import {
  getCourseVariantForProductCode,
  getProductCodeForCourseVariant,
  getSupportedCourseProductCodes,
} from "./product-context";

export function isSupportedCheckoutProductCode(
  productCode: string,
  courseSlug?: string | null
): boolean {
  return getSupportedCourseProductCodes(courseSlug).some(
    (supportedProductCode) => supportedProductCode === productCode
  );
}

export function getTrialProductCodeForVariant(
  variantSlug: string | null | undefined,
  courseSlug?: string | null
): string | null {
  return getProductCodeForCourseVariant(courseSlug, variantSlug);
}

export function isFoundationProductCode(productCode: string): boolean {
  return getCourseVariantForProductCode(productCode)?.variantSlug === "foundation";
}

export function isHigherProductCode(productCode: string): boolean {
  return getCourseVariantForProductCode(productCode)?.variantSlug === "higher";
}

export function getProductVariantPriority(productCode: string): number {
  const variantSlug = getCourseVariantForProductCode(productCode)?.variantSlug;

  if (variantSlug === "higher") {
    return 3;
  }

  if (variantSlug === "foundation") {
    return 2;
  }

  return 0;
}

export function getProductVariantDisplayName(productCode: string): string | null {
  const variantSlug = getCourseVariantForProductCode(productCode)?.variantSlug;

  if (variantSlug === "foundation") {
    return "Foundation";
  }

  if (variantSlug === "higher") {
    return "Higher";
  }

  return null;
}
