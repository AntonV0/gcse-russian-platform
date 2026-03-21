import type {
  DbQuestion,
  DbQuestionAcceptedAnswer,
  DbQuestionOption,
  DbQuestionSet,
} from "@/lib/question-helpers-db";

export type SupportedQuestionType =
  | "multiple_choice"
  | "short_answer"
  | "translation";

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

type RuntimeQuestionBase = {
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

export type RuntimeTextQuestion = RuntimeQuestionBase & {
  type: "short_answer" | "translation";
  acceptedAnswers: RuntimeAcceptedAnswer[];
};

export type RuntimeQuestion =
  | RuntimeMultipleChoiceQuestion
  | RuntimeTextQuestion;

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

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function stripPunctuation(value: string) {
  return value.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»“”[\]\\|<>…]/g, " ");
}

function stripEnglishArticles(value: string) {
  return value.replace(/\b(a|an|the)\b/gi, " ");
}

export function normalizeFreeTextAnswer(
  value: string,
  options?: TextValidationOptions
) {
  let result = value.toLowerCase();

  if (options?.ignorePunctuation) {
    result = stripPunctuation(result);
  }

  if (options?.ignoreArticles) {
    result = stripEnglishArticles(result);
  }

  if (options?.collapseWhitespace !== false) {
    result = collapseWhitespace(result);
  } else {
    result = result.trim();
  }

  return result;
}

function dedupeTexts(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = normalizeFreeTextAnswer(value);

    if (normalized.length === 0 || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(value);
  }

  return result;
}

