import { getLessonAccessStateFromMeta } from "@/lib/access/access";
import { getLessonPath } from "@/lib/access/routes";
import { getCurrentCourseAccess, getCurrentProfile } from "@/lib/auth/auth";
import {
  getLessonsByModuleIdsDb,
  getModulesByVariantIdDb,
} from "@/lib/courses/course-helpers-db";
import { getCourseLessonProgress } from "@/lib/progress/progress-module";

import type { DbCourseVariant, DbLesson, DbModule } from "./types";

type LessonProgressEntry = {
  module_slug: string;
  lesson_slug: string;
  completed: boolean | null;
};

export type CoursePathNextLesson = {
  title: string;
  moduleTitle: string;
  href: string;
  estimatedMinutes: number | null;
};

export type ModulePathProgressSummary = {
  moduleSlug: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  estimatedMinutes: number | null;
  remainingMinutes: number | null;
  nextLesson: CoursePathNextLesson | null;
  isComplete: boolean;
};

export type VariantPathProgressSummary = {
  variantSlug: string;
  totalModules: number;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  estimatedMinutes: number | null;
  remainingMinutes: number | null;
  nextLesson: CoursePathNextLesson | null;
  isComplete: boolean;
  moduleSummaries: ModulePathProgressSummary[];
};

function getLessonProgressKey(moduleSlug: string, lessonSlug: string) {
  return `${moduleSlug}/${lessonSlug}`;
}

function getCompletedLessonKeys(progress: LessonProgressEntry[]) {
  return new Set(
    progress
      .filter((entry) => entry.completed)
      .map((entry) => getLessonProgressKey(entry.module_slug, entry.lesson_slug))
  );
}

function getProgressPercent(completedLessons: number, totalLessons: number) {
  if (totalLessons === 0) return 0;
  return Math.min(100, Math.round((completedLessons / totalLessons) * 100));
}

function addKnownMinutes(total: number | null, nextValue: number | null) {
  if (!nextValue) return total;
  return (total ?? 0) + nextValue;
}

function buildModuleSummary(params: {
  courseSlug: string;
  variantSlug: string;
  courseModule: DbModule;
  lessons: DbLesson[];
  completedLessonKeys: Set<string>;
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
  access: Awaited<ReturnType<typeof getCurrentCourseAccess>>;
}): ModulePathProgressSummary {
  const {
    courseSlug,
    variantSlug,
    courseModule,
    lessons,
    completedLessonKeys,
    profile,
    access,
  } = params;
  let completedLessons = 0;
  let estimatedMinutes: number | null = null;
  let remainingMinutes: number | null = null;
  let nextLesson: CoursePathNextLesson | null = null;

  for (const lesson of lessons) {
    const lessonKey = getLessonProgressKey(courseModule.slug, lesson.slug);
    const isCompleted = completedLessonKeys.has(lessonKey);

    estimatedMinutes = addKnownMinutes(estimatedMinutes, lesson.estimated_minutes);

    if (isCompleted) {
      completedLessons += 1;
    } else {
      remainingMinutes = addKnownMinutes(remainingMinutes, lesson.estimated_minutes);
    }

    if (isCompleted || nextLesson) continue;

    const accessState = getLessonAccessStateFromMeta(lesson, profile, access);

    if (accessState !== "accessible") continue;

    nextLesson = {
      title: lesson.title,
      moduleTitle: courseModule.title,
      href: getLessonPath(courseSlug, variantSlug, courseModule.slug, lesson.slug),
      estimatedMinutes: lesson.estimated_minutes,
    };
  }

  return {
    moduleSlug: courseModule.slug,
    totalLessons: lessons.length,
    completedLessons,
    progressPercent: getProgressPercent(completedLessons, lessons.length),
    estimatedMinutes,
    remainingMinutes,
    nextLesson,
    isComplete: lessons.length > 0 && completedLessons === lessons.length,
  };
}

export function formatCoursePathMinutes(minutes: number | null | undefined) {
  if (!minutes) return "Self-paced";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

export function formatCoursePathRemainingMinutes(
  minutes: number | null | undefined,
  isComplete: boolean
) {
  if (isComplete) return "Complete";
  return formatCoursePathMinutes(minutes);
}

export async function getVariantPathProgressSummary(
  courseSlug: string,
  variant: DbCourseVariant,
  modules?: DbModule[]
): Promise<VariantPathProgressSummary> {
  const pathModules = modules ?? (await getModulesByVariantIdDb(variant.id));
  const [lessons, progress, profile, access] = await Promise.all([
    getLessonsByModuleIdsDb(pathModules.map((courseModule) => courseModule.id)),
    getCourseLessonProgress(courseSlug, variant.slug),
    getCurrentProfile(),
    getCurrentCourseAccess(courseSlug, variant.slug),
  ]);
  const lessonsByModuleId = new Map<string, DbLesson[]>();

  for (const lesson of lessons) {
    const moduleLessons = lessonsByModuleId.get(lesson.module_id) ?? [];
    moduleLessons.push(lesson);
    lessonsByModuleId.set(lesson.module_id, moduleLessons);
  }

  const completedLessonKeys = getCompletedLessonKeys(progress);
  const moduleSummaries = pathModules.map((courseModule) =>
    buildModuleSummary({
      courseSlug,
      variantSlug: variant.slug,
      courseModule,
      lessons: lessonsByModuleId.get(courseModule.id) ?? [],
      completedLessonKeys,
      profile,
      access,
    })
  );
  const totalLessons = moduleSummaries.reduce(
    (total, summary) => total + summary.totalLessons,
    0
  );
  const completedLessons = moduleSummaries.reduce(
    (total, summary) => total + summary.completedLessons,
    0
  );
  const estimatedMinutes = moduleSummaries.reduce<number | null>(
    (total, summary) => addKnownMinutes(total, summary.estimatedMinutes),
    null
  );
  const remainingMinutes = moduleSummaries.reduce<number | null>(
    (total, summary) => addKnownMinutes(total, summary.remainingMinutes),
    null
  );

  return {
    variantSlug: variant.slug,
    totalModules: pathModules.length,
    totalLessons,
    completedLessons,
    progressPercent: getProgressPercent(completedLessons, totalLessons),
    estimatedMinutes,
    remainingMinutes,
    nextLesson: moduleSummaries.find((summary) => summary.nextLesson)?.nextLesson ?? null,
    isComplete: totalLessons > 0 && completedLessons === totalLessons,
    moduleSummaries,
  };
}

export async function getVariantPathProgressSummaries(
  courseSlug: string,
  variants: DbCourseVariant[]
) {
  const summaries = await Promise.all(
    variants.map((variant) => getVariantPathProgressSummary(courseSlug, variant))
  );

  return new Map(summaries.map((summary) => [summary.variantSlug, summary]));
}
