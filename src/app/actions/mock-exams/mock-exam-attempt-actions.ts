"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  canDashboardAccessMockExam,
  getMockExamSetBySlugDb,
  loadMockExamAttemptDb,
} from "@/lib/mock-exams/mock-exam-helpers-db";
import { createClient } from "@/lib/supabase/server";
import { getTrimmedString } from "@/app/actions/shared/form-data";

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

  const { attempt, exam, sections, questionsBySectionId } =
    await loadMockExamAttemptDb(attemptId);

  if (!attempt || !exam || attempt.user_id !== user.id) {
    throw new Error("Attempt not found");
  }

  if (attempt.status !== "draft") {
    throw new Error("Only draft attempts can be edited");
  }

  const questionIds = sections.flatMap((section) =>
    (questionsBySectionId[section.id] ?? []).map((question) => question.id)
  );

  const rows = questionIds.map((questionId) => {
    const responseText = getTrimmedString(formData, `response_${questionId}`);

    return {
      attempt_id: attempt.id,
      question_id: questionId,
      response_text: responseText || null,
      response_payload: {},
      updated_at: new Date().toISOString(),
    };
  });

  const supabase = await createClient();

  if (rows.length > 0) {
    const { error } = await supabase
      .from("mock_exam_responses")
      .upsert(rows, {
        onConflict: "attempt_id,question_id",
      });

    if (error) {
      console.error("Error saving mock exam responses:", { attemptId, error });
      throw new Error(`Failed to save mock exam responses: ${error.message}`);
    }
  }

  const submitIntent = getTrimmedString(formData, "submitIntent");

  if (submitIntent === "submit") {
    const { error } = await supabase
      .from("mock_exam_attempts")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
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
