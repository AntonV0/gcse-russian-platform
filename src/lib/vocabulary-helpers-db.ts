import { createClient } from "@/lib/supabase/server";

export type DbVocabularySet = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
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
  position: number;
  created_at: string;
  updated_at: string;
};

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

export async function loadVocabularySetBySlugDb(vocabularySetSlug: string) {
  const vocabularySet = await getVocabularySetBySlugDb(vocabularySetSlug);

  if (!vocabularySet) {
    return {
      vocabularySet: null,
      items: [] as DbVocabularyItem[],
    };
  }

  const items = await getVocabularyItemsBySetIdDb(vocabularySet.id);

  return {
    vocabularySet,
    items,
  };
}
