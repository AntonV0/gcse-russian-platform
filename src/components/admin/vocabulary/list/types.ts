import type {
  DbVocabularySetListItem,
  VocabularySetFilters,
} from "@/lib/vocabulary/shared/types";

export type AdminVocabularySearchParams = {
  search?: string;
  tier?: string;
  listMode?: string;
  setType?: string;
  themeKey?: string;
  sourceKey?: string;
  usageVariant?: string;
  published?: string;
};

export type AdminVocabularyListStats = {
  totalSets: number;
  publishedSets: number;
  draftSets: number;
  totalItems: number;
  totalUsages: number;
};

export type AdminVocabularyMetadataHealth = {
  specItems: number;
  unknownPartOfSpeechItems: number;
  missingTransliterationItems: number;
  missingCategoryItems: number;
  duplicateCanonicalKeys: number;
  sampleIssues: {
    title: string;
    setId: string;
    setTitle: string;
    setSlug: string | null;
    russian: string;
    english: string;
    href: string;
  }[];
};

export type AdminVocabularyListProps = {
  vocabularySets: DbVocabularySetListItem[];
  filters: VocabularySetFilters;
  params: AdminVocabularySearchParams;
  themeKeys: string[];
  sourceKeys: string[];
};
