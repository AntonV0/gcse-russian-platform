import {
  buildStructuredMetadata,
  getBoolean,
  getOptionalPositiveNumber,
  getOptionalString,
  getQuestionTypeMetadataDefaults,
  getTrimmedString,
  parseJsonObject,
  parseLineList,
  parseOneBasedIndexList,
} from "./shared";

export function validateQuestionType(questionType: string) {
  if (
    questionType !== "multiple_choice" &&
    questionType !== "multiple_response" &&
    questionType !== "short_answer" &&
    questionType !== "translation" &&
    questionType !== "matching" &&
    questionType !== "ordering" &&
    questionType !== "word_bank_gap_fill" &&
    questionType !== "categorisation"
  ) {
    throw new Error("Unsupported question type");
  }
}

export function usesOptionsTable(questionType: string) {
  return questionType === "multiple_choice" || questionType === "multiple_response";
}

export function usesAcceptedAnswersTable(questionType: string) {
  return questionType === "short_answer" || questionType === "translation";
}

function getQuestionMetadata(formData: FormData, questionType: string) {
  let extraMetadata: Record<string, unknown> = {};

  try {
    extraMetadata = parseJsonObject(getTrimmedString(formData, "metadata"));
  } catch (error) {
    console.error("Invalid metadata JSON:", error);
    throw new Error("Invalid metadata JSON");
  }

  return {
    ...getQuestionTypeMetadataDefaults(questionType),
    ...buildStructuredMetadata(formData),
    ...extraMetadata,
  };
}

function getBaseQuestionFields(formData: FormData) {
  const questionSetId = getTrimmedString(formData, "questionSetId");
  const questionType = getTrimmedString(formData, "questionType");
  const prompt = getTrimmedString(formData, "prompt");
  const explanation = getOptionalString(formData, "explanation");
  const audioPath = getOptionalString(formData, "audioPath");

  if (!questionSetId || !questionType || !prompt) {
    throw new Error("Missing required fields");
  }

  validateQuestionType(questionType);

  const marks = getOptionalPositiveNumber(formData, "marks") ?? 1;
  const position = getOptionalPositiveNumber(formData, "position") ?? 1;
  const metadata = getQuestionMetadata(formData, questionType);

  return {
    questionSetId,
    questionType,
    payload: {
      question_type: questionType,
      prompt,
      explanation,
      marks,
      position,
      audio_path: audioPath,
      metadata,
    },
  };
}

export function getCreateQuestionPayload(formData: FormData) {
  const baseFields = getBaseQuestionFields(formData);

  return {
    ...baseFields,
    payload: {
      question_set_id: baseFields.questionSetId,
      ...baseFields.payload,
      is_active: true,
    },
  };
}

export function getUpdateQuestionPayload(formData: FormData) {
  const questionId = getTrimmedString(formData, "questionId");
  const baseFields = getBaseQuestionFields(formData);

  if (!questionId) {
    throw new Error("Missing required fields");
  }

  return {
    questionId,
    ...baseFields,
    payload: {
      ...baseFields.payload,
      is_active: getBoolean(formData, "isActive"),
    },
  };
}

function getCorrectOptionIndexes(formData: FormData, questionType: string) {
  return questionType === "multiple_response"
    ? parseOneBasedIndexList(getTrimmedString(formData, "correctOptionIndexes"))
    : [Number(getTrimmedString(formData, "correctOptionIndex")) - 1];
}

export function getQuestionOptionRows(
  formData: FormData,
  questionId: string,
  questionType: string
) {
  const options = parseLineList(getTrimmedString(formData, "optionsText"));
  const correctOptionIndexes = getCorrectOptionIndexes(formData, questionType);

  if (options.length < 2) {
    throw new Error("Choice questions need at least 2 options");
  }

  if (
    correctOptionIndexes.length === 0 ||
    correctOptionIndexes.some((index) => index < 0 || index >= options.length)
  ) {
    throw new Error("Correct option index is invalid");
  }

  return options.map((optionText, index) => ({
    question_id: questionId,
    option_text: optionText,
    is_correct: correctOptionIndexes.includes(index),
    position: index + 1,
  }));
}

export function getQuestionAcceptedAnswerRows(formData: FormData, questionId: string) {
  const acceptedAnswers = parseLineList(
    getTrimmedString(formData, "acceptedAnswersText")
  );

  if (acceptedAnswers.length === 0) {
    throw new Error("Text questions need at least 1 accepted answer");
  }

  return acceptedAnswers.map((answerText, index) => ({
    question_id: questionId,
    answer_text: answerText,
    normalized_answer: null,
    is_primary: index === 0,
    case_sensitive: false,
    notes: null,
  }));
}
