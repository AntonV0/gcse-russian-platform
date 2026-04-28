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
} from "@/lib/mock-exams/constants";
import type {
  MockExamPaperName,
  MockExamQuestionType,
  MockExamSectionType,
  MockExamTier,
} from "@/lib/mock-exams/types";

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

export function getOptionalNonNegativeNumber(formData: FormData, key: string) {
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

export function getExamPayload(formData: FormData) {
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

export function getSectionPayload(formData: FormData) {
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

export function getQuestionPayload(formData: FormData) {
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
