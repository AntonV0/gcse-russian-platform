export const QUESTION_SET_SELECT =
  "id, slug, title, description, instructions, source_type, is_template, template_type, created_at, updated_at";

export const QUESTION_SELECT =
  "id, question_set_id, question_type, prompt, prompt_rich, explanation, difficulty, marks, audio_path, image_path, metadata, position, is_active, created_at, updated_at";

export const QUESTION_OPTION_SELECT =
  "id, question_id, option_text, option_rich, is_correct, match_group, position";

export const QUESTION_ACCEPTED_ANSWER_SELECT =
  "id, question_id, answer_text, normalized_answer, is_primary, case_sensitive, notes";
