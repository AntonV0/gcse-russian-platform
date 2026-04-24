"use server";

import {
  insertLessonTemplateAction as insertLessonTemplate,
  insertSectionTemplateAction as insertSectionTemplate,
} from "@/app/actions/admin/lesson-template-actions/insert-actions";
import {
  createLessonBlockPresetAction as createLessonBlockPreset,
  createLessonBlockPresetBlockAction as createLessonBlockPresetBlock,
  deleteLessonBlockPresetAction as deleteLessonBlockPreset,
  deleteLessonBlockPresetBlockAction as deleteLessonBlockPresetBlock,
  reorderLessonBlockPresetBlocksAction as reorderLessonBlockPresetBlocks,
  updateLessonBlockPresetAction as updateLessonBlockPreset,
  updateLessonBlockPresetBlockAction as updateLessonBlockPresetBlock,
} from "@/app/actions/admin/lesson-template-actions/block-preset-actions";
import {
  addPresetToLessonSectionTemplateAction as addPresetToLessonSectionTemplate,
  createLessonSectionTemplateAction as createLessonSectionTemplate,
  deleteLessonSectionTemplateAction as deleteLessonSectionTemplate,
  removePresetFromLessonSectionTemplateAction as removePresetFromLessonSectionTemplate,
  reorderLessonSectionTemplatePresetsAction as reorderLessonSectionTemplatePresets,
  updateLessonSectionTemplateAction as updateLessonSectionTemplate,
} from "@/app/actions/admin/lesson-template-actions/section-template-actions";
import {
  addSectionToLessonTemplateAction as addSectionToLessonTemplate,
  createLessonTemplateAction as createLessonTemplate,
  deleteLessonTemplateAction as deleteLessonTemplate,
  removeSectionFromLessonTemplateAction as removeSectionFromLessonTemplate,
  reorderLessonTemplateSectionsAction as reorderLessonTemplateSections,
  updateLessonTemplateAction as updateLessonTemplate,
  updateLessonTemplateSectionAction as updateLessonTemplateSection,
} from "@/app/actions/admin/lesson-template-actions/lesson-template-actions";

export async function insertLessonTemplateAction(formData: FormData) {
  return insertLessonTemplate(formData);
}

export async function insertSectionTemplateAction(formData: FormData) {
  return insertSectionTemplate(formData);
}

export async function createLessonBlockPresetAction(formData: FormData) {
  return createLessonBlockPreset(formData);
}

export async function createLessonBlockPresetBlockAction(formData: FormData) {
  return createLessonBlockPresetBlock(formData);
}

export async function deleteLessonBlockPresetAction(formData: FormData) {
  return deleteLessonBlockPreset(formData);
}

export async function deleteLessonBlockPresetBlockAction(formData: FormData) {
  return deleteLessonBlockPresetBlock(formData);
}

export async function reorderLessonBlockPresetBlocksAction(formData: FormData) {
  return reorderLessonBlockPresetBlocks(formData);
}

export async function updateLessonBlockPresetAction(formData: FormData) {
  return updateLessonBlockPreset(formData);
}

export async function updateLessonBlockPresetBlockAction(formData: FormData) {
  return updateLessonBlockPresetBlock(formData);
}

export async function addPresetToLessonSectionTemplateAction(formData: FormData) {
  return addPresetToLessonSectionTemplate(formData);
}

export async function createLessonSectionTemplateAction(formData: FormData) {
  return createLessonSectionTemplate(formData);
}

export async function deleteLessonSectionTemplateAction(formData: FormData) {
  return deleteLessonSectionTemplate(formData);
}

export async function removePresetFromLessonSectionTemplateAction(formData: FormData) {
  return removePresetFromLessonSectionTemplate(formData);
}

export async function reorderLessonSectionTemplatePresetsAction(formData: FormData) {
  return reorderLessonSectionTemplatePresets(formData);
}

export async function updateLessonSectionTemplateAction(formData: FormData) {
  return updateLessonSectionTemplate(formData);
}

export async function addSectionToLessonTemplateAction(formData: FormData) {
  return addSectionToLessonTemplate(formData);
}

export async function createLessonTemplateAction(formData: FormData) {
  return createLessonTemplate(formData);
}

export async function deleteLessonTemplateAction(formData: FormData) {
  return deleteLessonTemplate(formData);
}

export async function removeSectionFromLessonTemplateAction(formData: FormData) {
  return removeSectionFromLessonTemplate(formData);
}

export async function reorderLessonTemplateSectionsAction(formData: FormData) {
  return reorderLessonTemplateSections(formData);
}

export async function updateLessonTemplateAction(formData: FormData) {
  return updateLessonTemplate(formData);
}

export async function updateLessonTemplateSectionAction(formData: FormData) {
  return updateLessonTemplateSection(formData);
}
