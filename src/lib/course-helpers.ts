import { courses } from "@/lib/course-data";
import type { Course, Module, Lesson } from "@/types/course";

export function getCourses(): Course[] {
  return courses;
}

export function getCourseBySlug(courseSlug: string): Course | null {
  return courses.find((course) => course.slug === courseSlug) ?? null;
}

export function getModuleBySlug(
  courseSlug: string,
  moduleSlug: string
): Module | null {
  const course = getCourseBySlug(courseSlug);

  if (!course) return null;

  return course.modules.find((module) => module.slug === moduleSlug) ?? null;
}

export function getLessonBySlug(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Lesson | null {
  const module = getModuleBySlug(courseSlug, moduleSlug);

  if (!module) return null;

  return module.lessons.find((lesson) => lesson.slug === lessonSlug) ?? null;
}

export function getLessonIndex(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): number {
  const module = getModuleBySlug(courseSlug, moduleSlug);

  if (!module) return -1;

  return module.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
}

export function getAdjacentLessons(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): {
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
} {
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