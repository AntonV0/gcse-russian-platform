import { describe, expect, it } from "vitest";
import {
  PRODUCT_CODES,
  getCourseVariantForProductCode,
  getProductCodeForCourseVariant,
  getSupportedCourseProductCodes,
} from "@/lib/billing/catalog/product-context";
import {
  getTrialProductCodeForVariant,
  isSupportedCheckoutProductCode,
} from "@/lib/billing/catalog/product-eligibility";

describe("billing product context", () => {
  it("resolves current course variants to product codes", () => {
    expect(getProductCodeForCourseVariant("gcse-russian", "foundation")).toBe(
      PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
    );
    expect(getProductCodeForCourseVariant("gcse-russian", "higher")).toBe(
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER
    );
  });

  it("resolves product codes back to course variants", () => {
    expect(getCourseVariantForProductCode(PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION)).toEqual(
      {
        courseSlug: "gcse-russian",
        variantSlug: "foundation",
        productCode: PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
      }
    );

    expect(getCourseVariantForProductCode(PRODUCT_CODES.GCSE_RUSSIAN_HIGHER)).toEqual({
      courseSlug: "gcse-russian",
      variantSlug: "higher",
      productCode: PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
    });
  });

  it("lists supported product codes for the active course", () => {
    expect(getSupportedCourseProductCodes()).toEqual([
      PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER,
    ]);
  });

  it("safely rejects unsupported course, variant, and product combinations", () => {
    expect(getProductCodeForCourseVariant("gcse-russian", "speaking")).toBeNull();
    expect(getProductCodeForCourseVariant("a-level-russian", "foundation")).toBeNull();
    expect(getCourseVariantForProductCode("unknown-product")).toBeNull();
    expect(isSupportedCheckoutProductCode("unknown-product")).toBe(false);
    expect(isSupportedCheckoutProductCode(PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION)).toBe(
      true
    );
    expect(
      isSupportedCheckoutProductCode(
        PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION,
        "a-level-russian"
      )
    ).toBe(false);
  });

  it("uses the same resolver for trial variant product selection", () => {
    expect(getTrialProductCodeForVariant("foundation")).toBe(
      PRODUCT_CODES.GCSE_RUSSIAN_FOUNDATION
    );
    expect(getTrialProductCodeForVariant("higher")).toBe(
      PRODUCT_CODES.GCSE_RUSSIAN_HIGHER
    );
    expect(getTrialProductCodeForVariant("unknown")).toBeNull();
  });
});

