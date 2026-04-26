import {
  buildRuntimeQuestionSet,
  type RuntimeQuestion,
  type RuntimeQuestionSet,
} from "@/lib/questions/question-engine";

import {
  getAcceptedAnswersByQuestionIdsDb,
  getQuestionOptionsByQuestionIdsDb,
  getQuestionsByQuestionSetIdDb,
  getQuestionSetBySlugDb,
} from "./question-queries";
import type {
  DbQuestion,
  DbQuestionAcceptedAnswer,
  DbQuestionOption,
} from "./question-db-types";

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
  const [options, acceptedAnswers] = await Promise.all([
    getQuestionOptionsByQuestionIdsDb(questionIds),
    getAcceptedAnswersByQuestionIdsDb(questionIds),
  ]);

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
