import { createClient } from "@/lib/supabase/server";

export type DbVocabularyTier = "foundation" | "higher" | "both" | "unknown";

export type DbVocabularyListMode =
  | "spec_only"
  | "extended_only"
  | "spec_and_extended"
  | "custom";

export type DbVocabularySetType =
  | "specification"
  | "core"
  | "theme"
  | "phrase_bank"
  | "exam_prep"
  | "lesson_custom";

export type DbVocabularyDisplayVariant = "single_column" | "two_column" | "compact_cards";

export type DbVocabularyItemType = "word" | "phrase";

export type DbVocabularyItemSourceType = "spec_required" | "extended" | "custom";

export type DbVocabularyItemPriority = "core" | "extension";

export type DbVocabularyPartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "number"
  | "phrase"
  | "interjection"
  | "other"
  | "unknown";

export type DbVocabularyGender =
  | "masculine"
  | "feminine"
  | "neuter"
  | "plural_only"
  | "common"
  | "not_applicable"
  | "unknown";

export type DbVocabularyProductiveReceptive =
  | "productive"
  | "receptive"
  | "both"
  | "unknown";

export type DbVocabularyAspect =
  | "perfective"
  | "imperfective"
  | "both"
  | "not_applicable"
  | "unknown";

export type DbVocabularyUsageVariant = "foundation" | "higher" | "volna";

export type DbVocabularyCoverageVariant = DbVocabularyUsageVariant;

export type DbVocabularyUsageType =
  | "lesson_block"
  | "lesson_page"
  | "revision_page"
  | "other";

export type DbVocabularySet = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  theme_key: string | null;
  topic_key: string | null;
  tier: DbVocabularyTier;
  list_mode: DbVocabularyListMode;
  set_type: DbVocabularySetType;
  default_display_variant: DbVocabularyDisplayVariant;
  is_published: boolean;
  sort_order: number;
  source_key: string | null;
  source_version: string | null;
  import_key: string | null;
  created_at: string;
  updated_at: string;
};

export type DbVocabularyList = {
  id: string;
  vocabulary_set_id: string;
  slug: string;
  title: string;
  description: string | null;
  theme_key: string | null;
  topic_key: string | null;
  category_key: string | null;
  subcategory_key: string | null;
  tier: DbVocabularyTier;
  list_mode: DbVocabularyListMode;
  default_display_variant: DbVocabularyDisplayVariant;
  is_published: boolean;
  sort_order: number;
  source_key: string | null;
  source_version: string | null;
  source_section_ref: string | null;
  import_key: string | null;
  created_at: string;
  updated_at: string;
};

export type DbVocabularyItem = {
  id: string;
  vocabulary_set_id: string;
  vocabulary_list_id?: string | null;
  canonical_key: string | null;
  russian: string;
  english: string;
  transliteration: string | null;
  example_ru: string | null;
  example_en: string | null;
  audio_path: string | null;
  notes: string | null;
  item_type: DbVocabularyItemType;
  source_type: DbVocabularyItemSourceType;
  priority: DbVocabularyItemPriority;
  part_of_speech: DbVocabularyPartOfSpeech;
  gender: DbVocabularyGender;
  plural: string | null;
  productive_receptive: DbVocabularyProductiveReceptive;
  tier: DbVocabularyTier;
  theme_key: string | null;
  topic_key: string | null;
  category_key: string | null;
  subcategory_key: string | null;
  aspect: DbVocabularyAspect;
  case_governed: string | null;
  is_reflexive: boolean;
  source_key: string | null;
  source_version: string | null;
  source_section_ref: string | null;
  import_key: string | null;
  position: number;
  created_at: string;
  updated_at: string;
};

export type DbVocabularyListItem = {
  id: string;
  vocabulary_list_id: string;
  vocabulary_item_id: string;
  position: number;
  productive_receptive_override: DbVocabularyProductiveReceptive | null;
  tier_override: DbVocabularyTier | null;
  notes_override: string | null;
  source_section_ref: string | null;
  import_key: string | null;
  created_at: string;
};

export type DbVocabularyItemCoverage = {
  vocabulary_item_id: string;
  used_in_foundation: boolean;
  used_in_higher: boolean;
  used_in_volna: boolean;
  used_in_custom_list: boolean;
  foundation_occurrences: number;
  higher_occurrences: number;
  volna_occurrences: number;
  custom_list_occurrences: number;
};

