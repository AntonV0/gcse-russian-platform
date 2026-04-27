type LessonSectionVariantVisibility =
  | "shared"
  | "foundation_only"
  | "higher_only"
  | "volna_only";

export type CrossVariantSectionProgressMeta = {
  canonical_section_key: string | null;
  variant_visibility: LessonSectionVariantVisibility;
  is_published: boolean;
};

export function isCanonicalSectionProgressTarget(
  currentSection: CrossVariantSectionProgressMeta,
  targetSection: CrossVariantSectionProgressMeta,
  targetVisibilities: LessonSectionVariantVisibility[] = ["shared", "higher_only"]
) {
  return (
    !!currentSection.canonical_section_key &&
    targetSection.is_published &&
    targetSection.canonical_section_key === currentSection.canonical_section_key &&
    targetVisibilities.includes(targetSection.variant_visibility)
  );
}
