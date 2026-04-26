import { createClient } from "@/lib/supabase/server";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type {
  DbMockExamAttempt,
  DbMockExamQuestion,
  DbMockExamResponse,
  DbMockExamScore,
  DbMockExamSection,
  DbMockExamSet,
  LoadedMockExamAttemptDb,
  LoadedMockExamAttemptReviewDb,
  LoadedMockExamDb,
  MockExamAttemptReviewListItem,
  MockExamFilters,
  MockExamPaperName,
  MockExamProfileSummary,
  MockExamQuestionType,
  MockExamSectionType,
  MockExamTier,
} from "@/lib/mock-exams/types";

export {
  mockExamPaperNames,
  mockExamQuestionTypes,
  mockExamSectionTypes,
  mockExamTiers,
} from "@/lib/mock-exams/constants";
export { mockExamQuestionDataTemplates } from "@/lib/mock-exams/question-data/templates";
export type {
  DbMockExamAttempt,
  DbMockExamQuestion,
  DbMockExamResponse,
  DbMockExamScore,
  DbMockExamSection,
  DbMockExamSet,
  LoadedMockExamAttemptDb,
  LoadedMockExamAttemptReviewDb,
  LoadedMockExamDb,
  MockExamAttemptReviewListItem,
  MockExamAttemptStatus,
  MockExamFilters,
  MockExamPaperName,
  MockExamProfileSummary,
  MockExamQuestionType,
  MockExamSectionType,
  MockExamTier,
} from "@/lib/mock-exams/types";

export function getMockExamTierLabel(tier: MockExamTier) {
  switch (tier) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "both":
      return "Both tiers";
    default:
      return tier;
  }
}

export function getMockExamSectionTypeLabel(sectionType: MockExamSectionType) {
  return sectionType.replaceAll("_", " ");
}

export function getMockExamQuestionTypeLabel(questionType: MockExamQuestionType) {
  switch (questionType) {
    case "true_false_not_mentioned":
      return "True / false / not mentioned";
    default:
      return questionType.replaceAll("_", " ");
  }
}

function normalizeRecord(value: unknown): Record<string, unknown> {
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

function normalizeMockExamSet(row: unknown): DbMockExamSet {
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

function normalizeMockExamSection(row: unknown): DbMockExamSection {
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

function normalizeMockExamQuestion(row: unknown): DbMockExamQuestion {
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

function normalizeMockExamAttempt(row: unknown): DbMockExamAttempt {
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

function normalizeMockExamResponse(row: unknown): DbMockExamResponse {
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

function normalizeMockExamScore(row: unknown): DbMockExamScore {
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

function normalizeProfileSummary(row: unknown): MockExamProfileSummary {
  const record = row as Partial<MockExamProfileSummary>;

  return {
    id: String(record.id),
    full_name: record.full_name ?? null,
    display_name: record.display_name ?? null,
    email: record.email ?? null,
  };
}

function applyMockExamFilters(exams: DbMockExamSet[], filters?: MockExamFilters) {
  const paperNumber =
    filters?.paperNumber && filters.paperNumber !== "all"
      ? Number(filters.paperNumber)
      : null;
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const published = filters?.published ?? "all";

  return exams.filter((exam) => {
    if (paperNumber && exam.paper_number !== paperNumber) return false;
    if (tier && exam.tier !== tier && exam.tier !== "both") return false;
    if (published === "published" && !exam.is_published) return false;
    if (published === "draft" && exam.is_published) return false;

    return true;
  });
}

export function canDashboardAccessMockExam(
  exam: DbMockExamSet,
  dashboard: DashboardInfo | null
) {
  if (!dashboard) return false;

  if (dashboard.role === "admin" || dashboard.role === "teacher") {
    return true;
  }

  if (dashboard.role !== "student") {
    return false;
  }

  if (dashboard.variant === "foundation" && exam.tier === "higher") {
    return false;
  }

  if (dashboard.variant === "higher" && exam.tier === "foundation") {
    return false;
  }

  if (dashboard.accessMode === "trial") {
    return exam.is_trial_visible;
  }

  if (dashboard.accessMode === "full") {
    return true;
  }

  if (dashboard.accessMode === "volna") {
    return exam.available_in_volna;
  }

  return !exam.requires_paid_access;
}

export function filterMockExamsForDashboardAccess(
  exams: DbMockExamSet[],
  dashboard: DashboardInfo | null
) {
  return exams.filter((exam) => canDashboardAccessMockExam(exam, dashboard));
}

export async function getMockExamSetsDb(filters?: MockExamFilters) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sets")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching mock exam sets:", { filters, error });
    return [];
  }

  return applyMockExamFilters((data ?? []).map(normalizeMockExamSet), filters);
}

export async function getPublishedMockExamSetsDb(filters?: MockExamFilters) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sets")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching published mock exam sets:", { filters, error });
    return [];
  }

  return applyMockExamFilters((data ?? []).map(normalizeMockExamSet), {
    ...filters,
    published: "published",
  });
}

export async function getMockExamSetByIdDb(mockExamId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sets")
    .select("*")
    .eq("id", mockExamId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching mock exam set by id:", { mockExamId, error });
    return null;
  }

  return data ? normalizeMockExamSet(data) : null;
}

export async function getMockExamSetBySlugDb(mockExamSlug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sets")
    .select("*")
    .eq("slug", mockExamSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching mock exam set by slug:", { mockExamSlug, error });
    return null;
  }

  return data ? normalizeMockExamSet(data) : null;
}

export async function getMockExamSectionsDb(mockExamId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_sections")
    .select("*")
    .eq("mock_exam_id", mockExamId)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching mock exam sections:", { mockExamId, error });
    return [];
  }

  return (data ?? []).map(normalizeMockExamSection);
}

