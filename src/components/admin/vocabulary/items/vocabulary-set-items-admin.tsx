import { getDefaultVocabularyItemTier } from "@/components/admin/vocabulary/items/item-display";
import { CurrentVocabularyItemsSection } from "@/components/admin/vocabulary/items/vocabulary-set-items-admin/current-items-section";
import {
  filterVocabularyItems,
  getUniqueSortedValues,
  hasActiveVocabularyItemFilters,
} from "@/components/admin/vocabulary/items/vocabulary-set-items-admin/item-filters";
import { VocabularyItemEntryFormsSection } from "@/components/admin/vocabulary/items/vocabulary-set-items-admin/item-entry-forms-section";
import { groupAdminItemsByList } from "@/components/admin/vocabulary/items/vocabulary-set-items-admin/item-sections";
import { VocabularySetItemsStatsSection } from "@/components/admin/vocabulary/items/vocabulary-set-items-admin/set-stats-section";
import { VocabularySetItemsSummarySection } from "@/components/admin/vocabulary/items/vocabulary-set-items-admin/set-summary-section";
import type { VocabularySetItemsAdminProps } from "@/components/admin/vocabulary/items/vocabulary-set-items-admin/types";

export default function VocabularySetItemsAdmin({
  vocabularySet,
  vocabularyList,
  lists,
  items,
  usageStats,
  itemCoverageById,
  itemFilters,
}: VocabularySetItemsAdminProps) {
  const defaultTier = getDefaultVocabularyItemTier(vocabularySet.tier);
  const filteredItems = filterVocabularyItems({
    items,
    itemCoverageById,
    filters: itemFilters,
  });
  const itemSections = groupAdminItemsByList(lists, filteredItems);
  const categoryOptions = getUniqueSortedValues(
    items.flatMap((item) => [item.category_key, item.subcategory_key])
  );
  const hasActiveItemFilters = hasActiveVocabularyItemFilters(itemFilters);

  return (
    <main className="space-y-8">
      <VocabularySetItemsSummarySection vocabularySet={vocabularySet} />

      <VocabularySetItemsStatsSection
        items={items}
        lists={lists}
        usageStats={usageStats}
      />

      <VocabularyItemEntryFormsSection
        vocabularySetId={vocabularySet.id}
        vocabularyListId={vocabularyList?.id ?? null}
        defaultTier={defaultTier}
      />

      <CurrentVocabularyItemsSection
        vocabularySetId={vocabularySet.id}
        vocabularyList={vocabularyList}
        items={items}
        filteredItems={filteredItems}
        itemSections={itemSections}
        itemCoverageById={itemCoverageById}
        itemFilters={itemFilters}
        categoryOptions={categoryOptions}
        hasActiveItemFilters={hasActiveItemFilters}
        defaultTier={defaultTier}
      />
    </main>
  );
}
