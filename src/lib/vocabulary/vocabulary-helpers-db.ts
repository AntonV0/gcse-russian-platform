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

export function groupVocabularyItemsBySource(items: DbVocabularyItem[]) {
  return {
    specRequired: items.filter((item) => item.source_type === "spec_required"),
    extended: items.filter((item) => item.source_type === "extended"),
    custom: items.filter((item) => item.source_type === "custom"),
  };
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
