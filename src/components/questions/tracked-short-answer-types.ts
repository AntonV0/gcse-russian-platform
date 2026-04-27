import type { SelectionGroup } from "@/components/questions/selection-based-block";

export type TranslationDirection = "to_russian" | "to_english";

export type AnswerStrategy =
  | "text_input"
  | "selection_based"
  | "sentence_builder"
  | "upload_required";

export type TranslationUiConfig = {
  direction?: TranslationDirection;
  sourceLanguageLabel?: string;
  targetLanguageLabel?: string;
  instruction?: string;
  placeholder?: string;
};

export type SentenceBuilderUiConfig = {
  wordBank?: string[];
};

export type SelectionBasedUiConfig = {
  groups?: SelectionGroup[];
  displayMode?: "grouped" | "inline_gaps";
};

export type ListeningUiConfig = {
  maxPlays?: number;
  listeningMode?: boolean;
  autoPlay?: boolean;
  hideNativeControls?: boolean;
  requireAudioCompletionBeforeSubmit?: boolean;
};

export type TrackedShortAnswerBlockProps = {
  questionId: string;
  lessonId?: string | null;
  question: string;
  questionType?: "short_answer" | "translation";
  explanation?: string;
  placeholder?: string;
  translationUi?: TranslationUiConfig;
  sentenceBuilderUi?: SentenceBuilderUiConfig;
  selectionBasedUi?: SelectionBasedUiConfig;
  audioUrl?: string | null;
  listeningUi?: ListeningUiConfig;
  answerStrategy?: AnswerStrategy;
};