export type DbLessonVocabularySetUsage = {
  id: string;
  lesson_id: string;
  vocabulary_set_id: string;
  variant: DbVocabularyUsageVariant;
  usage_type: DbVocabularyUsageType;
  created_at: string;
};

export type LoadedVocabularySetDb = {
  vocabularySet: DbVocabularySet | null;
  vocabularyList: DbVocabularyList | null;
  lists: DbVocabularyList[];
  items: DbVocabularyItem[];
};

export type DbVocabularySetUsageStats = {
  totalOccurrences: number;
  foundationOccurrences: number;
  higherOccurrences: number;
  volnaOccurrences: number;
  usedInFoundation: boolean;
  usedInHigher: boolean;
  usedInVolna: boolean;
};

export type DbVocabularySetCoverageSummary = {
  totalItems: number;
  foundationUsedItems: number;
  higherUsedItems: number;
  volnaUsedItems: number;
  customListUsedItems: number;
};

export type DbVocabularySetListItem = DbVocabularySet & {
  item_count: number;
  list_count: number;
  usage_stats: DbVocabularySetUsageStats;
  coverage_summary: DbVocabularySetCoverageSummary;
};

export type LoadedVocabularySetDetailDb = {
  vocabularySet: DbVocabularySet | null;
  vocabularyList: DbVocabularyList | null;
  lists: DbVocabularyList[];
  items: DbVocabularyItem[];
  usageStats: DbVocabularySetUsageStats;
};

export type VocabularySetFilters = {
  search?: string | null;
  tier?: DbVocabularyTier | "all" | null;
  themeKey?: string | null;
  listMode?: DbVocabularyListMode | "all" | null;
  published?: "all" | "published" | "draft" | null;
};

export function groupVocabularyItemsBySource(items: DbVocabularyItem[]) {
  return {
    specRequired: items.filter((item) => item.source_type === "spec_required"),
    extended: items.filter((item) => item.source_type === "extended"),
    custom: items.filter((item) => item.source_type === "custom"),
  };
}

export function getVocabularyListModeLabel(listMode: DbVocabularyListMode) {
  switch (listMode) {
    case "spec_only":
      return "Spec only";
    case "extended_only":
      return "Extended only";
    case "spec_and_extended":
      return "Spec + extended";
    case "custom":
      return "Custom";
    default:
      return listMode;
  }
}

export function getVocabularyTierLabel(tier: DbVocabularyTier) {
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

export function getVocabularyProductiveReceptiveLabel(
  value: DbVocabularyProductiveReceptive
) {
  switch (value) {
    case "productive":
      return "Productive";
    case "receptive":
      return "Receptive";
    case "both":
      return "Productive + receptive";
    case "unknown":
      return "Unknown";
    default:
      return value;
  }
}

export function getVocabularySetTypeLabel(setType: DbVocabularySetType) {
  switch (setType) {
    case "specification":
      return "Specification";
    case "core":
      return "Core";
    case "theme":
      return "Theme";
    case "phrase_bank":
      return "Phrase bank";
    case "exam_prep":
      return "Exam prep";
    case "lesson_custom":
      return "Lesson custom";
    default:
      return setType;
  }
}

export function getVocabularyDisplayVariantLabel(
  displayVariant: DbVocabularyDisplayVariant
) {
  switch (displayVariant) {
    case "single_column":
      return "Single column";
    case "two_column":
      return "Two column";
    case "compact_cards":
      return "Compact cards";
    default:
      return displayVariant;
  }
}

export function getVocabularyThemeLabel(value: string | null) {
  if (!value) return "General";
  return value.replaceAll("_", " ");
}

export function getVocabularyTopicLabel(value: string | null) {
  if (!value) return "Mixed";
  return value.replaceAll("_", " ");
}

export function getRequiredVocabularyCoverageVariants(tier: DbVocabularyTier) {
  if (tier === "foundation") {
    return ["foundation"] as const;
  }

  if (tier === "higher") {
    return ["higher", "volna"] as const;
  }

  return ["foundation", "higher", "volna"] as const;
}

export function getVocabularyCoverageVariantLabel(
  variant: DbVocabularyCoverageVariant
) {
  switch (variant) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "volna":
      return "Volna";
    default:
      return variant;
  }
}

