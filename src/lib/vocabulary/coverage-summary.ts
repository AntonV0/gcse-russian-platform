import { getCoverageTotalItemIdsForVariant } from "./study-variants";
import type {
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  DbVocabularyList,
  DbVocabularyListItem,
  DbVocabularySetCoverageSummary,
} from "./types";

export function createEmptyCoverageSummary(): DbVocabularySetCoverageSummary {
  return {
    totalItems: 0,
    foundationTotalItems: 0,
    higherTotalItems: 0,
    volnaTotalItems: 0,
    customListTotalItems: 0,
    foundationUsedItems: 0,
    higherUsedItems: 0,
    volnaUsedItems: 0,
    customListUsedItems: 0,
  };
}

export function buildVocabularySetCoverageSummary(params: {
  lists: DbVocabularyList[];
  listItems: Pick<DbVocabularyListItem, "vocabulary_list_id" | "vocabulary_item_id">[];
  items: Pick<DbVocabularyItem, "id" | "tier">[];
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
}): DbVocabularySetCoverageSummary {
  const uniqueItems = Array.from(
    new Map(params.items.map((item) => [item.id, item])).values()
  );
  const foundationItemIds = getCoverageTotalItemIdsForVariant({
    lists: params.lists,
    listItems: params.listItems,
    fallbackItems: uniqueItems,
    variant: "foundation",
  });
  const higherItemIds = getCoverageTotalItemIdsForVariant({
    lists: params.lists,
    listItems: params.listItems,
    fallbackItems: uniqueItems,
    variant: "higher",
  });
  const volnaItemIds = getCoverageTotalItemIdsForVariant({
    lists: params.lists,
    listItems: params.listItems,
    fallbackItems: uniqueItems,
    variant: "volna",
  });

  return {
    totalItems: uniqueItems.length,
    foundationTotalItems: foundationItemIds.size,
    higherTotalItems: higherItemIds.size,
    volnaTotalItems: volnaItemIds.size,
    customListTotalItems: uniqueItems.length,
    foundationUsedItems: Array.from(foundationItemIds).filter(
      (itemId) => params.itemCoverageById.get(itemId)?.used_in_foundation
    ).length,
    higherUsedItems: Array.from(higherItemIds).filter(
      (itemId) => params.itemCoverageById.get(itemId)?.used_in_higher
    ).length,
    volnaUsedItems: Array.from(volnaItemIds).filter(
      (itemId) => params.itemCoverageById.get(itemId)?.used_in_volna
    ).length,
    customListUsedItems: uniqueItems.filter(
      (item) => params.itemCoverageById.get(item.id)?.used_in_custom_list
    ).length,
  };
}
