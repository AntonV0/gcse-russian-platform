import { applyGrammarSetFilters } from "@/lib/grammar/access";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import {
  normalizeGrammarPointCoverage,
  normalizeGrammarExample,
  normalizeGrammarPoint,
  normalizeGrammarSet,
  normalizeGrammarSetSummaryRow,
  normalizeGrammarTable,
} from "@/lib/grammar/normalizers";
import {
  GRAMMAR_EXAMPLE_SELECT,
  GRAMMAR_POINT_COVERAGE_SELECT,
  GRAMMAR_POINT_SELECT,
  GRAMMAR_SET_SELECT,
  GRAMMAR_SET_SUMMARY_SELECT,
  GRAMMAR_TABLE_SELECT,
} from "@/lib/grammar/selects";
import {
  buildGrammarUsageStats,
  filterGrammarPointsForStudyVariant,
} from "@/lib/grammar/study-variants";
import type {
  DbGrammarPointContentHealth,
  DbGrammarPointCoverage,
  DbGrammarSet,
  DbGrammarSetContentHealth,
  DbGrammarSetListItem,
  DbGrammarSetSummaryRow,
  DbGrammarStudyVariant,
  DbGrammarUsageVariant,
  GrammarSetFilters,
} from "@/lib/grammar/types";
import { createClient } from "@/lib/supabase/server";

type GrammarQueryOptions = {
  useServiceRole?: boolean;
};

async function getGrammarClient(options?: GrammarQueryOptions) {
  return options?.useServiceRole ? createServiceRoleClient() : createClient();
}

async function getGrammarSetSummaryRowsBySetIdsDb(grammarSetIds: string[]) {
  const uniqueGrammarSetIds = Array.from(new Set(grammarSetIds));

  if (uniqueGrammarSetIds.length === 0) {
    return new Map<string, DbGrammarSetSummaryRow>();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grammar_set_summaries")
    .select(GRAMMAR_SET_SUMMARY_SELECT)
    .in("grammar_set_id", uniqueGrammarSetIds);

  if (error) {
    console.error("Error fetching grammar set summaries:", {
      grammarSetIds: uniqueGrammarSetIds,
      error,
    });
    return new Map<string, DbGrammarSetSummaryRow>();
  }

  return new Map(
    (data ?? []).map((row) => {
      const summary = normalizeGrammarSetSummaryRow(row);
      return [summary.grammar_set_id, summary];
    })
  );
}

async function attachGrammarCountsAndUsage(
  grammarSets: DbGrammarSet[]
): Promise<DbGrammarSetListItem[]> {
  if (grammarSets.length === 0) {
    return [];
  }

  const summariesBySetId = await getGrammarSetSummaryRowsBySetIdsDb(
    grammarSets.map((grammarSet) => grammarSet.id)
  );

  return grammarSets.map((grammarSet) => ({
    ...grammarSet,
    point_count: summariesBySetId.get(grammarSet.id)?.point_count ?? 0,
    usage_stats: buildGrammarUsageStats([
      ...Array.from(
        { length: summariesBySetId.get(grammarSet.id)?.foundation_occurrences ?? 0 },
        () => ({ variant: "foundation" as const })
      ),
      ...Array.from(
        { length: summariesBySetId.get(grammarSet.id)?.higher_occurrences ?? 0 },
        () => ({ variant: "higher" as const })
      ),
      ...Array.from(
        { length: summariesBySetId.get(grammarSet.id)?.volna_occurrences ?? 0 },
        () => ({ variant: "volna" as const })
      ),
    ] satisfies { variant: DbGrammarUsageVariant }[]),
    coverage_summary: {
      totalPoints: summariesBySetId.get(grammarSet.id)?.point_count ?? 0,
      foundationTotalPoints:
        summariesBySetId.get(grammarSet.id)?.foundation_total_points ?? 0,
      higherTotalPoints: summariesBySetId.get(grammarSet.id)?.higher_total_points ?? 0,
      volnaTotalPoints: summariesBySetId.get(grammarSet.id)?.volna_total_points ?? 0,
      foundationUsedPoints:
        summariesBySetId.get(grammarSet.id)?.foundation_used_points ?? 0,
      higherUsedPoints: summariesBySetId.get(grammarSet.id)?.higher_used_points ?? 0,
      volnaUsedPoints: summariesBySetId.get(grammarSet.id)?.volna_used_points ?? 0,
    },
  }));
}

export async function getGrammarSetsDb(filters?: GrammarSetFilters) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("grammar_sets")
    .select(GRAMMAR_SET_SELECT)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching grammar sets:", { filters, error });
    return [] as DbGrammarSetListItem[];
  }

  const withCounts = await attachGrammarCountsAndUsage(
    (data ?? []).map(normalizeGrammarSet)
  );
  return applyGrammarSetFilters(withCounts, filters);
}

