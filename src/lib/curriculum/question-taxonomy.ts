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

export const QUESTION_TASK_CONTEXTS = [
  {
    key: "standalone_practice",
    label: "Standalone practice",
    description: "A single reusable drill or practice question.",
    order: 1,
  },
  {
    key: "question_set",
    label: "Question set",
    description: "A reusable sequence of practice questions.",
    order: 2,
  },
  {
    key: "lesson_practice",
    label: "Lesson practice",
    description: "Practice embedded inside a lesson section.",
    order: 3,
  },
  {
    key: "reading_task",
    label: "Reading task",
    description: "A reading stimulus with one or more linked questions.",
    order: 4,
  },
  {
    key: "listening_task",
    label: "Listening task",
    description: "An audio stimulus with one or more linked questions.",
    order: 5,
  },
  {
    key: "writing_task",
    label: "Writing task",
    description: "A writing prompt, scaffold, draft, or upload task.",
    order: 6,
  },
  {
    key: "speaking_task",
    label: "Speaking task",
    description: "Role play, photo card, conversation, recording, or prep work.",
    order: 7,
  },
  {
    key: "mock_exam_section",
    label: "Mock exam section",
    description: "A section within a mock exam attempt.",
    order: 8,
  },
  {
    key: "assignment_task",
    label: "Assignment task",
    description: "A teacher-assigned task or question.",
    order: 9,
  },
] as const satisfies readonly QuestionTaskContext[];

