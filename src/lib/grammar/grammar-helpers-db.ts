import { createClient } from "@/lib/supabase/server";
import type { DashboardInfo } from "@/lib/dashboard/dashboard-helpers";

export type DbGrammarTier = "foundation" | "higher" | "both" | "unknown";

export type GrammarTableCell = string;
export type GrammarTableColumns = string[];
export type GrammarTableRows = string[][];

export type DbGrammarSet = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  theme_key: string | null;
  topic_key: string | null;
  tier: DbGrammarTier;
  sort_order: number;
  is_published: boolean;
  is_trial_visible: boolean;
  requires_paid_access: boolean;
  available_in_volna: boolean;
  source_key: string | null;
  source_version: string | null;
  import_key: string | null;
  created_at: string;
  updated_at: string;
};

export type DbGrammarPoint = {
  id: string;
  grammar_set_id: string;
  slug: string;
  title: string;
  short_description: string | null;
  full_explanation: string | null;
  spec_reference: string | null;
  grammar_tag_key: string | null;
  category_key: string | null;
  tier: DbGrammarTier;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type DbGrammarExample = {
  id: string;
  grammar_point_id: string;
  russian_text: string;
  english_translation: string;
  optional_highlight: string | null;
  note: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type DbGrammarTable = {
  id: string;
  grammar_point_id: string;
  title: string;
  columns: GrammarTableColumns;
  rows: GrammarTableRows;
  optional_note: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type DbGrammarSetListItem = DbGrammarSet & {
  point_count: number;
};

export type LoadedGrammarSetDetailDb = {
  grammarSet: DbGrammarSet | null;
  points: DbGrammarPoint[];
};

export type LoadedGrammarPointDetailDb = {
  grammarSet: DbGrammarSet | null;
  grammarPoint: DbGrammarPoint | null;
  examples: DbGrammarExample[];
  tables: DbGrammarTable[];
};

export type GrammarSetFilters = {
  search?: string | null;
  tier?: DbGrammarTier | "all" | null;
  themeKey?: string | null;
  published?: "all" | "published" | "draft" | null;
};

export function getGrammarTierLabel(tier: DbGrammarTier) {
  switch (tier) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "both":
      return "Both tiers";
    case "unknown":
      return "Unknown tier";
    default:
      return tier;
  }
}

export function getGrammarCategoryLabel(value: string | null) {
  if (!value) return "Uncategorised";
  return value.replaceAll("_", " ");
}

export function getGrammarThemeLabel(value: string | null) {
  if (!value) return "General";
  return value.replaceAll("_", " ");
}

export function getGrammarTopicLabel(value: string | null) {
  if (!value) return "Mixed";
  return value.replaceAll("_", " ");
}

function normalizeGrammarSet(row: unknown): DbGrammarSet {
  const record = row as Partial<DbGrammarSet>;

  return {
    id: String(record.id),
    slug: String(record.slug),
    title: String(record.title),
    description: record.description ?? null,
    theme_key: record.theme_key ?? null,
    topic_key: record.topic_key ?? null,
    tier: record.tier ?? "both",
    sort_order: Number(record.sort_order ?? 0),
    is_published: Boolean(record.is_published),
    is_trial_visible: Boolean(record.is_trial_visible),
    requires_paid_access: Boolean(record.requires_paid_access),
    available_in_volna: Boolean(record.available_in_volna),
    source_key: record.source_key ?? null,
    source_version: record.source_version ?? null,
    import_key: record.import_key ?? null,
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

function normalizeGrammarPoint(row: unknown): DbGrammarPoint {
  const record = row as Partial<DbGrammarPoint>;

  return {
    id: String(record.id),
    grammar_set_id: String(record.grammar_set_id),
    slug: String(record.slug),
    title: String(record.title),
    short_description: record.short_description ?? null,
    full_explanation: record.full_explanation ?? null,
    spec_reference: record.spec_reference ?? null,
    grammar_tag_key: record.grammar_tag_key ?? null,
    category_key: record.category_key ?? null,
    tier: record.tier ?? "both",
    sort_order: Number(record.sort_order ?? 0),
    is_published: Boolean(record.is_published),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

function normalizeGrammarExample(row: unknown): DbGrammarExample {
  const record = row as Partial<DbGrammarExample>;

  return {
    id: String(record.id),
    grammar_point_id: String(record.grammar_point_id),
    russian_text: String(record.russian_text),
    english_translation: String(record.english_translation),
    optional_highlight: record.optional_highlight ?? null,
    note: record.note ?? null,
    sort_order: Number(record.sort_order ?? 0),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => String(item));
}

function normalizeStringMatrix(value: unknown): string[][] {
  if (!Array.isArray(value)) return [];

  return value.map((row) => {
    if (!Array.isArray(row)) return [];
    return row.map((cell) => String(cell));
  });
}

function normalizeGrammarTable(row: unknown): DbGrammarTable {
  const record = row as Partial<DbGrammarTable>;

  return {
    id: String(record.id),
    grammar_point_id: String(record.grammar_point_id),
    title: String(record.title),
    columns: normalizeStringArray(record.columns),
    rows: normalizeStringMatrix(record.rows),
    optional_note: record.optional_note ?? null,
    sort_order: Number(record.sort_order ?? 0),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

async function attachGrammarPointCounts(
  grammarSets: DbGrammarSet[]
): Promise<DbGrammarSetListItem[]> {
  const supabase = await createClient();

  const enriched = await Promise.all(
    grammarSets.map(async (grammarSet) => {
      const { count, error } = await supabase
        .from("grammar_points")
        .select("id", { count: "exact", head: true })
        .eq("grammar_set_id", grammarSet.id);

      if (error) {
        console.error("Error counting grammar points:", {
          grammarSetId: grammarSet.id,
          error,
        });
      }

      return {
        ...grammarSet,
        point_count: count ?? 0,
      };
    })
  );

  return enriched;
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
