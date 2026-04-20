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

export type LoadedVocabularySetDb = {
  vocabularySet: DbVocabularySet | null;
  items: DbVocabularyItem[];
};

export type DbVocabularySetListItem = DbVocabularySet & {
  item_count: number;
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

async function attachVocabularyItemCounts(
  vocabularySets: DbVocabularySet[]
): Promise<DbVocabularySetListItem[]> {
  const itemCounts = await Promise.all(
    vocabularySets.map(async (vocabularySet) => {
      const itemCount = await getVocabularyItemCountBySetIdDb(vocabularySet.id);

      return {
        vocabularySetId: vocabularySet.id,
        itemCount,
      };
    })
  );

  const countMap = new Map(
    itemCounts.map((item) => [item.vocabularySetId, item.itemCount])
  );

  return vocabularySets.map((vocabularySet) => ({
    ...vocabularySet,
    item_count: countMap.get(vocabularySet.id) ?? 0,
  }));
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

  return attachVocabularyItemCounts((data ?? []) as DbVocabularySet[]);
}

export async function getPublishedVocabularySetsDb() {
  return getVocabularySetsDb({ publishedOnly: true });
}
