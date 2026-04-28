import type {
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  DbVocabularyList,
  DbVocabularySet,
  DbVocabularySetUsageStats,
} from "@/lib/vocabulary/shared/types";

export type VocabularyItemAdminFilters = {
  itemSearch?: string;
  partOfSpeech?: string;
  sourceType?: string;
  tier?: string;
  skillUse?: string;
  categoryKey?: string;
  coverage?: string;
};

export type VocabularySetItemsAdminProps = {
  vocabularySet: DbVocabularySet;
  vocabularyList: DbVocabularyList | null;
  lists: DbVocabularyList[];
  items: DbVocabularyItem[];
  usageStats: DbVocabularySetUsageStats;
  itemCoverageById: Map<string, DbVocabularyItemCoverage>;
  itemFilters: VocabularyItemAdminFilters;
};

export type VocabularyItemAdminSection = {
  key: string;
  title: string;
  description: string;
  items: DbVocabularyItem[];
};
