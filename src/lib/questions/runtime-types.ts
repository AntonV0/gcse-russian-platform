import type { DbQuestionSet } from "@/lib/questions/question-db-types";

export type SupportedQuestionType =
  | "multiple_choice"
  | "multiple_response"
  | "short_answer"
  | "translation"
  | "matching"
  | "ordering"
  | "word_bank_gap_fill"
  | "categorisation";

export type RuntimeQuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  position: number;
};

export type RuntimeAcceptedAnswer = {
  id: string;
  text: string;
  normalizedText: string;
  isPrimary: boolean;
  caseSensitive: boolean;
  notes: string | null;
};

export type RuntimeQuestionBase = {
  id: string;
  questionSetId: string;
  type: SupportedQuestionType;
  prompt: string;
  promptRich: unknown;
  explanation: string | null;
  difficulty: number | null;
  marks: number;
  audioPath: string | null;
  imagePath: string | null;
  metadata: Record<string, unknown>;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RuntimeMultipleChoiceQuestion = RuntimeQuestionBase & {
  type: "multiple_choice";
  options: RuntimeQuestionOption[];
  correctOptionId: string | null;
};

export type RuntimeMultipleResponseQuestion = RuntimeQuestionBase & {
  type: "multiple_response";
  options: RuntimeQuestionOption[];
  correctOptionIds: string[];
};

export type RuntimeTextQuestion = RuntimeQuestionBase & {
  type: "short_answer" | "translation";
  acceptedAnswers: RuntimeAcceptedAnswer[];
};

export type RuntimeMatchingPrompt = {
  id: string;
  text: string;
};

export type RuntimeMatchingOption = {
  id: string;
  text: string;
};

export type RuntimeMatchingQuestion = RuntimeQuestionBase & {
  type: "matching";
  prompts: RuntimeMatchingPrompt[];
  options: RuntimeMatchingOption[];
  correctMatches: Record<string, string>;
};

export type RuntimeOrderingItem = {
  id: string;
  text: string;
};

export type RuntimeOrderingQuestion = RuntimeQuestionBase & {
  type: "ordering";
  items: RuntimeOrderingItem[];
  correctOrder: string[];
};

export type RuntimeWordBankGap = {
  id: string;
  label: string;
  acceptedAnswers: string[];
};

export type RuntimeWordBankGapFillQuestion = RuntimeQuestionBase & {
  type: "word_bank_gap_fill";
  text: string | null;
  gaps: RuntimeWordBankGap[];
  wordBank: string[];
};

export type RuntimeCategorisationCategory = {
  id: string;
  label: string;
};

export type RuntimeCategorisationItem = {
  id: string;
  text: string;
  categoryId: string;
};

export type RuntimeCategorisationQuestion = RuntimeQuestionBase & {
  type: "categorisation";
  categories: RuntimeCategorisationCategory[];
  items: RuntimeCategorisationItem[];
};

export type RuntimeStructuredQuestion =
  | RuntimeMultipleResponseQuestion
  | RuntimeMatchingQuestion
  | RuntimeOrderingQuestion
  | RuntimeWordBankGapFillQuestion
  | RuntimeCategorisationQuestion;

export type RuntimeQuestion =
  | RuntimeMultipleChoiceQuestion
  | RuntimeTextQuestion
  | RuntimeStructuredQuestion;

export type RuntimeQuestionSet = {
  questionSet: DbQuestionSet;
  questions: RuntimeQuestion[];
};

export type QuestionFeedbackResult = {
  isCorrect: boolean;
  feedback: string | null;
  statusLabel: string;
  correctAnswerText: string | null;
  acceptedAnswerTexts: string[];
};

export type MultipleChoiceValidationResult = QuestionFeedbackResult & {
  selectedOptionId: string | null;
  selectedOptionText: string | null;
  correctOptionId: string | null;
};

export type TextValidationOptions = {
  ignorePunctuation?: boolean;
  ignoreArticles?: boolean;
  collapseWhitespace?: boolean;
};

export type TextValidationResult = QuestionFeedbackResult & {
  submittedText: string;
  normalizedSubmittedText: string;
  matchedAnswer: RuntimeAcceptedAnswer | null;
};

export type SentenceBuilderValidationResult = QuestionFeedbackResult & {
  submittedText: string;
  normalizedSubmittedText: string;
  submittedTokens: string[];
  expectedTokens: string[];
  matchedAnswer: RuntimeAcceptedAnswer | null;
};

export type StructuredValidationResult = QuestionFeedbackResult & {
  submittedPayload: Record<string, unknown>;
};
