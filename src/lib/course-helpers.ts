import { gcseRussianCourse } from "@/lib/course-data";

export function getCourse() {
  return gcseRussianCourse;
}

export function getModuleBySlug(moduleSlug: string) {
  return gcseRussianCourse.modules.find((module) => module.slug === moduleSlug);
}

export function getLessonBySlug(moduleSlug: string, lessonSlug: string) {
  const module = getModuleBySlug(moduleSlug);

  if (!module) return null;

  return module.lessons.find((lesson) => lesson.slug === lessonSlug) ?? null;
}

export function getLessonIndex(moduleSlug: string, lessonSlug: string) {
  const module = getModuleBySlug(moduleSlug);

  if (!module) return -1;

  return module.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
}

export function getAdjacentLessons(moduleSlug: string, lessonSlug: string) {
  const module = getModuleBySlug(moduleSlug);

  if (!module) {
    return {
      previousLesson: null,
      nextLesson: null,
    };
  }

  const currentIndex = getLessonIndex(moduleSlug, lessonSlug);

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