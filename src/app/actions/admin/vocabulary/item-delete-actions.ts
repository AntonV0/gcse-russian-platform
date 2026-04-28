"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  buildItemsPath,
  getRequiredString,
} from "@/app/actions/admin/vocabulary/item-action-helpers";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { deleteVocabularyItemDb } from "@/lib/vocabulary/items/mutations";

export async function deleteVocabularyItemAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const vocabularyItemId = getRequiredString(formData, "vocabularyItemId");
  const vocabularySetId = getRequiredString(formData, "vocabularySetId");

  await deleteVocabularyItemDb({ vocabularyItemId, vocabularySetId });

  const path = buildItemsPath(vocabularySetId);
  revalidatePath("/admin/vocabulary");
  revalidatePath(path);
  redirect(path);
}
