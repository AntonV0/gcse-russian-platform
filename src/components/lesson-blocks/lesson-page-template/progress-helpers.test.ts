import { describe, expect, it } from "vitest";
import {
  clampStepIndex,
  getAllowedMaxIndex,
  getMaxVisitedIndex,
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

  it("allows the next unvisited step but never beyond the final step", () => {
    expect(getAllowedMaxIndex(4, -1)).toBe(0);
    expect(getAllowedMaxIndex(4, 1)).toBe(2);
    expect(getAllowedMaxIndex(4, 3)).toBe(3);
    expect(getAllowedMaxIndex(0, 3)).toBe(0);
  });
});
