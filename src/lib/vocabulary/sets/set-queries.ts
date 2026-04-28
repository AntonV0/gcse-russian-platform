import { createClient } from "@/lib/supabase/server";

import { normalizeVocabularySet } from "@/lib/vocabulary/shared/normalizers";
import { VOCABULARY_SET_SELECT } from "@/lib/vocabulary/shared/selects";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

  if (!UUID_PATTERN.test(vocabularySetRef)) {
    return null;
  }

  return getVocabularySetByIdDb(vocabularySetRef);
}
