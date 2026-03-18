import { courses } from "@/lib/course-data";
import type { Course, CourseVariant, Module, Lesson } from "@/types/course";

export function getCourses(): Course[] {
  return courses;
}

export function getCourseBySlug(courseSlug: string): Course | null {
  return courses.find((course) => course.slug === courseSlug) ?? null;
}

export function getVariantBySlug(
  courseSlug: string,
  variantSlug: string
): CourseVariant | null {
  const course = getCourseBySlug(courseSlug);

  if (!course) return null;

  return course.variants.find((variant) => variant.slug === variantSlug) ?? null;
}

export function getModuleBySlug(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string
): Module | null {
  const variant = getVariantBySlug(courseSlug, variantSlug);

  if (!variant) return null;

  return variant.modules.find((module) => module.slug === moduleSlug) ?? null;
}

export function getLessonBySlug(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Lesson | null {
  const module = getModuleBySlug(courseSlug, variantSlug, moduleSlug);

  if (!module) return null;

  return module.lessons.find((lesson) => lesson.slug === lessonSlug) ?? null;
}

export function getLessonIndex(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
): number {
  const module = getModuleBySlug(courseSlug, variantSlug, moduleSlug);

  if (!module) return -1;

  return module.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
}

export function getAdjacentLessons(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
): {
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
} {
  const module = getModuleBySlug(courseSlug, variantSlug, moduleSlug);

  if (!module) {
    return {
      previousLesson: null,
      nextLesson: null,
    };
  }

  const currentIndex = getLessonIndex(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

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