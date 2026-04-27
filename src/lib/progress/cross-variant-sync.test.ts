import { describe, expect, it } from "vitest";
import {
  isCanonicalSectionProgressTarget,
  type CrossVariantSectionProgressMeta,
} from "@/lib/progress/cross-variant-sync-helpers";

function meta(
  canonicalSectionKey: string | null,
  variantVisibility: CrossVariantSectionProgressMeta["variant_visibility"],
  isPublished = true
): CrossVariantSectionProgressMeta {
  return {
    canonical_section_key: canonicalSectionKey,
    variant_visibility: variantVisibility,
    is_published: isPublished,
  };
}

describe("cross-variant lesson progress helpers", () => {
  it("matches published shared or higher sections by canonical section key", () => {
    const current = meta("intro", "shared");

    expect(isCanonicalSectionProgressTarget(current, meta("intro", "shared"))).toBe(true);
    expect(isCanonicalSectionProgressTarget(current, meta("intro", "higher_only"))).toBe(
      true
    );
  });

  it("does not sync when canonical keys are missing or different", () => {
    expect(
      isCanonicalSectionProgressTarget(meta(null, "shared"), meta("intro", "shared"))
    ).toBe(false);
    expect(
      isCanonicalSectionProgressTarget(meta("intro", "shared"), meta("summary", "shared"))
    ).toBe(false);
  });

  it("does not sync unpublished or non-target variant sections", () => {
    const current = meta("intro", "shared");

    expect(
      isCanonicalSectionProgressTarget(current, meta("intro", "shared", false))
    ).toBe(false);
    expect(
      isCanonicalSectionProgressTarget(current, meta("intro", "foundation_only"))
    ).toBe(false);
    expect(isCanonicalSectionProgressTarget(current, meta("intro", "volna_only"))).toBe(
      false
    );
  });
});