export async function getPublishedGrammarSetsDb(filters?: GrammarSetFilters) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("grammar_sets")
    .select(GRAMMAR_SET_SELECT)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching published grammar sets:", { filters, error });
    return [] as DbGrammarSetListItem[];
  }

  const withCounts = await attachGrammarCountsAndUsage(
    (data ?? []).map(normalizeGrammarSet)
  );
  return applyGrammarSetFilters(withCounts, { ...filters, published: "published" });
}

export async function getGrammarSetByIdDb(
  grammarSetId: string,
  options?: GrammarQueryOptions
) {
  const supabase = await getGrammarClient(options);

  const { data, error } = await supabase
    .from("grammar_sets")
    .select(GRAMMAR_SET_SELECT)
    .eq("id", grammarSetId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching grammar set by id:", { grammarSetId, error });
    return null;
  }

  return data ? normalizeGrammarSet(data) : null;
}

export async function getGrammarSetBySlugDb(
  grammarSetSlug: string,
  options?: GrammarQueryOptions
) {
  const supabase = await getGrammarClient(options);

  const { data, error } = await supabase
    .from("grammar_sets")
    .select(GRAMMAR_SET_SELECT)
    .eq("slug", grammarSetSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching grammar set by slug:", { grammarSetSlug, error });
    return null;
  }

  return data ? normalizeGrammarSet(data) : null;
}

export async function getGrammarPointsBySetIdDb(
  grammarSetId: string,
  options?: {
    publishedOnly?: boolean;
    scopeVariant?: DbGrammarStudyVariant | "all" | null;
    useServiceRole?: boolean;
  }
) {
  const supabase = await getGrammarClient(options);

  let query = supabase
    .from("grammar_points")
    .select(GRAMMAR_POINT_SELECT)
    .eq("grammar_set_id", grammarSetId)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (options?.publishedOnly) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching grammar points by set id:", {
      grammarSetId,
      options,
      error,
    });
    return [];
  }

  return filterGrammarPointsForStudyVariant(
    (data ?? []).map(normalizeGrammarPoint),
    options?.scopeVariant
  );
}

