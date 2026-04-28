import { createClient } from "@/lib/supabase/server";

import { fetchSupabasePages } from "@/lib/vocabulary/shared/pagination";

type VocabularyMetadataItemRow = {
  id: string;
  canonical_key: string | null;
  transliteration: string | null;
  part_of_speech: string | null;
  tier: string | null;
  theme_key: string | null;
  topic_key: string | null;
  category_key: string | null;
  source_type: string | null;
};

type VocabularyMetadataSetRow = {
  id: string;
  theme_key: string | null;
  topic_key: string | null;
  set_type: string | null;
  source_key: string | null;
};

function countDuplicateValues(values: (string | null)[]) {
  const counts = new Map<string, number>();

  for (const value of values) {
    const normalizedValue = value?.trim();
    if (!normalizedValue) continue;
    counts.set(normalizedValue, (counts.get(normalizedValue) ?? 0) + 1);
  }

  return Array.from(counts.values()).filter((count) => count > 1).length;
}

export async function getVocabularyMetadataHealthDb() {
  const supabase = await createClient();
  const [items, sets] = await Promise.all([
    fetchSupabasePages<VocabularyMetadataItemRow>({
      queryFactory: () =>
        supabase
          .from("vocabulary_items")
          .select(
            "id, canonical_key, transliteration, part_of_speech, tier, theme_key, topic_key, category_key, source_type"
          ),
      errorMessage: "Error fetching vocabulary metadata health items:",
      errorContext: {},
    }),
    fetchSupabasePages<VocabularyMetadataSetRow>({
      queryFactory: () =>
        supabase
          .from("vocabulary_sets")
          .select("id, theme_key, topic_key, set_type, source_key"),
      errorMessage: "Error fetching vocabulary metadata health sets:",
      errorContext: {},
    }),
  ]);

  const specItems = items.filter((item) => item.source_type === "spec_required");
  const specificationSets = sets.filter((set) => set.set_type === "specification");

  return {
    totalItems: items.length,
    specItems: specItems.length,
    totalSets: sets.length,
    specificationSets: specificationSets.length,
    unknownPartOfSpeechItems: items.filter(
      (item) => !item.part_of_speech || item.part_of_speech === "unknown"
    ).length,
    unknownTierItems: items.filter((item) => !item.tier || item.tier === "unknown")
      .length,
    missingTransliterationItems: items.filter((item) => !item.transliteration?.trim())
      .length,
    missingCategoryItems: items.filter((item) => !item.category_key?.trim()).length,
    missingTopicItems: items.filter((item) => !item.topic_key?.trim()).length,
    missingThemeSets: sets.filter((set) => !set.theme_key?.trim()).length,
    missingTopicSets: sets.filter((set) => !set.topic_key?.trim()).length,
    duplicateCanonicalKeys: countDuplicateValues(items.map((item) => item.canonical_key)),
    specSetsInHighFrequency: specificationSets.filter(
      (set) => set.theme_key === "high_frequency_language"
    ).length,
  };
}
