import type { QuestionInteractionType } from "./question-taxonomy-types";
import { QUESTION_OBJECTIVE_INTERACTION_TYPES } from "./question-objective-interaction-type-data";
import { QUESTION_TEACHER_MARKED_INTERACTION_TYPES } from "./question-teacher-marked-interaction-type-data";

export const QUESTION_INTERACTION_TYPES = [
  ...QUESTION_OBJECTIVE_INTERACTION_TYPES,
  ...QUESTION_TEACHER_MARKED_INTERACTION_TYPES,
] as const satisfies readonly QuestionInteractionType[];
