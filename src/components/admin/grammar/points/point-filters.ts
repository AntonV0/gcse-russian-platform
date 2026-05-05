import type {
  DbGrammarKnowledgeRequirement,
  DbGrammarPoint,
  DbGrammarPointCoverage,
  DbGrammarTier,
} from "@/lib/grammar/grammar-helpers-db";
import type {
  GrammarPointAdminFilters,
  GrammarPointCoverageFilter,
} from "@/components/admin/grammar/points/types";

export const TIER_FILTER_OPTIONS: DbGrammarTier[] = [
  "foundation",
  "higher",
  "both",
  "unknown",
];

export const KNOWLEDGE_FILTER_OPTIONS: DbGrammarKnowledgeRequirement[] = [
  "productive",
  "receptive",
  "mixed",
  "unknown",
];

export function getUniqueSortedValues(values: (string | null | undefined)[]) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b));
}

export function getOrderedUniqueValues<T extends string>(
  values: T[],
  order: readonly T[]
) {
  const uniqueValues = new Set(values);
  return order.filter((value) => uniqueValues.has(value));
}

export function normalizeTierFilter(value?: string): DbGrammarTier | "all" {
  return value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
    ? value
    : "all";
}

export function normalizeKnowledgeRequirementFilter(
  value?: string
): DbGrammarKnowledgeRequirement | "all" {
  return value === "productive" ||
    value === "receptive" ||
    value === "mixed" ||
    value === "unknown"
    ? value
    : "all";
}

export function normalizeCoverageFilter(value?: string): GrammarPointCoverageFilter {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "volna" ||
    value === "unused"
  ) {
    return value;
  }

  return "all";
}

export function hasActiveGrammarPointFilters(filters: GrammarPointAdminFilters) {
  return (
    Boolean(filters.pointSearch?.trim()) ||
    normalizeTierFilter(filters.tier) !== "all" ||
    normalizeKnowledgeRequirementFilter(filters.knowledgeRequirement) !== "all" ||
    Boolean(filters.categoryKey?.trim()) ||
    normalizeCoverageFilter(filters.coverage) !== "all"
  );
}

export function filterGrammarPoints({
  points,
  pointCoverageById,
  filters,
}: {
  points: DbGrammarPoint[];
  pointCoverageById: Map<string, DbGrammarPointCoverage>;
  filters: GrammarPointAdminFilters;
}) {
  const search = filters.pointSearch?.trim().toLowerCase();
  const tier = normalizeTierFilter(filters.tier);
  const knowledgeRequirement = normalizeKnowledgeRequirementFilter(
    filters.knowledgeRequirement
  );
  const categoryKey = filters.categoryKey?.trim();
  const coverage = normalizeCoverageFilter(filters.coverage);

  return points.filter((point) => {
    if (search) {
      const haystack = [
        point.title,
        point.slug,
        point.short_description,
        point.full_explanation,
        point.spec_reference,
        point.grammar_tag_key,
        point.category_key,
        point.source_key,
        point.source_version,
        point.import_key,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(search)) return false;
    }

    if (tier !== "all" && point.tier !== tier) {
      return false;
    }

    if (
      knowledgeRequirement !== "all" &&
      point.knowledge_requirement !== knowledgeRequirement
    ) {
      return false;
    }

    if (categoryKey && point.category_key !== categoryKey) {
      return false;
    }

    const pointCoverage = pointCoverageById.get(point.id);

    if (coverage === "foundation" && !pointCoverage?.used_in_foundation) {
      return false;
    }

    if (coverage === "higher" && !pointCoverage?.used_in_higher) {
      return false;
    }

    if (coverage === "volna" && !pointCoverage?.used_in_volna) {
      return false;
    }

    if (
      coverage === "unused" &&
      (pointCoverage?.used_in_foundation ||
        pointCoverage?.used_in_higher ||
        pointCoverage?.used_in_volna)
    ) {
      return false;
    }

    return true;
  });
}
