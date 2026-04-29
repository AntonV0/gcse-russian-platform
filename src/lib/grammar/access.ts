import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type {
  DbGrammarSet,
  DbGrammarSetListItem,
  GrammarSetFilters,
} from "@/lib/grammar/types";

export function applyGrammarSetFilters(
  grammarSets: DbGrammarSetListItem[],
  filters?: GrammarSetFilters
) {
  const search = filters?.search?.trim().toLowerCase();
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const themeKey = filters?.themeKey?.trim();
  const topicKey = filters?.topicKey?.trim();
  const sourceKey = filters?.sourceKey?.trim();
  const usageVariant =
    filters?.usageVariant && filters.usageVariant !== "all"
      ? filters.usageVariant
      : null;
  const published = filters?.published ?? "all";

  return grammarSets.filter((grammarSet) => {
    if (search) {
      const haystack = [
        grammarSet.title,
        grammarSet.description,
        grammarSet.theme_key,
        grammarSet.topic_key,
        grammarSet.source_key,
        grammarSet.source_version,
        grammarSet.import_key,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(search)) return false;
    }

    if (tier && grammarSet.tier !== tier && grammarSet.tier !== "both") {
      return false;
    }

    if (themeKey && grammarSet.theme_key !== themeKey) {
      return false;
    }

    if (topicKey && grammarSet.topic_key !== topicKey) {
      return false;
    }

    if (sourceKey && grammarSet.source_key !== sourceKey) {
      return false;
    }

    if (usageVariant === "foundation" && !grammarSet.usage_stats.usedInFoundation) {
      return false;
    }

    if (usageVariant === "higher" && !grammarSet.usage_stats.usedInHigher) {
      return false;
    }

    if (usageVariant === "volna" && !grammarSet.usage_stats.usedInVolna) {
      return false;
    }

    if (usageVariant === "unused" && grammarSet.usage_stats.totalOccurrences > 0) {
      return false;
    }

    if (published === "published" && !grammarSet.is_published) {
      return false;
    }

    if (published === "draft" && grammarSet.is_published) {
      return false;
    }

    return true;
  });
}

export function canDashboardAccessGrammarSet(
  grammarSet: DbGrammarSet,
  dashboard: DashboardInfo | null
) {
  if (!dashboard) return false;

  if (dashboard.role === "admin" || dashboard.role === "teacher") {
    return true;
  }

  if (dashboard.role !== "student") {
    return false;
  }

  if (dashboard.variant === "foundation" && grammarSet.tier === "higher") {
    return false;
  }

  if (
    dashboard.variant === "higher" &&
    grammarSet.tier !== "foundation" &&
    grammarSet.tier !== "higher" &&
    grammarSet.tier !== "both"
  ) {
    return false;
  }

  if (dashboard.accessMode === "trial") {
    return grammarSet.is_trial_visible;
  }

  if (dashboard.accessMode === "full") {
    return true;
  }

  if (dashboard.accessMode === "volna") {
    return grammarSet.available_in_volna;
  }

  return !grammarSet.requires_paid_access;
}

export function filterGrammarSetsForDashboardAccess(
  grammarSets: DbGrammarSetListItem[],
  dashboard: DashboardInfo | null
) {
  return grammarSets.filter((grammarSet) =>
    canDashboardAccessGrammarSet(grammarSet, dashboard)
  );
}
