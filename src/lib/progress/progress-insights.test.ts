import { describe, expect, it } from "vitest";
import type { MasterySignal } from "@/lib/dashboard/mastery-signals";
import type { StudentDashboardActivity } from "@/lib/dashboard/student-next-actions";
import type { VariantPathProgressSummary } from "@/lib/courses/path-progress";
import {
  getProgressDomainSummaries,
  getProgressRecentWins,
  getProgressWeakAreas,
  isNewStudentProgressEmpty,
} from "@/lib/progress/progress-insights";

function signal(overrides: Partial<MasterySignal>): MasterySignal {
  return {
    title: "Vocabulary",
    value: 0,
    label: "Ready to start",
    evidence: "Evidence",
    icon: "vocabulary",
    tone: "default",
    ...overrides,
  };
}

function activity(
  overrides: Partial<StudentDashboardActivity["stats"]> = {}
): StudentDashboardActivity {
  const stats = {
    totalAssignments: 0,
    pendingAssignments: 0,
    submittedAssignments: 0,
    reviewedAssignments: 0,
    draftMockAttempts: 0,
    submittedMockAttempts: 0,
    markedMockAttempts: 0,
    recentFeedback: 0,
    ...overrides,
  };

  return {
    assignments: [],
    pendingAssignments: [],
    submittedAssignments: [],
    reviewedAssignments: [],
    draftMockAttempts: [],
    submittedMockAttempts: [],
    markedMockAttempts: [],
    recentFeedback: [],
    stats,
  };
}

function pathSummary(
  overrides: Partial<VariantPathProgressSummary> = {}
): VariantPathProgressSummary {
  return {
    variantSlug: "foundation",
    totalModules: 2,
    totalLessons: 4,
    completedLessons: 0,
    progressPercent: 0,
    estimatedMinutes: 80,
    remainingMinutes: 80,
    nextLesson: null,
    isComplete: false,
    moduleSummaries: [
      {
        moduleSlug: "basics",
        totalLessons: 2,
        completedLessons: 0,
        progressPercent: 0,
        estimatedMinutes: 40,
        remainingMinutes: 40,
        nextLesson: null,
        isComplete: false,
      },
    ],
    ...overrides,
  };
}

describe("progress insights", () => {
  it("treats a student with no progress activity as a new-student empty state", () => {
    expect(isNewStudentProgressEmpty(pathSummary(), activity())).toBe(true);

    expect(
      isNewStudentProgressEmpty(
        pathSummary({ completedLessons: 1, progressPercent: 25 }),
        activity()
      )
    ).toBe(false);
  });

  it("builds domain summaries for vocabulary, grammar, and exam prep", () => {
    const domains = getProgressDomainSummaries(
      [
        signal({ title: "Vocabulary", value: 64, label: "2 of 4 lessons" }),
        signal({ title: "Grammar", value: 42, icon: "grammar" }),
        signal({ title: "Exam technique", value: 20, icon: "exam" }),
      ],
      activity({ draftMockAttempts: 1, markedMockAttempts: 1 })
    );

    expect(domains.map((domain) => domain.id)).toEqual([
      "vocabulary",
      "grammar",
      "exam-prep",
    ]);
    expect(domains[0]).toMatchObject({
      title: "Vocabulary growth",
      value: 64,
      href: "/vocabulary",
    });
    expect(domains[2].label).toBe("2 mock attempts");
  });

  it("prioritises active blockers before low readiness signals", () => {
    const weakAreas = getProgressWeakAreas(
      [
        signal({ title: "Vocabulary", value: 25 }),
        signal({ title: "Grammar", value: 52, icon: "grammar" }),
      ],
      activity({ pendingAssignments: 1, draftMockAttempts: 1, totalAssignments: 1 })
    );

    expect(weakAreas.map((area) => area.id)).toEqual([
      "pending-assignments",
      "draft-mocks",
      "signal-vocabulary",
    ]);
    expect(weakAreas[0]?.description).not.toContain("stale");
    expect(weakAreas[2]?.title).toBe("Vocabulary needs practice");
  });

  it("summarises recent wins from feedback, mocks, modules, lessons, and submissions", () => {
    const wins = getProgressRecentWins(
      pathSummary({
        completedLessons: 3,
        moduleSummaries: [
          {
            moduleSlug: "basics",
            totalLessons: 2,
            completedLessons: 2,
            progressPercent: 100,
            estimatedMinutes: 40,
            remainingMinutes: null,
            nextLesson: null,
            isComplete: true,
          },
        ],
      }),
      activity({
        recentFeedback: 1,
        markedMockAttempts: 1,
        submittedAssignments: 1,
        totalAssignments: 1,
      })
    );

    expect(wins.map((win) => win.id)).toEqual([
      "recent-feedback",
      "marked-mocks",
      "completed-modules",
      "completed-lessons",
    ]);
  });
});
