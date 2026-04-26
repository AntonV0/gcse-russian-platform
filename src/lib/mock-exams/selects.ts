export const MOCK_EXAM_SET_SELECT =
  "id, title, slug, description, paper_number, paper_name, tier, time_limit_minutes, total_marks, is_published, sort_order, is_trial_visible, requires_paid_access, available_in_volna, created_at, updated_at";

export const MOCK_EXAM_SECTION_SELECT =
  "id, mock_exam_id, title, instructions, section_type, sort_order, created_at, updated_at";

export const MOCK_EXAM_QUESTION_SELECT =
  "id, section_id, question_type, prompt, data, marks, sort_order, created_at, updated_at";

export const MOCK_EXAM_ATTEMPT_SELECT =
  "id, mock_exam_id, user_id, status, started_at, submitted_at, time_limit_minutes_snapshot, total_marks_snapshot, awarded_marks, feedback, created_at, updated_at";

export const MOCK_EXAM_RESPONSE_SELECT =
  "id, attempt_id, question_id, response_text, response_payload, awarded_marks, feedback, is_flagged, created_at, updated_at";

export const MOCK_EXAM_SCORE_SELECT =
  "id, attempt_id, total_marks, awarded_marks, score_payload, feedback, marked_by, marked_at, created_at, updated_at";
