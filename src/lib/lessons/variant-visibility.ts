import type { LessonSection } from "@/types/lesson";

export type LessonRendererVariant = "foundation" | "higher" | "volna";

export function getLessonRendererVariant(variantSlug: string): LessonRendererVariant {
  if (variantSlug === "higher" || variantSlug === "volna") {
    return variantSlug;
  }

  return "foundation";
}

export function isSectionVisible(
  section: LessonSection,
  currentVariant: LessonRendererVariant
) {
  if (section.variantVisibility === "shared") {
    return true;
  }

  if (
    section.variantVisibility === "foundation_only" &&
    currentVariant === "foundation"
  ) {
    return true;
  }

  if (section.variantVisibility === "higher_only" && currentVariant === "higher") {
    return true;
  }

  if (section.variantVisibility === "volna_only" && currentVariant === "volna") {
    return true;
  }

  return false;
}

export function filterVisibleLessonSections(
  sections: LessonSection[],
  currentVariant: LessonRendererVariant
) {
  return sections.filter((section) => isSectionVisible(section, currentVariant));
}
