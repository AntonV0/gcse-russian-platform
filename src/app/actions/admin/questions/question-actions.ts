"use server";

import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  buildStructuredMetadata,
  getBoolean,
  getOptionalPositiveNumber,
  getOptionalString,
  getQuestionTypeMetadataDefaults,
  getTrimmedString,
  parseOneBasedIndexList,
  parseJsonObject,
  parseLineList,
} from "./shared";

function validateQuestionType(questionType: string) {
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

function usesOptionsTable(questionType: string) {
  return questionType === "multiple_choice" || questionType === "multiple_response";
}

function usesAcceptedAnswersTable(questionType: string) {
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

export async function createQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

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

  const supabase = await createClient();

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .insert({
      question_set_id: questionSetId,
      question_type: questionType,
      prompt,
      explanation,
      marks,
      position,
      audio_path: audioPath,
      metadata,
      is_active: true,
    })
    .select("id")
    .single();

  if (questionError || !question) {
    console.error("Error creating question:", {
      questionError,
      payload: {
        question_set_id: questionSetId,
        question_type: questionType,
        prompt,
        explanation,
        marks,
        position,
        audio_path: audioPath,
        metadata,
        is_active: true,
      },
    });

    throw new Error(
      `Failed to create question: ${questionError?.message ?? "unknown error"}`
    );
  }

  if (usesOptionsTable(questionType)) {
    const options = parseLineList(getTrimmedString(formData, "optionsText"));
    const correctOptionIndexes =
      questionType === "multiple_response"
        ? parseOneBasedIndexList(getTrimmedString(formData, "correctOptionIndexes"))
        : [Number(getTrimmedString(formData, "correctOptionIndex")) - 1];

    if (options.length < 2) {
      throw new Error("Choice questions need at least 2 options");
    }

    if (
      correctOptionIndexes.length === 0 ||
      correctOptionIndexes.some((index) => index < 0 || index >= options.length)
    ) {
      throw new Error("Correct option index is invalid");
    }

    const optionRows = options.map((optionText, index) => ({
      question_id: question.id,
      option_text: optionText,
      is_correct: correctOptionIndexes.includes(index),
      position: index + 1,
    }));

    const { error: optionsError } = await supabase
      .from("question_options")
      .insert(optionRows);

    if (optionsError) {
      console.error("Error creating question options:", optionsError);
      throw new Error("Failed to create question options");
    }
  } else if (usesAcceptedAnswersTable(questionType)) {
    const acceptedAnswers = parseLineList(
      getTrimmedString(formData, "acceptedAnswersText")
    );

    if (acceptedAnswers.length === 0) {
      throw new Error("Text questions need at least 1 accepted answer");
    }

    const answerRows = acceptedAnswers.map((answerText, index) => ({
      question_id: question.id,
      answer_text: answerText,
      normalized_answer: null,
      is_primary: index === 0,
      case_sensitive: false,
      notes: null,
    }));

    const { error: answersError } = await supabase
      .from("question_accepted_answers")
      .insert(answerRows);

    if (answersError) {
      console.error("Error creating accepted answers:", answersError);
      throw new Error("Failed to create accepted answers");
    }
  }

  redirect(`/admin/question-sets/${questionSetId}`);
}

export async function updateQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const questionId = getTrimmedString(formData, "questionId");
  const questionSetId = getTrimmedString(formData, "questionSetId");
  const questionType = getTrimmedString(formData, "questionType");
  const prompt = getTrimmedString(formData, "prompt");
  const explanation = getOptionalString(formData, "explanation");
  const audioPath = getOptionalString(formData, "audioPath");
  const isActive = getBoolean(formData, "isActive");

  if (!questionId || !questionSetId || !questionType || !prompt) {
    throw new Error("Missing required fields");
  }

  validateQuestionType(questionType);

  const marks = getOptionalPositiveNumber(formData, "marks") ?? 1;
  const position = getOptionalPositiveNumber(formData, "position") ?? 1;
  const metadata = getQuestionMetadata(formData, questionType);

  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("questions")
    .update({
      question_type: questionType,
      prompt,
      explanation,
      marks,
      position,
      audio_path: audioPath,
      metadata,
      is_active: isActive,
    })
    .eq("id", questionId);

  if (updateError) {
    console.error("Error updating question:", updateError);
    throw new Error(
      `Failed to update question: ${updateError.message ?? "unknown error"}`
    );
  }

  if (usesOptionsTable(questionType)) {
    const options = parseLineList(getTrimmedString(formData, "optionsText"));
    const correctOptionIndexes =
      questionType === "multiple_response"
        ? parseOneBasedIndexList(getTrimmedString(formData, "correctOptionIndexes"))
        : [Number(getTrimmedString(formData, "correctOptionIndex")) - 1];

    if (options.length < 2) {
      throw new Error("Choice questions need at least 2 options");
    }

    if (
      correctOptionIndexes.length === 0 ||
      correctOptionIndexes.some((index) => index < 0 || index >= options.length)
    ) {
      throw new Error("Correct option index is invalid");
    }

    const { error: deleteOptionsError } = await supabase
      .from("question_options")
      .delete()
      .eq("question_id", questionId);

    if (deleteOptionsError) {
      console.error("Error clearing question options:", deleteOptionsError);
      throw new Error("Failed to clear question options");
    }

    const optionRows = options.map((optionText, index) => ({
      question_id: questionId,
      option_text: optionText,
      is_correct: correctOptionIndexes.includes(index),
      position: index + 1,
    }));

    const { error: insertOptionsError } = await supabase
      .from("question_options")
      .insert(optionRows);

    if (insertOptionsError) {
      console.error("Error updating question options:", insertOptionsError);
      throw new Error("Failed to update question options");
    }

    const { error: deleteAnswersError } = await supabase
      .from("question_accepted_answers")
      .delete()
      .eq("question_id", questionId);

    if (deleteAnswersError) {
      console.error("Error clearing accepted answers for MCQ:", deleteAnswersError);
      throw new Error("Failed to clear accepted answers");
    }
  } else if (usesAcceptedAnswersTable(questionType)) {
    const acceptedAnswers = parseLineList(
      getTrimmedString(formData, "acceptedAnswersText")
    );

    if (acceptedAnswers.length === 0) {
      throw new Error("Text questions need at least 1 accepted answer");
    }

    const { error: deleteAnswersError } = await supabase
      .from("question_accepted_answers")
      .delete()
      .eq("question_id", questionId);

    if (deleteAnswersError) {
      console.error("Error clearing accepted answers:", deleteAnswersError);
      throw new Error("Failed to clear accepted answers");
    }

    const answerRows = acceptedAnswers.map((answerText, index) => ({
      question_id: questionId,
      answer_text: answerText,
      normalized_answer: null,
      is_primary: index === 0,
      case_sensitive: false,
      notes: null,
    }));

    const { error: insertAnswersError } = await supabase
      .from("question_accepted_answers")
      .insert(answerRows);

    if (insertAnswersError) {
      console.error("Error updating accepted answers:", insertAnswersError);
      throw new Error("Failed to update accepted answers");
    }

    const { error: deleteOptionsError } = await supabase
      .from("question_options")
      .delete()
      .eq("question_id", questionId);

    if (deleteOptionsError) {
      console.error("Error clearing MCQ options for text question:", deleteOptionsError);
      throw new Error("Failed to clear question options");
    }
  } else {
    const { error: deleteAnswersError } = await supabase
      .from("question_accepted_answers")
      .delete()
      .eq("question_id", questionId);

    if (deleteAnswersError) {
      console.error(
        "Error clearing accepted answers for structured question:",
        deleteAnswersError
      );
      throw new Error("Failed to clear accepted answers");
    }

    const { error: deleteOptionsError } = await supabase
      .from("question_options")
      .delete()
      .eq("question_id", questionId);

    if (deleteOptionsError) {
      console.error(
        "Error clearing options for structured question:",
        deleteOptionsError
      );
      throw new Error("Failed to clear question options");
    }
  }

  redirect(`/admin/questions/${questionId}`);
}

