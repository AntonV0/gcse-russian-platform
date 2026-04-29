import { describe, expect, it, vi } from "vitest";
import {
  getCompletedLessonCountForDashboardPlan,
  getDashboardLessonResumeStepNumber,
  getDashboardNextStep,
  type StudentLearningPlan,
} from "@/lib/dashboard/learning-plan";

vi.mock("@/lib/access/access", () => ({
  getLessonAccessStateFromMeta: vi.fn(),
}));

vi.mock("@/lib/access/routes", () => ({
  getLessonPath: vi.fn(),
}));

vi.mock("@/lib/auth/auth", () => ({
  getCurrentCourseAccess: vi.fn(),
  getCurrentProfile: vi.fn(),
}));

vi.mock("@/lib/courses/course-helpers-db", () => ({
  getLessonsByModuleIdsDb: vi.fn(),
  loadVariantPageData: vi.fn(),
}));

vi.mock("@/lib/progress/progress-module", () => ({
  getCourseLessonProgress: vi.fn(),
}));

vi.mock("@/lib/lessons/lesson-content-helpers-db", () => ({
  getLessonIdsWithPublishedSectionsDb: vi.fn(),
  getLessonSectionsByLessonIdDb: vi.fn(),
}));

vi.mock("@/lib/progress/progress", () => ({
  getVisitedLessonSectionIds: vi.fn(),
}));

function learningPlan(overrides: Partial<StudentLearningPlan>): StudentLearningPlan {
  return {
    totalLessons: 2,
    completedLessons: 0,
    progressPercent: 0,
    nextLesson: null,
    ...overrides,
  };
}

describe("dashboard learning-plan progress helpers", () => {
  it("counts completed lessons once and ignores stale progress rows", () => {
    expect(
      getCompletedLessonCountForDashboardPlan(
        [
          { module_slug: "intro", lesson_slug: "alphabet", completed: true },
          { module_slug: "intro", lesson_slug: "alphabet", completed: true },
          { module_slug: "intro", lesson_slug: "greetings", completed: false },
          { module_slug: "archived", lesson_slug: "old-lesson", completed: true },
        ],
        [
          { moduleSlug: "intro", lessonSlug: "alphabet" },
          { moduleSlug: "intro", lessonSlug: "greetings" },
        ]
      )
    ).toBe(1);
  });

  it("uses the learning-plan completed count for continue lesson copy", () => {
    const nextStep = getDashboardNextStep(
      "foundation",
      "full",
      0,
      learningPlan({
        completedLessons: 1,
        progressPercent: 50,
        nextLesson: {
          title: "Questions",
          moduleTitle: "Basics",
          href: "/courses/gcse-russian/foundation/modules/basics/questions",
          estimatedMinutes: 15,
        },
      })
    );

    expect(nextStep.title).toBe("Continue where you left off");
    expect(nextStep.label).toBe("Continue lesson");
  });

  it("keeps Volna students on the assignments next step", () => {
    const nextStep = getDashboardNextStep(
      "volna",
      "volna",
      4,
      learningPlan({
        completedLessons: 4,
        nextLesson: {
          title: "Speaking practice",
          moduleTitle: "Classwork",
          href: "/courses/gcse-russian/volna/modules/classwork/speaking-practice",
          estimatedMinutes: 20,
        },
      })
    );

    expect(nextStep.href).toBe("/assignments");
    expect(nextStep.label).toBe("Open assignments");
  });

  it("resumes the next unlocked visible lesson section", () => {
    expect(
      getDashboardLessonResumeStepNumber(
        [
          { id: "shared-1", variant_visibility: "shared" },
          { id: "foundation-1", variant_visibility: "foundation_only" },
          { id: "higher-1", variant_visibility: "higher_only" },
          { id: "shared-2", variant_visibility: "shared" },
        ],
        ["shared-1"],
        "foundation"
      )
    ).toBe(2);

    expect(
      getDashboardLessonResumeStepNumber(
        [
          { id: "shared-1", variant_visibility: "shared" },
          { id: "higher-1", variant_visibility: "higher_only" },
          { id: "shared-2", variant_visibility: "shared" },
        ],
        ["shared-1", "higher-1"],
        "higher"
      )
    ).toBe(3);
  });
});
