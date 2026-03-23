"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/admin-auth";

function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getOptionalString(formData: FormData, key: string) {
  const value = getTrimmedString(formData, key);
  return value.length > 0 ? value : null;
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

function getOptionalPositiveNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${key} must be a positive number`);
  }

  return value;
}

function parseJsonObject(raw: string) {
  if (!raw) return {};

  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Metadata must be a JSON object");
  }

  return parsed as Record<string, unknown>;
}

function parseLineList(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSelectionGroups(raw: string) {
  const lines = parseLineList(raw);

  return lines.map((line, index) => {
    const parts = line.split("|").map((part) => part.trim());
    const [id, label, optionsRaw] = parts;

    if (!id || !optionsRaw) {
      throw new Error(
        `Invalid selection group format on line ${index + 1}. Use id|label|option1,option2`
      );
    }

    const options = optionsRaw
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);

    if (options.length === 0) {
      throw new Error(`Selection group on line ${index + 1} has no options`);
    }

    return {
      id,
      label: label || undefined,
      options,
    };
  });
}

function buildStructuredMetadata(formData: FormData) {
  const metadata: Record<string, unknown> = {};

  const answerStrategy = getTrimmedString(formData, "answerStrategy");
  if (answerStrategy) {
    metadata.answerStrategy = answerStrategy;
  }

  const translationDirection = getTrimmedString(formData, "translationDirection");
  if (
    translationDirection === "to_russian" ||
    translationDirection === "to_english"
  ) {
    metadata.direction = translationDirection;
  }

  const placeholder = getOptionalString(formData, "placeholder");
  if (placeholder) {
    metadata.placeholder = placeholder;
  }

  const sourceLanguageLabel = getOptionalString(formData, "sourceLanguageLabel");
  if (sourceLanguageLabel) {
    metadata.sourceLanguageLabel = sourceLanguageLabel;
  }

  const targetLanguageLabel = getOptionalString(formData, "targetLanguageLabel");
  if (targetLanguageLabel) {
    metadata.targetLanguageLabel = targetLanguageLabel;
  }

  const instruction = getOptionalString(formData, "instruction");
  if (instruction) {
    metadata.instruction = instruction;
  }

  const selectionDisplayMode = getTrimmedString(formData, "selectionDisplayMode");
  if (
    selectionDisplayMode === "grouped" ||
    selectionDisplayMode === "inline_gaps"
  ) {
    metadata.selectionDisplayMode = selectionDisplayMode;
  }

  const selectionGroupsText = getTrimmedString(formData, "selectionGroupsText");
  if (selectionGroupsText) {
    metadata.selectionGroups = parseSelectionGroups(selectionGroupsText);
  }

  const wordBankText = getTrimmedString(formData, "wordBankText");
  if (wordBankText) {
    metadata.wordBank = parseLineList(wordBankText);
  }

  metadata.ignorePunctuation = getBoolean(formData, "ignorePunctuation");
  metadata.ignoreArticles = getBoolean(formData, "ignoreArticles");
  metadata.collapseWhitespace = getBoolean(formData, "collapseWhitespace");

  const maxPlays = getOptionalPositiveNumber(formData, "maxPlays");
  if (maxPlays !== null) {
    metadata.maxPlays = maxPlays;
  }

  if (getBoolean(formData, "listeningMode")) {
    metadata.listeningMode = true;
  }

  if (getBoolean(formData, "autoPlay")) {
    metadata.autoPlay = true;
  }

  if (getBoolean(formData, "hideNativeControls")) {
    metadata.hideNativeControls = true;
  }

  if (getBoolean(formData, "requireAudioCompletionBeforeSubmit")) {
    metadata.requireAudioCompletionBeforeSubmit = true;
  }

  return metadata;
}

export async function createQuestionSetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const title = getTrimmedString(formData, "title");
  const slug = getTrimmedString(formData, "slug");
  const description = getOptionalString(formData, "description");
  const instructions = getOptionalString(formData, "instructions");

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

  const questionSetId = getTrimmedString(formData, "questionSetId");
  const questionType = getTrimmedString(formData, "questionType");
  const prompt = getTrimmedString(formData, "prompt");
  const explanation = getOptionalString(formData, "explanation");
  const audioPath = getOptionalString(formData, "audioPath");

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

  const marks = getOptionalPositiveNumber(formData, "marks") ?? 1;
  const position = getOptionalPositiveNumber(formData, "position") ?? 1;

  let extraMetadata: Record<string, unknown> = {};

  try {
    extraMetadata = parseJsonObject(getTrimmedString(formData, "metadata"));
  } catch (error) {
    console.error("Invalid metadata JSON:", error);
    throw new Error("Invalid metadata JSON");
  }

  const structuredMetadata = buildStructuredMetadata(formData);
  const metadata = {
    ...structuredMetadata,
    ...extraMetadata,
  };

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

  if (questionType === "multiple_choice") {
    const options = parseLineList(getTrimmedString(formData, "optionsText"));
    const correctOptionIndex = Number(
      getTrimmedString(formData, "correctOptionIndex")
    );

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