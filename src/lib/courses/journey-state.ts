import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type { AppIconKey } from "@/lib/shared/icons";

import type { DbCourseVariant } from "./types";

export type CourseVariantTone = "info" | "success" | "muted";
export type JourneyBadgeTone = "info" | "success" | "warning" | "muted";
export type JourneyActionTone = "accent" | "muted" | "success" | "locked";

export function getVariantDisplayName(slug: string, fallback: string) {
  if (slug === "foundation") return "Foundation";
  if (slug === "higher") return "Higher";
  if (slug === "volna") return "Volna";
  return fallback;
}

export function getVariantTone(slug: string): CourseVariantTone {
  if (slug === "foundation") return "success";
  if (slug === "higher") return "info";
  return "muted";
}

export function getDashboardVariantSlug(variant: DashboardInfo["variant"]) {
  return variant === "foundation" || variant === "higher" || variant === "volna"
    ? variant
    : null;
}

export function getVisibleCourseVariants(
  variants: DbCourseVariant[],
  accessState: DashboardInfo["accessState"]
) {
  if (accessState !== "full_higher") {
    return variants;
  }

  const higherVariants = variants.filter((variant) => variant.slug === "higher");

  return higherVariants.length > 0 ? higherVariants : variants;
}

export function getPreferredCourseVariant(
  variants: DbCourseVariant[],
  activeVariantSlug: string | null
) {
  if (activeVariantSlug) {
    const activeVariant = variants.find((variant) => variant.slug === activeVariantSlug);

    if (activeVariant) {
      return activeVariant;
    }
  }

  return variants[0] ?? null;
}

export function getVariantActionState({
  isUpgrade,
  hasNextLesson,
  isComplete,
  completedLessons,
}: {
  isUpgrade: boolean;
  hasNextLesson: boolean;
  isComplete: boolean;
  completedLessons: number;
}) {
  if (isUpgrade) {
    return {
      label: "Upgrade to Higher",
      icon: "billing" as AppIconKey,
      ariaPrefix: "Upgrade to",
    };
  }

  if (hasNextLesson) {
    return {
      label: completedLessons > 0 ? "Continue lesson" : "Start first lesson",
      icon: "next" as AppIconKey,
      ariaPrefix: completedLessons > 0 ? "Continue" : "Start",
    };
  }

  if (isComplete) {
    return {
      label: "Review path",
      icon: "completed" as AppIconKey,
      ariaPrefix: "Review",
    };
  }

  return {
    label: "Open path",
    icon: "next" as AppIconKey,
    ariaPrefix: "Open",
  };
}

export function getLessonJourneyState({
  isCompleted,
  isNextLesson,
  canAccessLesson,
  lockedLabel,
}: {
  isCompleted: boolean;
  isNextLesson: boolean;
  canAccessLesson: boolean;
  lockedLabel: string;
}) {
  if (isCompleted) {
    return {
      badgeTone: "success" as JourneyBadgeTone,
      badgeIcon: "completed" as AppIconKey,
      badgeLabel: "Completed",
      statusLabel: "Ready for revision",
      actionLabel: "Review lesson",
      actionTone: "success" as JourneyActionTone,
      actionIcon: "completed" as AppIconKey,
      canOpen: true,
      progressValue: 100,
    };
  }

  if (isNextLesson) {
    return {
      badgeTone: "info" as JourneyBadgeTone,
      badgeIcon: "next" as AppIconKey,
      badgeLabel: "Current lesson",
      statusLabel: "Your next step",
      actionLabel: "Continue lesson",
      actionTone: "accent" as JourneyActionTone,
      actionIcon: "next" as AppIconKey,
      canOpen: true,
      progressValue: 0,
    };
  }

  if (canAccessLesson) {
    return {
      badgeTone: "muted" as JourneyBadgeTone,
      badgeIcon: "unlocked" as AppIconKey,
      badgeLabel: "Unlocked",
      statusLabel: "Available when ready",
      actionLabel: "Start lesson",
      actionTone: "muted" as JourneyActionTone,
      actionIcon: "unlocked" as AppIconKey,
      canOpen: true,
      progressValue: 0,
    };
  }

  return {
    badgeTone: "warning" as JourneyBadgeTone,
    badgeIcon: "locked" as AppIconKey,
    badgeLabel: "Locked",
    statusLabel: lockedLabel,
    actionLabel: lockedLabel,
    actionTone: "locked" as JourneyActionTone,
    actionIcon: "locked" as AppIconKey,
    canOpen: false,
    progressValue: 0,
  };
}
