import { getLessonAccessStateFromMeta } from "@/lib/access/access";
import { getLessonPath } from "@/lib/access/routes";
import { getCurrentCourseAccess, getCurrentProfile } from "@/lib/auth/auth";
import {
  getLessonsByModuleIdsDb,
  loadVariantPageData,
} from "@/lib/courses/course-helpers-db";
import {
  getLessonIdsWithPublishedSectionsDb,
  getLessonSectionsByLessonIdDb,
} from "@/lib/lessons/lesson-content-helpers-db";
import { getCourseLessonProgress } from "@/lib/progress/progress-module";
import { getVisitedLessonSectionIds } from "@/lib/progress/progress";

export type DashboardVariant = "foundation" | "higher" | "volna" | null;
export type DashboardAccessMode = "trial" | "full" | "volna" | null;

export type StudentLearningPlan = {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  nextLesson: {
    title: string;
    moduleTitle: string;
    href: string;
    estimatedMinutes: number | null;
  } | null;
};

type DashboardLessonProgressEntry = {
  module_slug: string;
  lesson_slug: string;
  completed: boolean | null;
};

type DashboardLessonProgressTarget = {
  moduleSlug: string;
  lessonSlug: string;
};

type DashboardLessonSectionTarget = {
  id: string;
  variant_visibility: "shared" | "foundation_only" | "higher_only" | "volna_only";
};

function getLessonProgressKey(moduleSlug: string, lessonSlug: string) {
  return `${moduleSlug}/${lessonSlug}`;
}

function getCompletedLessonKeys(progress: DashboardLessonProgressEntry[]) {
  return new Set(
    progress
      .filter((entry) => entry.completed)
      .map((entry) => getLessonProgressKey(entry.module_slug, entry.lesson_slug))
  );
}

export function getCompletedLessonCountForDashboardPlan(
  progress: DashboardLessonProgressEntry[],
  lessons: DashboardLessonProgressTarget[]
) {
  const completedLessonKeys = getCompletedLessonKeys(progress);
  const lessonKeys = new Set(
    lessons.map((lesson) => getLessonProgressKey(lesson.moduleSlug, lesson.lessonSlug))
  );

  let completedLessons = 0;

  for (const lessonKey of lessonKeys) {
    if (completedLessonKeys.has(lessonKey)) {
      completedLessons += 1;
    }
  }

  return completedLessons;
}

function isSectionVisibleForDashboardVariant(
  section: DashboardLessonSectionTarget,
  variant: Exclude<DashboardVariant, null>
) {
  if (section.variant_visibility === "shared") {
    return true;
  }

  if (section.variant_visibility === "foundation_only" && variant === "foundation") {
    return true;
  }

  if (section.variant_visibility === "higher_only" && variant === "higher") {
    return true;
  }

  if (section.variant_visibility === "volna_only" && variant === "volna") {
    return true;
  }

  return false;
}

export function getDashboardLessonResumeStepNumber(
  sections: DashboardLessonSectionTarget[],
  visitedSectionIds: string[],
  variant: Exclude<DashboardVariant, null>
) {
  const visibleSections = sections.filter((section) =>
    isSectionVisibleForDashboardVariant(section, variant)
  );

  if (visibleSections.length === 0) {
    return null;
  }

  const visitedIds = new Set(visitedSectionIds);
  let maxVisitedIndex = -1;

  visibleSections.forEach((section, index) => {
    if (visitedIds.has(section.id)) {
      maxVisitedIndex = index;
    }
  });

  return Math.min(maxVisitedIndex + 1, visibleSections.length - 1) + 1;
}

async function getDashboardLessonResumeHref(params: {
  courseSlug: string;
  variant: Exclude<DashboardVariant, null>;
  moduleSlug: string;
  lessonSlug: string;
  lessonId: string;
}) {
  const href = getLessonPath(
    params.courseSlug,
    params.variant,
    params.moduleSlug,
    params.lessonSlug
  );
  const [sections, visitedSectionIds] = await Promise.all([
    getLessonSectionsByLessonIdDb(params.lessonId),
    getVisitedLessonSectionIds(params.lessonId),
  ]);
  const resumeStepNumber = getDashboardLessonResumeStepNumber(
    sections,
    visitedSectionIds,
    params.variant
  );

  if (!resumeStepNumber || resumeStepNumber <= 1) {
    return href;
  }

  return `${href}?step=${resumeStepNumber}`;
}

