"use server";

import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  getBoolean,
  getOptionalString,
  getOptionalTemplateType,
  getTrimmedString,
} from "./shared";

export async function createQuestionSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getOptionalString(formData, "description");
  const instructions = getOptionalString(formData, "instructions");
  const isTemplate = getBoolean(formData, "isTemplate");
  const templateType = getOptionalTemplateType(formData);

  if (!title || !slug) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_sets")
    .insert({
      title,
      slug,
      description,
      instructions,
      is_template: isTemplate,
      template_type: isTemplate ? templateType : null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating question set:", error);
    throw new Error("Failed to create question set");
  }

  redirect(`/admin/question-sets/${data.id}`);
}

export async function updateQuestionSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const questionSetId = getTrimmedString(formData, "questionSetId");
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getOptionalString(formData, "description");
  const instructions = getOptionalString(formData, "instructions");
  const isTemplate = getBoolean(formData, "isTemplate");
  const templateType = getOptionalTemplateType(formData);

  if (!questionSetId || !title || !slug) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("question_sets")
    .update({
      title,
      slug,
      description,
      instructions,
      is_template: isTemplate,
      template_type: isTemplate ? templateType : null,
    })
    .eq("id", questionSetId);

  if (error) {
    console.error("Error updating question set:", error);
    throw new Error(`Failed to update question set: ${error.message}`);
  }

  redirect(`/admin/question-sets/${questionSetId}`);
}

export async function deleteQuestionSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const questionSetId = getTrimmedString(formData, "questionSetId");

  if (!questionSetId) {
    throw new Error("Missing question set id");
  }

  const supabase = await createClient();

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id")
    .eq("question_set_id", questionSetId);

  if (questionsError) {
    console.error("Error loading question ids for delete:", questionsError);
    throw new Error("Failed to load question set questions");
  }

  const questionIds = (questions ?? []).map((q) => q.id);

  if (questionIds.length > 0) {
    const { error: deleteAnswersError } = await supabase
      .from("question_accepted_answers")
      .delete()
      .in("question_id", questionIds);

    if (deleteAnswersError) {
      console.error("Error deleting accepted answers:", deleteAnswersError);
      throw new Error("Failed to delete accepted answers");
    }

    const { error: deleteOptionsError } = await supabase
      .from("question_options")
      .delete()
      .in("question_id", questionIds);

    if (deleteOptionsError) {
      console.error("Error deleting question options:", deleteOptionsError);
      throw new Error("Failed to delete question options");
    }

    const { error: deleteQuestionsError } = await supabase
      .from("questions")
      .delete()
      .eq("question_set_id", questionSetId);

    if (deleteQuestionsError) {
      console.error("Error deleting questions:", deleteQuestionsError);
      throw new Error("Failed to delete questions");
    }
  }

  const { error: deleteSetError } = await supabase
    .from("question_sets")
    .delete()
    .eq("id", questionSetId);

  if (deleteSetError) {
    console.error("Error deleting question set:", deleteSetError);
    throw new Error("Failed to delete question set");
  }

  redirect("/admin/question-sets");
}
