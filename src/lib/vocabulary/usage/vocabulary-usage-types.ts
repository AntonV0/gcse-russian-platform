export type VocabularyUsageVariant = "foundation" | "higher" | "volna";

export type LessonVocabularyLinkRow = {
  lesson_id: string;
  lesson_section_id: string;
  lesson_block_id: string;
  link_type: "set" | "list";
  vocabulary_set_id?: string;
  vocabulary_list_id?: string;
  variant: VocabularyUsageVariant;
  usage_type: "lesson_block";
  position: number;
};

export type VocabularyListForUsageSync = {
  id: string;
  vocabulary_set_id: string;
  slug: string | null;
  tier: string | null;
  sort_order: number | null;
};
