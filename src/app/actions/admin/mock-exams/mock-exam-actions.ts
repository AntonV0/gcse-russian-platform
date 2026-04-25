"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  getBoolean,
  getOptionalPositiveNumber,
  getOptionalString,
  getTrimmedString,
} from "@/app/actions/shared/form-data";
import {
  mockExamPaperNames,
  mockExamQuestionTypes,
  mockExamSectionTypes,
  mockExamTiers,
  loadMockExamAttemptDb,
  type MockExamPaperName,
  type MockExamQuestionType,
  type MockExamSectionType,
  type MockExamTier,
} from "@/lib/mock-exams/mock-exam-helpers-db";

function validatePaperName(value: string): MockExamPaperName {
  if (mockExamPaperNames.includes(value as MockExamPaperName)) {
    return value as MockExamPaperName;
  }

  throw new Error("Invalid paper name");
}

function validateTier(value: string): MockExamTier {
  if (mockExamTiers.includes(value as MockExamTier)) {
    return value as MockExamTier;
  }

  throw new Error("Invalid tier");
}

function validateSectionType(value: string): MockExamSectionType {
  if (mockExamSectionTypes.includes(value as MockExamSectionType)) {
    return value as MockExamSectionType;
  }

  throw new Error("Invalid section type");
}

function validateQuestionType(value: string): MockExamQuestionType {
  if (mockExamQuestionTypes.includes(value as MockExamQuestionType)) {
    return value as MockExamQuestionType;
  }

  throw new Error("Invalid question type");
}

function getOptionalNonNegativeNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${key} must be zero or greater`);
  }

  return value;
}

function parseJsonObject(raw: string) {
  if (!raw) return {};

  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Question data must be a JSON object");
  }

  return parsed as Record<string, unknown>;
}

function getManualMark(formData: FormData, key: string, maxMarks: number) {
  const raw = getTrimmedString(formData, key);
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0 || value > maxMarks) {
    throw new Error(`${key} must be between 0 and ${maxMarks}`);
  }

  return value;
}

function getExamPayload(formData: FormData) {
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const paperNumber = getOptionalPositiveNumber(formData, "paperNumber");
  const paperName = validatePaperName(getTrimmedString(formData, "paperName"));
  const tier = validateTier(getTrimmedString(formData, "tier"));

  if (!title || !slug || !paperNumber) {
    throw new Error("Missing required fields");
  }

  if (paperNumber < 1 || paperNumber > 4) {
    throw new Error("Paper number must be between 1 and 4");
  }

  return {
    title,
    slug,
    description: getOptionalString(formData, "description"),
    paper_number: paperNumber,
    paper_name: paperName,
    tier,
    time_limit_minutes: getOptionalPositiveNumber(formData, "timeLimitMinutes"),
    total_marks: getOptionalNonNegativeNumber(formData, "totalMarks") ?? 0,
    is_published: getBoolean(formData, "isPublished"),
    sort_order: getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0,
    is_trial_visible: getBoolean(formData, "isTrialVisible"),
    requires_paid_access: getBoolean(formData, "requiresPaidAccess"),
    available_in_volna: getBoolean(formData, "availableInVolna"),
    updated_at: new Date().toISOString(),
  };
}

function getSectionPayload(formData: FormData) {
  const title = getTrimmedString(formData, "title");
  const sectionType = validateSectionType(getTrimmedString(formData, "sectionType"));

  if (!title) {
    throw new Error("Missing section title");
  }

  return {
    title,
    instructions: getOptionalString(formData, "instructions"),
    section_type: sectionType,
    sort_order: getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0,
    updated_at: new Date().toISOString(),
  };
}

function getQuestionPayload(formData: FormData) {
  const prompt = getTrimmedString(formData, "prompt");
  const questionType = validateQuestionType(getTrimmedString(formData, "questionType"));
  const rawData = getTrimmedString(formData, "data");

  if (!prompt) {
    throw new Error("Missing question prompt");
  }

  return {
    question_type: questionType,
    prompt,
    data: parseJsonObject(rawData),
    marks: getOptionalNonNegativeNumber(formData, "marks") ?? 1,
    sort_order: getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0,
    updated_at: new Date().toISOString(),
  };
}

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

  const questions = sections.flatMap((section) =>
    questionsBySectionId[section.id] ?? []
  );
  const now = new Date().toISOString();
  const responseRows = questions.map((question) => {
    const existingResponse = responsesByQuestionId[question.id];
    const awardedMarks = getManualMark(
      formData,
      `awardedMarks_${question.id}`,
      question.marks
    );
    const feedback = getOptionalString(formData, `feedback_${question.id}`);

    return {
      attempt_id: attempt.id,
      question_id: question.id,
      response_text: existingResponse?.response_text ?? null,
      response_payload: existingResponse?.response_payload ?? {},
      awarded_marks: awardedMarks,
      feedback,
      is_flagged: getBoolean(formData, `isFlagged_${question.id}`),
      updated_at: now,
    };
  });
  const markedRows = responseRows.filter((row) => row.awarded_marks !== null);
  const awardedMarks = markedRows.reduce(
    (total, row) => total + Number(row.awarded_marks ?? 0),
    0
  );
  const overallFeedback = getOptionalString(formData, "overallFeedback");
  const predictedGrade = getOptionalString(formData, "predictedGrade");
  const status = markedRows.length === questions.length ? "marked" : "submitted";
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
    .update({
      status,
      awarded_marks: markedRows.length > 0 ? awardedMarks : null,
      feedback: overallFeedback,
      updated_at: now,
    })
    .eq("id", attempt.id);

  if (attemptError) {
    console.error("Error updating marked mock exam attempt:", {
      attemptId,
      error: attemptError,
    });
    throw new Error(`Failed to update attempt: ${attemptError.message}`);
  }

  if (markedRows.length > 0) {
    const { error: scoreError } = await supabase
      .from("mock_exam_scores")
      .upsert(
        {
          attempt_id: attempt.id,
          total_marks: attempt.total_marks_snapshot,
          awarded_marks: awardedMarks,
          score_payload: {
            predictedGrade,
            markedResponseCount: markedRows.length,
            totalQuestionCount: questions.length,
            isFullyMarked: markedRows.length === questions.length,
          },
          feedback: overallFeedback,
          marked_by: user.id,
          marked_at: now,
          updated_at: now,
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
