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
    .select("*")
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
    .insert({
      question_set_id: sourceQuestion.question_set_id,
      question_type: sourceQuestion.question_type,
      prompt: `${sourceQuestion.prompt} (Copy)`,
      explanation: sourceQuestion.explanation,
      marks: sourceQuestion.marks,
      position: nextPosition,
      audio_path: sourceQuestion.audio_path,
      image_path: sourceQuestion.image_path,
      metadata: sourceQuestion.metadata ?? {},
      is_active: sourceQuestion.is_active,
    })
    .select("id, question_type")
    .single();

  if (duplicatedQuestionError || !duplicatedQuestion) {
    console.error("Error duplicating question:", duplicatedQuestionError);
    throw new Error("Failed to duplicate question");
  }

  if (duplicatedQuestion.question_type === "multiple_choice") {
    const { data: sourceOptions, error: sourceOptionsError } = await supabase
      .from("question_options")
      .select("*")
      .eq("question_id", sourceQuestion.id)
      .order("position", { ascending: true });

    if (sourceOptionsError) {
      console.error("Error loading source options:", sourceOptionsError);
      throw new Error("Failed to load source options");
    }

    const optionRows = (sourceOptions ?? []).map((option) => ({
      question_id: duplicatedQuestion.id,
      option_text: option.option_text,
      is_correct: option.is_correct,
      position: option.position,
    }));

    if (optionRows.length > 0) {
      const { error: insertOptionsError } = await supabase
        .from("question_options")
        .insert(optionRows);

      if (insertOptionsError) {
        console.error("Error duplicating question options:", insertOptionsError);
        throw new Error("Failed to duplicate question options");
      }
    }
  } else {
    const { data: sourceAnswers, error: sourceAnswersError } = await supabase
      .from("question_accepted_answers")
      .select("*")
      .eq("question_id", sourceQuestion.id)
      .order("is_primary", { ascending: false });

    if (sourceAnswersError) {
      console.error("Error loading source accepted answers:", sourceAnswersError);
      throw new Error("Failed to load source accepted answers");
    }

    const answerRows = (sourceAnswers ?? []).map((answer) => ({
      question_id: duplicatedQuestion.id,
      answer_text: answer.answer_text,
      normalized_answer: answer.normalized_answer,
      is_primary: answer.is_primary,
      case_sensitive: answer.case_sensitive,
      notes: answer.notes,
    }));

    if (answerRows.length > 0) {
      const { error: insertAnswersError } = await supabase
        .from("question_accepted_answers")
        .insert(answerRows);

      if (insertAnswersError) {
        console.error("Error duplicating accepted answers:", insertAnswersError);
        throw new Error("Failed to duplicate accepted answers");
      }
    }
  }

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
    .select("*")
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

  const { data: sourceQuestions, error: sourceQuestionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("question_set_id", questionSetId)
    .order("position", { ascending: true });

  if (sourceQuestionsError) {
    console.error("Error loading source questions:", sourceQuestionsError);
    throw new Error("Failed to load source questions");
  }

  const questionIdMap = new Map<string, string>();

  for (const sourceQuestion of sourceQuestions ?? []) {
    const { data: duplicatedQuestion, error: duplicatedQuestionError } = await supabase
      .from("questions")
      .insert({
        question_set_id: duplicatedSet.id,
        question_type: sourceQuestion.question_type,
        prompt: sourceQuestion.prompt,
        explanation: sourceQuestion.explanation,
        marks: sourceQuestion.marks,
        position: sourceQuestion.position,
        audio_path: sourceQuestion.audio_path,
        image_path: sourceQuestion.image_path,
        metadata: sourceQuestion.metadata ?? {},
        is_active: sourceQuestion.is_active,
      })
      .select("id")
      .single();

    if (duplicatedQuestionError || !duplicatedQuestion) {
      console.error("Error duplicating question:", duplicatedQuestionError);
      throw new Error("Failed to duplicate question");
    }

    questionIdMap.set(sourceQuestion.id, duplicatedQuestion.id);
  }

  for (const sourceQuestion of sourceQuestions ?? []) {
    const duplicatedQuestionId = questionIdMap.get(sourceQuestion.id);

    if (!duplicatedQuestionId) {
      continue;
    }

    if (sourceQuestion.question_type === "multiple_choice") {
      const { data: sourceOptions, error: sourceOptionsError } = await supabase
        .from("question_options")
        .select("*")
        .eq("question_id", sourceQuestion.id)
        .order("position", { ascending: true });

      if (sourceOptionsError) {
        console.error("Error loading source question options:", sourceOptionsError);
        throw new Error("Failed to load source question options");
      }

      const optionRows = (sourceOptions ?? []).map((option) => ({
        question_id: duplicatedQuestionId,
        option_text: option.option_text,
        is_correct: option.is_correct,
        position: option.position,
      }));

      if (optionRows.length > 0) {
        const { error: insertOptionsError } = await supabase
          .from("question_options")
          .insert(optionRows);

        if (insertOptionsError) {
          console.error("Error duplicating question options:", insertOptionsError);
          throw new Error("Failed to duplicate question options");
        }
      }
    } else {
      const { data: sourceAnswers, error: sourceAnswersError } = await supabase
        .from("question_accepted_answers")
        .select("*")
        .eq("question_id", sourceQuestion.id)
        .order("is_primary", { ascending: false });

      if (sourceAnswersError) {
        console.error("Error loading source accepted answers:", sourceAnswersError);
        throw new Error("Failed to load source accepted answers");
      }

      const answerRows = (sourceAnswers ?? []).map((answer) => ({
        question_id: duplicatedQuestionId,
        answer_text: answer.answer_text,
        normalized_answer: answer.normalized_answer,
        is_primary: answer.is_primary,
        case_sensitive: answer.case_sensitive,
        notes: answer.notes,
      }));

      if (answerRows.length > 0) {
        const { error: insertAnswersError } = await supabase
          .from("question_accepted_answers")
          .insert(answerRows);

        if (insertAnswersError) {
          console.error("Error duplicating accepted answers:", insertAnswersError);
          throw new Error("Failed to duplicate accepted answers");
        }
      }
    }
  }

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
    .select("*")
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

  const { data: sourceQuestions, error: sourceQuestionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("question_set_id", templateQuestionSetId)
    .order("position", { ascending: true });

  if (sourceQuestionsError) {
    console.error("Error loading template questions:", sourceQuestionsError);
    throw new Error("Failed to load template questions");
  }

  const questionIdMap = new Map<string, string>();

  for (const sourceQuestion of sourceQuestions ?? []) {
    const { data: newQuestion, error: newQuestionError } = await supabase
      .from("questions")
      .insert({
        question_set_id: newSet.id,
        question_type: sourceQuestion.question_type,
        prompt: sourceQuestion.prompt,
        explanation: sourceQuestion.explanation,
        marks: sourceQuestion.marks,
        position: sourceQuestion.position,
        audio_path: sourceQuestion.audio_path,
        image_path: sourceQuestion.image_path,
        metadata: sourceQuestion.metadata ?? {},
        is_active: sourceQuestion.is_active,
      })
      .select("id")
      .single();

    if (newQuestionError || !newQuestion) {
      console.error("Error creating question from template:", newQuestionError);
      throw new Error("Failed to create template question copy");
    }

    questionIdMap.set(sourceQuestion.id, newQuestion.id);
  }

  for (const sourceQuestion of sourceQuestions ?? []) {
    const newQuestionId = questionIdMap.get(sourceQuestion.id);

    if (!newQuestionId) continue;

    if (sourceQuestion.question_type === "multiple_choice") {
      const { data: sourceOptions, error: sourceOptionsError } = await supabase
        .from("question_options")
        .select("*")
        .eq("question_id", sourceQuestion.id)
        .order("position", { ascending: true });

      if (sourceOptionsError) {
        console.error("Error loading template options:", sourceOptionsError);
        throw new Error("Failed to load template options");
      }

      const optionRows = (sourceOptions ?? []).map((option) => ({
        question_id: newQuestionId,
        option_text: option.option_text,
        is_correct: option.is_correct,
        position: option.position,
      }));

      if (optionRows.length > 0) {
        const { error: insertOptionsError } = await supabase
          .from("question_options")
          .insert(optionRows);

        if (insertOptionsError) {
          console.error("Error copying template options:", insertOptionsError);
          throw new Error("Failed to copy template options");
        }
      }
    } else {
      const { data: sourceAnswers, error: sourceAnswersError } = await supabase
        .from("question_accepted_answers")
        .select("*")
        .eq("question_id", sourceQuestion.id)
        .order("is_primary", { ascending: false });

      if (sourceAnswersError) {
        console.error("Error loading template accepted answers:", sourceAnswersError);
        throw new Error("Failed to load template accepted answers");
      }

      const answerRows = (sourceAnswers ?? []).map((answer) => ({
        question_id: newQuestionId,
        answer_text: answer.answer_text,
        normalized_answer: answer.normalized_answer,
        is_primary: answer.is_primary,
        case_sensitive: answer.case_sensitive,
        notes: answer.notes,
      }));

      if (answerRows.length > 0) {
        const { error: insertAnswersError } = await supabase
          .from("question_accepted_answers")
          .insert(answerRows);

        if (insertAnswersError) {
          console.error("Error copying template answers:", insertAnswersError);
          throw new Error("Failed to copy template answers");
        }
      }
    }
  }

  redirect(`/admin/question-sets/${newSet.id}`);
}
