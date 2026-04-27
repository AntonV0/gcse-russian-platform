"use server";

import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  generateUniqueQuestionSetSlug,
  generateUniqueQuestionSetTitle,
  getOptionalString,
  getTrimmedString,
} from "./shared";
import {
  copyQuestionAnswerRows,
  copyQuestionRowsIntoSet,
  getQuestionCopyInsert,
  QUESTION_DUPLICATE_SELECT,
  QUESTION_SET_DUPLICATE_SELECT,
  SOURCE_QUESTION_COPY_MESSAGES,
  SOURCE_SET_COPY_MESSAGES,
  TEMPLATE_COPY_MESSAGES,
} from "./question-copy-helpers";

export async function duplicateQuestionAction(formData: FormData) {
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

  const { data: sourceQuestion, error: sourceQuestionError } = await supabase
    .from("questions")
    .select(QUESTION_DUPLICATE_SELECT)
    .eq("id", questionId)
    .eq("question_set_id", questionSetId)
    .maybeSingle();

  if (sourceQuestionError || !sourceQuestion) {
    console.error("Error loading source question:", sourceQuestionError);
    throw new Error("Failed to load source question");
  }

  const { data: existingQuestions, error: existingQuestionsError } = await supabase
    .from("questions")
    .select("id")
    .eq("question_set_id", questionSetId);

  if (existingQuestionsError) {
    console.error(
      "Error loading question count for duplication:",
      existingQuestionsError
    );
    throw new Error("Failed to load question set questions");
  }

  const nextPosition = (existingQuestions?.length ?? 0) + 1;

  const { data: duplicatedQuestion, error: duplicatedQuestionError } = await supabase
    .from("questions")
    .insert(
      getQuestionCopyInsert(sourceQuestion, sourceQuestion.question_set_id, {
        prompt: `${sourceQuestion.prompt} (Copy)`,
        position: nextPosition,
      })
    )
    .select("id, question_type")
    .single();

  if (duplicatedQuestionError || !duplicatedQuestion) {
    console.error("Error duplicating question:", duplicatedQuestionError);
    throw new Error("Failed to duplicate question");
  }

  await copyQuestionAnswerRows({
    supabase,
    sourceQuestionId: sourceQuestion.id,
    targetQuestionId: duplicatedQuestion.id,
    questionType: duplicatedQuestion.question_type,
    messages: SOURCE_QUESTION_COPY_MESSAGES,
  });

  redirect(`/admin/question-sets/${questionSetId}`);
}

export async function duplicateQuestionSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const questionSetId = getTrimmedString(formData, "questionSetId");

  if (!questionSetId) {
    throw new Error("Missing question set id");
  }

  const supabase = await createClient();

  const { data: sourceSet, error: sourceSetError } = await supabase
    .from("question_sets")
    .select(QUESTION_SET_DUPLICATE_SELECT)
    .eq("id", questionSetId)
    .maybeSingle();

  if (sourceSetError || !sourceSet) {
    console.error("Error loading source question set:", sourceSetError);
    throw new Error("Failed to load source question set");
  }

  const duplicatedTitle = await generateUniqueQuestionSetTitle({
    supabase,
    baseTitle: sourceSet.title,
  });

  const duplicatedSlug = await generateUniqueQuestionSetSlug({
    supabase,
    baseSlug: sourceSet.slug ?? sourceSet.title,
  });

  const { data: duplicatedSet, error: duplicatedSetError } = await supabase
    .from("question_sets")
    .insert({
      slug: duplicatedSlug,
      title: duplicatedTitle,
      description: sourceSet.description,
      instructions: sourceSet.instructions,
      source_type: sourceSet.source_type,
    })
    .select("id")
    .single();

  if (duplicatedSetError || !duplicatedSet) {
    console.error("Error duplicating question set:", duplicatedSetError);
    throw new Error("Failed to duplicate question set");
  }

  await copyQuestionRowsIntoSet({
    supabase,
    sourceQuestionSetId: questionSetId,
    targetQuestionSetId: duplicatedSet.id,
    messages: SOURCE_SET_COPY_MESSAGES,
  });

  redirect(`/admin/question-sets/${duplicatedSet.id}`);
}

export async function createQuestionSetFromTemplateAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const templateQuestionSetId = getTrimmedString(formData, "templateQuestionSetId");
  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getOptionalString(formData, "description");
  const instructions = getOptionalString(formData, "instructions");

  if (!templateQuestionSetId) {
    throw new Error("Missing template question set id");
  }

  if (!title || !slug) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { data: sourceSet, error: sourceSetError } = await supabase
    .from("question_sets")
    .select(QUESTION_SET_DUPLICATE_SELECT)
    .eq("id", templateQuestionSetId)
    .eq("is_template", true)
    .maybeSingle();

  if (sourceSetError || !sourceSet) {
    console.error("Error loading template question set:", sourceSetError);
    throw new Error("Failed to load template question set");
  }

  const { data: newSet, error: newSetError } = await supabase
    .from("question_sets")
    .insert({
      slug,
      title,
      description,
      instructions,
      source_type: sourceSet.source_type,
      is_template: false,
      template_type: sourceSet.template_type ?? null,
    })
    .select("id")
    .single();

  if (newSetError || !newSet) {
    console.error("Error creating question set from template:", newSetError);
    throw new Error("Failed to create question set from template");
  }

  await copyQuestionRowsIntoSet({
    supabase,
    sourceQuestionSetId: templateQuestionSetId,
    targetQuestionSetId: newSet.id,
    messages: TEMPLATE_COPY_MESSAGES,
  });

  redirect(`/admin/question-sets/${newSet.id}`);
}
