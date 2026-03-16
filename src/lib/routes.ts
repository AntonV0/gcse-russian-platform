export function getCoursePath(courseSlug: string) {
  return `/courses/${courseSlug}`;
}

export function getModulePath(courseSlug: string, moduleSlug: string) {
  return `/courses/${courseSlug}/modules/${moduleSlug}`;
}

export function getLessonPath(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  return `/courses/${courseSlug}/modules/${moduleSlug}/lessons/${lessonSlug}`;
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