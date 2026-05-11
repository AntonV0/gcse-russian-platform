import type { AppIconKey } from "@/lib/shared/icons";
import {
  getDashboardNextStep,
  getStudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { getCourseProgressSummary } from "@/lib/progress/progress";

export type PlatformSidebarNextUp = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  label: string;
  icon: AppIconKey;
  progressPercent?: number | null;
};

export async function getPlatformSidebarNextUp(
  dashboard: DashboardInfo
): Promise<PlatformSidebarNextUp | null> {
  if (dashboard.role === "guest") {
    return null;
  }

  if (dashboard.accessState === "trial_needs_tier") {
    return {
      eyebrow: "Next up",
      title: "Choose a course path",
      description: "Pick Foundation or Higher before lessons start saving progress.",
      href: "/courses",
      label: "Choose path",
      icon: "courses",
      progressPercent: 0,
    };
  }

  if (dashboard.accessState === "expired") {
    return {
      eyebrow: "Next up",
      title: "Restore course access",
      description: "Reactivate your plan to continue lessons and saved progress.",
      href: "/account/billing",
      label: "Review access",
      icon: "billing",
      progressPercent: null,
    };
  }

  if (!dashboard.variant) {
    return null;
  }

  const progressSummary = await getCourseProgressSummary(
    "gcse-russian",
    dashboard.variant
  );
  const learningPlan = await getStudentLearningPlan(
    dashboard.variant,
    progressSummary.completedLessons
  );
  const completedLessonCount =
    learningPlan.totalLessons > 0
      ? learningPlan.completedLessons
      : progressSummary.completedLessons;

  if (learningPlan.nextLesson) {
    const title =
      completedLessonCount > 0 ? "Continue your lesson" : "Start your first lesson";

    return {
      eyebrow: "Next up",
      title,
      description: `${learningPlan.nextLesson.moduleNumber}. ${learningPlan.nextLesson.moduleTitle}`,
      href: learningPlan.nextLesson.href,
      label: title,
      icon: "next",
      progressPercent: learningPlan.progressPercent,
    };
  }

  const nextStep = getDashboardNextStep(
    dashboard.variant,
    dashboard.accessMode,
    progressSummary.completedLessons,
    learningPlan
  );

  return {
    eyebrow: "Next up",
    title: nextStep.title,
    description: nextStep.description,
    href: nextStep.href,
    label: nextStep.label,
    icon: nextStep.icon,
    progressPercent: learningPlan.totalLessons > 0 ? learningPlan.progressPercent : null,
  };
}
