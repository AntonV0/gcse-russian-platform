export const GRAMMAR_SET_SELECT =
  "id, slug, title, description, theme_key, topic_key, tier, sort_order, is_published, is_trial_visible, requires_paid_access, available_in_volna, source_key, source_version, import_key, created_at, updated_at";

export const GRAMMAR_POINT_SELECT =
  "id, grammar_set_id, slug, title, short_description, full_explanation, spec_reference, grammar_tag_key, category_key, tier, sort_order, is_published, created_at, updated_at";

export const GRAMMAR_EXAMPLE_SELECT =
  "id, grammar_point_id, russian_text, english_translation, optional_highlight, note, sort_order, created_at, updated_at";

export const GRAMMAR_TABLE_SELECT =
  "id, grammar_point_id, title, columns, rows, optional_note, sort_order, created_at, updated_at";
