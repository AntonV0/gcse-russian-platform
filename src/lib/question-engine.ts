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

export type MultipleChoiceValidationResult = {
  isCorrect: boolean;
  selectedOptionId: string | null;
  correctOptionId: string | null;
  feedback: string | null;
};

export type TextValidationResult = {
  isCorrect: boolean;
  submittedText: string;
  normalizedSubmittedText: string;
  matchedAnswer: RuntimeAcceptedAnswer | null;
  acceptedAnswers: RuntimeAcceptedAnswer[];
  feedback: string | null;
};

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeFreeTextAnswer(value: string) {
  return collapseWhitespace(value).toLowerCase();
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

  return {
    isCorrect:
      Boolean(selectedOptionId) && selectedOptionId === question.correctOptionId,
    selectedOptionId,
    correctOptionId: question.correctOptionId,
    feedback: question.explanation,
  };
}

export function validateTextAnswer(params: {
  question: RuntimeTextQuestion;
  submittedText: string;
}): TextValidationResult {
  const submittedText = params.submittedText;
  const normalizedSubmittedText = normalizeFreeTextAnswer(submittedText);

  const matchedAnswer =
    params.question.acceptedAnswers.find((answer) => {
      if (answer.caseSensitive) {
        return collapseWhitespace(submittedText) === collapseWhitespace(answer.text);
      }

      return normalizedSubmittedText === answer.normalizedText;
    }) ?? null;

  return {
    isCorrect: matchedAnswer !== null,
    submittedText,
    normalizedSubmittedText,
    matchedAnswer,
    acceptedAnswers: params.question.acceptedAnswers,
    feedback: params.question.explanation,
  };
}