"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { getTrimmedString } from "@/app/actions/shared/form-data";
import {
  getExamPayload,
  getQuestionPayload,
  getSectionPayload,
} from "@/app/actions/admin/mock-exams/mock-exam-form-payloads";
import { getMockExamMarkingPayloads } from "@/app/actions/admin/mock-exams/mock-exam-marking-payloads";
import { loadMockExamAttemptDb } from "@/lib/mock-exams/mock-exam-helpers-db";

export async function createMockExamSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const payload = getExamPayload(formData);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sets")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating mock exam set:", { payload, error });
    throw new Error(`Failed to create mock exam set: ${error?.message ?? "unknown"}`);
  }

  redirect(`/admin/mock-exams/${data.id}`);
}

export async function updateMockExamSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");

  if (!mockExamId) {
    throw new Error("Missing mock exam id");
  }

  const payload = getExamPayload(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("mock_exam_sets")
    .update(payload)
    .eq("id", mockExamId);

  if (error) {
    console.error("Error updating mock exam set:", { mockExamId, payload, error });
    throw new Error(`Failed to update mock exam set: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function deleteMockExamSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");

  if (!mockExamId) {
    throw new Error("Missing mock exam id");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("mock_exam_sets").delete().eq("id", mockExamId);

  if (error) {
    console.error("Error deleting mock exam set:", { mockExamId, error });
    throw new Error(`Failed to delete mock exam set: ${error.message}`);
  }

  redirect("/admin/mock-exams");
}

export async function createMockExamSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");

  if (!mockExamId) {
    throw new Error("Missing mock exam id");
  }

  const payload = {
    mock_exam_id: mockExamId,
    ...getSectionPayload(formData),
  };
  const supabase = await createClient();

  const { error } = await supabase.from("mock_exam_sections").insert(payload);

  if (error) {
    console.error("Error creating mock exam section:", { payload, error });
    throw new Error(`Failed to create mock exam section: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function updateMockExamSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");
  const sectionId = getTrimmedString(formData, "sectionId");

  if (!mockExamId || !sectionId) {
    throw new Error("Missing section id");
  }

  const payload = getSectionPayload(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("mock_exam_sections")
    .update(payload)
    .eq("id", sectionId)
    .eq("mock_exam_id", mockExamId);

  if (error) {
    console.error("Error updating mock exam section:", {
      mockExamId,
      sectionId,
      payload,
      error,
    });
    throw new Error(`Failed to update mock exam section: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function deleteMockExamSectionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");
  const sectionId = getTrimmedString(formData, "sectionId");

  if (!mockExamId || !sectionId) {
    throw new Error("Missing section id");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("mock_exam_sections")
    .delete()
    .eq("id", sectionId)
    .eq("mock_exam_id", mockExamId);

  if (error) {
    console.error("Error deleting mock exam section:", {
      mockExamId,
      sectionId,
      error,
    });
    throw new Error(`Failed to delete mock exam section: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function createMockExamQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");
  const sectionId = getTrimmedString(formData, "sectionId");

  if (!mockExamId || !sectionId) {
    throw new Error("Missing section id");
  }

  const payload = {
    section_id: sectionId,
    ...getQuestionPayload(formData),
  };
  const supabase = await createClient();

  const { error } = await supabase.from("mock_exam_questions").insert(payload);

  if (error) {
    console.error("Error creating mock exam question:", { payload, error });
    throw new Error(`Failed to create mock exam question: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function updateMockExamQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");
  const questionId = getTrimmedString(formData, "questionId");

  if (!mockExamId || !questionId) {
    throw new Error("Missing question id");
  }

  const payload = getQuestionPayload(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("mock_exam_questions")
    .update(payload)
    .eq("id", questionId);

  if (error) {
    console.error("Error updating mock exam question:", {
      mockExamId,
      questionId,
      payload,
      error,
    });
    throw new Error(`Failed to update mock exam question: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

export async function deleteMockExamQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const mockExamId = getTrimmedString(formData, "mockExamId");
  const questionId = getTrimmedString(formData, "questionId");

  if (!mockExamId || !questionId) {
    throw new Error("Missing question id");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("mock_exam_questions")
    .delete()
    .eq("id", questionId);

  if (error) {
    console.error("Error deleting mock exam question:", {
      mockExamId,
      questionId,
      error,
    });
    throw new Error(`Failed to delete mock exam question: ${error.message}`);
  }

  redirect(`/admin/mock-exams/${mockExamId}`);
}

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