export async function deleteQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const questionId = getTrimmedString(formData, "questionId");
  const questionSetId = getTrimmedString(formData, "questionSetId");

  if (!questionId || !questionSetId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error: deleteAnswersError } = await supabase
    .from("question_accepted_answers")
    .delete()
    .eq("question_id", questionId);

  if (deleteAnswersError) {
    console.error("Error deleting accepted answers:", deleteAnswersError);
    throw new Error("Failed to delete accepted answers");
  }

  const { error: deleteOptionsError } = await supabase
    .from("question_options")
    .delete()
    .eq("question_id", questionId);

  if (deleteOptionsError) {
    console.error("Error deleting question options:", deleteOptionsError);
    throw new Error("Failed to delete question options");
  }

  const { error: deleteQuestionError } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId);

  if (deleteQuestionError) {
    console.error("Error deleting question:", deleteQuestionError);
    throw new Error("Failed to delete question");
  }

  redirect(`/admin/question-sets/${questionSetId}`);
}

export async function toggleQuestionActiveAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const questionId = getTrimmedString(formData, "questionId");
  const questionSetId = getTrimmedString(formData, "questionSetId");
  const nextStateRaw = getTrimmedString(formData, "nextState");

  if (!questionId || !questionSetId) {
    throw new Error("Missing required fields");
  }

  if (nextStateRaw !== "active" && nextStateRaw !== "inactive") {
    throw new Error("Invalid question state");
  }

  const isActive = nextStateRaw === "active";

  const supabase = await createClient();

  const { error } = await supabase
    .from("questions")
    .update({
      is_active: isActive,
    })
    .eq("id", questionId)
    .eq("question_set_id", questionSetId);

  if (error) {
    console.error("Error toggling question active state:", error);
    throw new Error(`Failed to toggle question state: ${error.message}`);
  }

  redirect(`/admin/question-sets/${questionSetId}`);
}
