import type { PaperKey, PaperTaskKey, SkillKey, TierKey } from "./taxonomy-types";

export type QuestionTaskContextKey =
  | "standalone_practice"
  | "question_set"
  | "lesson_practice"
  | "reading_task"
  | "listening_task"
  | "writing_task"
  | "speaking_task"
  | "mock_exam_section"
  | "assignment_task";

export type QuestionInputModeKey =
  | "select"
  | "multi_select"
  | "tap"
  | "drag_or_tap"
  | "type_english"
  | "type_russian_optional"
  | "upload"
  | "record"
  | "manual";

export type QuestionResponseLanguageKey = "english" | "russian" | "mixed" | "none";

export type QuestionMarkingModeKey =
  | "auto_exact"
  | "auto_normalized_text"
  | "auto_structured"
  | "teacher_marked"
  | "ai_assisted_teacher_confirmed"
  | "manual";

export type QuestionInteractionTypeKey =
  | "single_choice"
  | "multi_select"
  | "true_false_not_mentioned"
  | "matching"
  | "categorisation"
  | "ordering"
  | "word_bank_gap_fill"
  | "dropdown_gap_fill"
  | "table_completion"
  | "click_text"
  | "opinion_recognition"
  | "speaker_identification"
  | "sentence_builder"
  | "phrase_builder"
  | "translation_en_ru_tiles"
  | "grammar_form_selection"
  | "verb_form_selection"
  | "sentence_transformation_tiles"
  | "error_spotting"
  | "error_correction_selection"
  | "short_answer_en"
  | "note_completion_en"
  | "translation_ru_en"
  | "summary_answer_en"
  | "writing_upload"
  | "writing_draft_optional"
  | "speaking_recording"
  | "speaking_prep_notes"
  | "role_play_response"
  | "photo_card_response"
  | "conversation_response"
  | "manual_marked_response";

export type QuestionTaskContext = {
  key: QuestionTaskContextKey;
  label: string;
  description: string;
  order: number;
};

export type QuestionInteractionType = {
  key: QuestionInteractionTypeKey;
  label: string;
  description: string;
  defaultInputMode: QuestionInputModeKey;
  responseLanguage: QuestionResponseLanguageKey;
  defaultMarkingMode: QuestionMarkingModeKey;
  requiresRussianTyping: boolean;
  isExamAligned: boolean;
  order: number;
};

export type ExistingQuestionSetTypeKey =
  | "multiple_choice"
  | "short_answer"
  | "translation";

export type ExistingQuestionSetAnswerStrategyKey =
  | "text_input"
  | "selection_based"
  | "sentence_builder"
  | "upload_required";

export type ExistingMockExamQuestionTypeKey =
  | "multiple_choice"
  | "multiple_response"
  | "short_answer"
  | "gap_fill"
  | "matching"
  | "sequencing"
  | "opinion_recognition"
  | "true_false_not_mentioned"
  | "translation_into_english"
  | "translation_into_russian"
  | "writing_task"
  | "simple_sentences"
  | "short_paragraph"
  | "extended_writing"
  | "role_play"
  | "photo_card"
  | "conversation"
  | "sentence_builder"
  | "note_completion"
  | "listening_comprehension"
  | "reading_comprehension"
  | "other";

export type QuestionCompatibilityStatus =
  | "covered"
  | "partial"
  | "needs_new_interaction"
  | "migration_only";

export type ExistingQuestionTypeCompatibility = {
  sourceSystem: "question_set" | "mock_exam";
  existingType: ExistingQuestionSetTypeKey | ExistingMockExamQuestionTypeKey;
  existingAnswerStrategy?: ExistingQuestionSetAnswerStrategyKey;
  recommendedInteractionTypes: QuestionInteractionTypeKey[];
  status: QuestionCompatibilityStatus;
  russianTypingRisk: "none" | "low" | "medium" | "high";
  notes: string;
};

export type FutureQuestionMetadata = {
  taskContext: QuestionTaskContextKey;
  interactionType: QuestionInteractionTypeKey;
  skillKey?: SkillKey;
  paperKey?: PaperKey;
  paperTaskKey?: PaperTaskKey;
  tier?: TierKey;
  inputMode: QuestionInputModeKey;
  responseLanguage: QuestionResponseLanguageKey;
  markingMode: QuestionMarkingModeKey;
  requiresRussianTyping: boolean;
};

