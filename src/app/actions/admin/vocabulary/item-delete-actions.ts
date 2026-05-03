"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  buildItemsPath,
  getRequiredString,
} from "@/app/actions/admin/vocabulary/item-action-helpers";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { getVocabularyItemCoverageByItemIdsDb } from "@/lib/vocabulary/items/item-queries";
import { deleteVocabularyItemDb } from "@/lib/vocabulary/items/mutations";

export async function deleteVocabularyItemAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const vocabularyItemId = getRequiredString(formData, "vocabularyItemId");
  const vocabularySetId = getRequiredString(formData, "vocabularySetId");
  const coverageById = await getVocabularyItemCoverageByItemIdsDb([vocabularyItemId]);
  const coverage = coverageById.get(vocabularyItemId);

  if (
    coverage?.used_in_foundation ||
    coverage?.used_in_higher ||
    coverage?.used_in_volna
  ) {
    throw new Error("Remove this item from lesson-used vocabulary coverage before deleting it");
  }

  await deleteVocabularyItemDb({ vocabularyItemId, vocabularySetId });

  const path = buildItemsPath(vocabularySetId);
  revalidatePath("/admin/vocabulary");
  revalidatePath(path);
  redirect(path);
}
