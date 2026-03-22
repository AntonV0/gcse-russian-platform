"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/admin-auth";

export async function createQuestionSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const instructions =
    String(formData.get("instructions") || "").trim() || null;

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
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating question set:", error);
    throw new Error("Failed to create question set");
  }

  redirect(`/admin/question-sets/${data.id}`);
}

export async function createQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const questionSetId = String(formData.get("questionSetId") || "").trim();
  const questionType = String(formData.get("questionType") || "").trim();
  const prompt = String(formData.get("prompt") || "").trim();
  const explanation = String(formData.get("explanation") || "").trim() || null;
  const marksValue = String(formData.get("marks") || "").trim();
  const positionValue = String(formData.get("position") || "").trim();
  const audioPath = String(formData.get("audioPath") || "").trim() || null;
  const metadataRaw = String(formData.get("metadata") || "").trim();

  if (!questionSetId || !questionType || !prompt) {
    throw new Error("Missing required fields");
  }

  if (
    questionType !== "multiple_choice" &&
    questionType !== "short_answer" &&
    questionType !== "translation"
  ) {
    throw new Error("Unsupported question type");
  }

  const marks = marksValue ? Number(marksValue) : 1;
  const position = positionValue ? Number(positionValue) : 1;

  if (!Number.isFinite(marks) || marks <= 0) {
    throw new Error("Marks must be a positive number");
  }

  if (!Number.isFinite(position) || position <= 0) {
    throw new Error("Position must be a positive number");
  }

  let metadata: Record<string, unknown> = {};

  if (metadataRaw) {
    try {
      const parsed = JSON.parse(metadataRaw);

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Metadata must be a JSON object");
      }

      metadata = parsed as Record<string, unknown>;
    } catch (error) {
      console.error("Invalid metadata JSON:", error);
      throw new Error("Invalid metadata JSON");
    }
  }

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
    console.error("Error creating question:", questionError);
    throw new Error("Failed to create question");
  }

  if (questionType === "multiple_choice") {
    const optionsRaw = String(formData.get("optionsText") || "").trim();
    const correctOptionIndexValue = String(
      formData.get("correctOptionIndex") || ""
    ).trim();

    const options = optionsRaw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const correctOptionIndex = Number(correctOptionIndexValue);

    if (options.length < 2) {
      throw new Error("Multiple choice questions need at least 2 options");
    }

    if (
      !Number.isInteger(correctOptionIndex) ||
      correctOptionIndex < 1 ||
      correctOptionIndex > options.length
    ) {
      throw new Error("Correct option index is invalid");
    }

    const optionRows = options.map((optionText, index) => ({
      question_id: question.id,
      option_text: optionText,
      is_correct: index + 1 === correctOptionIndex,
      position: index + 1,
    }));

    const { error: optionsError } = await supabase
      .from("question_options")
      .insert(optionRows);

    if (optionsError) {
      console.error("Error creating question options:", optionsError);
      throw new Error("Failed to create question options");
    }
  } else {
    const acceptedAnswersRaw = String(
      formData.get("acceptedAnswersText") || ""
    ).trim();

    const acceptedAnswers = acceptedAnswersRaw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

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