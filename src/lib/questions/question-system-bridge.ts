import type {
  ExistingQuestionSetAnswerStrategyKey,
  ExistingQuestionSetTypeKey,
  QuestionCompatibilityStatus,
  QuestionInputModeKey,
  QuestionInteractionTypeKey,
  QuestionMarkingModeKey,
  QuestionResponseLanguageKey,
  QuestionTaskContextKey,
} from "@/lib/curriculum";
import { QUESTION_INTERACTION_TYPES } from "@/lib/curriculum";
import type { MockExamQuestionType } from "@/lib/mock-exams/mock-exam-helpers-db";

export type QuestionSystemSource = "question_set" | "mock_exam";

export type QuestionDesignBridge = {
  sourceSystem: QuestionSystemSource;
  sourceType: string;
  sourceAnswerStrategy?: string;
  taskContext: QuestionTaskContextKey;
  interactionType: QuestionInteractionTypeKey;
  secondaryInteractionTypes: QuestionInteractionTypeKey[];
  inputMode: QuestionInputModeKey;
  responseLanguage: QuestionResponseLanguageKey;
  markingMode: QuestionMarkingModeKey;
  requiresRussianTyping: boolean;
  status: QuestionCompatibilityStatus;
  notes: string;
};

type BridgeDefinition = {
  taskContext: QuestionTaskContextKey;
  interactionType: QuestionInteractionTypeKey;
  secondaryInteractionTypes?: QuestionInteractionTypeKey[];
  status: QuestionCompatibilityStatus;
  notes: string;
};

const interactionDefaults = new Map(
  QUESTION_INTERACTION_TYPES.map((interaction) => [interaction.key, interaction])
);

const QUESTION_SET_BRIDGE = {
  multiple_choice: {
    taskContext: "question_set",
    interactionType: "single_choice",
    status: "covered",
    notes:
      "Reusable question-set multiple choice maps to the shared single-choice interaction.",
  },
  short_answer: {
    taskContext: "question_set",
    interactionType: "short_answer_en",
    secondaryInteractionTypes: ["note_completion_en"],
    status: "covered",
    notes: "Keep for English responses; avoid Russian typed answers as the default.",
  },
  translation: {
    taskContext: "question_set",
    interactionType: "translation_ru_en",
    secondaryInteractionTypes: ["translation_en_ru_tiles", "sentence_builder"],
    status: "partial",
    notes:
      "Translation needs direction-specific metadata so Russian production can use tiles or upload.",
  },
} as const satisfies Record<ExistingQuestionSetTypeKey, BridgeDefinition>;

const QUESTION_SET_STRATEGY_BRIDGE = {
  text_input: {
    taskContext: "question_set",
    interactionType: "translation_ru_en",
    secondaryInteractionTypes: ["manual_marked_response"],
    status: "partial",
    notes:
      "Text input is suitable for Russian-to-English; English-to-Russian should not default to Cyrillic typing.",
  },
  selection_based: {
    taskContext: "question_set",
    interactionType: "word_bank_gap_fill",
    secondaryInteractionTypes: ["dropdown_gap_fill", "grammar_form_selection"],
    status: "partial",
    notes:
      "Selection-based translation metadata should become a first-class structured interaction.",
  },
  sentence_builder: {
    taskContext: "question_set",
    interactionType: "translation_en_ru_tiles",
    secondaryInteractionTypes: ["sentence_builder"],
    status: "covered",
    notes:
      "Sentence-builder translation already matches the digital-first Russian input principle.",
  },
  upload_required: {
    taskContext: "writing_task",
    interactionType: "writing_upload",
    status: "needs_new_interaction",
    notes: "Upload-required translation should move into the writing upload workflow.",
  },
} as const satisfies Record<ExistingQuestionSetAnswerStrategyKey, BridgeDefinition>;

