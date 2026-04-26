import { createClient } from "@/lib/supabase/server";

import {
  QUESTION_ACCEPTED_ANSWER_SELECT,
  QUESTION_OPTION_SELECT,
  QUESTION_SELECT,
  QUESTION_SET_SELECT,
} from "./question-selects";
import type {
  DbQuestion,
  DbQuestionAcceptedAnswer,
  DbQuestionOption,
  DbQuestionSet,
} from "./question-db-types";

export async function getQuestionSetBySlugDb(questionSetSlug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_sets")
    .select(QUESTION_SET_SELECT)
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
    .select(QUESTION_SELECT)
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
    .select(QUESTION_OPTION_SELECT)
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
    .select(QUESTION_ACCEPTED_ANSWER_SELECT)
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
    .select(QUESTION_SET_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching question sets:", error);
    return [];
  }

  return (data ?? []) as DbQuestionSet[];
}

export async function getQuestionSetByIdDb(questionSetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_sets")
    .select(QUESTION_SET_SELECT)
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
    .select(QUESTION_SELECT)
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
    .select(QUESTION_SELECT)
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
    .select(QUESTION_OPTION_SELECT)
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
    .select(QUESTION_ACCEPTED_ANSWER_SELECT)
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
    .select(QUESTION_SET_SELECT)
    .eq("is_template", true)
    .order("template_type", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching question set templates:", error);
    return [];
  }

  return (data ?? []) as DbQuestionSet[];
}
