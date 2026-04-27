import {
  getCourseBySlugDb,
  getLessonsByModuleIdDb,
  getModuleBySlugForVariantIdDb,
  getModulesByVariantIdDb,
  getVariantBySlugForCourseIdDb,
  getVariantsByCourseIdDb,
} from "./course-queries";
import type { DbCourseVariant, DbLesson, DbModule } from "./types";

export async function loadCoursePageData(courseSlug: string) {
  const course = await getCourseBySlugDb(courseSlug);
  if (!course) {
    return { course: null, variants: [] as DbCourseVariant[] };
  }

  const variants = await getVariantsByCourseIdDb(course.id);

  return { course, variants };
}

export async function loadVariantPageData(courseSlug: string, variantSlug: string) {
  const course = await getCourseBySlugDb(courseSlug);
  if (!course) {
    return {
      course: null,
      variant: null,
      modules: [] as DbModule[],
    };
  }

  const variant = await getVariantBySlugForCourseIdDb(course.id, variantSlug);
  if (!variant) {
    return {
      course,
      variant: null,
      modules: [] as DbModule[],
    };
  }

  const modules = await getModulesByVariantIdDb(variant.id);

  return { course, variant, modules };
}

export async function loadModulePageData(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string
) {
  const course = await getCourseBySlugDb(courseSlug);
  if (!course) {
    return {
      course: null,
      variant: null,
      module: null,
      lessons: [] as DbLesson[],
    };
  }

  const variant = await getVariantBySlugForCourseIdDb(course.id, variantSlug);
  if (!variant) {
    return {
      course,
      variant: null,
      module: null,
      lessons: [] as DbLesson[],
    };
  }

  const courseModule = await getModuleBySlugForVariantIdDb(variant.id, moduleSlug);
  if (!courseModule) {
    return {
      course,
      variant,
      module: null,
      lessons: [] as DbLesson[],
    };
  }

  const lessons = await getLessonsByModuleIdDb(courseModule.id);

  return { course, variant, module: courseModule, lessons };
}

export async function loadLessonPageData(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  const course = await getCourseBySlugDb(courseSlug);
  if (!course) {
    return {
      course: null,
      variant: null,
      module: null,
      lesson: null,
      lessons: [] as DbLesson[],
      previousLesson: null as DbLesson | null,
      nextLesson: null as DbLesson | null,
    };
  }

  const variant = await getVariantBySlugForCourseIdDb(course.id, variantSlug);
  if (!variant) {
    return {
      course,
      variant: null,
      module: null,
      lesson: null,
      lessons: [] as DbLesson[],
      previousLesson: null as DbLesson | null,
      nextLesson: null as DbLesson | null,
    };
  }

  const courseModule = await getModuleBySlugForVariantIdDb(variant.id, moduleSlug);
  if (!courseModule) {
    return {
      course,
      variant,
      module: null,
      lesson: null,
      lessons: [] as DbLesson[],
      previousLesson: null as DbLesson | null,
      nextLesson: null as DbLesson | null,
    };
  }

  const lessons = await getLessonsByModuleIdDb(courseModule.id);
  const currentIndex = lessons.findIndex(
    (moduleLesson) => moduleLesson.slug === lessonSlug
  );
  const lesson = currentIndex >= 0 ? lessons[currentIndex] : null;
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  return {
    course,
    variant,
    module: courseModule,
    lesson,
    lessons,
    previousLesson,
    nextLesson,
  };
}
