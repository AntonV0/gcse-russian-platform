"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { canDashboardAccessMockExam } from "@/lib/mock-exams/access";
import { loadMockExamAttemptDb } from "@/lib/mock-exams/loaders";
import { getMockExamSetBySlugDb } from "@/lib/mock-exams/queries";
import { createClient } from "@/lib/supabase/server";
import { getTrimmedString } from "@/app/actions/shared/form-data";
import { extractQuestionResponse } from "@/app/actions/mock-exams/mock-exam-response-extraction";
import { markQuestion } from "@/app/actions/mock-exams/mock-exam-response-marking";

function hasAttemptTimeExpired(startedAt: string, timeLimitMinutes: number | null) {
  if (!timeLimitMinutes) return false;

  const startedAtTime = new Date(startedAt).getTime();
  if (!Number.isFinite(startedAtTime)) return false;

  return Date.now() > startedAtTime + timeLimitMinutes * 60 * 1000;
}

export async function startMockExamAttemptAction(formData: FormData) {
  const mockExamSlug = getTrimmedString(formData, "mockExamSlug");

  if (!mockExamSlug) {
    throw new Error("Missing mock exam slug");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [exam, dashboard] = await Promise.all([
    getMockExamSetBySlugDb(mockExamSlug),
    getDashboardInfo(),
  ]);

  if (!exam || !exam.is_published || !canDashboardAccessMockExam(exam, dashboard)) {
    throw new Error("Mock exam not available");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mock_exam_attempts")
    .insert({
      mock_exam_id: exam.id,
      user_id: user.id,
      status: "draft",
      time_limit_minutes_snapshot: exam.time_limit_minutes,
      total_marks_snapshot: exam.total_marks,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error starting mock exam attempt:", {
      mockExamSlug,
      error,
    });
    throw new Error(`Failed to start mock exam attempt: ${error?.message ?? "unknown"}`);
  }

  redirect(`/mock-exams/${mockExamSlug}/attempts/${data.id}`);
}

export async function saveMockExamAttemptResponsesAction(formData: FormData) {
  const attemptId = getTrimmedString(formData, "attemptId");

  if (!attemptId) {
    throw new Error("Missing attempt id");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { attempt, exam, sections, questionsBySectionId, responsesByQuestionId } =
    await loadMockExamAttemptDb(attemptId);

  if (!attempt || !exam || attempt.user_id !== user.id) {
    throw new Error("Attempt not found");
  }

  if (attempt.status !== "draft") {
    throw new Error("Only draft attempts can be edited");
  }

  const questions = sections.flatMap((section) => questionsBySectionId[section.id] ?? []);
  const requestedSubmitIntent = getTrimmedString(formData, "submitIntent");
  const submitIntent =
    requestedSubmitIntent === "submit" ||
    hasAttemptTimeExpired(attempt.started_at, attempt.time_limit_minutes_snapshot)
      ? "submit"
      : "save";
  const supabase = await createClient();

  const rows = await Promise.all(
    questions.map(async (question) => {
      const extractedResponse = await extractQuestionResponse(question, formData, {
        attemptId: attempt.id,
        userId: user.id,
        supabase,
        existingResponse: responsesByQuestionId[question.id],
      });
      const markResult =
        submitIntent === "submit"
          ? markQuestion(question, extractedResponse)
          : { awardedMarks: null, feedback: null };

      return {
        attempt_id: attempt.id,
        question_id: question.id,
        response_text: extractedResponse.responseText,
        response_payload: extractedResponse.responsePayload,
        awarded_marks: markResult.awardedMarks,
        feedback: markResult.feedback,
        updated_at: new Date().toISOString(),
      };
    })
  );

  if (rows.length > 0) {
    const { error } = await supabase.from("mock_exam_responses").upsert(rows, {
      onConflict: "attempt_id,question_id",
    });

    if (error) {
      console.error("Error saving mock exam responses:", { attemptId, error });
      throw new Error(`Failed to save mock exam responses: ${error.message}`);
    }
  }

  if (submitIntent === "submit") {
    const autoMarkedRows = rows.filter((row) => row.awarded_marks !== null);
    const awardedMarks = autoMarkedRows.reduce(
      (total, row) => total + Number(row.awarded_marks ?? 0),
      0
    );
    const { error } = await supabase
      .from("mock_exam_attempts")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
        awarded_marks: autoMarkedRows.length > 0 ? awardedMarks : null,
        feedback:
          autoMarkedRows.length > 0
            ? "Objective questions were auto-marked. Manual review may still be needed."
            : hasAttemptTimeExpired(
                  attempt.started_at,
                  attempt.time_limit_minutes_snapshot
                )
              ? "Submitted after the time limit elapsed. Manual review may still be needed."
              : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", attempt.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error submitting mock exam attempt:", { attemptId, error });
      throw new Error(`Failed to submit mock exam attempt: ${error.message}`);
    }
  } else {
    const { error } = await supabase
      .from("mock_exam_attempts")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", attempt.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error touching mock exam attempt:", { attemptId, error });
      throw new Error(`Failed to save mock exam attempt: ${error.message}`);
    }
  }

  redirect(`/mock-exams/${exam.slug}/attempts/${attempt.id}`);
}