export function getVocabularyCoverageVariantCount(
  coverage: DbVocabularyItemCoverage | null,
  variant: DbVocabularyCoverageVariant
) {
  if (!coverage) return 0;

  switch (variant) {
    case "foundation":
      return coverage.foundation_occurrences;
    case "higher":
      return coverage.higher_occurrences;
    case "volna":
      return coverage.volna_occurrences;
    default:
      return 0;
  }
}

export function getVocabularyCoverageVariantUsed(
  coverage: DbVocabularyItemCoverage | null,
  variant: DbVocabularyCoverageVariant
) {
  return getVocabularyCoverageVariantCount(coverage, variant) > 0;
}

export function buildVocabularyUsageStats(
  usages: Pick<DbLessonVocabularySetUsage, "variant">[]
): DbVocabularySetUsageStats {
  let foundationOccurrences = 0;
  let higherOccurrences = 0;
  let volnaOccurrences = 0;

  for (const usage of usages) {
    switch (usage.variant) {
      case "foundation":
        foundationOccurrences += 1;
        break;
      case "higher":
        higherOccurrences += 1;
        break;
      case "volna":
        volnaOccurrences += 1;
        break;
      default:
        break;
    }
  }

  const totalOccurrences = foundationOccurrences + higherOccurrences + volnaOccurrences;

  return {
    totalOccurrences,
    foundationOccurrences,
    higherOccurrences,
    volnaOccurrences,
    usedInFoundation: foundationOccurrences > 0,
    usedInHigher: higherOccurrences > 0,
    usedInVolna: volnaOccurrences > 0,
  };
}

function normalizeVocabularySet(row: unknown): DbVocabularySet {
  const record = row as Partial<DbVocabularySet>;

  return {
    id: String(record.id),
    slug: record.slug ?? null,
    title: String(record.title),
    description: record.description ?? null,
    theme_key: record.theme_key ?? null,
    topic_key: record.topic_key ?? null,
    tier: record.tier ?? "both",
    list_mode: record.list_mode ?? "custom",
    set_type: record.set_type ?? "lesson_custom",
    default_display_variant: record.default_display_variant ?? "single_column",
    is_published: Boolean(record.is_published),
    sort_order: Number(record.sort_order ?? 0),
    source_key: record.source_key ?? null,
    source_version: record.source_version ?? null,
    import_key: record.import_key ?? null,
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

function normalizeVocabularyItem(row: unknown): DbVocabularyItem {
  const record = row as Partial<DbVocabularyItem>;

  return {
    id: String(record.id),
    vocabulary_set_id: String(record.vocabulary_set_id),
    vocabulary_list_id: record.vocabulary_list_id ?? null,
    canonical_key: record.canonical_key ?? null,
    russian: String(record.russian),
    english: String(record.english),
    transliteration: record.transliteration ?? null,
    example_ru: record.example_ru ?? null,
    example_en: record.example_en ?? null,
    audio_path: record.audio_path ?? null,
    notes: record.notes ?? null,
    item_type: record.item_type ?? "word",
    source_type: record.source_type ?? "custom",
    priority: record.priority ?? "core",
    part_of_speech: record.part_of_speech ?? "unknown",
    gender: record.gender ?? "unknown",
    plural: record.plural ?? null,
    productive_receptive: record.productive_receptive ?? "unknown",
    tier: record.tier ?? "unknown",
    theme_key: record.theme_key ?? null,
    topic_key: record.topic_key ?? null,
    category_key: record.category_key ?? null,
    subcategory_key: record.subcategory_key ?? null,
    aspect: record.aspect ?? "unknown",
    case_governed: record.case_governed ?? null,
    is_reflexive: Boolean(record.is_reflexive),
    source_key: record.source_key ?? null,
    source_version: record.source_version ?? null,
    source_section_ref: record.source_section_ref ?? null,
    import_key: record.import_key ?? null,
    position: Number(record.position ?? 0),
    created_at: String(record.created_at),
    updated_at: String(record.updated_at),
  };
}

function normalizeVocabularyItemCoverage(row: unknown): DbVocabularyItemCoverage {
  const record = row as Partial<DbVocabularyItemCoverage>;

  return {
    vocabulary_item_id: String(record.vocabulary_item_id),
    used_in_foundation: Boolean(record.used_in_foundation),
    used_in_higher: Boolean(record.used_in_higher),
    used_in_volna: Boolean(record.used_in_volna),
    used_in_custom_list: Boolean(record.used_in_custom_list),
    foundation_occurrences: Number(record.foundation_occurrences ?? 0),
    higher_occurrences: Number(record.higher_occurrences ?? 0),
    volna_occurrences: Number(record.volna_occurrences ?? 0),
    custom_list_occurrences: Number(record.custom_list_occurrences ?? 0),
  };
}

function slugifyVocabularyTitle(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "default-list";
}

export async function getVocabularySetByIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_sets")
    .select("*")
    .eq("id", vocabularySetId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching vocabulary set by id:", {
      vocabularySetId,
      error,
    });
    return null;
  }

  return data ? normalizeVocabularySet(data) : null;
}