export const QUESTION_INTERACTION_TYPES = [
  {
    key: "single_choice",
    label: "Single choice",
    description: "Student selects one correct option.",
    defaultInputMode: "select",
    responseLanguage: "none",
    defaultMarkingMode: "auto_exact",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 1,
  },
  {
    key: "multi_select",
    label: "Multi-select",
    description: "Student selects multiple correct options.",
    defaultInputMode: "multi_select",
    responseLanguage: "none",
    defaultMarkingMode: "auto_exact",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 2,
  },
  {
    key: "true_false_not_mentioned",
    label: "True / false / not mentioned",
    description: "Student classifies statements as true, false, or not mentioned.",
    defaultInputMode: "select",
    responseLanguage: "none",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 3,
  },
  {
    key: "matching",
    label: "Matching",
    description: "Student matches prompts to options.",
    defaultInputMode: "select",
    responseLanguage: "none",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 4,
  },
  {
    key: "categorisation",
    label: "Categorisation",
    description: "Student sorts items into categories.",
    defaultInputMode: "drag_or_tap",
    responseLanguage: "none",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: false,
    order: 5,
  },
  {
    key: "ordering",
    label: "Ordering",
    description: "Student orders events, words, phrases, or sentences.",
    defaultInputMode: "drag_or_tap",
    responseLanguage: "none",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 6,
  },
  {
    key: "word_bank_gap_fill",
    label: "Word-bank gap fill",
    description: "Student fills gaps using provided words or phrases.",
    defaultInputMode: "drag_or_tap",
    responseLanguage: "mixed",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 7,
  },
  {
    key: "dropdown_gap_fill",
    label: "Dropdown gap fill",
    description: "Student chooses one option for each gap.",
    defaultInputMode: "select",
    responseLanguage: "mixed",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 8,
  },
  {
    key: "table_completion",
    label: "Table completion",
    description: "Student completes table cells, preferably using choices.",
    defaultInputMode: "select",
    responseLanguage: "mixed",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 9,
  },
  {
    key: "click_text",
    label: "Click text",
    description: "Student clicks words or phrases in a stimulus text.",
    defaultInputMode: "tap",
    responseLanguage: "none",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: false,
    order: 10,
  },
  {
    key: "opinion_recognition",
    label: "Opinion recognition",
    description: "Student identifies opinion, attitude, or polarity.",
    defaultInputMode: "select",
    responseLanguage: "none",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 11,
  },
  {
    key: "speaker_identification",
    label: "Speaker identification",
    description: "Student links details, opinions, or statements to speakers.",
    defaultInputMode: "select",
    responseLanguage: "none",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 12,
  },
  {
    key: "sentence_builder",
    label: "Sentence builder",
    description: "Student builds a sentence from selectable tiles.",
    defaultInputMode: "drag_or_tap",
    responseLanguage: "russian",
    defaultMarkingMode: "auto_normalized_text",
    requiresRussianTyping: false,
    isExamAligned: false,
    order: 13,
  },
  {
    key: "phrase_builder",
    label: "Phrase builder",
    description: "Student builds a phrase from selectable tiles.",
    defaultInputMode: "drag_or_tap",
    responseLanguage: "russian",
    defaultMarkingMode: "auto_normalized_text",
    requiresRussianTyping: false,
    isExamAligned: false,
    order: 14,
  },
  {
    key: "translation_en_ru_tiles",
    label: "Translation into Russian with tiles",
    description: "Student translates into Russian using provided tiles.",
    defaultInputMode: "drag_or_tap",
    responseLanguage: "russian",
    defaultMarkingMode: "auto_normalized_text",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 15,
  },
  {
    key: "grammar_form_selection",
    label: "Grammar form selection",
    description: "Student chooses the correct grammar form from options.",
    defaultInputMode: "select",
    responseLanguage: "russian",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: false,
    order: 16,
  },
  {
    key: "verb_form_selection",
    label: "Verb form selection",
    description: "Student chooses the correct verb form from options.",
    defaultInputMode: "select",
    responseLanguage: "russian",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: false,
    order: 17,
  },
  {
    key: "sentence_transformation_tiles",
    label: "Sentence transformation with tiles",
    description: "Student transforms a sentence using provided words or phrases.",
    defaultInputMode: "drag_or_tap",
    responseLanguage: "russian",
    defaultMarkingMode: "auto_normalized_text",
    requiresRussianTyping: false,
    isExamAligned: false,
    order: 18,
  },
  {
    key: "error_spotting",
    label: "Error spotting",
    description: "Student identifies an error in a word, phrase, or sentence.",
    defaultInputMode: "tap",
    responseLanguage: "none",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: false,
    order: 19,
  },
  {
    key: "error_correction_selection",
    label: "Error correction selection",
    description: "Student corrects an error by selecting from provided options.",
    defaultInputMode: "select",
    responseLanguage: "russian",
    defaultMarkingMode: "auto_structured",
    requiresRussianTyping: false,
    isExamAligned: false,
    order: 20,
  },
  {
    key: "short_answer_en",
    label: "Short answer in English",
    description: "Student types a concise English answer.",
    defaultInputMode: "type_english",
    responseLanguage: "english",
    defaultMarkingMode: "auto_normalized_text",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 21,
  },
  {
    key: "note_completion_en",
    label: "Note completion in English",
    description: "Student types short English notes or details.",
    defaultInputMode: "type_english",
    responseLanguage: "english",
    defaultMarkingMode: "auto_normalized_text",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 22,
  },
  {
    key: "translation_ru_en",
    label: "Translation into English",
    description: "Student translates Russian text into English.",
    defaultInputMode: "type_english",
    responseLanguage: "english",
    defaultMarkingMode: "teacher_marked",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 23,
  },
  {
    key: "summary_answer_en",
    label: "Summary answer in English",
    description: "Student writes a concise English summary of meaning.",
    defaultInputMode: "type_english",
    responseLanguage: "english",
    defaultMarkingMode: "teacher_marked",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 24,
  },
  {
    key: "writing_upload",
    label: "Writing upload",
    description: "Student uploads handwritten writing for review.",
    defaultInputMode: "upload",
    responseLanguage: "russian",
    defaultMarkingMode: "teacher_marked",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 25,
  },
  {
    key: "writing_draft_optional",
    label: "Optional writing draft",
    description: "Student may type a draft or planning notes.",
    defaultInputMode: "type_russian_optional",
    responseLanguage: "mixed",
    defaultMarkingMode: "teacher_marked",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 26,
  },
  {
    key: "speaking_recording",
    label: "Speaking recording",
    description: "Student records spoken Russian for review.",
    defaultInputMode: "record",
    responseLanguage: "russian",
    defaultMarkingMode: "teacher_marked",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 27,
  },
  {
    key: "speaking_prep_notes",
    label: "Speaking prep notes",
    description: "Student prepares notes before a speaking response.",
    defaultInputMode: "type_english",
    responseLanguage: "english",
    defaultMarkingMode: "manual",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 28,
  },
  {
    key: "role_play_response",
    label: "Role play response",
    description: "Student responds to role-play prompts.",
    defaultInputMode: "record",
    responseLanguage: "russian",
    defaultMarkingMode: "teacher_marked",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 29,
  },
  {
    key: "photo_card_response",
    label: "Photo card response",
    description: "Student responds to photo-card prompts.",
    defaultInputMode: "record",
    responseLanguage: "russian",
    defaultMarkingMode: "teacher_marked",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 30,
  },
  {
    key: "conversation_response",
    label: "Conversation response",
    description: "Student responds to conversation prompts.",
    defaultInputMode: "record",
    responseLanguage: "russian",
    defaultMarkingMode: "teacher_marked",
    requiresRussianTyping: false,
    isExamAligned: true,
    order: 31,
  },
  {
    key: "manual_marked_response",
    label: "Manual marked response",
    description: "Generic migration-only response for unusual tasks.",
    defaultInputMode: "manual",
    responseLanguage: "mixed",
    defaultMarkingMode: "manual",
    requiresRussianTyping: false,
    isExamAligned: false,
    order: 32,
  },
] as const satisfies readonly QuestionInteractionType[];

