"use server";

import { redirect } from "next/navigation";
import { getTrimmedString } from "@/app/actions/shared/form-data";
import { getCurrentUser } from "@/lib/auth/auth";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { loadMockExamAttemptDb } from "@/lib/mock-exams/mock-exam-helpers-db";
import { getMockExamMarkingPayloads } from "@/app/actions/admin/mock-exams/mock-exam-marking-payloads";

export async function markMockExamAttemptAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const attemptId = getTrimmedString(formData, "attemptId");

  if (!attemptId) {
    throw new Error("Missing attempt id");
  }

  const { attempt, exam, sections, questionsBySectionId, responsesByQuestionId } =
    await loadMockExamAttemptDb(attemptId);

  if (!attempt || !exam) {
    throw new Error("Mock exam attempt not found");
  }

  if (attempt.status === "draft") {
    throw new Error("Draft attempts cannot be marked until submitted");
  }

  const questions = sections.flatMap((section) => questionsBySectionId[section.id] ?? []);
  const now = new Date().toISOString();
  const { responseRows, attemptPayload, scorePayload } = getMockExamMarkingPayloads({
    formData,
    questions,
    responsesByQuestionId,
    attemptId: attempt.id,
    totalMarks: attempt.total_marks_snapshot,
    markedBy: user.id,
    now,
  });
  const supabase = await createClient();

  if (responseRows.length > 0) {
    const { error } = await supabase
      .from("mock_exam_responses")
      .upsert(responseRows, { onConflict: "attempt_id,question_id" });

    if (error) {
      console.error("Error marking mock exam responses:", { attemptId, error });
      throw new Error(`Failed to mark responses: ${error.message}`);
    }
  }

  const { error: attemptError } = await supabase
    .from("mock_exam_attempts")
    .update(attemptPayload)
    .eq("id", attempt.id);

  if (attemptError) {
    console.error("Error updating marked mock exam attempt:", {
      attemptId,
      error: attemptError,
    });
    throw new Error(`Failed to update attempt: ${attemptError.message}`);
  }

  if (scorePayload) {
    const { error: scoreError } = await supabase.from("mock_exam_scores").upsert(
      {
        attempt_id: attempt.id,
        ...scorePayload,
      },
      { onConflict: "attempt_id" }
    );

    if (scoreError) {
      console.error("Error saving mock exam score:", { attemptId, error: scoreError });
      throw new Error(`Failed to save score: ${scoreError.message}`);
    }
  }

  redirect(`/admin/mock-exams/review/${attempt.id}?saved=1`);
}