export async function getGrammarPointCoverageByPointIdsDb(grammarPointIds: string[]) {
  const uniqueGrammarPointIds = Array.from(new Set(grammarPointIds));

  if (uniqueGrammarPointIds.length === 0) {
    return new Map<string, DbGrammarPointCoverage>();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grammar_point_coverage")
    .select(GRAMMAR_POINT_COVERAGE_SELECT)
    .in("grammar_point_id", uniqueGrammarPointIds);

  if (error) {
    console.error("Error fetching grammar point coverage:", {
      grammarPointIds: uniqueGrammarPointIds,
      error,
    });
    return new Map<string, DbGrammarPointCoverage>();
  }

  return new Map(
    (data ?? []).map((row) => {
      const coverage = normalizeGrammarPointCoverage(row);
      return [coverage.grammar_point_id, coverage];
    })
  );
}

async function getPointIdsWithGrammarExamplesDb(grammarPointIds: string[]) {
  if (grammarPointIds.length === 0) return new Set<string>();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grammar_examples")
    .select("grammar_point_id")
    .in("grammar_point_id", grammarPointIds);

  if (error) {
    console.error("Error fetching grammar example health:", {
      grammarPointIds,
      error,
    });
    return new Set<string>();
  }

  return new Set((data ?? []).map((row) => row.grammar_point_id as string));
}

async function getPointIdsWithGrammarTablesDb(grammarPointIds: string[]) {
  if (grammarPointIds.length === 0) return new Set<string>();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grammar_tables")
    .select("grammar_point_id")
    .in("grammar_point_id", grammarPointIds);

  if (error) {
    console.error("Error fetching grammar table health:", {
      grammarPointIds,
      error,
    });
    return new Set<string>();
  }

  return new Set((data ?? []).map((row) => row.grammar_point_id as string));
}

export async function getGrammarPointContentHealthByPointIdsDb(
  grammarPointIds: string[]
) {
  const uniqueGrammarPointIds = Array.from(new Set(grammarPointIds));

  if (uniqueGrammarPointIds.length === 0) {
    return new Map<string, DbGrammarPointContentHealth>();
  }

  const supabase = await createClient();
  const [{ data, error }, pointsWithExamples, pointsWithTables] = await Promise.all([
    supabase
      .from("grammar_points")
      .select("id, full_explanation")
      .in("id", uniqueGrammarPointIds),
    getPointIdsWithGrammarExamplesDb(uniqueGrammarPointIds),
    getPointIdsWithGrammarTablesDb(uniqueGrammarPointIds),
  ]);

  if (error) {
    console.error("Error fetching grammar point content health:", {
      grammarPointIds: uniqueGrammarPointIds,
      error,
    });
    return new Map<string, DbGrammarPointContentHealth>();
  }

  return new Map(
    (data ?? []).map((point) => [
      point.id as string,
      {
        grammar_point_id: point.id as string,
        missing_explanation: !String(point.full_explanation ?? "").trim(),
        missing_examples: !pointsWithExamples.has(point.id as string),
        missing_tables: !pointsWithTables.has(point.id as string),
      },
    ])
  );
}

export async function getGrammarSetContentHealthBySetIdsDb(grammarSetIds: string[]) {
  const uniqueGrammarSetIds = Array.from(new Set(grammarSetIds));
  const defaultHealth = new Map<string, DbGrammarSetContentHealth>(
    uniqueGrammarSetIds.map((grammarSetId) => [
      grammarSetId,
      {
        grammar_set_id: grammarSetId,
        published_points: 0,
        missing_explanation_points: 0,
        missing_example_points: 0,
        missing_table_points: 0,
      },
    ])
  );

  if (uniqueGrammarSetIds.length === 0) {
    return defaultHealth;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grammar_points")
    .select("id, grammar_set_id, full_explanation")
    .in("grammar_set_id", uniqueGrammarSetIds)
    .eq("is_published", true);

  if (error) {
    console.error("Error fetching grammar set content health:", {
      grammarSetIds: uniqueGrammarSetIds,
      error,
    });
    return defaultHealth;
  }

  const publishedPoints = data ?? [];
  const grammarPointIds = publishedPoints.map((point) => point.id as string);
  const [pointsWithExamples, pointsWithTables] = await Promise.all([
    getPointIdsWithGrammarExamplesDb(grammarPointIds),
    getPointIdsWithGrammarTablesDb(grammarPointIds),
  ]);

  for (const point of publishedPoints) {
    const grammarSetId = point.grammar_set_id as string;
    const pointId = point.id as string;
    const health = defaultHealth.get(grammarSetId);

    if (!health) continue;

    health.published_points += 1;

    if (!String(point.full_explanation ?? "").trim()) {
      health.missing_explanation_points += 1;
    }

    if (!pointsWithExamples.has(pointId)) {
      health.missing_example_points += 1;
    }

    if (!pointsWithTables.has(pointId)) {
      health.missing_table_points += 1;
    }
  }

  return defaultHealth;
}

export async function getGrammarPointByIdDb(grammarPointId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("grammar_points")
    .select(GRAMMAR_POINT_SELECT)
    .eq("id", grammarPointId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching grammar point by id:", { grammarPointId, error });
    return null;
  }

  return data ? normalizeGrammarPoint(data) : null;
}

export async function getGrammarPointBySlugForSetIdDb(
  grammarSetId: string,
  grammarPointSlug: string,
  options?: GrammarQueryOptions
) {
  const supabase = await getGrammarClient(options);

  const { data, error } = await supabase
    .from("grammar_points")
    .select(GRAMMAR_POINT_SELECT)
    .eq("grammar_set_id", grammarSetId)
    .eq("slug", grammarPointSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching grammar point by slug:", {
      grammarSetId,
      grammarPointSlug,
      error,
    });
    return null;
  }

  return data ? normalizeGrammarPoint(data) : null;
}

export async function getGrammarExamplesByPointIdDb(
  grammarPointId: string,
  options?: GrammarQueryOptions
) {
  const supabase = await getGrammarClient(options);

  const { data, error } = await supabase
    .from("grammar_examples")
    .select(GRAMMAR_EXAMPLE_SELECT)
    .eq("grammar_point_id", grammarPointId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching grammar examples:", { grammarPointId, error });
    return [];
  }

  return (data ?? []).map(normalizeGrammarExample);
}

export async function getGrammarTablesByPointIdDb(
  grammarPointId: string,
  options?: GrammarQueryOptions
) {
  const supabase = await getGrammarClient(options);

  const { data, error } = await supabase
    .from("grammar_tables")
    .select(GRAMMAR_TABLE_SELECT)
    .eq("grammar_point_id", grammarPointId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching grammar tables:", { grammarPointId, error });
    return [];
  }

  return (data ?? []).map(normalizeGrammarTable);
}
