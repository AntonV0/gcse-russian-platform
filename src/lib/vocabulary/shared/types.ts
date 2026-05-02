export type DbVocabularyTier = "foundation" | "higher" | "both" | "unknown";

export type DbVocabularyListMode =
  | "spec_only"
  | "extended_only"
  | "spec_and_extended"
  | "custom";

export type DbVocabularySetType =
  | "specification"
  | "core"
  | "theme"
  | "phrase_bank"
  | "exam_prep"
  | "lesson_custom";

export type DbVocabularyDisplayVariant = "single_column" | "two_column" | "compact_cards";

export type DbVocabularyItemType = "word" | "phrase";

export type DbVocabularyItemSourceType = "spec_required" | "extended" | "custom";

export type DbVocabularyItemPriority = "core" | "extension";

export type DbVocabularyPartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "number"
  | "phrase"
  | "interjection"
  | "other"
  | "unknown";

export type DbVocabularyGender =
  | "masculine"
  | "feminine"
  | "neuter"
  | "plural_only"
  | "common"
  | "not_applicable"
  | "unknown";

export type DbVocabularyProductiveReceptive =
  | "productive"
  | "receptive"
  | "both"
  | "unknown";

export type DbVocabularyAspect =
  | "perfective"
  | "imperfective"
  | "both"
  | "not_applicable"
  | "unknown";

export type DbVocabularyUsageVariant = "foundation" | "higher" | "volna";

export type DbVocabularyCoverageVariant = DbVocabularyUsageVariant;

export type DbVocabularyStudyVariant = DbVocabularyUsageVariant;

export type DbVocabularyUsageType =
  | "lesson_block"
  | "lesson_page"
  | "revision_page"
  | "other";

export type DbVocabularySet = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  theme_key: string | null;
  topic_key: string | null;
  tier: DbVocabularyTier;
  list_mode: DbVocabularyListMode;
  set_type: DbVocabularySetType;
  default_display_variant: DbVocabularyDisplayVariant;
  is_published: boolean;
  is_trial_visible: boolean;
  requires_paid_access: boolean;
  available_in_volna: boolean;
  sort_order: number;
  source_key: string | null;
  source_version: string | null;
  import_key: string | null;
  created_at: string;
  updated_at: string;
};

export type DbVocabularyList = {
  id: string;
  vocabulary_set_id: string;
  slug: string;
  title: string;
  description: string | null;
  theme_key: string | null;
  topic_key: string | null;
  category_key: string | null;
  subcategory_key: string | null;
  tier: DbVocabularyTier;
  list_mode: DbVocabularyListMode;
  default_display_variant: DbVocabularyDisplayVariant;
  is_published: boolean;
  sort_order: number;
  source_key: string | null;
  source_version: string | null;
  source_section_ref: string | null;
  import_key: string | null;
  created_at: string;
  updated_at: string;
};

export type DbVocabularyItem = {
  id: string;
  vocabulary_set_id: string;
  vocabulary_list_id?: string | null;
  canonical_key: string | null;
  russian: string;
  english: string;
  transliteration: string | null;
  example_ru: string | null;
  example_en: string | null;
  audio_path: string | null;
  notes: string | null;
  item_type: DbVocabularyItemType;
  source_type: DbVocabularyItemSourceType;
  priority: DbVocabularyItemPriority;
  part_of_speech: DbVocabularyPartOfSpeech;
  gender: DbVocabularyGender;
  plural: string | null;
  productive_receptive: DbVocabularyProductiveReceptive;
  tier: DbVocabularyTier;
  theme_key: string | null;
  topic_key: string | null;
  category_key: string | null;
  subcategory_key: string | null;
  aspect: DbVocabularyAspect;
  case_governed: string | null;
  is_reflexive: boolean;
  source_key: string | null;
  source_version: string | null;
  source_section_ref: string | null;
  import_key: string | null;
  position: number;
  created_at: string;
  updated_at: string;
};

