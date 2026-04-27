import { createClient } from "@/lib/supabase/server";

import { ensureDefaultVocabularyListForSetDb } from "@/lib/vocabulary/list-queries";
import { normalizeVocabularySet } from "@/lib/vocabulary/normalizers";
import { VOCABULARY_SET_SELECT } from "@/lib/vocabulary/selects";
import type {
  DbVocabularyDisplayVariant,
  DbVocabularyListMode,
  DbVocabularySet,
  DbVocabularySetType,
  DbVocabularyTier,
} from "@/lib/vocabulary/types";

export type VocabularySetMutationPayload = {
  title: string;
  slug: string | null;
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
};

export async function createVocabularySetDb(
  payload: VocabularySetMutationPayload
): Promise<DbVocabularySet> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_sets")
    .insert(payload)
    .select(VOCABULARY_SET_SELECT)
    .single();

  if (error) {
    console.error("Error creating vocabulary set:", error);
    throw new Error("Failed to create vocabulary set");
  }

  const vocabularySet = normalizeVocabularySet(data);
  await ensureDefaultVocabularyListForSetDb(vocabularySet);

  return vocabularySet;
}

export async function updateVocabularySetDb(
  vocabularySetId: string,
  payload: VocabularySetMutationPayload
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("vocabulary_sets")
    .update(payload)
    .eq("id", vocabularySetId);

  if (error) {
    console.error("Error updating vocabulary set:", error);
    throw new Error("Failed to update vocabulary set");
  }
}

export async function deleteVocabularySetDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("vocabulary_sets")
    .delete()
    .eq("id", vocabularySetId);

  if (error) {
    console.error("Error deleting vocabulary set:", { vocabularySetId, error });
    throw new Error("Failed to delete vocabulary set");
  }
}