export async function getVocabularySetBySlugDb(vocabularySetSlug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_sets")
    .select("*")
    .eq("slug", vocabularySetSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching vocabulary set by slug:", {
      vocabularySetSlug,
      error,
    });
    return null;
  }

  return data ? normalizeVocabularySet(data) : null;
}

export async function getVocabularySetByRefDb(vocabularySetRef: string) {
  const bySlug = await getVocabularySetBySlugDb(vocabularySetRef);

  if (bySlug) {
    return bySlug;
  }

  return getVocabularySetByIdDb(vocabularySetRef);
}

export async function getVocabularyListsBySetIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_lists")
    .select("*")
    .eq("vocabulary_set_id", vocabularySetId)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching vocabulary lists by set id:", {
      vocabularySetId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbVocabularyList[];
}

export async function getVocabularyListByIdDb(vocabularyListId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_lists")
    .select("*")
    .eq("id", vocabularyListId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching vocabulary list by id:", {
      vocabularyListId,
      error,
    });
    return null;
  }

  return (data as DbVocabularyList | null) ?? null;
}

export async function getDefaultVocabularyListBySetIdDb(vocabularySetId: string) {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);
  return lists[0] ?? null;
}

export async function ensureDefaultVocabularyListForSetDb(vocabularySet: DbVocabularySet) {
  const existing = await getDefaultVocabularyListBySetIdDb(vocabularySet.id);

  if (existing) {
    return existing;
  }

  const supabase = await createClient();
  const slug = vocabularySet.slug?.trim() || slugifyVocabularyTitle(vocabularySet.title);

  const { data, error } = await supabase
    .from("vocabulary_lists")
    .insert({
      vocabulary_set_id: vocabularySet.id,
      slug,
      title: vocabularySet.title,
      description: vocabularySet.description,
      theme_key: vocabularySet.theme_key,
      topic_key: vocabularySet.topic_key,
      tier: vocabularySet.tier,
      list_mode: vocabularySet.list_mode,
      default_display_variant: vocabularySet.default_display_variant,
      is_published: vocabularySet.is_published,
      sort_order: 0,
      source_key: vocabularySet.source_key,
      source_version: vocabularySet.source_version,
      import_key: vocabularySet.import_key
        ? `${vocabularySet.import_key}:default-list`
        : null,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error creating default vocabulary list:", {
      vocabularySetId: vocabularySet.id,
      error,
    });
    throw new Error("Failed to create default vocabulary list");
  }

  return data as DbVocabularyList;
}

export async function getVocabularyItemsByListIdDb(vocabularyListId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_list_items")
    .select("position, vocabulary_items(*)")
    .eq("vocabulary_list_id", vocabularyListId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching vocabulary items by list id:", {
      vocabularyListId,
      error,
    });
    return [];
  }

  return (data ?? [])
    .map((row) => {
      const record = row as {
        position?: number;
        vocabulary_items?: Record<string, unknown> | Record<string, unknown>[] | null;
      };
      const joinedItem = Array.isArray(record.vocabulary_items)
        ? record.vocabulary_items[0]
        : record.vocabulary_items;

      if (!joinedItem) return null;

      return normalizeVocabularyItem({
        ...joinedItem,
        vocabulary_list_id: vocabularyListId,
        position: record.position ?? 0,
      });
    })
    .filter((item): item is DbVocabularyItem => Boolean(item));
}

export async function getVocabularyItemsBySetIdDb(vocabularySetId: string) {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);

  if (lists.length > 0) {
    const groupedItems = await Promise.all(
      lists.map((list) => getVocabularyItemsByListIdDb(list.id))
    );

    return groupedItems.flat();
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_items")
    .select("*")
    .eq("vocabulary_set_id", vocabularySetId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching legacy vocabulary items by set id:", {
      vocabularySetId,
      error,
    });
    return [];
  }

  return (data ?? []).map(normalizeVocabularyItem);
}

