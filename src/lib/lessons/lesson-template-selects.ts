export const LESSON_BLOCK_PRESET_SELECT =
  "id, slug, title, description, is_active, created_at, updated_at";

export const LESSON_BLOCK_PRESET_BLOCK_SELECT =
  "id, lesson_block_preset_id, block_type, position, data, is_active, created_at, updated_at";

export const LESSON_SECTION_TEMPLATE_SELECT =
  "id, slug, title, description, default_section_title, default_section_kind, is_active, created_at, updated_at";

export const LESSON_SECTION_TEMPLATE_PRESET_SELECT =
  "lesson_section_template_id, lesson_block_preset_id, position";

export const LESSON_TEMPLATE_SELECT =
  "id, slug, title, description, is_active, created_at, updated_at";

export const LESSON_TEMPLATE_SECTION_SELECT =
  "id, lesson_template_id, lesson_section_template_id, title_override, section_kind_override, position";