export const MOCK_EXAM_QUESTION_BRIDGE = {
  multiple_choice: {
    taskContext: "mock_exam_section",
    interactionType: "single_choice",
    status: "covered",
    notes: "Radio-style objective question.",
  },
  multiple_response: {
    taskContext: "mock_exam_section",
    interactionType: "multi_select",
    status: "covered",
    notes: "Checkbox-style objective question.",
  },
  short_answer: {
    taskContext: "mock_exam_section",
    interactionType: "short_answer_en",
    status: "covered",
    notes: "Best used for English comprehension answers.",
  },
  gap_fill: {
    taskContext: "mock_exam_section",
    interactionType: "word_bank_gap_fill",
    secondaryInteractionTypes: ["dropdown_gap_fill"],
    status: "partial",
    notes: "Use selectable words by default when gaps contain Russian.",
  },
  matching: {
    taskContext: "mock_exam_section",
    interactionType: "matching",
    secondaryInteractionTypes: ["speaker_identification"],
    status: "covered",
    notes: "Can be shared with speaker-identification tasks.",
  },
  sequencing: {
    taskContext: "mock_exam_section",
    interactionType: "ordering",
    status: "needs_new_interaction",
    notes: "Should use tap or drag ordering rather than typed index lists.",
  },
  opinion_recognition: {
    taskContext: "mock_exam_section",
    interactionType: "opinion_recognition",
    status: "covered",
    notes: "Statement-level polarity or attitude selection.",
  },
  true_false_not_mentioned: {
    taskContext: "mock_exam_section",
    interactionType: "true_false_not_mentioned",
    status: "covered",
    notes: "Standard GCSE reading/listening classification.",
  },
  translation_into_english: {
    taskContext: "mock_exam_section",
    interactionType: "translation_ru_en",
    status: "partial",
    notes: "Typed English is acceptable, but marking needs rubric/mark-scheme metadata.",
  },
  translation_into_russian: {
    taskContext: "mock_exam_section",
    interactionType: "translation_en_ru_tiles",
    secondaryInteractionTypes: ["writing_upload"],
    status: "needs_new_interaction",
    notes:
      "Avoid default Cyrillic typing; use tiles for controlled tasks or upload for open writing.",
  },
  writing_task: {
    taskContext: "writing_task",
    interactionType: "writing_upload",
    secondaryInteractionTypes: ["writing_draft_optional"],
    status: "needs_new_interaction",
    notes: "Needs upload/draft workflow and rubric metadata.",
  },
  simple_sentences: {
    taskContext: "writing_task",
    interactionType: "sentence_builder",
    secondaryInteractionTypes: ["writing_upload", "writing_draft_optional"],
    status: "partial",
    notes: "Can begin as scaffolded sentence building before open writing.",
  },
  short_paragraph: {
    taskContext: "writing_task",
    interactionType: "writing_upload",
    secondaryInteractionTypes: ["writing_draft_optional"],
    status: "needs_new_interaction",
    notes: "Needs upload/draft workflow and rubric metadata.",
  },
  extended_writing: {
    taskContext: "writing_task",
    interactionType: "writing_upload",
    secondaryInteractionTypes: ["writing_draft_optional"],
    status: "needs_new_interaction",
    notes: "Needs upload/draft workflow and rubric metadata.",
  },
  role_play: {
    taskContext: "speaking_task",
    interactionType: "role_play_response",
    secondaryInteractionTypes: ["speaking_prep_notes", "speaking_recording"],
    status: "needs_new_interaction",
    notes: "Needs prep, recording, and teacher/AI-assisted marking metadata.",
  },
  photo_card: {
    taskContext: "speaking_task",
    interactionType: "photo_card_response",
    secondaryInteractionTypes: ["speaking_prep_notes", "speaking_recording"],
    status: "needs_new_interaction",
    notes: "Needs image prompt, prep, recording, and marking metadata.",
  },
  conversation: {
    taskContext: "speaking_task",
    interactionType: "conversation_response",
    secondaryInteractionTypes: ["speaking_recording"],
    status: "needs_new_interaction",
    notes: "Needs recording workflow and speaking criteria metadata.",
  },
  sentence_builder: {
    taskContext: "mock_exam_section",
    interactionType: "sentence_builder",
    secondaryInteractionTypes: ["translation_en_ru_tiles"],
    status: "partial",
    notes: "Should share the same tile builder as question sets.",
  },
  note_completion: {
    taskContext: "mock_exam_section",
    interactionType: "note_completion_en",
    secondaryInteractionTypes: ["word_bank_gap_fill"],
    status: "partial",
    notes: "English notes can be typed; Russian notes should use choices.",
  },
  listening_comprehension: {
    taskContext: "listening_task",
    interactionType: "speaker_identification",
    secondaryInteractionTypes: [
      "single_choice",
      "matching",
      "true_false_not_mentioned",
      "opinion_recognition",
      "short_answer_en",
    ],
    status: "partial",
    notes: "Parent audio stimulus should hold child objective interactions.",
  },
  reading_comprehension: {
    taskContext: "reading_task",
    interactionType: "short_answer_en",
    secondaryInteractionTypes: [
      "single_choice",
      "matching",
      "true_false_not_mentioned",
      "opinion_recognition",
      "word_bank_gap_fill",
    ],
    status: "partial",
    notes: "Parent text stimulus should hold child objective interactions.",
  },
  other: {
    taskContext: "mock_exam_section",
    interactionType: "manual_marked_response",
    status: "migration_only",
    notes: "Migration-only escape hatch.",
  },
} as const satisfies Record<MockExamQuestionType, BridgeDefinition>;

function createBridge(
  sourceSystem: QuestionSystemSource,
  sourceType: string,
  definition: BridgeDefinition,
  sourceAnswerStrategy?: string
): QuestionDesignBridge {
  const interaction = interactionDefaults.get(definition.interactionType);

  if (!interaction) {
    throw new Error(
      `Missing question interaction defaults for ${definition.interactionType}`
    );
  }

  return {
    sourceSystem,
    sourceType,
    sourceAnswerStrategy,
    taskContext: definition.taskContext,
    interactionType: definition.interactionType,
    secondaryInteractionTypes: definition.secondaryInteractionTypes ?? [],
    inputMode: interaction.defaultInputMode,
    responseLanguage: interaction.responseLanguage,
    markingMode: interaction.defaultMarkingMode,
    requiresRussianTyping: interaction.requiresRussianTyping,
    status: definition.status,
    notes: definition.notes,
  };
}

export function getQuestionSetDesignBridge(params: {
  questionType: ExistingQuestionSetTypeKey;
  answerStrategy?: ExistingQuestionSetAnswerStrategyKey | null;
}) {
  const definition = params.answerStrategy
    ? QUESTION_SET_STRATEGY_BRIDGE[params.answerStrategy]
    : QUESTION_SET_BRIDGE[params.questionType];

  return createBridge(
    "question_set",
    params.questionType,
    definition,
    params.answerStrategy ?? undefined
  );
}

export function getMockExamQuestionDesignBridge(questionType: MockExamQuestionType) {
  return createBridge("mock_exam", questionType, MOCK_EXAM_QUESTION_BRIDGE[questionType]);
}
