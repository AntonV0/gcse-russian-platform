import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type { DbMockExamSet, MockExamFilters } from "@/lib/mock-exams/types";

export function applyMockExamFilters(exams: DbMockExamSet[], filters?: MockExamFilters) {
  const paperNumber =
    filters?.paperNumber && filters.paperNumber !== "all"
      ? Number(filters.paperNumber)
      : null;
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const published = filters?.published ?? "all";

  return exams.filter((exam) => {
    if (paperNumber && exam.paper_number !== paperNumber) return false;
    if (tier && exam.tier !== tier && exam.tier !== "both") return false;
    if (published === "published" && !exam.is_published) return false;
    if (published === "draft" && exam.is_published) return false;

    return true;
  });
}

export function canDashboardAccessMockExam(
  exam: DbMockExamSet,
  dashboard: DashboardInfo | null
) {
  if (!dashboard) return false;

  if (dashboard.role === "admin" || dashboard.role === "teacher") {
    return true;
  }

  if (dashboard.role !== "student") {
    return false;
  }

  if (dashboard.variant === "foundation" && exam.tier === "higher") {
    return false;
  }

  if (dashboard.variant === "higher" && exam.tier === "foundation") {
    return false;
  }

  if (dashboard.accessMode === "trial") {
    return exam.is_trial_visible;
  }

  if (dashboard.accessMode === "full") {
    return true;
  }

  if (dashboard.accessMode === "volna") {
    return exam.available_in_volna;
  }

  return !exam.requires_paid_access;
}

export function filterMockExamsForDashboardAccess(
  exams: DbMockExamSet[],
  dashboard: DashboardInfo | null
) {
  return exams.filter((exam) => canDashboardAccessMockExam(exam, dashboard));
}
