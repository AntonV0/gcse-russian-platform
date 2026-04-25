"use server";

import {
  createMockExamQuestionAction as createMockExamQuestion,
  createMockExamSectionAction as createMockExamSection,
  createMockExamSetAction as createMockExamSet,
  deleteMockExamQuestionAction as deleteMockExamQuestion,
  deleteMockExamSectionAction as deleteMockExamSection,
  deleteMockExamSetAction as deleteMockExamSet,
  markMockExamAttemptAction as markMockExamAttempt,
  updateMockExamQuestionAction as updateMockExamQuestion,
  updateMockExamSectionAction as updateMockExamSection,
  updateMockExamSetAction as updateMockExamSet,
} from "@/app/actions/admin/mock-exams/mock-exam-actions";

export async function createMockExamSetAction(formData: FormData) {
  return createMockExamSet(formData);
}

export async function updateMockExamSetAction(formData: FormData) {
  return updateMockExamSet(formData);
}

export async function deleteMockExamSetAction(formData: FormData) {
  return deleteMockExamSet(formData);
}

export async function createMockExamSectionAction(formData: FormData) {
  return createMockExamSection(formData);
}

export async function updateMockExamSectionAction(formData: FormData) {
  return updateMockExamSection(formData);
}

export async function deleteMockExamSectionAction(formData: FormData) {
  return deleteMockExamSection(formData);
}

export async function createMockExamQuestionAction(formData: FormData) {
  return createMockExamQuestion(formData);
}

export async function updateMockExamQuestionAction(formData: FormData) {
  return updateMockExamQuestion(formData);
}

export async function deleteMockExamQuestionAction(formData: FormData) {
  return deleteMockExamQuestion(formData);
}

export async function markMockExamAttemptAction(formData: FormData) {
  return markMockExamAttempt(formData);
}
