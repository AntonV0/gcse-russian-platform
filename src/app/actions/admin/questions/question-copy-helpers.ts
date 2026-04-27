import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type SourceQuestionRow = {
  id: string;
  question_set_id: string;
  question_type: string;
  prompt: string;
  explanation: string | null;
  marks: number | null;
  position: number | null;
  audio_path: string | null;
  image_path: string | null;
  metadata: Record<string, unknown> | null;
  is_active: boolean;
};

type CopyQuestionRowsMessages = {
  loadQuestionsLog: string;
  loadQuestionsError: string;
  insertQuestionLog: string;
  insertQuestionError: string;
  copyRowsMessages: CopyAnswerRowsMessages;
};

type CopyAnswerRowsMessages = {
  loadOptionsLog: string;
  loadOptionsError: string;
  insertOptionsLog: string;
  insertOptionsError: string;
  loadAnswersLog: string;
  loadAnswersError: string;
  insertAnswersLog: string;
  insertAnswersError: string;
};

export const QUESTION_SET_DUPLICATE_SELECT =
  "id, slug, title, description, instructions, source_type, is_template, template_type";
export const QUESTION_DUPLICATE_SELECT =
  "id, question_set_id, question_type, prompt, explanation, marks, position, audio_path, image_path, metadata, is_active";

const QUESTION_OPTION_DUPLICATE_SELECT = "option_text, is_correct, position";
const QUESTION_ACCEPTED_ANSWER_DUPLICATE_SELECT =
  "answer_text, normalized_answer, is_primary, case_sensitive, notes";

export const SOURCE_QUESTION_COPY_MESSAGES: CopyAnswerRowsMessages = {
  loadOptionsLog: "Error loading source options:",
  loadOptionsError: "Failed to load source options",
  insertOptionsLog: "Error duplicating question options:",
  insertOptionsError: "Failed to duplicate question options",
  loadAnswersLog: "Error loading source accepted answers:",
  loadAnswersError: "Failed to load source accepted answers",
  insertAnswersLog: "Error duplicating accepted answers:",
  insertAnswersError: "Failed to duplicate accepted answers",
};

export const SOURCE_SET_COPY_MESSAGES: CopyQuestionRowsMessages = {
  loadQuestionsLog: "Error loading source questions:",
  loadQuestionsError: "Failed to load source questions",
  insertQuestionLog: "Error duplicating question:",
  insertQuestionError: "Failed to duplicate question",
  copyRowsMessages: {
    loadOptionsLog: "Error loading source question options:",
    loadOptionsError: "Failed to load source question options",
    insertOptionsLog: "Error duplicating question options:",
    insertOptionsError: "Failed to duplicate question options",
    loadAnswersLog: "Error loading source accepted answers:",
    loadAnswersError: "Failed to load source accepted answers",
    insertAnswersLog: "Error duplicating accepted answers:",
    insertAnswersError: "Failed to duplicate accepted answers",
  },
};

export const TEMPLATE_COPY_MESSAGES: CopyQuestionRowsMessages = {
  loadQuestionsLog: "Error loading template questions:",
  loadQuestionsError: "Failed to load template questions",
  insertQuestionLog: "Error creating question from template:",
  insertQuestionError: "Failed to create template question copy",
  copyRowsMessages: {
    loadOptionsLog: "Error loading template options:",
    loadOptionsError: "Failed to load template options",
    insertOptionsLog: "Error copying template options:",
    insertOptionsError: "Failed to copy template options",
    loadAnswersLog: "Error loading template accepted answers:",
    loadAnswersError: "Failed to load template accepted answers",
    insertAnswersLog: "Error copying template answers:",
    insertAnswersError: "Failed to copy template answers",
  },
};

export function usesOptionsTable(questionType: string) {
  return questionType === "multiple_choice" || questionType === "multiple_response";
}

export function getQuestionCopyInsert(
  sourceQuestion: SourceQuestionRow,
  questionSetId: string,
  overrides: Partial<Pick<SourceQuestionRow, "prompt" | "position">> = {}
) {
  return {
    question_set_id: questionSetId,
    question_type: sourceQuestion.question_type,
    prompt: overrides.prompt ?? sourceQuestion.prompt,
    explanation: sourceQuestion.explanation,
    marks: sourceQuestion.marks,
    position: overrides.position ?? sourceQuestion.position,
    audio_path: sourceQuestion.audio_path,
    image_path: sourceQuestion.image_path,
    metadata: sourceQuestion.metadata ?? {},
    is_active: sourceQuestion.is_active,
  };
}

