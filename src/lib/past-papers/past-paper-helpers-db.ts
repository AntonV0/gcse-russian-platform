import { createClient } from "@/lib/supabase/server";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";

export type PastPaperTier = "foundation" | "higher" | "both";

export type PastPaperResourceType =
  | "question_paper"
  | "mark_scheme"
  | "transcript"
  | "audio"
  | "examiner_report"
  | "sample_assessment_material"
  | "other";

export type PastPaperPaperName =
  | "Paper 1 Listening"
  | "Paper 2 Speaking"
  | "Paper 3 Reading"
  | "Paper 4 Writing";

export type DbPastPaperResource = {
  id: string;
  title: string;
  exam_series: string;
  paper_number: number;
  paper_name: PastPaperPaperName;
  tier: PastPaperTier;
  resource_type: PastPaperResourceType;
  official_url: string;
  source_label: string;
  is_official: boolean;
  sort_order: number;
  is_published: boolean;
  is_trial_visible: boolean;
  requires_paid_access: boolean;
  available_in_volna: boolean;
  created_at: string;
  updated_at: string;
};

export type PastPaperResourceFilters = {
  examSeries?: string | null;
  paperNumber?: number | "all" | null;
  tier?: PastPaperTier | "all" | null;
  resourceType?: PastPaperResourceType | "all" | null;
  published?: "all" | "published" | "draft" | null;
};

const PAST_PAPER_RESOURCE_SELECT =
  "id, title, exam_series, paper_number, paper_name, tier, resource_type, official_url, source_label, is_official, sort_order, is_published, is_trial_visible, requires_paid_access, available_in_volna, created_at, updated_at";

export const pastPaperPaperNames: PastPaperPaperName[] = [
  "Paper 1 Listening",
  "Paper 2 Speaking",
  "Paper 3 Reading",
  "Paper 4 Writing",
];

export const pastPaperResourceTypes: PastPaperResourceType[] = [
  "question_paper",
  "mark_scheme",
  "transcript",
  "audio",
  "examiner_report",
  "sample_assessment_material",
  "other",
];

export const pastPaperTiers: PastPaperTier[] = ["foundation", "higher", "both"];

export function getPastPaperTierLabel(tier: PastPaperTier) {
  switch (tier) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "both":
      return "Both tiers";
    default:
      return tier;
  }
}

export function getPastPaperResourceTypeLabel(resourceType: PastPaperResourceType) {
  switch (resourceType) {
    case "question_paper":
      return "Question paper";
    case "mark_scheme":
      return "Mark scheme";
    case "transcript":
      return "Transcript";
    case "audio":
      return "Audio";
    case "examiner_report":
      return "Examiner report";
    case "sample_assessment_material":
      return "Sample assessment material";
    case "other":
      return "Other";
    default:
      return resourceType;
  }
}

function normalizePastPaperResource(row: unknown): DbPastPaperResource {
  const record = row as Partial<DbPastPaperResource>;

  return {
    id: String(record.id),
    title: String(record.title),
    exam_series: String(record.exam_series),
    paper_number: Number(record.paper_number ?? 0),
    paper_name: (record.paper_name ?? "Paper 1 Listening") as PastPaperPaperName,
    tier: (record.tier ?? "both") as PastPaperTier,
    resource_type: (record.resource_type ?? "other") as PastPaperResourceType,
    official_url: String(record.official_url),
    source_label: record.source_label ?? "Pearson",
    is_official: Boolean(record.is_official),
    sort_order: Number(record.sort_order ?? 0),
    is_published: Boolean(record.is_published),
    is_trial_visible: Boolean(record.is_trial_visible),
    requires_paid_access: Boolean(record.requires_paid_access),
    available_in_volna: Boolean(record.available_in_volna),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

function applyPastPaperFilters(
  resources: DbPastPaperResource[],
  filters?: PastPaperResourceFilters
) {
  const examSeries = filters?.examSeries?.trim();
  const paperNumber =
    filters?.paperNumber && filters.paperNumber !== "all"
      ? Number(filters.paperNumber)
      : null;
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const resourceType =
    filters?.resourceType && filters.resourceType !== "all" ? filters.resourceType : null;
  const published = filters?.published ?? "all";

  return resources.filter((resource) => {
    if (examSeries && resource.exam_series !== examSeries) return false;
    if (paperNumber && resource.paper_number !== paperNumber) return false;
    if (tier && resource.tier !== tier && resource.tier !== "both") return false;
    if (resourceType && resource.resource_type !== resourceType) return false;
    if (published === "published" && !resource.is_published) return false;
    if (published === "draft" && resource.is_published) return false;

    return true;
  });
}

export function canDashboardAccessPastPaperResource(
  resource: DbPastPaperResource,
  dashboard: DashboardInfo | null
) {
  if (!dashboard) return false;

  if (dashboard.role === "admin" || dashboard.role === "teacher") {
    return true;
  }

  if (dashboard.role === "guest") {
    return true;
  }

  if (dashboard.role === "student") {
    return true;
  }

  return false;
}

export function filterPastPaperResourcesForDashboardAccess(
  resources: DbPastPaperResource[],
  dashboard: DashboardInfo | null
) {
  return resources.filter((resource) =>
    canDashboardAccessPastPaperResource(resource, dashboard)
  );
}

export function groupPastPaperResourcesBySeries(resources: DbPastPaperResource[]) {
  const groups = new Map<string, DbPastPaperResource[]>();

  resources.forEach((resource) => {
    const existing = groups.get(resource.exam_series) ?? [];
    existing.push(resource);
    groups.set(resource.exam_series, existing);
  });

  return Array.from(groups.entries()).map(([examSeries, groupResources]) => ({
    examSeries,
    resources: groupResources,
  }));
}

export function getPastPaperExamSeriesOptions(resources: DbPastPaperResource[]) {
  return Array.from(new Set(resources.map((resource) => resource.exam_series))).sort(
    (a, b) => b.localeCompare(a)
  );
}

export async function getPastPaperResourcesDb(filters?: PastPaperResourceFilters) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("past_paper_resources")
    .select(PAST_PAPER_RESOURCE_SELECT)
    .order("exam_series", { ascending: false })
    .order("paper_number", { ascending: true })
    .order("tier", { ascending: true })
    .order("resource_type", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching past paper resources:", { filters, error });
    return [];
  }

  return applyPastPaperFilters((data ?? []).map(normalizePastPaperResource), filters);
}

export async function getPublishedPastPaperResourcesDb(
  filters?: PastPaperResourceFilters
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("past_paper_resources")
    .select(PAST_PAPER_RESOURCE_SELECT)
    .eq("is_published", true)
    .order("exam_series", { ascending: false })
    .order("paper_number", { ascending: true })
    .order("tier", { ascending: true })
    .order("resource_type", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching published past paper resources:", {
      filters,
      error,
    });
    return [];
  }

  return applyPastPaperFilters((data ?? []).map(normalizePastPaperResource), {
    ...filters,
    published: "published",
  });
}
