"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/auth/admin-auth";

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
  if (translationDirection === "to_russian" || translationDirection === "to_english") {
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
  if (selectionDisplayMode === "grouped" || selectionDisplayMode === "inline_gaps") {
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

function getQuestionTypeMetadataDefaults(questionType: string) {
  if (questionType === "translation") {
    return {
      answerStrategy: "text_input",
      selectionDisplayMode: "grouped",
      collapseWhitespace: true,
    };
  }

  if (questionType === "short_answer") {
    return {
      collapseWhitespace: true,
    };
  }

  return {};
}

function stripCopySuffix(value: string) {
  return value
    .trim()
    .replace(/\s*\(copy(?:\s+\d+)?\)$/i, "")
    .replace(/-copy(?:-\d+)?$/i, "")
    .trim();
}

function getOptionalTemplateType(formData: FormData) {
  const value = getTrimmedString(formData, "templateType");
  return value.length > 0 ? value : null;
}

async function generateUniqueQuestionSetTitle(params: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  baseTitle: string;
}) {
  const normalizedBaseTitle = stripCopySuffix(params.baseTitle) || "Question Set";

  const { data, error } = await params.supabase
    .from("question_sets")
    .select("title")
    .ilike("title", `${normalizedBaseTitle} (Copy%`);

  if (error) {
    console.error("Error checking existing titles:", error);
    throw new Error("Failed to generate unique title");
  }

  const existingTitles = new Set((data ?? []).map((row) => row.title).filter(Boolean));

  const firstCopyTitle = `${normalizedBaseTitle} (Copy)`;

  if (!existingTitles.has(firstCopyTitle)) {
    return firstCopyTitle;
  }

  let counter = 2;

  while (existingTitles.has(`${normalizedBaseTitle} (Copy ${counter})`)) {
    counter += 1;
  }

  return `${normalizedBaseTitle} (Copy ${counter})`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function generateUniqueQuestionSetSlug(params: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  baseSlug: string;
}) {
  const cleanedBaseSlug = stripCopySuffix(params.baseSlug);
  const normalizedBaseSlug = slugify(cleanedBaseSlug) || "question-set";
  const copyBaseSlug = `${normalizedBaseSlug}-copy`;

  const { data, error } = await params.supabase
    .from("question_sets")
    .select("slug")
    .ilike("slug", `${copyBaseSlug}%`);

  if (error) {
    console.error("Error checking existing slugs:", error);
    throw new Error("Failed to generate unique slug");
  }

  const existingSlugs = new Set((data ?? []).map((row) => row.slug).filter(Boolean));

  if (!existingSlugs.has(copyBaseSlug)) {
    return copyBaseSlug;
  }

  let counter = 2;

  while (existingSlugs.has(`${copyBaseSlug}-${counter}`)) {
    counter += 1;
  }

  return `${copyBaseSlug}-${counter}`;
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
    ...getQuestionTypeMetadataDefaults(questionType),
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
    const correctOptionIndex = Number(getTrimmedString(formData, "correctOptionIndex"));

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
    ...getQuestionTypeMetadataDefaults(questionType),
    ...structuredMetadata,
    ...extraMetadata,
  };

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

  if (questionType === "multiple_choice") {
    const options = parseLineList(getTrimmedString(formData, "optionsText"));
    const correctOptionIndex = Number(getTrimmedString(formData, "correctOptionIndex"));

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
      is_correct: index + 1 === correctOptionIndex,
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
  } else {
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

export async function moveQuestionAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const questionId = getTrimmedString(formData, "questionId");
  const questionSetId = getTrimmedString(formData, "questionSetId");
  const direction = getTrimmedString(formData, "direction");

  if (!questionId || !questionSetId) {
    throw new Error("Missing required fields");
  }

  if (direction !== "up" && direction !== "down") {
    throw new Error("Invalid move direction");
  }

  const supabase = await createClient();

  const { data: currentQuestion, error: currentQuestionError } = await supabase
    .from("questions")
    .select("id, question_set_id, position")
    .eq("id", questionId)
    .eq("question_set_id", questionSetId)
    .maybeSingle();

  if (currentQuestionError || !currentQuestion) {
    console.error("Error loading current question:", currentQuestionError);
    throw new Error("Failed to load current question");
  }

  const targetPosition =
    direction === "up" ? currentQuestion.position - 1 : currentQuestion.position + 1;

  if (targetPosition < 1) {
    redirect(`/admin/question-sets/${questionSetId}`);
  }

  const { data: swapQuestion, error: swapQuestionError } = await supabase
    .from("questions")
    .select("id, position")
    .eq("question_set_id", questionSetId)
    .eq("position", targetPosition)
    .maybeSingle();

  if (swapQuestionError) {
    console.error("Error loading swap question:", swapQuestionError);
    throw new Error("Failed to load target question");
  }

  if (!swapQuestion) {
    redirect(`/admin/question-sets/${questionSetId}`);
  }

  const { error: firstUpdateError } = await supabase
    .from("questions")
    .update({ position: 0 })
    .eq("id", currentQuestion.id);

  if (firstUpdateError) {
    console.error("Error setting temporary position:", firstUpdateError);
    throw new Error("Failed to reorder question");
  }

  const { error: secondUpdateError } = await supabase
    .from("questions")
    .update({ position: currentQuestion.position })
    .eq("id", swapQuestion.id);

  if (secondUpdateError) {
    console.error("Error updating swap question position:", secondUpdateError);
    throw new Error("Failed to reorder question");
  }

  const { error: thirdUpdateError } = await supabase
    .from("questions")
    .update({ position: swapQuestion.position })
    .eq("id", currentQuestion.id);

  if (thirdUpdateError) {
    console.error("Error updating current question position:", thirdUpdateError);
    throw new Error("Failed to reorder question");
  }

  redirect(`/admin/question-sets/${questionSetId}`);
}

export async function normalizeQuestionPositionsAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const questionSetId = getTrimmedString(formData, "questionSetId");

  if (!questionSetId) {
    throw new Error("Missing question set id");
  }

  const supabase = await createClient();

  const { data: questions, error: loadError } = await supabase
    .from("questions")
    .select("id, position")
    .eq("question_set_id", questionSetId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (loadError) {
    console.error("Error loading questions for normalization:", loadError);
    throw new Error("Failed to load questions");
  }

  const rows = questions ?? [];

  for (let index = 0; index < rows.length; index += 1) {
    const question = rows[index];
    const nextPosition = index + 1;

    if (question.position === nextPosition) {
      continue;
    }

    const { error: updateError } = await supabase
      .from("questions")
      .update({ position: nextPosition })
      .eq("id", question.id);

    if (updateError) {
      console.error("Error normalizing question position:", updateError);
      throw new Error("Failed to normalize question positions");
    }
  }

  redirect(`/admin/question-sets/${questionSetId}`);
}

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