export async function getVocabularyItemCoverageByItemIdsDb(vocabularyItemIds: string[]) {
  if (vocabularyItemIds.length === 0) {
    return new Map<string, DbVocabularyItemCoverage>();
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_item_coverage")
    .select("*")
    .in("vocabulary_item_id", vocabularyItemIds);

  if (error) {
    console.error("Error fetching vocabulary item coverage:", {
      vocabularyItemIds,
      error,
    });
    return new Map<string, DbVocabularyItemCoverage>();
  }

  return new Map(
    (data ?? []).map((row) => {
      const coverage = normalizeVocabularyItemCoverage(row);
      return [coverage.vocabulary_item_id, coverage];
    })
  );
}

export async function getVocabularySetCoverageSummaryBySetIdDb(vocabularySetId: string) {
  const items = await getVocabularyItemsBySetIdDb(vocabularySetId);
  const uniqueItems = Array.from(
    new Map(items.map((item) => [item.id, item])).values()
  );
  const itemCoverageById = await getVocabularyItemCoverageByItemIdsDb(
    uniqueItems.map((item) => item.id)
  );

  return uniqueItems.reduce<DbVocabularySetCoverageSummary>(
    (summary, item) => {
      const coverage = itemCoverageById.get(item.id);

      return {
        totalItems: summary.totalItems + 1,
        foundationUsedItems:
          summary.foundationUsedItems + (coverage?.used_in_foundation ? 1 : 0),
        higherUsedItems: summary.higherUsedItems + (coverage?.used_in_higher ? 1 : 0),
        volnaUsedItems: summary.volnaUsedItems + (coverage?.used_in_volna ? 1 : 0),
        customListUsedItems:
          summary.customListUsedItems + (coverage?.used_in_custom_list ? 1 : 0),
      };
    },
    {
      totalItems: 0,
      foundationUsedItems: 0,
      higherUsedItems: 0,
      volnaUsedItems: 0,
      customListUsedItems: 0,
    }
  );
}

export async function getVocabularyItemCountBySetIdDb(vocabularySetId: string) {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);

  if (lists.length > 0) {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("vocabulary_list_items")
      .select("id", { count: "exact", head: true })
      .in(
        "vocabulary_list_id",
        lists.map((list) => list.id)
      );

    if (error) {
      console.error("Error counting vocabulary list items by set id:", {
        vocabularySetId,
        error,
      });
      return 0;
    }

    return count ?? 0;
  }

  const supabase = await createClient();

  const { count, error } = await supabase
    .from("vocabulary_items")
    .select("id", { count: "exact", head: true })
    .eq("vocabulary_set_id", vocabularySetId);

  if (error) {
    console.error("Error counting legacy vocabulary items by set id:", {
      vocabularySetId,
      error,
    });
    return 0;
  }

  return count ?? 0;
}

export async function getVocabularyListCountBySetIdDb(vocabularySetId: string) {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);
  return lists.length;
}

export async function getVocabularySetUsagesBySetIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_vocabulary_set_usages")
    .select("*")
    .eq("vocabulary_set_id", vocabularySetId);

  if (error) {
    console.error("Error fetching vocabulary set usages by set id:", {
      vocabularySetId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbLessonVocabularySetUsage[];
}

export async function getVocabularySetUsageStatsBySetIdDb(
  vocabularySetId: string
): Promise<DbVocabularySetUsageStats> {
  const usages = await getVocabularySetUsagesBySetIdDb(vocabularySetId);
  return buildVocabularyUsageStats(usages);
}

export async function loadVocabularySetByIdDb(
  vocabularySetId: string
): Promise<LoadedVocabularySetDetailDb> {
  const vocabularySet = await getVocabularySetByIdDb(vocabularySetId);

  if (!vocabularySet) {
    return {
      vocabularySet: null,
      vocabularyList: null,
      lists: [],
      items: [],
      usageStats: {
        totalOccurrences: 0,
        foundationOccurrences: 0,
        higherOccurrences: 0,
        volnaOccurrences: 0,
        usedInFoundation: false,
        usedInHigher: false,
        usedInVolna: false,
      },
    };
  }

  const lists = await getVocabularyListsBySetIdDb(vocabularySet.id);
  const vocabularyList = lists[0] ?? null;
  const [items, usageStats] = await Promise.all([
    getVocabularyItemsBySetIdDb(vocabularySet.id),
    getVocabularySetUsageStatsBySetIdDb(vocabularySet.id),
  ]);

  return {
    vocabularySet,
    vocabularyList,
    lists,
    items,
    usageStats,
  };
}

export async function loadVocabularySetBySlugDb(
  vocabularySetSlug: string
): Promise<LoadedVocabularySetDb> {
  const vocabularySet = await getVocabularySetBySlugDb(vocabularySetSlug);

  if (!vocabularySet) {
    return {
      vocabularySet: null,
      vocabularyList: null,
      lists: [],
      items: [],
    };
  }

  const lists = await getVocabularyListsBySetIdDb(vocabularySet.id);
  const items = await getVocabularyItemsBySetIdDb(vocabularySet.id);

  return {
    vocabularySet,
    vocabularyList: lists[0] ?? null,
    lists,
    items,
  };
}

export async function loadVocabularySetByRefDb(
  vocabularySetRef: string
): Promise<LoadedVocabularySetDb> {
  const vocabularySet = await getVocabularySetByRefDb(vocabularySetRef);

  if (!vocabularySet) {
    return {
      vocabularySet: null,
      vocabularyList: null,
      lists: [],
      items: [],
    };
  }

  const lists = await getVocabularyListsBySetIdDb(vocabularySet.id);
  const items = await getVocabularyItemsBySetIdDb(vocabularySet.id);

  return {
    vocabularySet,
    vocabularyList: lists[0] ?? null,
    lists,
    items,
  };
}

async function attachVocabularyCountsAndUsage(
  vocabularySets: DbVocabularySet[]
): Promise<DbVocabularySetListItem[]> {
  const enriched = await Promise.all(
    vocabularySets.map(async (vocabularySet) => {
      const [itemCount, listCount, usageStats, coverageSummary] = await Promise.all([
        getVocabularyItemCountBySetIdDb(vocabularySet.id),
        getVocabularyListCountBySetIdDb(vocabularySet.id),
        getVocabularySetUsageStatsBySetIdDb(vocabularySet.id),
        getVocabularySetCoverageSummaryBySetIdDb(vocabularySet.id),
      ]);

      return {
        ...vocabularySet,
        item_count: itemCount,
        list_count: listCount,
        usage_stats: usageStats,
        coverage_summary: coverageSummary,
      };
    })
  );

  return enriched;
}

function applyVocabularySetFilters(
  vocabularySets: DbVocabularySetListItem[],
  filters?: VocabularySetFilters
) {
  const search = filters?.search?.trim().toLowerCase();
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const themeKey = filters?.themeKey?.trim();
  const listMode = filters?.listMode && filters.listMode !== "all" ? filters.listMode : null;
  const published = filters?.published ?? "all";

  return vocabularySets.filter((vocabularySet) => {
    if (search) {
      const haystack = [
        vocabularySet.title,
        vocabularySet.description,
        vocabularySet.slug,
        vocabularySet.theme_key,
        vocabularySet.topic_key,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(search)) return false;
    }

    if (tier && vocabularySet.tier !== tier && vocabularySet.tier !== "both") {
      return false;
    }

    if (themeKey && vocabularySet.theme_key !== themeKey) {
      return false;
    }

    if (listMode && vocabularySet.list_mode !== listMode) {
      return false;
    }

    if (published === "published" && !vocabularySet.is_published) {
      return false;
    }

    if (published === "draft" && vocabularySet.is_published) {
      return false;
    }

    return true;
  });
}

export async function getVocabularySetsDb(options?: {
  publishedOnly?: boolean;
  filters?: VocabularySetFilters;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("vocabulary_sets")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (options?.publishedOnly) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching vocabulary sets:", {
      options,
      error,
    });
    return [] as DbVocabularySetListItem[];
  }

  const withCounts = await attachVocabularyCountsAndUsage(
    (data ?? []).map(normalizeVocabularySet)
  );

  return applyVocabularySetFilters(withCounts, options?.filters);
}

export async function getPublishedVocabularySetsDb(filters?: VocabularySetFilters) {
  return getVocabularySetsDb({ publishedOnly: true, filters });
}
