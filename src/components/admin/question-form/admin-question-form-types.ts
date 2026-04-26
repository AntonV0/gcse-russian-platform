export type AdminQuestionType =
  | "multiple_choice"
  | "multiple_response"
  | "short_answer"
  | "translation"
  | "matching"
  | "ordering"
  | "word_bank_gap_fill"
  | "categorisation";

export type AdminQuestionAnswerStrategy =
  | "text_input"
  | "selection_based"
  | "sentence_builder"
  | "upload_required";

export type AdminQuestionDefaultValues = {
  questionType?: AdminQuestionType;
  answerStrategy?: AdminQuestionAnswerStrategy;
  prompt?: string;
  explanation?: string;
  marks?: string;
  position?: string;
  audioPath?: string;
  isActive?: boolean;
  translationDirection?: "" | "to_russian" | "to_english";
  placeholder?: string;
  sourceLanguageLabel?: string;
  targetLanguageLabel?: string;
  instruction?: string;
  selectionDisplayMode?: "grouped" | "inline_gaps";
  selectionGroupsText?: string;
  wordBankText?: string;
  ignorePunctuation?: boolean;
  ignoreArticles?: boolean;
  collapseWhitespace?: boolean;
  maxPlays?: string;
  listeningMode?: boolean;
  autoPlay?: boolean;
  hideNativeControls?: boolean;
  requireAudioCompletionBeforeSubmit?: boolean;
  optionsText?: string;
  correctOptionIndex?: string;
  correctOptionIndexes?: string;
  acceptedAnswersText?: string;
  matchingPromptsText?: string;
  matchingOptionsText?: string;
  correctMatchesText?: string;
  orderingItemsText?: string;
  correctOrderText?: string;
  gapFillText?: string;
  gapsText?: string;
  categoriesText?: string;
  categorisationItemsText?: string;
  metadata?: string;
};

export type AdminQuestionFormProps = {
  mode: "create" | "edit";
  action: (formData: FormData) => void | Promise<void>;
  questionSetId: string;
  questionId?: string;
  defaultValues?: AdminQuestionDefaultValues;
  submitLabel?: string;
};
