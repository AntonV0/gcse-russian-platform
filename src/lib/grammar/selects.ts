export const GRAMMAR_SET_SELECT =
  "id, slug, title, description, theme_key, topic_key, tier, sort_order, is_published, is_trial_visible, requires_paid_access, available_in_volna, source_key, source_version, import_key, created_at, updated_at";

export const GRAMMAR_POINT_SELECT =
  "id, grammar_set_id, slug, title, short_description, full_explanation, spec_reference, grammar_tag_key, category_key, tier, knowledge_requirement, receptive_scope, source_key, source_version, import_key, sort_order, is_published, created_at, updated_at";

export const GRAMMAR_EXAMPLE_SELECT =
  "id, grammar_point_id, russian_text, english_translation, optional_highlight, note, sort_order, created_at, updated_at";

export const GRAMMAR_TABLE_SELECT =
  "id, grammar_point_id, title, columns, rows, optional_note, sort_order, created_at, updated_at";

export const GRAMMAR_POINT_COVERAGE_SELECT =
  "grammar_point_id, used_in_foundation, used_in_higher, used_in_volna, foundation_occurrences, higher_occurrences, volna_occurrences";

export const GRAMMAR_SET_SUMMARY_SELECT =
  "grammar_set_id, point_count, total_occurrences, foundation_occurrences, higher_occurrences, volna_occurrences, foundation_total_points, higher_total_points, volna_total_points, foundation_used_points, higher_used_points, volna_used_points";

export const LESSON_GRAMMAR_LINK_SELECT =
  "id, lesson_id, lesson_section_id, lesson_block_id, link_type, grammar_set_id, grammar_point_id, grammar_tag_key, variant, usage_type, position, created_at";
