import { applyGrammarSetFilters } from "@/lib/grammar/access";
import {
  normalizeGrammarExample,
  normalizeGrammarPoint,
  normalizeGrammarSet,
  normalizeGrammarTable,
} from "@/lib/grammar/normalizers";
import {
  GRAMMAR_EXAMPLE_SELECT,
  GRAMMAR_POINT_SELECT,
  GRAMMAR_SET_SELECT,
  GRAMMAR_TABLE_SELECT,
} from "@/lib/grammar/selects";
import type {
  DbGrammarSet,
  DbGrammarSetListItem,
  GrammarSetFilters,
} from "@/lib/grammar/types";
import { createClient } from "@/lib/supabase/server";

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

  const withCounts = await attachGrammarPointCounts(
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

  const withCounts = await attachGrammarPointCounts(
    (data ?? []).map(normalizeGrammarSet)
  );
  return applyGrammarSetFilters(withCounts, { ...filters, published: "published" });
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
