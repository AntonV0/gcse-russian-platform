import type {
  VocabularyListForUsageSync,
  VocabularyUsageVariant,
} from "./vocabulary-usage-types";

function isListInVariantScope(
  list: Pick<VocabularyListForUsageSync, "tier">,
  variant: VocabularyUsageVariant
) {
  if (list.tier === "both" || list.tier === "unknown" || !list.tier) {
    return true;
  }

  if (variant === "foundation") {
    return list.tier === "foundation";
  }

  return list.tier === "foundation" || list.tier === "higher";
}

export function getVocabularyListIdsForVariantScope(params: {
  vocabularySetId: string;
  vocabularyListSlug?: string;
  variant: VocabularyUsageVariant;
  lists: VocabularyListForUsageSync[];
}) {
  const setLists = params.lists
    .filter((list) => list.vocabulary_set_id === params.vocabularySetId)
    .sort(
      (a, b) =>
        Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0) ||
        String(a.slug ?? "").localeCompare(String(b.slug ?? ""))
    );

  if (params.vocabularyListSlug) {
    const explicitList = setLists.find((list) => list.slug === params.vocabularyListSlug);

    if (explicitList) {
      return [explicitList.id];
    }
  }

  const scopedLists = setLists.filter((list) =>
    isListInVariantScope(list, params.variant)
  );

  if (scopedLists.length > 0) {
    return scopedLists.map((list) => list.id);
  }

  return setLists[0] ? [setLists[0].id] : [];
}
