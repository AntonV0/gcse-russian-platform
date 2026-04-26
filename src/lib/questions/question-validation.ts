import {
  collapseWhitespace,
  dedupeTexts,
  getStringArray,
  isRecord,
  normalizeFreeTextAnswer,
  tokenizeSentenceBuilderText,
} from "@/lib/questions/question-answer-utils";
import type {
  MultipleChoiceValidationResult,
  RuntimeMultipleChoiceQuestion,
  RuntimeStructuredQuestion,
  RuntimeTextQuestion,
  SentenceBuilderValidationResult,
  StructuredValidationResult,
  TextValidationOptions,
  TextValidationResult,
} from "@/lib/questions/runtime-types";

function sameStringSet(left: string[], right: string[]) {
  if (left.length !== right.length) return false;

  const normalizedLeft = [...left].sort();
  const normalizedRight = [...right].sort();

  return normalizedLeft.every((value, index) => value === normalizedRight[index]);
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

