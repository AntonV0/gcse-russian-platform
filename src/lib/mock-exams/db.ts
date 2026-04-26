import { createClient } from "@/lib/supabase/server";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type {
  DbMockExamQuestion,
  DbMockExamResponse,
  DbMockExamSet,
  LoadedMockExamAttemptDb,
  LoadedMockExamAttemptReviewDb,
  LoadedMockExamDb,
  MockExamAttemptReviewListItem,
  MockExamFilters,
} from "@/lib/mock-exams/types";

export {
  mockExamPaperNames,
  mockExamQuestionTypes,
  mockExamSectionTypes,
  mockExamTiers,
} from "@/lib/mock-exams/constants";
export { mockExamQuestionDataTemplates } from "@/lib/mock-exams/question-data/templates";
export {
  getMockExamQuestionTypeLabel,
  getMockExamSectionTypeLabel,
  getMockExamTierLabel,
} from "@/lib/mock-exams/labels";
export { getStudentSafeMockExamQuestion } from "@/lib/mock-exams/normalizers";
import {
  normalizeMockExamAttempt,
  normalizeMockExamQuestion,
  normalizeMockExamResponse,
  normalizeMockExamScore,
  normalizeMockExamSection,
  normalizeMockExamSet,
  normalizeProfileSummary,
} from "@/lib/mock-exams/normalizers";
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

const MOCK_EXAM_SET_SELECT =
  "id, title, slug, description, paper_number, paper_name, tier, time_limit_minutes, total_marks, is_published, sort_order, is_trial_visible, requires_paid_access, available_in_volna, created_at, updated_at";
const MOCK_EXAM_SECTION_SELECT =
  "id, mock_exam_id, title, instructions, section_type, sort_order, created_at, updated_at";
const MOCK_EXAM_QUESTION_SELECT =
  "id, section_id, question_type, prompt, data, marks, sort_order, created_at, updated_at";
const MOCK_EXAM_ATTEMPT_SELECT =
  "id, mock_exam_id, user_id, status, started_at, submitted_at, time_limit_minutes_snapshot, total_marks_snapshot, awarded_marks, feedback, created_at, updated_at";
const MOCK_EXAM_RESPONSE_SELECT =
  "id, attempt_id, question_id, response_text, response_payload, awarded_marks, feedback, is_flagged, created_at, updated_at";
const MOCK_EXAM_SCORE_SELECT =
  "id, attempt_id, total_marks, awarded_marks, score_payload, feedback, marked_by, marked_at, created_at, updated_at";

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
    .select(MOCK_EXAM_SET_SELECT)
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
    .select(MOCK_EXAM_SET_SELECT)
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
    .select(MOCK_EXAM_SET_SELECT)
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
    .select(MOCK_EXAM_SET_SELECT)
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
    .select(MOCK_EXAM_SECTION_SELECT)
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
    .select(MOCK_EXAM_QUESTION_SELECT)
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
    .select(MOCK_EXAM_ATTEMPT_SELECT)
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
    .select(MOCK_EXAM_RESPONSE_SELECT)
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
    .select(MOCK_EXAM_SCORE_SELECT)
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
    .select(MOCK_EXAM_ATTEMPT_SELECT)
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
    .select(MOCK_EXAM_ATTEMPT_SELECT)
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

