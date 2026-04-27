import { describe, expect, it } from "vitest";
import {
  filterVisibleLessonSections,
  getLessonRendererVariant,
  isSectionVisible,
} from "@/lib/lessons/variant-visibility";
import type { LessonSection, LessonSectionVariantVisibility } from "@/types/lesson";

function section(
  id: string,
  variantVisibility: LessonSectionVariantVisibility
): LessonSection {
  return {
    id,
    title: id,
    sectionKind: "content",
    position: 1,
    variantVisibility,
    blocks: [],
  };
}

describe("lesson variant visibility helpers", () => {
  it("normalizes supported route variants and falls back to foundation", () => {
    expect(getLessonRendererVariant("foundation")).toBe("foundation");
    expect(getLessonRendererVariant("higher")).toBe("higher");
    expect(getLessonRendererVariant("volna")).toBe("volna");
    expect(getLessonRendererVariant("unknown")).toBe("foundation");
  });

  it("keeps shared sections visible for every course variant", () => {
    const shared = section("shared", "shared");

    expect(isSectionVisible(shared, "foundation")).toBe(true);
    expect(isSectionVisible(shared, "higher")).toBe(true);
    expect(isSectionVisible(shared, "volna")).toBe(true);
  });

  it.each([
    ["foundation_only", "foundation", true],
    ["foundation_only", "higher", false],
    ["foundation_only", "volna", false],
    ["higher_only", "foundation", false],
    ["higher_only", "higher", true],
    ["higher_only", "volna", false],
    ["volna_only", "foundation", false],
    ["volna_only", "higher", false],
    ["volna_only", "volna", true],
  ] as const)(
    "evaluates %s visibility for the %s variant",
    (visibility, variant, expected) => {
      expect(isSectionVisible(section(visibility, visibility), variant)).toBe(expected);
    }
  );

  it("filters visible sections while preserving lesson order", () => {
    const sections = [
      section("intro", "shared"),
      section("foundation-practice", "foundation_only"),
      section("higher-stretch", "higher_only"),
      section("volna-seminar", "volna_only"),
      section("summary", "shared"),
    ];

    expect(
      filterVisibleLessonSections(sections, "foundation").map(({ id }) => id)
    ).toEqual(["intro", "foundation-practice", "summary"]);
    expect(filterVisibleLessonSections(sections, "higher").map(({ id }) => id)).toEqual([
      "intro",
      "higher-stretch",
      "summary",
    ]);
    expect(filterVisibleLessonSections(sections, "volna").map(({ id }) => id)).toEqual([
      "intro",
      "volna-seminar",
      "summary",
    ]);
  });
});
