import type {
  DbQuestion,
  DbQuestionAcceptedAnswer,
  DbQuestionOption,
  DbQuestionSet,
} from "@/lib/questions/question-helpers-db";
import type {
  RuntimeAcceptedAnswer,
  RuntimeCategorisationQuestion,
  RuntimeMatchingQuestion,
  RuntimeOrderingQuestion,
  RuntimeQuestion,
  RuntimeQuestionBase,
  RuntimeQuestionOption,
  RuntimeQuestionSet,
  RuntimeWordBankGapFillQuestion,
  SupportedQuestionType,
} from "@/lib/questions/runtime-types";
import {
  getNumberArray,
  getRecordArray,
  getStringArray,
  normalizeFreeTextAnswer,
} from "@/lib/questions/question-answer-utils";

export type {
  MultipleChoiceValidationResult,
  QuestionFeedbackResult,
  RuntimeAcceptedAnswer,
  RuntimeCategorisationCategory,
  RuntimeCategorisationItem,
  RuntimeCategorisationQuestion,
  RuntimeMatchingOption,
  RuntimeMatchingPrompt,
  RuntimeMatchingQuestion,
  RuntimeMultipleChoiceQuestion,
  RuntimeMultipleResponseQuestion,
  RuntimeOrderingItem,
  RuntimeOrderingQuestion,
  RuntimeQuestion,
  RuntimeQuestionBase,
  RuntimeQuestionOption,
  RuntimeQuestionSet,
  RuntimeStructuredQuestion,
  RuntimeTextQuestion,
  RuntimeWordBankGap,
  RuntimeWordBankGapFillQuestion,
  SentenceBuilderValidationResult,
  StructuredValidationResult,
  SupportedQuestionType,
  TextValidationOptions,
  TextValidationResult,
} from "@/lib/questions/runtime-types";

export {
  normalizeFreeTextAnswer,
  tokenizeSentenceBuilderText,
} from "@/lib/questions/question-answer-utils";
export {
  validateMultipleChoiceAnswer,
  validateSentenceBuilderAnswer,
  validateStructuredAnswer,
  validateTextAnswer,
} from "@/lib/questions/question-validation";

export function mapSupportedQuestionType(
  questionType: string
): SupportedQuestionType | null {
  switch (questionType) {
    case "multiple_choice":
    case "multiple_response":
    case "short_answer":
    case "translation":
    case "matching":
    case "ordering":
    case "word_bank_gap_fill":
    case "categorisation":
      return questionType;
    default:
      return null;
  }
}

function createIndexedItems(values: string[], prefix: string) {
  return values.map((text, index) => ({
    id: `${prefix}-${index + 1}`,
    text,
  }));
}

function buildMatchingQuestion(
  base: RuntimeQuestionBase,
  metadata: Record<string, unknown>
): RuntimeMatchingQuestion {
  const prompts = createIndexedItems(getStringArray(metadata.prompts), "prompt");
  const options = createIndexedItems(getStringArray(metadata.options), "option");
  const correctMatchIndexes = getNumberArray(metadata.correctMatches);

  const correctMatches = prompts.reduce<Record<string, string>>((acc, prompt, index) => {
    const optionIndex = correctMatchIndexes[index];
    const option = options[optionIndex];

    if (option) {
      acc[prompt.id] = option.id;
    }

    return acc;
  }, {});

  return {
    ...base,
    type: "matching",
    prompts,
    options,
    correctMatches,
  };
}

function buildOrderingQuestion(
  base: RuntimeQuestionBase,
  metadata: Record<string, unknown>
): RuntimeOrderingQuestion {
  const items = createIndexedItems(getStringArray(metadata.items), "item");
  const correctOrderIndexes = getNumberArray(metadata.correctOrder);
  const correctOrder = correctOrderIndexes
    .map((index) => items[index]?.id)
    .filter((id): id is string => Boolean(id));

  return {
    ...base,
    type: "ordering",
    items,
    correctOrder,
  };
}

function buildWordBankGapFillQuestion(
  base: RuntimeQuestionBase,
  metadata: Record<string, unknown>
): RuntimeWordBankGapFillQuestion {
  const gaps = getRecordArray(metadata.gaps).map((gap, index) => {
    const label =
      typeof gap.label === "string" && gap.label.trim().length > 0
        ? gap.label
        : `Gap ${index + 1}`;

    const id =
      typeof gap.id === "string" && gap.id.trim().length > 0
        ? gap.id
        : `gap-${index + 1}`;

    return {
      id,
      label,
      acceptedAnswers: getStringArray(gap.acceptedAnswers),
    };
  });

  return {
    ...base,
    type: "word_bank_gap_fill",
    text: typeof metadata.text === "string" ? metadata.text : null,
    gaps,
    wordBank: getStringArray(metadata.wordBank),
  };
}

function buildCategorisationQuestion(
  base: RuntimeQuestionBase,
  metadata: Record<string, unknown>
): RuntimeCategorisationQuestion {
  const categories = getRecordArray(metadata.categories).map((category, index) => {
    const id =
      typeof category.id === "string" && category.id.trim().length > 0
        ? category.id
        : `category-${index + 1}`;
    const label =
      typeof category.label === "string" && category.label.trim().length > 0
        ? category.label
        : id;

    return { id, label };
  });

  const items = getRecordArray(metadata.items).map((item, index) => {
    const id =
      typeof item.id === "string" && item.id.trim().length > 0
        ? item.id
        : `item-${index + 1}`;
    const text =
      typeof item.text === "string" && item.text.trim().length > 0
        ? item.text
        : `Item ${index + 1}`;
    const categoryId =
      typeof item.categoryId === "string" && item.categoryId.trim().length > 0
        ? item.categoryId
        : "";

    return { id, text, categoryId };
  });

  return {
    ...base,
    type: "categorisation",
    categories,
    items,
  };
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
    const runtimeOptions: RuntimeQuestionOption[] = question.options.map((option) => ({
      id: option.id,
      text: option.option_text ?? "",
      isCorrect: Boolean(option.is_correct),
      position: option.position,
    }));

    return {
      ...base,
      type: "multiple_choice",
      options: runtimeOptions,
      correctOptionId: runtimeOptions.find((option) => option.isCorrect)?.id ?? null,
    };
  }

  if (supportedType === "multiple_response") {
    const runtimeOptions: RuntimeQuestionOption[] = question.options.map((option) => ({
      id: option.id,
      text: option.option_text ?? "",
      isCorrect: Boolean(option.is_correct),
      position: option.position,
    }));

    return {
      ...base,
      type: "multiple_response",
      options: runtimeOptions,
      correctOptionIds: runtimeOptions
        .filter((option) => option.isCorrect)
        .map((option) => option.id),
    };
  }

  if (supportedType === "matching") {
    return buildMatchingQuestion(base, question.question.metadata);
  }

  if (supportedType === "ordering") {
    return buildOrderingQuestion(base, question.question.metadata);
  }

  if (supportedType === "word_bank_gap_fill") {
    return buildWordBankGapFillQuestion(base, question.question.metadata);
  }

  if (supportedType === "categorisation") {
    return buildCategorisationQuestion(base, question.question.metadata);
  }

  const runtimeAcceptedAnswers: RuntimeAcceptedAnswer[] = question.acceptedAnswers.map(
    (answer) => ({
      id: answer.id,
      text: answer.answer_text,
      normalizedText:
        answer.normalized_answer ?? normalizeFreeTextAnswer(answer.answer_text),
      isPrimary: answer.is_primary,
      caseSensitive: answer.case_sensitive,
      notes: answer.notes,
    })
  );

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


