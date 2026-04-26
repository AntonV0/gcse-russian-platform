import { createClient } from "@/lib/supabase/server";

import { normalizeVocabularySet } from "./normalizers";
import { VOCABULARY_SET_SELECT } from "./selects";

export async function getVocabularySetByIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_sets")
    .select(VOCABULARY_SET_SELECT)
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
    .select(VOCABULARY_SET_SELECT)
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
