import type {
  DbLessonVocabularySetUsage,
  DbVocabularyCoverageVariant,
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  DbVocabularyList,
  DbVocabularyListItem,
  DbVocabularySetUsageStats,
  DbVocabularyStudyVariant,
  DbVocabularyTier,
} from "@/lib/vocabulary/shared/types";

export function getRequiredVocabularyCoverageVariants(tier: DbVocabularyTier) {
  if (tier === "foundation") {
    return ["foundation", "higher", "volna"] as const;
  }

  if (tier === "higher") {
    return ["higher", "volna"] as const;
  }

  return ["foundation", "higher", "volna"] as const;
}

export function getVocabularyListAppliesToStudyVariant(
  listTier: DbVocabularyTier,
  studyVariant: DbVocabularyStudyVariant
) {
  if (listTier === "both" || listTier === "unknown") {
    return true;
  }

  if (studyVariant === "foundation") {
    return listTier === "foundation";
  }

  return listTier === "foundation" || listTier === "higher";
}

export function getVocabularyItemAppliesToStudyVariant(
  itemTier: DbVocabularyTier,
  studyVariant: DbVocabularyStudyVariant
) {
  if (itemTier === "both" || itemTier === "unknown") {
    return true;
  }

  if (studyVariant === "foundation") {
    return itemTier === "foundation";
  }

  return itemTier === "foundation" || itemTier === "higher";
}

export function filterVocabularyListsForStudyVariant(
  lists: DbVocabularyList[],
  studyVariant?: DbVocabularyStudyVariant | "all" | null
) {
  if (!studyVariant || studyVariant === "all") {
    return lists;
  }

  return lists.filter((list) =>
    getVocabularyListAppliesToStudyVariant(list.tier, studyVariant)
  );
}

export function getCoverageTotalItemIdsForVariant(params: {
  lists: DbVocabularyList[];
  listItems: Pick<DbVocabularyListItem, "vocabulary_list_id" | "vocabulary_item_id">[];
  fallbackItems: Pick<DbVocabularyItem, "id" | "tier">[];
  variant: DbVocabularyCoverageVariant;
}) {
  const fallbackItemIds = new Set(
    params.fallbackItems
      .filter((item) => getVocabularyItemAppliesToStudyVariant(item.tier, params.variant))
      .map((item) => item.id)
  );

  if (params.lists.length === 0 || params.listItems.length === 0) {
    return fallbackItemIds;
  }

  const listIds = new Set(
    params.lists
      .filter((list) => getVocabularyListAppliesToStudyVariant(list.tier, params.variant))
      .map((list) => list.id)
  );
  const listItemIds = params.listItems
    .filter((listItem) => listIds.has(listItem.vocabulary_list_id))
    .map((listItem) => listItem.vocabulary_item_id);

  return new Set([...fallbackItemIds, ...listItemIds]);
}

export function getVocabularyCoverageVariantLabel(variant: DbVocabularyCoverageVariant) {
  switch (variant) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "volna":
      return "Volna";
    default:
      return variant;
  }
}

export function getVocabularyCoverageVariantCount(
  coverage: DbVocabularyItemCoverage | null,
  variant: DbVocabularyCoverageVariant
) {
  if (!coverage) return 0;

  switch (variant) {
    case "foundation":
      return coverage.foundation_occurrences;
    case "higher":
      return coverage.higher_occurrences;
    case "volna":
      return coverage.volna_occurrences;
    default:
      return 0;
  }
}

export function getVocabularyCoverageVariantUsed(
  coverage: DbVocabularyItemCoverage | null,
  variant: DbVocabularyCoverageVariant
) {
  return getVocabularyCoverageVariantCount(coverage, variant) > 0;
}

export function buildVocabularyUsageStats(
  usages: Pick<DbLessonVocabularySetUsage, "variant">[]
): DbVocabularySetUsageStats {
  let foundationOccurrences = 0;
  let higherOccurrences = 0;
  let volnaOccurrences = 0;

  for (const usage of usages) {
    switch (usage.variant) {
      case "foundation":
        foundationOccurrences += 1;
        break;
      case "higher":
        higherOccurrences += 1;
        break;
      case "volna":
        volnaOccurrences += 1;
        break;
      default:
        break;
    }
  }

  const totalOccurrences = foundationOccurrences + higherOccurrences + volnaOccurrences;

  return {
    totalOccurrences,
    foundationOccurrences,
    higherOccurrences,
    volnaOccurrences,
    usedInFoundation: foundationOccurrences > 0,
    usedInHigher: higherOccurrences > 0,
    usedInVolna: volnaOccurrences > 0,
  };
}
