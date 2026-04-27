import { describe, expect, it } from "vitest";
import {
  clampStepIndex,
  getAllowedMaxIndex,
  getLessonProgressSummary,
  getMaxVisitedIndex,
  getVisitedSectionCount,
} from "@/components/lesson-blocks/lesson-page-template/progress-helpers";
import type { LessonSection } from "@/types/lesson";

function section(id: string): LessonSection {
  return {
    id,
    title: id,
    sectionKind: "content",
    position: 1,
    variantVisibility: "shared",
    blocks: [],
  };
}

describe("lesson progress helpers", () => {
  it("clamps one-based step query values into zero-based indexes", () => {
    expect(clampStepIndex(undefined, 3)).toBe(0);
    expect(clampStepIndex("abc", 3)).toBe(0);
    expect(clampStepIndex("0", 3)).toBe(0);
    expect(clampStepIndex("2.9", 3)).toBe(1);
    expect(clampStepIndex("99", 3)).toBe(2);
    expect(clampStepIndex("1", 0)).toBe(0);
  });

  it("returns the highest visited section index", () => {
    expect(
      getMaxVisitedIndex(
        [section("intro"), section("practice"), section("summary")],
        new Set(["intro", "summary"])
      )
    ).toBe(2);
  });

  it("treats previously visited sections as accessible even when later sections are unvisited", () => {
    expect(
      getMaxVisitedIndex(
        [section("intro"), section("explain"), section("practice"), section("summary")],
        new Set(["intro", "practice"])
      )
    ).toBe(2);
  });

  it("allows the next unvisited step but never beyond the final step", () => {
    expect(getAllowedMaxIndex(4, -1)).toBe(0);
    expect(getAllowedMaxIndex(4, 1)).toBe(2);
    expect(getAllowedMaxIndex(4, 3)).toBe(3);
    expect(getAllowedMaxIndex(0, 3)).toBe(0);
  });

  it("unlocks only the next section after the latest visited section", () => {
    const totalSteps = 5;

    expect(getAllowedMaxIndex(totalSteps, -1)).toBe(0);
    expect(getAllowedMaxIndex(totalSteps, 0)).toBe(1);
    expect(getAllowedMaxIndex(totalSteps, 2)).toBe(3);
  });

  it("calculates visited section counts from visible sections only", () => {
    const sections = [section("intro"), section("practice"), section("summary")];

    expect(getVisitedSectionCount(sections, new Set(["intro", "hidden"]))).toBe(1);
  });

  it("summarizes completed and partially visited section progress", () => {
    const sections = [section("intro"), section("practice"), section("summary")];

    expect(getLessonProgressSummary(sections, new Set(["intro", "summary"]))).toEqual({
      visitedCount: 2,
      totalSections: 3,
      percent: 67,
      allVisited: false,
    });

    expect(
      getLessonProgressSummary(sections, new Set(["intro", "practice", "summary"]))
    ).toEqual({
      visitedCount: 3,
      totalSections: 3,
      percent: 100,
      allVisited: true,
    });
  });

  it("handles empty lessons without marking progress complete", () => {
    expect(getLessonProgressSummary([], new Set(["intro"]))).toEqual({
      visitedCount: 0,
      totalSections: 0,
      percent: 0,
      allVisited: false,
    });
  });
});
