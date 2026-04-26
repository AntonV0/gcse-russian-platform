import type {
  DbQuestion,
  DbQuestionAcceptedAnswer,
  DbQuestionOption,
  DbQuestionSet,
} from "@/lib/questions/question-helpers-db";
import type {
  MultipleChoiceValidationResult,
  RuntimeAcceptedAnswer,
  RuntimeCategorisationQuestion,
  RuntimeMatchingQuestion,
  RuntimeMultipleChoiceQuestion,
  RuntimeOrderingQuestion,
  RuntimeQuestion,
  RuntimeQuestionBase,
  RuntimeQuestionOption,
  RuntimeQuestionSet,
  RuntimeStructuredQuestion,
  RuntimeTextQuestion,
  RuntimeWordBankGapFillQuestion,
  SentenceBuilderValidationResult,
  StructuredValidationResult,
  SupportedQuestionType,
  TextValidationOptions,
  TextValidationResult,
} from "@/lib/questions/runtime-types";

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

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function stripPunctuation(value: string) {
  return value.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»“”[\]\\|<>…]/g, " ");
}

function stripEnglishArticles(value: string) {
  return value.replace(/\b(a|an|the)\b/gi, " ");
}

export function normalizeFreeTextAnswer(value: string, options?: TextValidationOptions) {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
}

function getNumberArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is number => Number.isInteger(item) && item >= 0);
}

function getRecordArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(isRecord);
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

function sameStringSet(left: string[], right: string[]) {
  if (left.length !== right.length) return false;

  const normalizedLeft = [...left].sort();
  const normalizedRight = [...right].sort();

  return normalizedLeft.every((value, index) => value === normalizedRight[index]);
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
  const normalizedSubmittedText = normalizeFreeTextAnswer(submittedText, params.options);

  const matchedAnswer =
    params.question.acceptedAnswers.find((answer) => {
      if (answer.caseSensitive) {
        return collapseWhitespace(submittedText) === collapseWhitespace(answer.text);
      }

      const normalizedAnswer = normalizeFreeTextAnswer(answer.text, params.options);

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

export function validateStructuredAnswer(params: {
  question: RuntimeStructuredQuestion;
  submittedPayload: Record<string, unknown>;
  options?: TextValidationOptions;
}): StructuredValidationResult {
  const { question, submittedPayload } = params;
  let isCorrect = false;
  let correctAnswerText: string | null = null;

  switch (question.type) {
    case "multiple_response": {
      const selectedOptionIds = getStringArray(submittedPayload.selectedOptionIds);
      isCorrect = sameStringSet(selectedOptionIds, question.correctOptionIds);
      correctAnswerText = question.options
        .filter((option) => question.correctOptionIds.includes(option.id))
        .map((option) => option.text)
        .join(", ");
      break;
    }

    case "matching": {
      const matches = isRecord(submittedPayload.matches) ? submittedPayload.matches : {};
      isCorrect =
        question.prompts.length > 0 &&
        question.prompts.every((prompt) => {
          return matches[prompt.id] === question.correctMatches[prompt.id];
        });
      correctAnswerText = question.prompts
        .map((prompt) => {
          const option = question.options.find(
            (item) => item.id === question.correctMatches[prompt.id]
          );
          return option ? `${prompt.text}: ${option.text}` : null;
        })
        .filter((value): value is string => Boolean(value))
        .join("; ");
      break;
    }

    case "ordering": {
      const order = getStringArray(submittedPayload.order);
      isCorrect =
        question.correctOrder.length > 0 &&
        order.length === question.correctOrder.length &&
        order.every((itemId, index) => itemId === question.correctOrder[index]);
      correctAnswerText = question.correctOrder
        .map((itemId) => question.items.find((item) => item.id === itemId)?.text)
        .filter((value): value is string => Boolean(value))
        .join(" ");
      break;
    }

    case "word_bank_gap_fill": {
      const gaps = isRecord(submittedPayload.gaps) ? submittedPayload.gaps : {};
      isCorrect =
        question.gaps.length > 0 &&
        question.gaps.every((gap) => {
          const submitted = normalizeFreeTextAnswer(String(gaps[gap.id] ?? ""), params.options);
          return gap.acceptedAnswers.some(
            (answer) => normalizeFreeTextAnswer(answer, params.options) === submitted
          );
        });
      correctAnswerText = question.gaps
        .map((gap) => `${gap.label}: ${gap.acceptedAnswers[0] ?? ""}`)
        .join("; ");
      break;
    }

    case "categorisation": {
      const categories = isRecord(submittedPayload.categories)
        ? submittedPayload.categories
        : {};
      isCorrect =
        question.items.length > 0 &&
        question.items.every((item) => categories[item.id] === item.categoryId);
      correctAnswerText = question.items
        .map((item) => {
          const category = question.categories.find(
            (entry) => entry.id === item.categoryId
          );
          return category ? `${item.text}: ${category.label}` : null;
        })
        .filter((value): value is string => Boolean(value))
        .join("; ");
      break;
    }
  }

  return {
    isCorrect,
    submittedPayload,
    feedback: question.explanation,
    statusLabel: isCorrect ? "Correct." : "Not quite.",
    correctAnswerText: isCorrect ? null : correctAnswerText,
    acceptedAnswerTexts: isCorrect || !correctAnswerText ? [] : [correctAnswerText],
  };
}

export function validateSentenceBuilderAnswer(params: {
  question: RuntimeTextQuestion;
  submittedTokens: string[];
  options?: TextValidationOptions;
}): SentenceBuilderValidationResult {
  const submittedText = params.submittedTokens.join(" ");
  const normalizedSubmittedText = normalizeFreeTextAnswer(submittedText, params.options);

  const matchedAnswer =
    params.question.acceptedAnswers.find((answer) => {
      const normalizedAnswer = normalizeFreeTextAnswer(answer.text, params.options);
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
