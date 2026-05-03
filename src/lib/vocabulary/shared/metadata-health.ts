import { createClient } from "@/lib/supabase/server";

import { fetchSupabasePages } from "@/lib/vocabulary/shared/pagination";

type VocabularyMetadataItemRow = {
  id: string;
  vocabulary_set_id: string;
  canonical_key: string | null;
  russian: string | null;
  english: string | null;
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
  title: string;
  slug: string | null;
  theme_key: string | null;
  topic_key: string | null;
  set_type: string | null;
  source_key: string | null;
};

function normalizeMetadataValue(value: string | null) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[()'',.;/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getUniqueNormalizedValues(
  items: VocabularyMetadataItemRow[],
  getValue: (item: VocabularyMetadataItemRow) => string | null
) {
  return new Set(items.map((item) => normalizeMetadataValue(getValue(item))));
}

function getDuplicateCanonicalKeyGroups(items: VocabularyMetadataItemRow[]) {
  const groups = new Map<string, VocabularyMetadataItemRow[]>();

  for (const item of items) {
    const canonicalKey = item.canonical_key?.trim();
    if (!canonicalKey) continue;
    const group = groups.get(canonicalKey) ?? [];
    group.push(item);
    groups.set(canonicalKey, group);
  }

  return Array.from(groups.entries())
    .filter(([, groupItems]) => groupItems.length > 1)
    .map(([canonicalKey, groupItems]) => {
      const russianValues = getUniqueNormalizedValues(
        groupItems,
        (item) => item.russian
      );
      const englishValues = getUniqueNormalizedValues(
        groupItems,
        (item) => item.english
      );
      const partOfSpeechValues = getUniqueNormalizedValues(
        groupItems,
        (item) => item.part_of_speech
      );

      return {
        canonicalKey,
        items: groupItems,
        isRepeatedSpecEntry:
          groupItems.every((item) => item.source_type === "spec_required") &&
          russianValues.size === 1 &&
          englishValues.size === 1 &&
          partOfSpeechValues.size === 1,
      };
    });
}

function getItemReviewHref(
  vocabularySetId: string,
  params: Record<string, string | null | undefined>
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value?.trim()) {
      searchParams.set(key, value);
    }
  }

  const queryString = searchParams.toString();

  return `/admin/vocabulary/${vocabularySetId}/items${
    queryString ? `?${queryString}` : ""
  }`;
}

function createIssueSample({
  title,
  item,
  setById,
  params,
}: {
  title: string;
  item: VocabularyMetadataItemRow;
  setById: Map<string, VocabularyMetadataSetRow>;
  params: Record<string, string | null | undefined>;
}) {
  const vocabularySet = setById.get(item.vocabulary_set_id);

  return {
    title,
    setId: item.vocabulary_set_id,
    setTitle: vocabularySet?.title ?? "Unknown set",
    setSlug: vocabularySet?.slug ?? null,
    russian: item.russian ?? "Untitled item",
    english: item.english ?? "",
    href: getItemReviewHref(item.vocabulary_set_id, params),
  };
}

export async function getVocabularyMetadataHealthDb() {
  const supabase = await createClient();
  const [items, sets] = await Promise.all([
    fetchSupabasePages<VocabularyMetadataItemRow>({
      queryFactory: () =>
        supabase
          .from("vocabulary_items")
          .select(
            "id, vocabulary_set_id, canonical_key, russian, english, transliteration, part_of_speech, tier, theme_key, topic_key, category_key, source_type"
          ),
      errorMessage: "Error fetching vocabulary metadata health items:",
      errorContext: {},
    }),
    fetchSupabasePages<VocabularyMetadataSetRow>({
      queryFactory: () =>
        supabase
          .from("vocabulary_sets")
          .select("id, title, slug, theme_key, topic_key, set_type, source_key"),
      errorMessage: "Error fetching vocabulary metadata health sets:",
      errorContext: {},
    }),
  ]);

  const specItems = items.filter((item) => item.source_type === "spec_required");
  const specificationSets = sets.filter((set) => set.set_type === "specification");
  const setById = new Map(sets.map((set) => [set.id, set]));
  const duplicateCanonicalKeyGroups = getDuplicateCanonicalKeyGroups(items);
  const repeatedCanonicalKeyGroups = duplicateCanonicalKeyGroups.filter(
    (group) => group.isRepeatedSpecEntry
  );
  const collidingCanonicalKeyGroups = duplicateCanonicalKeyGroups.filter(
    (group) => !group.isRepeatedSpecEntry
  );
  const collidingCanonicalKeys = new Set(
    collidingCanonicalKeyGroups.map((group) => group.canonicalKey)
  );
  const sampleIssues = [
    ...items
      .filter((item) => !item.part_of_speech || item.part_of_speech === "unknown")
      .slice(0, 3)
      .map((item) =>
        createIssueSample({
          title: "Unknown part of speech",
          item,
          setById,
          params: { partOfSpeech: "unknown", itemSearch: item.russian },
        })
      ),
    ...items
      .filter((item) => !item.transliteration?.trim())
      .slice(0, 3)
      .map((item) =>
        createIssueSample({
          title: "Missing transliteration",
          item,
          setById,
          params: { itemSearch: item.russian },
        })
      ),
    ...items
      .filter((item) => !item.category_key?.trim())
      .slice(0, 3)
      .map((item) =>
        createIssueSample({
          title: "Missing category",
          item,
          setById,
          params: { itemSearch: item.russian },
        })
      ),
    ...items
      .filter((item) => collidingCanonicalKeys.has(item.canonical_key?.trim() ?? ""))
      .slice(0, 3)
      .map((item) =>
        createIssueSample({
          title: "Canonical key collision",
          item,
          setById,
          params: { itemSearch: item.canonical_key },
        })
      ),
  ];

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
    duplicateCanonicalKeys: duplicateCanonicalKeyGroups.length,
    repeatedCanonicalKeyGroups: repeatedCanonicalKeyGroups.length,
    canonicalKeyCollisions: collidingCanonicalKeyGroups.length,
    specSetsInHighFrequency: specificationSets.filter(
      (set) => set.theme_key === "high_frequency_language"
    ).length,
    sampleIssues,
  };
}
