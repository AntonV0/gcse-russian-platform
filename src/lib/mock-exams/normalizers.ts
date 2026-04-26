import type {
  DbMockExamAttempt,
  DbMockExamQuestion,
  DbMockExamResponse,
  DbMockExamScore,
  DbMockExamSection,
  DbMockExamSet,
  MockExamAttemptStatus,
  MockExamPaperName,
  MockExamProfileSummary,
  MockExamQuestionType,
  MockExamSectionType,
  MockExamTier,
} from "@/lib/mock-exams/types";

export function normalizeRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

const studentHiddenQuestionDataKeys = new Set([
  "acceptedAnswers",
  "answers",
  "correctAnswer",
  "correctAnswers",
  "correctMatches",
  "correctOrder",
  "explanation",
  "markingMetadata",
  "markGuidance",
  "markScheme",
  "modelAnswer",
  "questionDesign",
  "sampleAnswer",
  "transcript",
]);

function removeStudentHiddenQuestionData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(removeStudentHiddenQuestionData);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
    (acc, [key, entry]) => {
      if (!studentHiddenQuestionDataKeys.has(key)) {
        acc[key] = removeStudentHiddenQuestionData(entry);
      }

      return acc;
    },
    {}
  );
}

export function getStudentSafeMockExamQuestion(
  question: DbMockExamQuestion
): DbMockExamQuestion {
  return {
    ...question,
    data: normalizeRecord(removeStudentHiddenQuestionData(question.data)),
  };
}

export function normalizeMockExamSet(row: unknown): DbMockExamSet {
  const record = row as Partial<DbMockExamSet>;

  return {
    id: String(record.id),
    title: String(record.title),
    slug: String(record.slug),
    description: record.description ?? null,
    paper_number: Number(record.paper_number ?? 0),
    paper_name: (record.paper_name ?? "Paper 1 Listening") as MockExamPaperName,
    tier: (record.tier ?? "both") as MockExamTier,
    time_limit_minutes:
      record.time_limit_minutes === null || record.time_limit_minutes === undefined
        ? null
        : Number(record.time_limit_minutes),
    total_marks: Number(record.total_marks ?? 0),
    is_published: Boolean(record.is_published),
    sort_order: Number(record.sort_order ?? 0),
    is_trial_visible: Boolean(record.is_trial_visible),
    requires_paid_access: Boolean(record.requires_paid_access),
    available_in_volna: Boolean(record.available_in_volna),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

export function normalizeMockExamSection(row: unknown): DbMockExamSection {
  const record = row as Partial<DbMockExamSection>;

  return {
    id: String(record.id),
    mock_exam_id: String(record.mock_exam_id),
    title: String(record.title),
    instructions: record.instructions ?? null,
    section_type: (record.section_type ?? "other") as MockExamSectionType,
    sort_order: Number(record.sort_order ?? 0),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

export function normalizeMockExamQuestion(row: unknown): DbMockExamQuestion {
  const record = row as Partial<DbMockExamQuestion>;

  return {
    id: String(record.id),
    section_id: String(record.section_id),
    question_type: (record.question_type ?? "other") as MockExamQuestionType,
    prompt: String(record.prompt),
    data: normalizeRecord(record.data),
    marks: Number(record.marks ?? 0),
    sort_order: Number(record.sort_order ?? 0),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

export function normalizeMockExamAttempt(row: unknown): DbMockExamAttempt {
  const record = row as Partial<DbMockExamAttempt>;

  return {
    id: String(record.id),
    mock_exam_id: String(record.mock_exam_id),
    user_id: String(record.user_id),
    status: (record.status ?? "draft") as MockExamAttemptStatus,
    started_at: String(record.started_at),
    submitted_at: record.submitted_at ?? null,
    time_limit_minutes_snapshot:
      record.time_limit_minutes_snapshot === null ||
      record.time_limit_minutes_snapshot === undefined
        ? null
        : Number(record.time_limit_minutes_snapshot),
    total_marks_snapshot: Number(record.total_marks_snapshot ?? 0),
    awarded_marks:
      record.awarded_marks === null || record.awarded_marks === undefined
        ? null
        : Number(record.awarded_marks),
    feedback: record.feedback ?? null,
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

export function normalizeMockExamResponse(row: unknown): DbMockExamResponse {
  const record = row as Partial<DbMockExamResponse>;

  return {
    id: String(record.id),
    attempt_id: String(record.attempt_id),
    question_id: String(record.question_id),
    response_text: record.response_text ?? null,
    response_payload: normalizeRecord(record.response_payload),
    awarded_marks:
      record.awarded_marks === null || record.awarded_marks === undefined
        ? null
        : Number(record.awarded_marks),
    feedback: record.feedback ?? null,
    is_flagged: Boolean(record.is_flagged),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

export function normalizeMockExamScore(row: unknown): DbMockExamScore {
  const record = row as Partial<DbMockExamScore>;

  return {
    id: String(record.id),
    attempt_id: String(record.attempt_id),
    total_marks: Number(record.total_marks ?? 0),
    awarded_marks: Number(record.awarded_marks ?? 0),
    score_payload: normalizeRecord(record.score_payload),
    feedback: record.feedback ?? null,
    marked_by: record.marked_by ?? null,
    marked_at: record.marked_at ?? null,
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

export function normalizeProfileSummary(row: unknown): MockExamProfileSummary {
  const record = row as Partial<MockExamProfileSummary>;

  return {
    id: String(record.id),
    full_name: record.full_name ?? null,
    display_name: record.display_name ?? null,
    email: record.email ?? null,
  };
}