export const EXISTING_QUESTION_SET_COMPATIBILITY = [
  {
    sourceSystem: "question_set",
    existingType: "multiple_choice",
    recommendedInteractionTypes: ["single_choice"],
    status: "covered",
    russianTypingRisk: "none",
    notes: "Current reusable question-set MCQ maps cleanly to single choice.",
  },
  {
    sourceSystem: "question_set",
    existingType: "short_answer",
    recommendedInteractionTypes: ["short_answer_en", "note_completion_en"],
    status: "covered",
    russianTypingRisk: "medium",
    notes: "Keep for English responses. Avoid authoring Russian typed answers by default.",
  },
  {
    sourceSystem: "question_set",
    existingType: "translation",
    existingAnswerStrategy: "text_input",
    recommendedInteractionTypes: ["translation_ru_en", "manual_marked_response"],
    status: "partial",
    russianTypingRisk: "high",
    notes: "Safe for Russian-to-English. English-to-Russian text input should become optional or upload-based.",
  },
  {
    sourceSystem: "question_set",
    existingType: "translation",
    existingAnswerStrategy: "sentence_builder",
    recommendedInteractionTypes: ["translation_en_ru_tiles", "sentence_builder"],
    status: "covered",
    russianTypingRisk: "none",
    notes: "Promote this metadata strategy to a first-class interaction.",
  },
  {
    sourceSystem: "question_set",
    existingType: "translation",
    existingAnswerStrategy: "selection_based",
    recommendedInteractionTypes: [
      "dropdown_gap_fill",
      "grammar_form_selection",
      "word_bank_gap_fill",
    ],
    status: "partial",
    russianTypingRisk: "none",
    notes: "Useful digital-first pattern, but currently hidden inside translation metadata.",
  },
  {
    sourceSystem: "question_set",
    existingType: "translation",
    existingAnswerStrategy: "upload_required",
    recommendedInteractionTypes: ["writing_upload"],
    status: "needs_new_interaction",
    russianTypingRisk: "none",
    notes: "Currently renders as an unsupported placeholder.",
  },
] as const satisfies readonly ExistingQuestionTypeCompatibility[];

