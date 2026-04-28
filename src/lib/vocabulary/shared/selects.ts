export const VOCABULARY_SET_SELECT =
  "id, slug, title, description, theme_key, topic_key, tier, list_mode, set_type, default_display_variant, is_published, sort_order, source_key, source_version, import_key, created_at, updated_at";

export const VOCABULARY_LIST_SELECT =
  "id, vocabulary_set_id, slug, title, description, theme_key, topic_key, category_key, subcategory_key, tier, list_mode, default_display_variant, is_published, sort_order, source_key, source_version, source_section_ref, import_key, created_at, updated_at";

export const VOCABULARY_ITEM_SELECT =
  "id, vocabulary_set_id, canonical_key, russian, english, transliteration, example_ru, example_en, audio_path, notes, item_type, source_type, priority, part_of_speech, gender, plural, productive_receptive, tier, theme_key, topic_key, category_key, subcategory_key, aspect, case_governed, is_reflexive, source_key, source_version, source_section_ref, import_key, position, created_at, updated_at";

export const VOCABULARY_ITEM_COVERAGE_SELECT =
  "vocabulary_item_id, used_in_foundation, used_in_higher, used_in_volna, used_in_custom_list, foundation_occurrences, higher_occurrences, volna_occurrences, custom_list_occurrences";

export const VOCABULARY_SET_SUMMARY_SELECT =
  "vocabulary_set_id, item_count, list_count, total_occurrences, foundation_occurrences, higher_occurrences, volna_occurrences, foundation_total_items, higher_total_items, volna_total_items, custom_list_total_items, foundation_used_items, higher_used_items, volna_used_items, custom_list_used_items";

export const LESSON_VOCABULARY_SET_USAGE_SELECT =
  "id, lesson_id, vocabulary_set_id, variant, usage_type, created_at";