export async function getMockExamQuestionsBySectionIdsDb(sectionIds: string[]) {
  if (sectionIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_questions")
    .select("*")
    .in("section_id", sectionIds)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching mock exam questions:", { sectionIds, error });
    return [];
  }

  return (data ?? []).map(normalizeMockExamQuestion);
}

export async function loadMockExamByIdDb(mockExamId: string): Promise<LoadedMockExamDb> {
  const exam = await getMockExamSetByIdDb(mockExamId);

  if (!exam) {
    return {
      exam: null,
      sections: [],
      questionsBySectionId: {},
    };
  }

  const sections = await getMockExamSectionsDb(exam.id);
  const questions = await getMockExamQuestionsBySectionIdsDb(
    sections.map((section) => section.id)
  );

  return {
    exam,
    sections,
    questionsBySectionId: groupQuestionsBySectionId(questions),
  };
}

export async function loadMockExamBySlugDb(
  mockExamSlug: string,
  options?: { publishedOnly?: boolean }
): Promise<LoadedMockExamDb> {
  const exam = await getMockExamSetBySlugDb(mockExamSlug);

  if (!exam || (options?.publishedOnly && !exam.is_published)) {
    return {
      exam: null,
      sections: [],
      questionsBySectionId: {},
    };
  }

  const sections = await getMockExamSectionsDb(exam.id);
  const questions = await getMockExamQuestionsBySectionIdsDb(
    sections.map((section) => section.id)
  );

  return {
    exam,
    sections,
    questionsBySectionId: groupQuestionsBySectionId(questions),
  };
}

export async function getMockExamAttemptByIdDb(attemptId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_attempts")
    .select("*")
    .eq("id", attemptId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching mock exam attempt:", { attemptId, error });
    return null;
  }

  return data ? normalizeMockExamAttempt(data) : null;
}

export async function getMockExamResponsesByAttemptIdDb(attemptId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_responses")
    .select("*")
    .eq("attempt_id", attemptId);

  if (error) {
    console.error("Error fetching mock exam responses:", { attemptId, error });
    return [];
  }

  return (data ?? []).map(normalizeMockExamResponse);
}

export async function getMockExamScoreByAttemptIdDb(attemptId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_scores")
    .select("*")
    .eq("attempt_id", attemptId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching mock exam score:", { attemptId, error });
    return null;
  }

  return data ? normalizeMockExamScore(data) : null;
}

export async function getProfileSummaryByIdDb(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, display_name, email")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile summary:", { userId, error });
    return null;
  }

  return data ? normalizeProfileSummary(data) : null;
}

export async function getCurrentUserMockExamAttemptsDb(
  mockExamId: string,
  userId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_attempts")
    .select("*")
    .eq("mock_exam_id", mockExamId)
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("Error fetching user mock exam attempts:", {
      mockExamId,
      userId,
      error,
    });
    return [];
  }

  return (data ?? []).map(normalizeMockExamAttempt);
}

export async function getMockExamAttemptsForAdminReviewDb() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_exam_attempts")
    .select("*")
    .order("started_at", { ascending: false });

  if (error) {
    console.error("Error fetching mock exam attempts for admin review:", { error });
    return [];
  }

  const attempts = (data ?? []).map(normalizeMockExamAttempt);

  const items = await Promise.all(
    attempts.map(async (attempt) => {
      const [exam, student, responses] = await Promise.all([
        getMockExamSetByIdDb(attempt.mock_exam_id),
        getProfileSummaryByIdDb(attempt.user_id),
        getMockExamResponsesByAttemptIdDb(attempt.id),
      ]);

      return {
        attempt,
        exam,
        student,
        responseCount: responses.length,
        markedResponseCount: responses.filter(
          (response) => response.awarded_marks !== null
        ).length,
      };
    })
  );

  return items satisfies MockExamAttemptReviewListItem[];
}

export async function loadMockExamAttemptDb(
  attemptId: string
): Promise<LoadedMockExamAttemptDb> {
  const attempt = await getMockExamAttemptByIdDb(attemptId);

  if (!attempt) {
    return {
      attempt: null,
      exam: null,
      sections: [],
      questionsBySectionId: {},
      responsesByQuestionId: {},
    };
  }

  const [loadedExam, responses] = await Promise.all([
    loadMockExamByIdDb(attempt.mock_exam_id),
    getMockExamResponsesByAttemptIdDb(attempt.id),
  ]);

  return {
    ...loadedExam,
    attempt,
    responsesByQuestionId: groupResponsesByQuestionId(responses),
  };
}

export async function loadMockExamAttemptReviewDb(
  attemptId: string
): Promise<LoadedMockExamAttemptReviewDb> {
  const loadedAttempt = await loadMockExamAttemptDb(attemptId);

  if (!loadedAttempt.attempt) {
    return {
      ...loadedAttempt,
      student: null,
      score: null,
    };
  }

  const [student, score] = await Promise.all([
    getProfileSummaryByIdDb(loadedAttempt.attempt.user_id),
    getMockExamScoreByAttemptIdDb(loadedAttempt.attempt.id),
  ]);

  return {
    ...loadedAttempt,
    student,
    score,
  };
}

function groupQuestionsBySectionId(questions: DbMockExamQuestion[]) {
  return questions.reduce<Record<string, DbMockExamQuestion[]>>((acc, question) => {
    const existing = acc[question.section_id] ?? [];
    existing.push(question);
    acc[question.section_id] = existing;
    return acc;
  }, {});
}

function groupResponsesByQuestionId(responses: DbMockExamResponse[]) {
  return responses.reduce<Record<string, DbMockExamResponse>>((acc, response) => {
    acc[response.question_id] = response;
    return acc;
  }, {});
}
