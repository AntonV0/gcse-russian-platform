import { createClient } from "@/lib/supabase/server";

import { applyMockExamFilters } from "@/lib/mock-exams/access";
import {
  normalizeMockExamAttempt,
  normalizeMockExamQuestion,
  normalizeMockExamResponse,
  normalizeMockExamScore,
  normalizeMockExamSection,
  normalizeMockExamSet,
  normalizeProfileSummary,
} from "@/lib/mock-exams/normalizers";
import {
  MOCK_EXAM_ATTEMPT_SELECT,
  MOCK_EXAM_QUESTION_SELECT,
  MOCK_EXAM_RESPONSE_SELECT,
  MOCK_EXAM_SCORE_SELECT,
  MOCK_EXAM_SECTION_SELECT,
  MOCK_EXAM_SET_SELECT,
} from "@/lib/mock-exams/selects";
import type { MockExamFilters } from "@/lib/mock-exams/types";

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