export const EXISTING_MOCK_EXAM_COMPATIBILITY = [
  {
    sourceSystem: "mock_exam",
    existingType: "multiple_choice",
    recommendedInteractionTypes: ["single_choice"],
    status: "covered",
    russianTypingRisk: "none",
    notes: "Current mock exam response UI supports radio selection.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "multiple_response",
    recommendedInteractionTypes: ["multi_select"],
    status: "covered",
    russianTypingRisk: "none",
    notes: "Current mock exam response UI supports checkboxes.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "short_answer",
    recommendedInteractionTypes: ["short_answer_en"],
    status: "covered",
    russianTypingRisk: "medium",
    notes: "Suitable for English short answers. Should not be the default for Russian answers.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "gap_fill",
    recommendedInteractionTypes: ["word_bank_gap_fill", "dropdown_gap_fill"],
    status: "needs_new_interaction",
    russianTypingRisk: "medium",
    notes: "Current UI uses text inputs; future UI should offer selectable words by default.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "matching",
    recommendedInteractionTypes: ["matching", "speaker_identification"],
    status: "covered",
    russianTypingRisk: "none",
    notes: "Current mock UI supports select-based matching; make shared later.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "sequencing",
    recommendedInteractionTypes: ["ordering"],
    status: "needs_new_interaction",
    russianTypingRisk: "none",
    notes: "Current UI asks for comma-separated numbers; replace with tap/drag ordering.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "opinion_recognition",
    recommendedInteractionTypes: ["opinion_recognition"],
    status: "covered",
    russianTypingRisk: "none",
    notes: "Current mock UI supports statement-level select controls.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "true_false_not_mentioned",
    recommendedInteractionTypes: ["true_false_not_mentioned"],
    status: "covered",
    russianTypingRisk: "none",
    notes: "Current mock UI supports statement-level select controls.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "translation_into_english",
    recommendedInteractionTypes: ["translation_ru_en"],
    status: "partial",
    russianTypingRisk: "none",
    notes: "Current UI falls back to textarea and manual marking.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "translation_into_russian",
    recommendedInteractionTypes: ["translation_en_ru_tiles", "writing_upload"],
    status: "needs_new_interaction",
    russianTypingRisk: "high",
    notes: "Avoid default typed Cyrillic; use tiles for controlled practice and uploads for exam writing.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "writing_task",
    recommendedInteractionTypes: ["writing_upload", "writing_draft_optional"],
    status: "needs_new_interaction",
    russianTypingRisk: "high",
    notes: "Needs upload workflow and rubric metadata.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "simple_sentences",
    recommendedInteractionTypes: [
      "writing_upload",
      "sentence_builder",
      "writing_draft_optional",
    ],
    status: "partial",
    russianTypingRisk: "high",
    notes: "Can be scaffolded digitally before becoming an upload or optional draft task.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "short_paragraph",
    recommendedInteractionTypes: ["writing_upload", "writing_draft_optional"],
    status: "needs_new_interaction",
    russianTypingRisk: "high",
    notes: "Needs writing workflow and rubric metadata.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "extended_writing",
    recommendedInteractionTypes: ["writing_upload", "writing_draft_optional"],
    status: "needs_new_interaction",
    russianTypingRisk: "high",
    notes: "Needs writing workflow and rubric metadata.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "role_play",
    recommendedInteractionTypes: [
      "role_play_response",
      "speaking_prep_notes",
      "speaking_recording",
    ],
    status: "needs_new_interaction",
    russianTypingRisk: "none",
    notes: "Needs speaking prep and recording workflow.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "photo_card",
    recommendedInteractionTypes: [
      "photo_card_response",
      "speaking_prep_notes",
      "speaking_recording",
    ],
    status: "needs_new_interaction",
    russianTypingRisk: "none",
    notes: "Needs image prompt, prep notes, and recording workflow.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "conversation",
    recommendedInteractionTypes: ["conversation_response", "speaking_recording"],
    status: "needs_new_interaction",
    russianTypingRisk: "none",
    notes: "Needs speaking response workflow.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "sentence_builder",
    recommendedInteractionTypes: ["sentence_builder", "translation_en_ru_tiles"],
    status: "partial",
    russianTypingRisk: "none",
    notes: "Auto-marking exists, but response UI currently falls back to textarea.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "note_completion",
    recommendedInteractionTypes: ["note_completion_en", "word_bank_gap_fill"],
    status: "partial",
    russianTypingRisk: "low",
    notes: "Current UI uses text inputs; choices should be available for Russian content.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "listening_comprehension",
    recommendedInteractionTypes: ["manual_marked_response"],
    status: "partial",
    russianTypingRisk: "none",
    notes: "Should become a listening task parent with child interaction questions.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "reading_comprehension",
    recommendedInteractionTypes: ["manual_marked_response"],
    status: "partial",
    russianTypingRisk: "none",
    notes: "Should become a reading task parent with child interaction questions.",
  },
  {
    sourceSystem: "mock_exam",
    existingType: "other",
    recommendedInteractionTypes: ["manual_marked_response"],
    status: "migration_only",
    russianTypingRisk: "medium",
    notes: "Keep only as an escape hatch during migration.",
  },
] as const satisfies readonly ExistingQuestionTypeCompatibility[];

export const EXISTING_QUESTION_TYPE_COMPATIBILITY = [
  ...EXISTING_QUESTION_SET_COMPATIBILITY,
  ...EXISTING_MOCK_EXAM_COMPATIBILITY,
] as const satisfies readonly ExistingQuestionTypeCompatibility[];

