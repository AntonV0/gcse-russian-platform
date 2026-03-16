import { courses } from "@/lib/course-data";

export function getCourses() {
  return courses;
}

export function getCourseBySlug(courseSlug: string) {
  return courses.find((course) => course.slug === courseSlug) ?? null;
}

export function getModuleBySlug(courseSlug: string, moduleSlug: string) {
  const course = getCourseBySlug(courseSlug);

  if (!course) return null;

  return course.modules.find((module) => module.slug === moduleSlug) ?? null;
}

export function getLessonBySlug(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  const module = getModuleBySlug(courseSlug, moduleSlug);

  if (!module) return null;

  return module.lessons.find((lesson) => lesson.slug === lessonSlug) ?? null;
}

export function getLessonIndex(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  const module = getModuleBySlug(courseSlug, moduleSlug);

  if (!module) return -1;

  return module.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
}

export function getAdjacentLessons(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  const module = getModuleBySlug(courseSlug, moduleSlug);

  if (!module) {
    return {
      previousLesson: null,
      nextLesson: null,
    };
  }

  const currentIndex = getLessonIndex(courseSlug, moduleSlug, lessonSlug);

  if (currentIndex === -1) {
    return {
      previousLesson: null,
      nextLesson: null,
    };
  }

  return {
    previousLesson:
      currentIndex > 0 ? module.lessons[currentIndex - 1] : null,
    nextLesson:
      currentIndex < module.lessons.length - 1
        ? module.lessons[currentIndex + 1]
        : null,
  };
}