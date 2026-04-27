"use server";

import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { getTrimmedString } from "@/app/actions/shared/form-data";
import {
  getCreateQuestionPayload,
  getQuestionAcceptedAnswerRows,
  getQuestionOptionRows,
  getUpdateQuestionPayload,
  usesAcceptedAnswersTable,
  usesOptionsTable,
} from "@/app/actions/admin/questions/question-action-payloads";

export async function createQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const { questionSetId, questionType, payload } = getCreateQuestionPayload(formData);

  const supabase = await createClient();

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .insert(payload)
    .select("id")
    .single();

  if (questionError || !question) {
    console.error("Error creating question:", {
      questionError,
      payload,
    });

    throw new Error(
      `Failed to create question: ${questionError?.message ?? "unknown error"}`
    );
  }

  if (usesOptionsTable(questionType)) {
    const optionRows = getQuestionOptionRows(formData, question.id, questionType);

    const { error: optionsError } = await supabase
      .from("question_options")
      .insert(optionRows);

    if (optionsError) {
      console.error("Error creating question options:", optionsError);
      throw new Error("Failed to create question options");
    }
  } else if (usesAcceptedAnswersTable(questionType)) {
    const answerRows = getQuestionAcceptedAnswerRows(formData, question.id);

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

  const { questionId, questionType, payload } = getUpdateQuestionPayload(formData);

  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("questions")
    .update(payload)
    .eq("id", questionId);

  if (updateError) {
    console.error("Error updating question:", updateError);
    throw new Error(
      `Failed to update question: ${updateError.message ?? "unknown error"}`
    );
  }

  if (usesOptionsTable(questionType)) {
    const { error: deleteOptionsError } = await supabase
      .from("question_options")
      .delete()
      .eq("question_id", questionId);

    if (deleteOptionsError) {
      console.error("Error clearing question options:", deleteOptionsError);
      throw new Error("Failed to clear question options");
    }

    const optionRows = getQuestionOptionRows(formData, questionId, questionType);

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
    const { error: deleteAnswersError } = await supabase
      .from("question_accepted_answers")
      .delete()
      .eq("question_id", questionId);

    if (deleteAnswersError) {
      console.error("Error clearing accepted answers:", deleteAnswersError);
      throw new Error("Failed to clear accepted answers");
    }

    const answerRows = getQuestionAcceptedAnswerRows(formData, questionId);

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