export function tokenizeSentenceBuilderText(value: string) {
  return collapseWhitespace(value)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

export function mapSupportedQuestionType(
  questionType: string
): SupportedQuestionType | null {
  switch (questionType) {
    case "multiple_choice":
    case "short_answer":
    case "translation":
      return questionType;
    default:
      return null;
  }
}

export function buildRuntimeQuestion(question: {
  question: DbQuestion;
  options: DbQuestionOption[];
  acceptedAnswers: DbQuestionAcceptedAnswer[];
}): RuntimeQuestion | null {
  const supportedType = mapSupportedQuestionType(question.question.question_type);

  if (!supportedType) {
    return null;
  }

  const base: RuntimeQuestionBase = {
    id: question.question.id,
    questionSetId: question.question.question_set_id,
    type: supportedType,
    prompt: question.question.prompt,
    promptRich: question.question.prompt_rich,
    explanation: question.question.explanation,
    difficulty: question.question.difficulty,
    marks: question.question.marks,
    audioPath: question.question.audio_path,
    imagePath: question.question.image_path,
    metadata: question.question.metadata,
    position: question.question.position,
    isActive: question.question.is_active,
    createdAt: question.question.created_at,
    updatedAt: question.question.updated_at,
  };

  if (supportedType === "multiple_choice") {
    const runtimeOptions: RuntimeQuestionOption[] = question.options.map(
      (option) => ({
        id: option.id,
        text: option.option_text ?? "",
        isCorrect: Boolean(option.is_correct),
        position: option.position,
      })
    );

    return {
      ...base,
      type: "multiple_choice",
      options: runtimeOptions,
      correctOptionId:
        runtimeOptions.find((option) => option.isCorrect)?.id ?? null,
    };
  }

  const runtimeAcceptedAnswers: RuntimeAcceptedAnswer[] =
    question.acceptedAnswers.map((answer) => ({
      id: answer.id,
      text: answer.answer_text,
      normalizedText:
        answer.normalized_answer ?? normalizeFreeTextAnswer(answer.answer_text),
      isPrimary: answer.is_primary,
      caseSensitive: answer.case_sensitive,
      notes: answer.notes,
    }));

  return {
    ...base,
    type: supportedType,
    acceptedAnswers: runtimeAcceptedAnswers,
  };
}

export function buildRuntimeQuestionSet(params: {
  questionSet: DbQuestionSet;
  questions: DbQuestion[];
  options: DbQuestionOption[];
  acceptedAnswers: DbQuestionAcceptedAnswer[];
}): RuntimeQuestionSet {
  const runtimeQuestions: RuntimeQuestion[] = params.questions
    .map((question) =>
      buildRuntimeQuestion({
        question,
        options: params.options.filter((option) => option.question_id === question.id),
        acceptedAnswers: params.acceptedAnswers.filter(
          (answer) => answer.question_id === question.id
        ),
      })
    )
    .filter((question): question is RuntimeQuestion => question !== null);

  return {
    questionSet: params.questionSet,
    questions: runtimeQuestions,
  };
}

export function validateMultipleChoiceAnswer(params: {
  question: RuntimeMultipleChoiceQuestion;
  selectedOptionId: string | null;
}): MultipleChoiceValidationResult {
  const { question, selectedOptionId } = params;

  const selectedOption =
    question.options.find((option) => option.id === selectedOptionId) ?? null;

  const correctOption =
    question.options.find((option) => option.id === question.correctOptionId) ?? null;

  const isCorrect =
    Boolean(selectedOptionId) && selectedOptionId === question.correctOptionId;

  return {
    isCorrect,
    selectedOptionId,
    selectedOptionText: selectedOption?.text ?? null,
    correctOptionId: question.correctOptionId,
    feedback: question.explanation,
    statusLabel: isCorrect ? "Correct." : "Not quite.",
    correctAnswerText: isCorrect ? null : (correctOption?.text ?? null),
    acceptedAnswerTexts: correctOption?.text ? [correctOption.text] : [],
  };
}

export function validateTextAnswer(params: {
  question: RuntimeTextQuestion;
  submittedText: string;
  options?: TextValidationOptions;
}): TextValidationResult {
  const submittedText = params.submittedText;
  const normalizedSubmittedText = normalizeFreeTextAnswer(
    submittedText,
    params.options
  );

  const matchedAnswer =
    params.question.acceptedAnswers.find((answer) => {
      if (answer.caseSensitive) {
        return collapseWhitespace(submittedText) === collapseWhitespace(answer.text);
      }

      const normalizedAnswer = normalizeFreeTextAnswer(
        answer.text,
        params.options
      );

      return normalizedSubmittedText === normalizedAnswer;
    }) ?? null;

  const acceptedAnswerTexts = dedupeTexts(
    params.question.acceptedAnswers.map((answer) => answer.text)
  );

  const primaryAnswer =
    params.question.acceptedAnswers.find((answer) => answer.isPrimary) ??
    params.question.acceptedAnswers[0] ??
    null;

  const isCorrect = matchedAnswer !== null;

  return {
    isCorrect,
    submittedText,
    normalizedSubmittedText,
    matchedAnswer,
    feedback: params.question.explanation,
    statusLabel: isCorrect ? "Correct." : "Not quite.",
    correctAnswerText: isCorrect ? null : (primaryAnswer?.text ?? null),
    acceptedAnswerTexts: isCorrect ? [] : acceptedAnswerTexts,
  };
}

export function validateSentenceBuilderAnswer(params: {
  question: RuntimeTextQuestion;
  submittedTokens: string[];
  options?: TextValidationOptions;
}): SentenceBuilderValidationResult {
  const submittedText = params.submittedTokens.join(" ");
  const normalizedSubmittedText = normalizeFreeTextAnswer(
    submittedText,
    params.options
  );

  const matchedAnswer =
    params.question.acceptedAnswers.find((answer) => {
      const normalizedAnswer = normalizeFreeTextAnswer(
        answer.text,
        params.options
      );
      return normalizedSubmittedText === normalizedAnswer;
    }) ?? null;

  const primaryAnswer =
    params.question.acceptedAnswers.find((answer) => answer.isPrimary) ??
    params.question.acceptedAnswers[0] ??
    null;

  const acceptedAnswerTexts = dedupeTexts(
    params.question.acceptedAnswers.map((answer) => answer.text)
  );

  const expectedTokens = primaryAnswer
    ? tokenizeSentenceBuilderText(primaryAnswer.text)
    : [];

  const isCorrect = matchedAnswer !== null;

  return {
    isCorrect,
    submittedText,
    normalizedSubmittedText,
    submittedTokens: params.submittedTokens,
    expectedTokens,
    matchedAnswer,
    feedback: params.question.explanation,
    statusLabel: isCorrect ? "Correct." : "Not quite.",
    correctAnswerText: isCorrect ? null : (primaryAnswer?.text ?? null),
    acceptedAnswerTexts: isCorrect ? [] : acceptedAnswerTexts,
  };
}