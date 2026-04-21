import { createClient } from "@/lib/supabase/server";

export type DbVocabularyTier = "foundation" | "higher" | "both";

export type DbVocabularyListMode =
  | "spec_only"
  | "extended_only"
  | "spec_and_extended"
  | "custom";

export type DbVocabularySetType =
  | "core"
  | "theme"
  | "phrase_bank"
  | "exam_prep"
  | "lesson_custom";

export type DbVocabularyDisplayVariant = "single_column" | "two_column" | "compact_cards";

export type DbVocabularyItemType = "word" | "phrase";

export type DbVocabularyItemSourceType = "spec_required" | "extended" | "custom";

export type DbVocabularyItemPriority = "core" | "extension";

export type DbVocabularyUsageVariant = "foundation" | "higher" | "volna";

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
  created_at: string;
  updated_at: string;
};

export type DbVocabularyItem = {
  id: string;
  vocabulary_set_id: string;
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
  position: number;
  created_at: string;
  updated_at: string;
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

export type DbVocabularySetListItem = DbVocabularySet & {
  item_count: number;
  usage_stats: DbVocabularySetUsageStats;
};

export type LoadedVocabularySetDetailDb = {
  vocabularySet: DbVocabularySet | null;
  items: DbVocabularyItem[];
  usageStats: DbVocabularySetUsageStats;
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
    default:
      return tier;
  }
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

  return (data as DbVocabularySet | null) ?? null;
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

  return (data as DbVocabularySet | null) ?? null;
}

export async function getVocabularyItemsBySetIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_items")
    .select("*")
    .eq("vocabulary_set_id", vocabularySetId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching vocabulary items by set id:", {
      vocabularySetId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbVocabularyItem[];
}

export async function getVocabularyItemCountBySetIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("vocabulary_items")
    .select("id", { count: "exact", head: true })
    .eq("vocabulary_set_id", vocabularySetId);

  if (error) {
    console.error("Error counting vocabulary items by set id:", {
      vocabularySetId,
      error,
    });
    return 0;
  }

  return count ?? 0;
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

  const [items, usageStats] = await Promise.all([
    getVocabularyItemsBySetIdDb(vocabularySet.id),
    getVocabularySetUsageStatsBySetIdDb(vocabularySet.id),
  ]);

  return {
    vocabularySet,
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
      items: [],
    };
  }

  const items = await getVocabularyItemsBySetIdDb(vocabularySet.id);

  return {
    vocabularySet,
    items,
  };
}

async function attachVocabularyCountsAndUsage(
  vocabularySets: DbVocabularySet[]
): Promise<DbVocabularySetListItem[]> {
  const enriched = await Promise.all(
    vocabularySets.map(async (vocabularySet) => {
      const [itemCount, usageStats] = await Promise.all([
        getVocabularyItemCountBySetIdDb(vocabularySet.id),
        getVocabularySetUsageStatsBySetIdDb(vocabularySet.id),
      ]);

      return {
        ...vocabularySet,
        item_count: itemCount,
        usage_stats: usageStats,
      };
    })
  );

  return enriched;
}

export async function getVocabularySetsDb(options?: { publishedOnly?: boolean }) {
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

  return attachVocabularyCountsAndUsage((data ?? []) as DbVocabularySet[]);
}

export async function getPublishedVocabularySetsDb() {
  return getVocabularySetsDb({ publishedOnly: true });
}
