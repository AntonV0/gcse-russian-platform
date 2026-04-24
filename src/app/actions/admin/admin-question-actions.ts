"use server";

import {
  createQuestionSetAction as createQuestionSet,
  deleteQuestionSetAction as deleteQuestionSet,
  updateQuestionSetAction as updateQuestionSet,
} from "@/app/actions/admin/questions/question-set-actions";
import {
  createQuestionAction as createQuestion,
  deleteQuestionAction as deleteQuestion,
  toggleQuestionActiveAction as toggleQuestionActive,
  updateQuestionAction as updateQuestion,
} from "@/app/actions/admin/questions/question-actions";
import {
  moveQuestionAction as moveQuestion,
  normalizeQuestionPositionsAction as normalizeQuestionPositions,
} from "@/app/actions/admin/questions/question-order-actions";
import {
  createQuestionSetFromTemplateAction as createQuestionSetFromTemplate,
  duplicateQuestionAction as duplicateQuestion,
  duplicateQuestionSetAction as duplicateQuestionSet,
} from "@/app/actions/admin/questions/question-duplication-actions";

export async function createQuestionSetAction(formData: FormData) {
  return createQuestionSet(formData);
}

export async function deleteQuestionSetAction(formData: FormData) {
  return deleteQuestionSet(formData);
}

export async function updateQuestionSetAction(formData: FormData) {
  return updateQuestionSet(formData);
}

export async function createQuestionAction(formData: FormData) {
  return createQuestion(formData);
}

export async function deleteQuestionAction(formData: FormData) {
  return deleteQuestion(formData);
}

export async function toggleQuestionActiveAction(formData: FormData) {
  return toggleQuestionActive(formData);
}

export async function updateQuestionAction(formData: FormData) {
  return updateQuestion(formData);
}

export async function moveQuestionAction(formData: FormData) {
  return moveQuestion(formData);
}

export async function normalizeQuestionPositionsAction(formData: FormData) {
  return normalizeQuestionPositions(formData);
}

export async function createQuestionSetFromTemplateAction(formData: FormData) {
  return createQuestionSetFromTemplate(formData);
}

export async function duplicateQuestionAction(formData: FormData) {
  return duplicateQuestion(formData);
}

export async function duplicateQuestionSetAction(formData: FormData) {
  return duplicateQuestionSet(formData);
}