export type DbVocabularyListItem = {
  id: string;
  vocabulary_list_id: string;
  vocabulary_item_id: string;
  position: number;
  productive_receptive_override: DbVocabularyProductiveReceptive | null;
  tier_override: DbVocabularyTier | null;
  notes_override: string | null;
  source_section_ref: string | null;
  import_key: string | null;
  created_at: string;
};

export type DbVocabularyItemCoverage = {
  vocabulary_item_id: string;
  used_in_foundation: boolean;
  used_in_higher: boolean;
  used_in_volna: boolean;
  used_in_custom_list: boolean;
  foundation_occurrences: number;
  higher_occurrences: number;
  volna_occurrences: number;
  custom_list_occurrences: number;
};

export type DbLessonVocabularySetUsage = {
  id: string;
  lesson_id: string;
  vocabulary_set_id: string;
  variant: DbVocabularyUsageVariant;
  usage_type: DbVocabularyUsageType;
  created_at: string;
};

export type LoadedVocabularySetDb = {
  vocabularySet: DbVocabularySet | null;
  vocabularyList: DbVocabularyList | null;
  lists: DbVocabularyList[];
  items: DbVocabularyItem[];
};

export type DbVocabularySetUsageStats = {
  totalOccurrences: number;
  foundationOccurrences: number;
  higherOccurrences: number;
  volnaOccurrences: number;
  usedInFoundation: boolean;
  usedInHigher: boolean;
  usedInVolna: boolean;
};

export type DbVocabularySetCoverageSummary = {
  totalItems: number;
  foundationTotalItems: number;
  higherTotalItems: number;
  volnaTotalItems: number;
  customListTotalItems: number;
  foundationUsedItems: number;
  higherUsedItems: number;
  volnaUsedItems: number;
  customListUsedItems: number;
};

export type DbVocabularySetSummaryRow = {
  vocabulary_set_id: string;
  item_count: number;
  list_count: number;
  total_occurrences: number;
  foundation_occurrences: number;
  higher_occurrences: number;
  volna_occurrences: number;
  foundation_total_items: number;
  higher_total_items: number;
  volna_total_items: number;
  custom_list_total_items: number;
  foundation_used_items: number;
  higher_used_items: number;
  volna_used_items: number;
  custom_list_used_items: number;
};

export type DbVocabularySetListItem = DbVocabularySet & {
  item_count: number;
  list_count: number;
  usage_stats: DbVocabularySetUsageStats;
  coverage_summary: DbVocabularySetCoverageSummary;
};

export type DbVocabularySetOptionList = Pick<
  DbVocabularyList,
  | "id"
  | "vocabulary_set_id"
  | "title"
  | "slug"
  | "tier"
  | "list_mode"
  | "sort_order"
  | "is_published"
>;

export type DbVocabularySetOption = Pick<
  DbVocabularySet,
  | "id"
  | "title"
  | "slug"
  | "is_published"
  | "tier"
  | "list_mode"
  | "set_type"
  | "sort_order"
> & {
  lists: DbVocabularySetOptionList[];
};

export type LoadedVocabularySetDetailDb = {
  vocabularySet: DbVocabularySet | null;
  vocabularyList: DbVocabularyList | null;
  lists: DbVocabularyList[];
  items: DbVocabularyItem[];
  usageStats: DbVocabularySetUsageStats;
};

export type VocabularySetLoadOptions = {
  scopeVariant?: DbVocabularyStudyVariant | "all" | null;
  vocabularyListSlug?: string | null;
};

export type VocabularySetFilters = {
  search?: string | null;
  tier?: DbVocabularyTier | "all" | null;
  themeKey?: string | null;
  listMode?: DbVocabularyListMode | "all" | null;
  setType?: DbVocabularySetType | "all" | null;
  sourceKey?: string | null;
  usageVariant?: DbVocabularyUsageVariant | "unused" | "all" | null;
  published?: "all" | "published" | "draft" | null;
};
