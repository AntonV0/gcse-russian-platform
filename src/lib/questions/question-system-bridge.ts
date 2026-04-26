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
import { MOCK_EXAM_QUESTION_BRIDGE } from "@/lib/questions/mock-exam-question-bridge";

export { MOCK_EXAM_QUESTION_BRIDGE } from "@/lib/questions/mock-exam-question-bridge";

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

export type BridgeDefinition = {
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
