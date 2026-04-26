import type {
  QuestionInteractionTypeKey,
  QuestionMarkingModeKey,
  QuestionResponseLanguageKey,
  QuestionTaskContextKey,
  TierKey,
} from "@/lib/curriculum";

export type QuestionStimulusKind = "text" | "audio" | "image" | "mixed";

export type QuestionTaskStimulus = {
  kind: QuestionStimulusKind;
  title?: string;
  text?: string;
  audioUrl?: string;
  imageUrl?: string;
  transcript?: string;
  childQuestionSetSlug?: string;
  replayLimit?: number;
};

export type ReadingListeningTaskMetadata = {
  taskContext: "reading_task" | "listening_task";
  stimulus: QuestionTaskStimulus;
  childInteractionTypes: QuestionInteractionTypeKey[];
  timeLimitSeconds?: number;
};

export type ResponseWorkflowMetadata = {
  responseMode:
    | "objective"
    | "short_text"
    | "word_bank"
    | "tile_builder"
    | "handwriting_upload"
    | "typed_draft_optional"
    | "audio_recording"
    | "teacher_marked_manual";
  uploadRequired?: boolean;
  allowTypedDraft?: boolean;
  allowAudioRecording?: boolean;
};

export type MarkingCriterionMetadata = {
  label: string;
  description: string;
  marks?: number;
};

export type LongResponseMarkingMetadata = {
  criteria?: MarkingCriterionMetadata[];
  levelDescriptors?: MarkingCriterionMetadata[];
  markSchemeReference?: string;
  wordCountGuidance?: string;
  aiMarkingNotes?: string;
};

export type LongResponseTaskMetadata = {
  taskContext: "writing_task" | "speaking_task";
  tier?: TierKey;
  interactionType: QuestionInteractionTypeKey;
  responseLanguage: QuestionResponseLanguageKey;
  markingMode: QuestionMarkingModeKey;
  responseWorkflow: ResponseWorkflowMetadata;
  markingMetadata?: LongResponseMarkingMetadata;
};

export type QuestionDesignMetadata = {
  taskContext: QuestionTaskContextKey;
  interactionType: QuestionInteractionTypeKey;
  responseLanguage: QuestionResponseLanguageKey;
  markingMode: QuestionMarkingModeKey;
  requiresRussianTyping: boolean;
};

export const DEFAULT_READING_LISTENING_CHILD_INTERACTIONS = [
  "single_choice",
  "multi_select",
  "matching",
  "word_bank_gap_fill",
  "short_answer_en",
  "true_false_not_mentioned",
  "opinion_recognition",
  "speaker_identification",
] as const satisfies readonly QuestionInteractionTypeKey[];

export function createReadingTaskMetadata(params: {
  text: string;
  childQuestionSetSlug?: string;
  timeLimitSeconds?: number;
}): ReadingListeningTaskMetadata {
  return {
    taskContext: "reading_task",
    stimulus: {
      kind: "text",
      text: params.text,
      childQuestionSetSlug: params.childQuestionSetSlug,
    },
    childInteractionTypes: [...DEFAULT_READING_LISTENING_CHILD_INTERACTIONS],
    timeLimitSeconds: params.timeLimitSeconds,
  };
}

export function createListeningTaskMetadata(params: {
  audioUrl: string;
  transcript?: string;
  childQuestionSetSlug?: string;
  replayLimit?: number;
  timeLimitSeconds?: number;
}): ReadingListeningTaskMetadata {
  return {
    taskContext: "listening_task",
    stimulus: {
      kind: "audio",
      audioUrl: params.audioUrl,
      transcript: params.transcript,
      childQuestionSetSlug: params.childQuestionSetSlug,
      replayLimit: params.replayLimit,
    },
    childInteractionTypes: [...DEFAULT_READING_LISTENING_CHILD_INTERACTIONS],
    timeLimitSeconds: params.timeLimitSeconds,
  };
}
