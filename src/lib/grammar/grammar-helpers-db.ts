import { createClient } from "@/lib/supabase/server";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type {
  DbGrammarSet,
  DbGrammarSetListItem,
  GrammarSetFilters,
  LoadedGrammarPointDetailDb,
  LoadedGrammarSetDetailDb,
} from "@/lib/grammar/types";
import {
  normalizeGrammarExample,
  normalizeGrammarPoint,
  normalizeGrammarSet,
  normalizeGrammarTable,
} from "@/lib/grammar/normalizers";

export type {
  DbGrammarExample,
  DbGrammarPoint,
  DbGrammarSet,
  DbGrammarSetListItem,
  DbGrammarTable,
  DbGrammarTier,
  GrammarSetFilters,
  GrammarTableCell,
  GrammarTableColumns,
  GrammarTableRows,
  LoadedGrammarPointDetailDb,
  LoadedGrammarSetDetailDb,
} from "@/lib/grammar/types";
export {
  getGrammarCategoryLabel,
  getGrammarThemeLabel,
  getGrammarTierLabel,
  getGrammarTopicLabel,
} from "@/lib/grammar/labels";

const GRAMMAR_SET_SELECT =
  "id, slug, title, description, theme_key, topic_key, tier, sort_order, is_published, is_trial_visible, requires_paid_access, available_in_volna, source_key, source_version, import_key, created_at, updated_at";
const GRAMMAR_POINT_SELECT =
  "id, grammar_set_id, slug, title, short_description, full_explanation, spec_reference, grammar_tag_key, category_key, tier, sort_order, is_published, created_at, updated_at";
const GRAMMAR_EXAMPLE_SELECT =
  "id, grammar_point_id, russian_text, english_translation, optional_highlight, note, sort_order, created_at, updated_at";
const GRAMMAR_TABLE_SELECT =
  "id, grammar_point_id, title, columns, rows, optional_note, sort_order, created_at, updated_at";

async function attachGrammarPointCounts(
  grammarSets: DbGrammarSet[]
): Promise<DbGrammarSetListItem[]> {
  if (grammarSets.length === 0) {
    return [];
  }

  const supabase = await createClient();
  const grammarSetIds = grammarSets.map((grammarSet) => grammarSet.id);

  const { data, error } = await supabase
    .from("grammar_points")
    .select("grammar_set_id")
    .in("grammar_set_id", grammarSetIds);

  if (error) {
    console.error("Error counting grammar points:", { grammarSetIds, error });
    return grammarSets.map((grammarSet) => ({
      ...grammarSet,
      point_count: 0,
    }));
  }

  const counts = new Map<string, number>();

  for (const row of data ?? []) {
    const grammarSetId = String(row.grammar_set_id);
    counts.set(grammarSetId, (counts.get(grammarSetId) ?? 0) + 1);
  }

  return grammarSets.map((grammarSet) => ({
    ...grammarSet,
    point_count: counts.get(grammarSet.id) ?? 0,
  }));
}

function applySetFilters(grammarSets: DbGrammarSetListItem[], filters?: GrammarSetFilters) {
  const search = filters?.search?.trim().toLowerCase();
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const themeKey = filters?.themeKey?.trim();
  const published = filters?.published ?? "all";

  return grammarSets.filter((grammarSet) => {
    if (search) {
      const haystack = [
        grammarSet.title,
        grammarSet.description,
        grammarSet.theme_key,
        grammarSet.topic_key,
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

  if (dashboard.variant === "higher" && grammarSet.tier === "foundation") {
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

  const withCounts = await attachGrammarPointCounts((data ?? []).map(normalizeGrammarSet));
  return applySetFilters(withCounts, filters);
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

  const withCounts = await attachGrammarPointCounts((data ?? []).map(normalizeGrammarSet));
  return applySetFilters(withCounts, { ...filters, published: "published" });
}

export async function getGrammarSetByIdDb(grammarSetId: string) {
  const supabase = await createClient();

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

export async function getGrammarSetBySlugDb(grammarSetSlug: string) {
  const supabase = await createClient();

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
  options?: { publishedOnly?: boolean }
) {
  const supabase = await createClient();

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

  return (data ?? []).map(normalizeGrammarPoint);
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
  grammarPointSlug: string
) {
  const supabase = await createClient();

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

export async function getGrammarExamplesByPointIdDb(grammarPointId: string) {
  const supabase = await createClient();

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

export async function getGrammarTablesByPointIdDb(grammarPointId: string) {
  const supabase = await createClient();

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

export async function loadGrammarSetByIdDb(
  grammarSetId: string
): Promise<LoadedGrammarSetDetailDb> {
  const grammarSet = await getGrammarSetByIdDb(grammarSetId);

  if (!grammarSet) {
    return {
      grammarSet: null,
      points: [],
    };
  }

  const points = await getGrammarPointsBySetIdDb(grammarSet.id);

  return {
    grammarSet,
    points,
  };
}

export async function loadGrammarSetBySlugDb(
  grammarSetSlug: string,
  options?: { publishedOnly?: boolean }
): Promise<LoadedGrammarSetDetailDb> {
  const grammarSet = await getGrammarSetBySlugDb(grammarSetSlug);

  if (!grammarSet) {
    return {
      grammarSet: null,
      points: [],
    };
  }

  if (options?.publishedOnly && !grammarSet.is_published) {
    return {
      grammarSet: null,
      points: [],
    };
  }

  const points = await getGrammarPointsBySetIdDb(grammarSet.id, {
    publishedOnly: options?.publishedOnly,
  });

  return {
    grammarSet,
    points,
  };
}

export async function loadGrammarPointByIdDb(
  grammarPointId: string
): Promise<LoadedGrammarPointDetailDb> {
  const grammarPoint = await getGrammarPointByIdDb(grammarPointId);

  if (!grammarPoint) {
    return {
      grammarSet: null,
      grammarPoint: null,
      examples: [],
      tables: [],
    };
  }

  const [grammarSet, examples, tables] = await Promise.all([
    getGrammarSetByIdDb(grammarPoint.grammar_set_id),
    getGrammarExamplesByPointIdDb(grammarPoint.id),
    getGrammarTablesByPointIdDb(grammarPoint.id),
  ]);

  return {
    grammarSet,
    grammarPoint,
    examples,
    tables,
  };
}

export async function loadGrammarPointBySlugsDb(
  grammarSetSlug: string,
  grammarPointSlug: string,
  options?: { publishedOnly?: boolean }
): Promise<LoadedGrammarPointDetailDb> {
  const grammarSet = await getGrammarSetBySlugDb(grammarSetSlug);

  if (!grammarSet || (options?.publishedOnly && !grammarSet.is_published)) {
    return {
      grammarSet: null,
      grammarPoint: null,
      examples: [],
      tables: [],
    };
  }

  const grammarPoint = await getGrammarPointBySlugForSetIdDb(
    grammarSet.id,
    grammarPointSlug
  );

  if (!grammarPoint || (options?.publishedOnly && !grammarPoint.is_published)) {
    return {
      grammarSet,
      grammarPoint: null,
      examples: [],
      tables: [],
    };
  }

  const [examples, tables] = await Promise.all([
    getGrammarExamplesByPointIdDb(grammarPoint.id),
    getGrammarTablesByPointIdDb(grammarPoint.id),
  ]);

  return {
    grammarSet,
    grammarPoint,
    examples,
    tables,
  };
}

