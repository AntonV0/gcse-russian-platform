import { createClient } from "@/lib/supabase/server";
import {
  buildRuntimeQuestionSet,
  type RuntimeQuestion,
  type RuntimeQuestionSet,
} from "@/lib/questions/question-engine";

export type DbQuestionSet = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  instructions: string | null;
  source_type: string;
  is_template: boolean;
  template_type: string | null;
  created_at: string;
  updated_at: string;
};

export type DbQuestion = {
  id: string;
  question_set_id: string;
  question_type: string;
  prompt: string;
  prompt_rich: unknown;
  explanation: string | null;
  difficulty: number | null;
  marks: number;
  audio_path: string | null;
  image_path: string | null;
  metadata: Record<string, unknown>;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbQuestionOption = {
  id: string;
  question_id: string;
  option_text: string | null;
  option_rich: unknown;
  is_correct: boolean | null;
  match_group: string | null;
  position: number;
};

export type DbQuestionAcceptedAnswer = {
  id: string;
  question_id: string;
  answer_text: string;
  normalized_answer: string | null;
  is_primary: boolean;
  case_sensitive: boolean;
  notes: string | null;
};

export async function getQuestionSetBySlugDb(questionSetSlug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_sets")
    .select("*")
    .eq("slug", questionSetSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching question set by slug:", {
      questionSetSlug,
      error,
    });
    return null;
  }

  return (data as DbQuestionSet | null) ?? null;
}

export async function getQuestionsByQuestionSetIdDb(questionSetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("question_set_id", questionSetId)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching questions by question set id:", {
      questionSetId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbQuestion[];
}

export async function getQuestionOptionsByQuestionIdsDb(questionIds: string[]) {
  if (questionIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_options")
    .select("*")
    .in("question_id", questionIds)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching question options:", { questionIds, error });
    return [];
  }

  return (data ?? []) as DbQuestionOption[];
}

export async function getAcceptedAnswersByQuestionIdsDb(questionIds: string[]) {
  if (questionIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_accepted_answers")
    .select("*")
    .in("question_id", questionIds);

  if (error) {
    console.error("Error fetching accepted answers:", { questionIds, error });
    return [];
  }

  return (data ?? []) as DbQuestionAcceptedAnswer[];
}

export async function getQuestionSetsDb() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_sets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching question sets:", error);
    return [];
  }

  return (data ?? []) as DbQuestionSet[];
}

export async function loadQuestionSetBySlugDb(questionSetSlug: string) {
  const questionSet = await getQuestionSetBySlugDb(questionSetSlug);
  if (!questionSet) {
    return {
      questionSet: null,
      questions: [] as DbQuestion[],
      options: [] as DbQuestionOption[],
      acceptedAnswers: [] as DbQuestionAcceptedAnswer[],
    };
  }

  const questions = await getQuestionsByQuestionSetIdDb(questionSet.id);
  const questionIds = questions.map((q) => q.id);
  const options = await getQuestionOptionsByQuestionIdsDb(questionIds);
  const acceptedAnswers = await getAcceptedAnswersByQuestionIdsDb(questionIds);

  return {
    questionSet,
    questions,
    options,
    acceptedAnswers,
  };
}

export async function loadRuntimeQuestionSetBySlugDb(questionSetSlug: string): Promise<{
  questionSet: RuntimeQuestionSet["questionSet"] | null;
  questions: RuntimeQuestion[];
}> {
  const { questionSet, questions, options, acceptedAnswers } =
    await loadQuestionSetBySlugDb(questionSetSlug);

  if (!questionSet) {
    return {
      questionSet: null,
      questions: [],
    };
  }

  const runtimeQuestionSet = buildRuntimeQuestionSet({
    questionSet,
    questions,
    options,
    acceptedAnswers,
  });

  return runtimeQuestionSet;
}

export async function getQuestionSetByIdDb(questionSetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_sets")
    .select("*")
    .eq("id", questionSetId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching question set by id:", {
      questionSetId,
      error,
    });
    return null;
  }

  return (data as DbQuestionSet | null) ?? null;
}

export async function getQuestionsByQuestionSetIdIncludingInactiveDb(
  questionSetId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("question_set_id", questionSetId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching questions by question set id:", {
      questionSetId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbQuestion[];
}

export async function getQuestionByIdDb(questionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", questionId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching question by id:", {
      questionId,
      error,
    });
    return null;
  }

  return (data as DbQuestion | null) ?? null;
}

export async function getQuestionOptionsByQuestionIdDb(questionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_options")
    .select("*")
    .eq("question_id", questionId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching question options:", {
      questionId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbQuestionOption[];
}

export async function getAcceptedAnswersByQuestionIdDb(questionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_accepted_answers")
    .select("*")
    .eq("question_id", questionId)
    .order("is_primary", { ascending: false })
    .order("answer_text", { ascending: true });

  if (error) {
    console.error("Error fetching accepted answers:", {
      questionId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbQuestionAcceptedAnswer[];
}

export async function getQuestionSetTemplatesDb() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_sets")
    .select("*")
    .eq("is_template", true)
    .order("template_type", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching question set templates:", error);
    return [];
  }

  return (data ?? []) as DbQuestionSet[];
}
