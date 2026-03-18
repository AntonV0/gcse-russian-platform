export function getCoursePath(courseSlug: string) {
  return `/courses/${courseSlug}`;
}

export function getVariantPath(courseSlug: string, variantSlug: string) {
  return `/courses/${courseSlug}/${variantSlug}`;
}

export function getModulePath(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string
) {
  return `/courses/${courseSlug}/${variantSlug}/modules/${moduleSlug}`;
}

export function getLessonPath(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  return `/courses/${courseSlug}/${variantSlug}/modules/${moduleSlug}/lessons/${lessonSlug}`;
}

export function getDashboardPath() {
  return "/dashboard";
}

export function getCoursesPath() {
  return "/courses";
}

export function getAccountPath() {
  return "/account";
}