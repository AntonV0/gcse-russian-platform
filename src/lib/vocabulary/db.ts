export {
  getVocabularyItemCountBySetIdDb,
  getVocabularyItemCoverageByItemIdsDb,
  getVocabularyItemsByListIdDb,
  getVocabularyItemsByListIdsDb,
  getVocabularyItemsBySetIdDb,
  getVocabularyListCountBySetIdDb,
  getVocabularySetCoverageSummaryBySetIdDb,
} from "@/lib/vocabulary/item-queries";
export {
  ensureDefaultVocabularyListForSetDb,
  getDefaultVocabularyListBySetIdDb,
  getVocabularyListByIdDb,
  getVocabularyListsBySetIdDb,
} from "@/lib/vocabulary/list-queries";
export {
  groupVocabularyItemsBySource,
  getVocabularyDisplayVariantLabel,
  getVocabularyListModeLabel,
  getVocabularyProductiveReceptiveLabel,
  getVocabularySetTypeLabel,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
  getVocabularyTopicLabel,
} from "@/lib/vocabulary/labels";
export {
  loadVocabularySetByIdDb,
  loadVocabularySetByRefDb,
  loadVocabularySetBySlugDb,
} from "@/lib/vocabulary/loaders";
export {
  getVocabularySetByIdDb,
  getVocabularySetByRefDb,
  getVocabularySetBySlugDb,
} from "@/lib/vocabulary/set-queries";
export {
  bulkCreateVocabularyItemsDb,
  createVocabularySetDb,
  createVocabularyItemDb,
  deleteVocabularyItemDb,
  deleteVocabularySetDb,
  updateVocabularyItemDb,
  updateVocabularySetDb,
} from "@/lib/vocabulary/mutations";
export type {
  BulkVocabularyItemInput,
  BulkVocabularyItemMutationPayload,
  VocabularyItemMutationPayload,
  VocabularySetMutationPayload,
} from "@/lib/vocabulary/mutations";
export {
  getPublishedVocabularySetsDb,
  getVocabularySetsDb,
} from "@/lib/vocabulary/set-list-queries";
export {
  getVocabularySetOptionsDb,
  getVocabularySetThemeKeysDb,
} from "@/lib/vocabulary/set-options";
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
} from "@/lib/vocabulary/study-variants";
export {
  getVocabularySetUsageStatsBySetIdDb,
  getVocabularySetUsagesBySetIdDb,
} from "@/lib/vocabulary/usage-queries";

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
} from "@/lib/vocabulary/types";
