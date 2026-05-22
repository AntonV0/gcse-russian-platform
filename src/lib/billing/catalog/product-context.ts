import {
  DEFAULT_ACTIVE_COURSE_SLUG,
  resolveActiveCourseSlug,
} from "@/lib/courses/active-course";

export type CourseProductVariantSlug = "foundation" | "higher";

export type CourseProductContext = {
  courseSlug: string;
  variantSlug: CourseProductVariantSlug;
  productCode: string;
};

const COURSE_PRODUCT_CODES = {
  [DEFAULT_ACTIVE_COURSE_SLUG]: {
    foundation: "gcse-russian-foundation",
    higher: "gcse-russian-higher",
  },
} as const satisfies Record<string, Record<CourseProductVariantSlug, string>>;

type SupportedCourseSlug = keyof typeof COURSE_PRODUCT_CODES;

export const PRODUCT_CODES = {
  GCSE_RUSSIAN_FOUNDATION: COURSE_PRODUCT_CODES[DEFAULT_ACTIVE_COURSE_SLUG].foundation,
  GCSE_RUSSIAN_HIGHER: COURSE_PRODUCT_CODES[DEFAULT_ACTIVE_COURSE_SLUG].higher,
} as const;

export type SupportedCourseProductCode =
  (typeof PRODUCT_CODES)[keyof typeof PRODUCT_CODES];

function getCourseProductMap(courseSlug?: string | null) {
  const resolvedCourseSlug = resolveActiveCourseSlug(courseSlug);

  if (resolvedCourseSlug in COURSE_PRODUCT_CODES) {
    return COURSE_PRODUCT_CODES[resolvedCourseSlug as SupportedCourseSlug];
  }

  return null;
}

export function getProductCodeForCourseVariant(
  courseSlug: string | null | undefined,
  variantSlug: string | null | undefined
): string | null {
  if (!variantSlug) {
    return null;
  }

  const productMap = getCourseProductMap(courseSlug);

  if (!productMap) {
    return null;
  }

  return productMap[variantSlug as CourseProductVariantSlug] ?? null;
}

export function getSupportedCourseProductCodes(
  courseSlug?: string | null
): SupportedCourseProductCode[] {
  const productMap = getCourseProductMap(courseSlug);

  if (!productMap) {
    return [];
  }

  return Object.values(productMap) as SupportedCourseProductCode[];
}

export function getCourseVariantForProductCode(
  productCode: string
): CourseProductContext | null {
  for (const [courseSlug, productMap] of Object.entries(COURSE_PRODUCT_CODES)) {
    for (const [variantSlug, mappedProductCode] of Object.entries(productMap)) {
      if (mappedProductCode === productCode) {
        return {
          courseSlug,
          variantSlug: variantSlug as CourseProductVariantSlug,
          productCode,
        };
      }
    }
  }

  return null;
}
