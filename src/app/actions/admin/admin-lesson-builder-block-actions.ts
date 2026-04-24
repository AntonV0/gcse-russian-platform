"use server";

import { insertBlockPresetAction as insertBlockPreset } from "@/app/actions/admin/lesson-builder-block-actions/preset-actions";
import {
  createCalloutBlockAction as createCalloutBlock,
  createDividerBlockAction as createDividerBlock,
  createExamTipBlockAction as createExamTipBlock,
  createHeaderBlockAction as createHeaderBlock,
  createNoteBlockAction as createNoteBlock,
  createSubheaderBlockAction as createSubheaderBlock,
  createTextBlockAction as createTextBlock,
  updateCalloutBlockAction as updateCalloutBlock,
  updateExamTipBlockAction as updateExamTipBlock,
  updateHeaderBlockAction as updateHeaderBlock,
  updateNoteBlockAction as updateNoteBlock,
  updateSubheaderBlockAction as updateSubheaderBlock,
  updateTextBlockAction as updateTextBlock,
} from "@/app/actions/admin/lesson-builder-block-actions/content-block-actions";
import {
  createAudioBlockAction as createAudioBlock,
  createImageBlockAction as createImageBlock,
  updateAudioBlockAction as updateAudioBlock,
  updateImageBlockAction as updateImageBlock,
} from "@/app/actions/admin/lesson-builder-block-actions/media-block-actions";
import {
  createQuestionSetBlockAction as createQuestionSetBlock,
  createVocabularyBlockAction as createVocabularyBlock,
  createVocabularySetBlockAction as createVocabularySetBlock,
  updateQuestionSetBlockAction as updateQuestionSetBlock,
  updateVocabularyBlockAction as updateVocabularyBlock,
  updateVocabularySetBlockAction as updateVocabularySetBlock,
} from "@/app/actions/admin/lesson-builder-block-actions/linked-block-actions";
import {
  deleteBlockAction as deleteBlock,
  duplicateBlockAction as duplicateBlock,
  moveBlockAction as moveBlock,
  moveBlockToSectionAction as moveBlockToSection,
  reorderBlocksAction as reorderBlocks,
  toggleBlockPublishedAction as toggleBlockPublished,
} from "@/app/actions/admin/lesson-builder-block-actions/block-management-actions";

export async function insertBlockPresetAction(formData: FormData) {
  return insertBlockPreset(formData);
}

export async function createCalloutBlockAction(formData: FormData) {
  return createCalloutBlock(formData);
}

export async function createDividerBlockAction(formData: FormData) {
  return createDividerBlock(formData);
}

export async function createExamTipBlockAction(formData: FormData) {
  return createExamTipBlock(formData);
}

export async function createHeaderBlockAction(formData: FormData) {
  return createHeaderBlock(formData);
}

export async function createNoteBlockAction(formData: FormData) {
  return createNoteBlock(formData);
}

export async function createSubheaderBlockAction(formData: FormData) {
  return createSubheaderBlock(formData);
}

export async function createTextBlockAction(formData: FormData) {
  return createTextBlock(formData);
}

export async function updateCalloutBlockAction(formData: FormData) {
  return updateCalloutBlock(formData);
}

export async function updateExamTipBlockAction(formData: FormData) {
  return updateExamTipBlock(formData);
}

export async function updateHeaderBlockAction(formData: FormData) {
  return updateHeaderBlock(formData);
}

export async function updateNoteBlockAction(formData: FormData) {
  return updateNoteBlock(formData);
}

export async function updateSubheaderBlockAction(formData: FormData) {
  return updateSubheaderBlock(formData);
}

export async function updateTextBlockAction(formData: FormData) {
  return updateTextBlock(formData);
}

export async function createAudioBlockAction(formData: FormData) {
  return createAudioBlock(formData);
}

export async function createImageBlockAction(formData: FormData) {
  return createImageBlock(formData);
}

export async function updateAudioBlockAction(formData: FormData) {
  return updateAudioBlock(formData);
}

export async function updateImageBlockAction(formData: FormData) {
  return updateImageBlock(formData);
}

export async function createQuestionSetBlockAction(formData: FormData) {
  return createQuestionSetBlock(formData);
}

export async function createVocabularyBlockAction(formData: FormData) {
  return createVocabularyBlock(formData);
}

export async function createVocabularySetBlockAction(formData: FormData) {
  return createVocabularySetBlock(formData);
}

export async function updateQuestionSetBlockAction(formData: FormData) {
  return updateQuestionSetBlock(formData);
}

export async function updateVocabularyBlockAction(formData: FormData) {
  return updateVocabularyBlock(formData);
}

export async function updateVocabularySetBlockAction(formData: FormData) {
  return updateVocabularySetBlock(formData);
}

export async function deleteBlockAction(formData: FormData) {
  return deleteBlock(formData);
}

export async function duplicateBlockAction(formData: FormData) {
  return duplicateBlock(formData);
}

export async function moveBlockAction(formData: FormData) {
  return moveBlock(formData);
}

export async function moveBlockToSectionAction(formData: FormData) {
  return moveBlockToSection(formData);
}

export async function reorderBlocksAction(formData: FormData) {
  return reorderBlocks(formData);
}

export async function toggleBlockPublishedAction(formData: FormData) {
  return toggleBlockPublished(formData);
}
