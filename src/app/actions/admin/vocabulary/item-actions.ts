"use server";

import {
  bulkCreateVocabularyItemsAction as bulkCreateVocabularyItems,
  createVocabularyItemAction as createVocabularyItem,
} from "@/app/actions/admin/vocabulary/item-create-actions";
import { deleteVocabularyItemAction as deleteVocabularyItem } from "@/app/actions/admin/vocabulary/item-delete-actions";
import { updateVocabularyItemAction as updateVocabularyItem } from "@/app/actions/admin/vocabulary/item-update-actions";

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
