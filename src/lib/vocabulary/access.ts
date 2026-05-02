import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type { DbVocabularySet } from "@/lib/vocabulary/shared/types";

export function canDashboardAccessVocabularySet(
  vocabularySet: DbVocabularySet,
  dashboard: DashboardInfo | null
) {
  if (!dashboard) return false;

  if (dashboard.role === "admin" || dashboard.role === "teacher") {
    return true;
  }

  if (dashboard.role === "guest") {
    return false;
  }

  if (dashboard.role !== "student") {
    return false;
  }

  if (dashboard.variant === "foundation" && vocabularySet.tier === "higher") {
    return false;
  }

  if (dashboard.accessMode === "trial") {
    return vocabularySet.is_trial_visible;
  }

  if (dashboard.accessMode === "full") {
    return true;
  }

  if (dashboard.accessMode === "volna") {
    return vocabularySet.available_in_volna;
  }

  return !vocabularySet.requires_paid_access;
}
