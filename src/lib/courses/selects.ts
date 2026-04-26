export const COURSE_SELECT =
  "id, slug, title, description, is_active, is_published, created_at, updated_at";

export const VARIANT_SELECT =
  "id, course_id, slug, title, description, position, is_active, is_published, created_at, updated_at";

export const MODULE_SELECT =
  "id, course_variant_id, slug, title, description, position, is_published, created_at, updated_at";

export const LESSON_SELECT =
  "id, module_id, slug, title, summary, lesson_type, position, estimated_minutes, is_published, is_trial_visible, requires_paid_access, available_in_volna, content_source, content_key, created_at, updated_at";
