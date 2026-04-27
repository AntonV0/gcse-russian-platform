import { createClient } from "@/lib/supabase/server";
import { buildVocabularyUsageStats } from "@/lib/vocabulary/study-variants";
import { LESSON_VOCABULARY_SET_USAGE_SELECT } from "@/lib/vocabulary/selects";
import type {
  DbLessonVocabularySetUsage,
  DbVocabularySetUsageStats,
} from "@/lib/vocabulary/types";

export async function getVocabularySetUsagesBySetIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_vocabulary_set_usages")
    .select(LESSON_VOCABULARY_SET_USAGE_SELECT)
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
