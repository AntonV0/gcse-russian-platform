import { describe, expect, it, vi } from "vitest";
import {
  getStudentDashboardActionQueue,
  getStudentDashboardStudyPrompts,
  getStudentDashboardWins,
  type StudentDashboardActivity,
} from "@/lib/dashboard/student-next-actions";
import type { StudentLearningPlan } from "@/lib/dashboard/learning-plan";

vi.mock("@/lib/assignments/assignment-helpers-db", () => ({
  getStudentAssignmentsWithDetailsDb: vi.fn(),
}));

vi.mock("@/lib/mock-exams/queries", () => ({
  getMockExamSetByIdDb: vi.fn(),
}));

vi.mock("@/lib/mock-exams/normalizers", () => ({
  normalizeMockExamAttempt: vi.fn(),
}));

vi.mock("@/lib/mock-exams/selects", () => ({
  MOCK_EXAM_ATTEMPT_SELECT: "id",
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

function activity(
  overrides: Partial<StudentDashboardActivity> = {}
): StudentDashboardActivity {
  return {
    assignments: [],
    pendingAssignments: [],
    submittedAssignments: [],
    reviewedAssignments: [],
    draftMockAttempts: [],
    submittedMockAttempts: [],
    markedMockAttempts: [],
    recentFeedback: [],
    stats: {
      totalAssignments: 0,
      pendingAssignments: 0,
      submittedAssignments: 0,
      reviewedAssignments: 0,
      draftMockAttempts: 0,
      submittedMockAttempts: 0,
      markedMockAttempts: 0,
      recentFeedback: 0,
    },
    ...overrides,
  };
}

function learningPlan(overrides: Partial<StudentLearningPlan> = {}): StudentLearningPlan {
  return {
    totalLessons: 10,
    completedLessons: 2,
    progressPercent: 20,
    nextLesson: {
      title: "Cases in context",
      moduleTitle: "Grammar essentials",
      moduleNumber: 1,
      lessonNumber: 3,
      href: "/courses/gcse-russian/foundation/modules/grammar/cases",
      estimatedMinutes: 18,
    },
    ...overrides,
  };
}

const fallback = {
  title: "Continue where you left off",
  description: "Grammar essentials: Cases in context",
  href: "/courses/gcse-russian/foundation/modules/grammar/cases",
  label: "Continue lesson",
  icon: "next" as const,
};

describe("student dashboard action helpers", () => {
  it("lets urgent Volna assignments override the lesson-first preference", () => {
    const queue = getStudentDashboardActionQueue(
      activity({
        pendingAssignments: [
          {
            assignment: {
              id: "assignment-1",
              title: "Written homework",
              instructions: null,
              due_at: "2020-01-01T00:00:00.000Z",
            },
            items: [{ id: "item-1" }],
            submission: null,
          } as never,
        ],
      }),
      fallback,
      { preferLearningPlan: true }
    );

    expect(queue[0]?.id).toBe("assignment-assignment-1");
    expect(queue[0]?.badgeLabel).toBe("Overdue");
    expect(queue[1]?.id).toBe("learning-plan");
  });

  it("keeps the learning plan first for Volna when assignments are not urgent", () => {
    const queue = getStudentDashboardActionQueue(
      activity({
        pendingAssignments: [
          {
            assignment: {
              id: "assignment-1",
              title: "Class practice",
              instructions: null,
              due_at: null,
            },
            items: [{ id: "item-1" }],
            submission: null,
          } as never,
        ],
      }),
      fallback,
      { preferLearningPlan: true }
    );

    expect(queue[0]?.id).toBe("learning-plan");
    expect(queue[1]?.id).toBe("assignment-assignment-1");
  });

  it("builds focused vocabulary, grammar, and exam prompts from activity", () => {
    const prompts = getStudentDashboardStudyPrompts(
      activity({
        pendingAssignments: [{} as never],
        draftMockAttempts: [
          {
            href: "/mock-exams/unit-1/attempts/mock-1",
          } as never,
        ],
        stats: {
          totalAssignments: 1,
          pendingAssignments: 1,
          submittedAssignments: 0,
          reviewedAssignments: 2,
          draftMockAttempts: 1,
          submittedMockAttempts: 0,
          markedMockAttempts: 0,
          recentFeedback: 0,
        },
      }),
      learningPlan()
    );

    expect(prompts.map((prompt) => prompt.kind)).toEqual([
      "vocabulary",
      "grammar",
      "exam",
    ]);
    expect(prompts[1]?.badgeTone).toBe("warning");
    expect(prompts[2]?.href).toBe("/mock-exams/unit-1/attempts/mock-1");
    expect(prompts[0]?.label).toBe("Practise vocabulary");
  });

  it("returns recent wins, or a first-win prompt when there is no evidence yet", () => {
    expect(
      getStudentDashboardWins(
        activity({
          stats: {
            totalAssignments: 1,
            pendingAssignments: 0,
            submittedAssignments: 0,
            reviewedAssignments: 1,
            draftMockAttempts: 0,
            submittedMockAttempts: 0,
            markedMockAttempts: 1,
            recentFeedback: 1,
          },
        }),
        learningPlan({ completedLessons: 3 })
      ).map((win) => win.id)
    ).toEqual(["lessons-complete", "assignments-reviewed", "mocks-marked"]);

    expect(
      getStudentDashboardWins(
        activity(),
        learningPlan({ completedLessons: 0, progressPercent: 0, nextLesson: null })
      )[0]?.id
    ).toBe("first-win-ready");
  });
});
