"use server";

import {
  bulkCreateVocabularyItemsAction as bulkCreateVocabularyItems,
  createVocabularyItemAction as createVocabularyItem,
  deleteVocabularyItemAction as deleteVocabularyItem,
  updateVocabularyItemAction as updateVocabularyItem,
} from "@/app/actions/admin/vocabulary/item-actions";

export async function createVocabularyItemAction(formData: FormData) {
  return createVocabularyItem(formData);
}

export async function bulkCreateVocabularyItemsAction(formData: FormData) {
  return bulkCreateVocabularyItems(formData);
}

export async function updateVocabularyItemAction(formData: FormData) {
  return updateVocabularyItem(formData);
}

export async function deleteVocabularyItemAction(formData: FormData) {
  return deleteVocabularyItem(formData);
}
