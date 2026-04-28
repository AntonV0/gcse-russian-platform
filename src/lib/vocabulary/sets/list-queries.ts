import { createClient } from "@/lib/supabase/server";

import { slugifyVocabularyTitle } from "@/lib/vocabulary/shared/normalizers";
import { VOCABULARY_LIST_SELECT } from "@/lib/vocabulary/shared/selects";
import type { DbVocabularyList, DbVocabularySet } from "@/lib/vocabulary/shared/types";

export async function getVocabularyListsBySetIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_lists")
    .select(VOCABULARY_LIST_SELECT)
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
    .select(VOCABULARY_LIST_SELECT)
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

export async function ensureDefaultVocabularyListForSetDb(
  vocabularySet: DbVocabularySet
) {
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
    .select(VOCABULARY_LIST_SELECT)
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
