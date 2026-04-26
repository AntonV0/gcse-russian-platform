import { normalizeMockExamAttempt } from "@/lib/mock-exams/normalizers";
import {
  getMockExamAttemptByIdDb,
  getMockExamQuestionsBySectionIdsDb,
  getMockExamResponsesByAttemptIdDb,
  getMockExamScoreByAttemptIdDb,
  getMockExamSectionsDb,
  getMockExamSetByIdDb,
  getMockExamSetBySlugDb,
  getProfileSummaryByIdDb,
} from "@/lib/mock-exams/queries";
import { MOCK_EXAM_ATTEMPT_SELECT } from "@/lib/mock-exams/selects";
import type {
  DbMockExamQuestion,
  DbMockExamResponse,
  LoadedMockExamAttemptDb,
  LoadedMockExamAttemptReviewDb,
  LoadedMockExamDb,
  MockExamAttemptReviewListItem,
} from "@/lib/mock-exams/types";
import { createClient } from "@/lib/supabase/server";

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
