export {
  getVocabularyItemCountBySetIdDb,
  getVocabularyItemCoverageByItemIdsDb,
  getVocabularyItemsByListIdDb,
  getVocabularyItemsByListIdsDb,
  getVocabularyItemsBySetIdDb,
  getVocabularyListCountBySetIdDb,
  getVocabularySetCoverageSummaryBySetIdDb,
} from "@/lib/vocabulary/items/item-queries";
export {
  ensureDefaultVocabularyListForSetDb,
  getDefaultVocabularyListBySetIdDb,
  getVocabularyListByIdDb,
  getVocabularyListsBySetIdDb,
} from "@/lib/vocabulary/sets/list-queries";
export {
  groupVocabularyItemsBySource,
  getVocabularyDisplayVariantLabel,
  getVocabularyListModeLabel,
  getVocabularyProductiveReceptiveLabel,
  getVocabularySetTypeLabel,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
  getVocabularyTopicLabel,
} from "@/lib/vocabulary/shared/labels";
export {
  loadVocabularySetByIdDb,
  loadVocabularySetByRefDb,
  loadVocabularySetBySlugDb,
} from "@/lib/vocabulary/sets/loaders";
export {
  getVocabularySetByIdDb,
  getVocabularySetByRefDb,
  getVocabularySetBySlugDb,
} from "@/lib/vocabulary/sets/set-queries";
export {
  bulkCreateVocabularyItemsDb,
  createVocabularySetDb,
  createVocabularyItemDb,
  deleteVocabularyItemDb,
  deleteVocabularySetDb,
  updateVocabularyItemDb,
  updateVocabularySetDb,
} from "@/lib/vocabulary/items/mutations";
export type {
  BulkVocabularyItemInput,
  BulkVocabularyItemMutationPayload,
  VocabularyItemMutationPayload,
  VocabularySetMutationPayload,
} from "@/lib/vocabulary/items/mutations";
export {
  getPublishedVocabularySetsDb,
  getVocabularySetsDb,
} from "@/lib/vocabulary/sets/set-list-queries";
export {
  getVocabularySetOptionsDb,
  getVocabularySetThemeKeysDb,
} from "@/lib/vocabulary/sets/set-options";
export {
  buildVocabularyUsageStats,
  filterVocabularyListsForStudyVariant,
  getCoverageTotalItemIdsForVariant,
  getRequiredVocabularyCoverageVariants,
  getVocabularyCoverageVariantCount,
  getVocabularyCoverageVariantLabel,
  getVocabularyCoverageVariantUsed,
  getVocabularyItemAppliesToStudyVariant,
  getVocabularyListAppliesToStudyVariant,
} from "@/lib/vocabulary/shared/study-variants";
export {
  getVocabularySetUsageStatsBySetIdDb,
  getVocabularySetUsagesBySetIdDb,
} from "@/lib/vocabulary/usage/usage-queries";

export type {
  DbLessonVocabularySetUsage,
  DbVocabularyAspect,
  DbVocabularyCoverageVariant,
  DbVocabularyDisplayVariant,
  DbVocabularyGender,
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  DbVocabularyItemPriority,
  DbVocabularyItemSourceType,
  DbVocabularyItemType,
  DbVocabularyList,
  DbVocabularyListItem,
  DbVocabularyListMode,
  DbVocabularyPartOfSpeech,
  DbVocabularyProductiveReceptive,
  DbVocabularySet,
  DbVocabularySetCoverageSummary,
  DbVocabularySetListItem,
  DbVocabularySetOption,
  DbVocabularySetOptionList,
  DbVocabularySetType,
  DbVocabularySetUsageStats,
  DbVocabularyStudyVariant,
  DbVocabularyTier,
  DbVocabularyUsageType,
  DbVocabularyUsageVariant,
  LoadedVocabularySetDb,
  LoadedVocabularySetDetailDb,
  VocabularySetFilters,
  VocabularySetLoadOptions,
} from "@/lib/vocabulary/shared/types";
