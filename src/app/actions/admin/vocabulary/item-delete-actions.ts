"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  buildItemsPath,
  getRequiredString,
} from "@/app/actions/admin/vocabulary/item-action-helpers";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";

export async function deleteVocabularyItemAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const vocabularyItemId = getRequiredString(formData, "vocabularyItemId");
  const vocabularySetId = getRequiredString(formData, "vocabularySetId");

  const supabase = await createClient();

  const { error } = await supabase
    .from("vocabulary_items")
    .delete()
    .eq("id", vocabularyItemId)
    .eq("vocabulary_set_id", vocabularySetId);

  if (error) {
    console.error("Error deleting vocabulary item:", {
      vocabularyItemId,
      vocabularySetId,
      error,
    });
    throw new Error("Failed to delete vocabulary item");
  }

  const path = buildItemsPath(vocabularySetId);
  revalidatePath("/admin/vocabulary");
  revalidatePath(path);
  redirect(path);
}
