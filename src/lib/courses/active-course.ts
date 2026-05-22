export const DEFAULT_ACTIVE_COURSE_SLUG = "gcse-russian";

export function getDefaultActiveCourseSlug() {
  return DEFAULT_ACTIVE_COURSE_SLUG;
}

export function resolveActiveCourseSlug(courseSlug?: string | null) {
  const normalizedCourseSlug = courseSlug?.trim();

  return normalizedCourseSlug || DEFAULT_ACTIVE_COURSE_SLUG;
}

export function getActiveCoursePath(
  variantSlug?: string | null,
  courseSlug?: string | null
) {
  if (!variantSlug) {
    return "/courses";
  }

  return `/courses/${resolveActiveCourseSlug(courseSlug)}/${variantSlug}`;
}