export async function copyQuestionAnswerRows({
  supabase,
  sourceQuestionId,
  targetQuestionId,
  questionType,
  messages,
}: {
  supabase: SupabaseServerClient;
  sourceQuestionId: string;
  targetQuestionId: string;
  questionType: string;
  messages: CopyAnswerRowsMessages;
}) {
  if (usesOptionsTable(questionType)) {
    const { data: sourceOptions, error: sourceOptionsError } = await supabase
      .from("question_options")
      .select(QUESTION_OPTION_DUPLICATE_SELECT)
      .eq("question_id", sourceQuestionId)
      .order("position", { ascending: true });

    if (sourceOptionsError) {
      console.error(messages.loadOptionsLog, sourceOptionsError);
      throw new Error(messages.loadOptionsError);
    }

    const optionRows = (sourceOptions ?? []).map((option) => ({
      question_id: targetQuestionId,
      option_text: option.option_text,
      is_correct: option.is_correct,
      position: option.position,
    }));

    if (optionRows.length > 0) {
      const { error: insertOptionsError } = await supabase
        .from("question_options")
        .insert(optionRows);

      if (insertOptionsError) {
        console.error(messages.insertOptionsLog, insertOptionsError);
        throw new Error(messages.insertOptionsError);
      }
    }

    return;
  }

  const { data: sourceAnswers, error: sourceAnswersError } = await supabase
    .from("question_accepted_answers")
    .select(QUESTION_ACCEPTED_ANSWER_DUPLICATE_SELECT)
    .eq("question_id", sourceQuestionId)
    .order("is_primary", { ascending: false });

  if (sourceAnswersError) {
    console.error(messages.loadAnswersLog, sourceAnswersError);
    throw new Error(messages.loadAnswersError);
  }

  const answerRows = (sourceAnswers ?? []).map((answer) => ({
    question_id: targetQuestionId,
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
      console.error(messages.insertAnswersLog, insertAnswersError);
      throw new Error(messages.insertAnswersError);
    }
  }
}

export async function copyQuestionRowsIntoSet({
  supabase,
  sourceQuestionSetId,
  targetQuestionSetId,
  messages,
}: {
  supabase: SupabaseServerClient;
  sourceQuestionSetId: string;
  targetQuestionSetId: string;
  messages: CopyQuestionRowsMessages;
}) {
  const { data: sourceQuestions, error: sourceQuestionsError } = await supabase
    .from("questions")
    .select(QUESTION_DUPLICATE_SELECT)
    .eq("question_set_id", sourceQuestionSetId)
    .order("position", { ascending: true });

  if (sourceQuestionsError) {
    console.error(messages.loadQuestionsLog, sourceQuestionsError);
    throw new Error(messages.loadQuestionsError);
  }

  const questionIdMap = new Map<string, string>();

  for (const sourceQuestion of (sourceQuestions ?? []) as SourceQuestionRow[]) {
    const { data: copiedQuestion, error: copiedQuestionError } = await supabase
      .from("questions")
      .insert(getQuestionCopyInsert(sourceQuestion, targetQuestionSetId))
      .select("id")
      .single();

    if (copiedQuestionError || !copiedQuestion) {
      console.error(messages.insertQuestionLog, copiedQuestionError);
      throw new Error(messages.insertQuestionError);
    }

    questionIdMap.set(sourceQuestion.id, copiedQuestion.id);
  }

  for (const sourceQuestion of (sourceQuestions ?? []) as SourceQuestionRow[]) {
    const targetQuestionId = questionIdMap.get(sourceQuestion.id);

    if (!targetQuestionId) {
      continue;
    }

    await copyQuestionAnswerRows({
      supabase,
      sourceQuestionId: sourceQuestion.id,
      targetQuestionId,
      questionType: sourceQuestion.question_type,
      messages: messages.copyRowsMessages,
    });
  }
}