export function formatDashboardLabel(value: string | null) {
  if (!value) return "-";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getDashboardVariantLabel(variant: DashboardVariant) {
  if (!variant) return "No active variant";
  if (variant === "volna") return "Volna";
  if (variant === "foundation") return "Foundation";
  return "Higher";
}

export function getDashboardAccessLabel(accessMode: DashboardAccessMode) {
  if (!accessMode) return "No active access";
  if (accessMode === "full") return "Full access";
  if (accessMode === "trial") return "Trial access";
  return "Volna access";
}

export function getDashboardProgressMessage(
  accessMode: DashboardAccessMode,
  completedLessons: number
) {
  if (accessMode === "trial") {
    return "You are currently exploring the platform with trial access. Use this time to sample lessons, resources, and the overall learning experience.";
  }

  if (accessMode === "volna") {
    if (completedLessons === 0) {
      return "Your learning is guided through lessons and assignments. Start with your assigned work and lesson content.";
    }

    return "Your learning is guided through lessons and assignments. Keep following your teacher-led path and build steady progress.";
  }

  if (completedLessons === 0) {
    return "Start your first lesson to begin building progress on your current course path.";
  }

  return "Keep going - steady lesson progress builds stronger confidence for GCSE Russian.";
}

export async function getStudentLearningPlan(
  variant: DashboardVariant,
  fallbackCompletedLessons: number
): Promise<StudentLearningPlan> {
  if (!variant) {
    return {
      totalLessons: 0,
      completedLessons: fallbackCompletedLessons,
      progressPercent: 0,
      nextLesson: null,
    };
  }

  const { course, modules } = await loadVariantPageData("gcse-russian", variant);

  if (!course || modules.length === 0) {
    return {
      totalLessons: 0,
      completedLessons: fallbackCompletedLessons,
      progressPercent: 0,
      nextLesson: null,
    };
  }

  const [lessons, progress, profile, access] = await Promise.all([
    getLessonsByModuleIdsDb(modules.map((courseModule) => courseModule.id)),
    getCourseLessonProgress(course.slug, variant),
    getCurrentProfile(),
    getCurrentCourseAccess(course.slug, variant),
  ]);

  const contentReadyLessonIds = await getLessonIdsWithPublishedSectionsDb(
    lessons.map((lesson) => lesson.id),
    variant
  );
  const contentReadyLessons = lessons.filter((lesson) =>
    contentReadyLessonIds.has(lesson.id)
  );
  const lessonsByModuleId = new Map<string, typeof contentReadyLessons>();

  for (const lesson of contentReadyLessons) {
    const current = lessonsByModuleId.get(lesson.module_id) ?? [];
    current.push(lesson);
    lessonsByModuleId.set(lesson.module_id, current);
  }

  const orderedLessonProgressTargets = modules.flatMap((courseModule) =>
    (lessonsByModuleId.get(courseModule.id) ?? []).map((lesson) => ({
      moduleSlug: courseModule.slug,
      lessonSlug: lesson.slug,
    }))
  );
  const totalLessons = contentReadyLessons.length;
  const completedLessons = getCompletedLessonCountForDashboardPlan(
    progress,
    orderedLessonProgressTargets
  );
  const progressPercent =
    totalLessons > 0
      ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
      : 0;
  const completedLessonKeys = getCompletedLessonKeys(progress);

  for (const courseModule of modules) {
    const moduleLessons = lessonsByModuleId.get(courseModule.id) ?? [];

    for (const lesson of moduleLessons) {
      if (completedLessonKeys.has(getLessonProgressKey(courseModule.slug, lesson.slug))) {
        continue;
      }

      const accessState = getLessonAccessStateFromMeta(lesson, profile, access);

      if (accessState !== "accessible") continue;

      return {
        totalLessons,
        completedLessons,
        progressPercent,
        nextLesson: {
          title: lesson.title,
          moduleTitle: courseModule.title,
          href: await getDashboardLessonResumeHref({
            courseSlug: course.slug,
            variant,
            moduleSlug: courseModule.slug,
            lessonSlug: lesson.slug,
            lessonId: lesson.id,
          }),
          estimatedMinutes: lesson.estimated_minutes,
        },
      };
    }
  }

  return {
    totalLessons,
    completedLessons,
    progressPercent,
    nextLesson: null,
  };
}

export function getDashboardNextStep(
  variant: DashboardVariant,
  accessMode: DashboardAccessMode,
  completedLessons: number,
  learningPlan: StudentLearningPlan
) {
  const completedLessonCount =
    learningPlan.totalLessons > 0 ? learningPlan.completedLessons : completedLessons;

  if (accessMode === "volna") {
    return {
      title: "Continue your guided work",
      description:
        "Open your assignments and continue through the lesson content linked to your teacher-led learning.",
      href: "/assignments",
      label: "Open assignments",
      icon: "assignments" as const,
    };
  }

  if (learningPlan.nextLesson) {
    return {
      title:
        completedLessonCount > 0
          ? "Continue where you left off"
          : "Start your first lesson",
      description: `${learningPlan.nextLesson.moduleTitle}: ${learningPlan.nextLesson.title}`,
      href: learningPlan.nextLesson.href,
      label: completedLessonCount > 0 ? "Continue lesson" : "Start lesson",
      icon: "next" as const,
    };
  }

  if (accessMode === "trial") {
    return {
      title: "Explore the platform",
      description:
        "Browse lessons, vocabulary, grammar, and past papers to see how the full learning experience is structured.",
      href: "/courses",
      label: "Explore lessons",
      icon: "courses" as const,
    };
  }

  if (variant && completedLessonCount > 0) {
    return {
      title: "Keep your momentum going",
      description:
        "Continue your current course path and keep building progress through lessons and revision resources.",
      href: "/courses",
      label: "Continue learning",
      icon: "next" as const,
    };
  }

  if (variant) {
    return {
      title: "Start your course path",
      description:
        "Begin working through your lessons and use the platform as your main GCSE Russian study hub.",
      href: "/courses",
      label: "Start learning",
      icon: "courses" as const,
    };
  }

  return {
    title: "Get started",
    description: "Browse available course content and begin exploring the platform.",
    href: "/courses",
    label: "Browse courses",
    icon: "courses" as const,
  };
}
