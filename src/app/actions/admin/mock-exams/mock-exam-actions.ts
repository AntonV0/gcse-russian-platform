"use server";

import { redirect } from "next/navigation";
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
