import type {
  DbVocabularyAspect,
  DbVocabularyDisplayVariant,
  DbVocabularyGender,
  DbVocabularyItemPriority,
  DbVocabularyItemSourceType,
  DbVocabularyItemType,
  DbVocabularyListMode,
  DbVocabularyPartOfSpeech,
  DbVocabularyProductiveReceptive,
  DbVocabularySetType,
  DbVocabularyTier,
} from "@/lib/vocabulary/types";

export type VocabularyManifestReviewStatus = "draft" | "reviewed" | "approved";

export type VocabularyImportManifest = {
  sourceKey: string;
  sourceTitle: string;
  sourceVersion: string;
  reviewStatus: VocabularyManifestReviewStatus;
  sets: VocabularyManifestSet[];
};

export type VocabularyManifestSet = {
  importKey: string;
  slug: string;
  title: string;
  description?: string | null;
  setType: DbVocabularySetType;
  themeKey?: string | null;
  topicKey?: string | null;
  tier: DbVocabularyTier;
  listMode: DbVocabularyListMode;
  defaultDisplayVariant: DbVocabularyDisplayVariant;
  isPublished: boolean;
  sortOrder: number;
  lists: VocabularyManifestList[];
};

export type VocabularyManifestList = {
  importKey: string;
  slug: string;
  title: string;
  description?: string | null;
  themeKey?: string | null;
  topicKey?: string | null;
  categoryKey?: string | null;
  subcategoryKey?: string | null;
  tier: DbVocabularyTier;
  listMode: DbVocabularyListMode;
  defaultDisplayVariant: DbVocabularyDisplayVariant;
  isPublished: boolean;
  sortOrder: number;
  sourceSectionRef?: string | null;
  items: VocabularyManifestItem[];
};

export type VocabularyManifestItem = {
  importKey: string;
  canonicalKey?: string | null;
  russian: string;
  english: string;
  transliteration?: string | null;
  itemType: DbVocabularyItemType;
  sourceType: DbVocabularyItemSourceType;
  priority: DbVocabularyItemPriority;
  partOfSpeech: DbVocabularyPartOfSpeech;
  gender: DbVocabularyGender;
  plural?: string | null;
  productiveReceptive: DbVocabularyProductiveReceptive;
  tier: DbVocabularyTier;
  themeKey?: string | null;
  topicKey?: string | null;
  categoryKey?: string | null;
  subcategoryKey?: string | null;
  aspect: DbVocabularyAspect;
  caseGoverned?: string | null;
  isReflexive: boolean;
  notes?: string | null;
  exampleRu?: string | null;
  exampleEn?: string | null;
  audioPath?: string | null;
  sourceSectionRef?: string | null;
  position: number;
};

export type VocabularyManifestValidationIssue = {
  path: string;
  message: string;
};

export type VocabularyManifestValidationResult = {
  valid: boolean;
  issues: VocabularyManifestValidationIssue[];
  summary: {
    setCount: number;
    listCount: number;
    itemCount: number;
  };
};
