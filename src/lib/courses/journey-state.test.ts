import { describe, expect, it } from "vitest";

import {
  getLessonJourneyState,
  getPreferredCourseVariant,
  getVariantActionState,
  getVariantDisplayName,
  getVisibleCourseVariants,
} from "@/lib/courses/journey-state";
import type { DbCourseVariant } from "@/lib/courses/types";

function variant(slug: string, position: number): DbCourseVariant {
  return {
    id: slug,
    course_id: "course",
    slug,
    title: `${slug} title`,
    description: null,
    position,
    is_active: true,
    is_published: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("course journey state", () => {
  const variants = [variant("foundation", 1), variant("higher", 2)];

  it("uses friendly labels for known variants", () => {
    expect(getVariantDisplayName("foundation", "Fallback")).toBe("Foundation");
    expect(getVariantDisplayName("higher", "Fallback")).toBe("Higher");
    expect(getVariantDisplayName("volna", "Fallback")).toBe("Volna");
    expect(getVariantDisplayName("custom", "Custom")).toBe("Custom");
  });

  it("limits Higher-only users to the Higher path when available", () => {
    expect(
      getVisibleCourseVariants(variants, "full_higher").map(({ slug }) => slug)
    ).toEqual(["higher"]);
    expect(
      getVisibleCourseVariants(variants, "full_foundation").map(({ slug }) => slug)
    ).toEqual(["foundation", "higher"]);
  });

  it("prefers the active dashboard variant before falling back to the first visible path", () => {
    expect(getPreferredCourseVariant(variants, "higher")?.slug).toBe("higher");
    expect(getPreferredCourseVariant(variants, "volna")?.slug).toBe("foundation");
    expect(getPreferredCourseVariant([], "higher")).toBeNull();
  });

  it("chooses path actions from upgrade, start, continue, review, and open states", () => {
    expect(
      getVariantActionState({
        isUpgrade: true,
        hasNextLesson: true,
        isComplete: false,
        completedLessons: 0,
      }).label
    ).toBe("Upgrade to Higher");

    expect(
      getVariantActionState({
        isUpgrade: false,
        hasNextLesson: true,
        isComplete: false,
        completedLessons: 0,
      }).label
    ).toBe("Start first lesson");

    expect(
      getVariantActionState({
        isUpgrade: false,
        hasNextLesson: true,
        isComplete: false,
        completedLessons: 2,
      }).label
    ).toBe("Continue lesson");

    expect(
      getVariantActionState({
        isUpgrade: false,
        hasNextLesson: false,
        isComplete: true,
        completedLessons: 4,
      }).label
    ).toBe("Review path");
  });

  it("keeps lesson card states explicit and accessible", () => {
    expect(
      getLessonJourneyState({
        isCompleted: true,
        isNextLesson: false,
        canAccessLesson: false,
        lockedLabel: "Access required",
      })
    ).toMatchObject({
      badgeLabel: "Completed",
      actionLabel: "Review lesson",
      canOpen: true,
      progressValue: 100,
    });

    expect(
      getLessonJourneyState({
        isCompleted: false,
        isNextLesson: true,
        canAccessLesson: true,
        lockedLabel: "Access required",
      })
    ).toMatchObject({
      badgeLabel: "Current lesson",
      actionLabel: "Continue lesson",
      canOpen: true,
    });

    expect(
      getLessonJourneyState({
        isCompleted: false,
        isNextLesson: false,
        canAccessLesson: false,
        lockedLabel: "Higher upgrade required",
      })
    ).toMatchObject({
      badgeLabel: "Locked",
      actionLabel: "Higher upgrade required",
      canOpen: false,
    });
  });
});
