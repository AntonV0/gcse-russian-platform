"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOptionalString, getTrimmedString } from "@/app/actions/shared/form-data";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";

function getOptionalNonNegativeNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);

  if (!raw) return null;

  const value = Number(raw);

  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${key} must be a non-negative number`);
  }

  return value;
}

async function requireGrammarAdmin() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }
}

async function getNextExampleOrder(grammarPointId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("grammar_examples")
    .select("sort_order")
    .eq("grammar_point_id", grammarPointId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error calculating grammar example order:", {
      grammarPointId,
      error,
    });
    throw new Error("Failed to calculate grammar example order");
  }

  return (data?.sort_order ?? -1) + 1;
}

function getPointEditPath(grammarSetId: string, grammarPointId: string) {
  return `/admin/grammar/${grammarSetId}/points/${grammarPointId}/edit`;
}

export async function createGrammarExampleAction(formData: FormData) {
  await requireGrammarAdmin();

  const grammarSetId = getTrimmedString(formData, "grammarSetId");
  const grammarPointId = getTrimmedString(formData, "grammarPointId");
  const russianText = getTrimmedString(formData, "russianText");
  const englishTranslation = getTrimmedString(formData, "englishTranslation");
  const optionalHighlight = getOptionalString(formData, "optionalHighlight");
  const note = getOptionalString(formData, "note");
  const manualSortOrder = getOptionalNonNegativeNumber(formData, "sortOrder");

  if (!grammarSetId || !grammarPointId || !russianText || !englishTranslation) {
    throw new Error("Missing required fields");
  }

  const sortOrder = manualSortOrder ?? (await getNextExampleOrder(grammarPointId));
  const supabase = await createClient();

  const { error } = await supabase.from("grammar_examples").insert({
    grammar_point_id: grammarPointId,
    russian_text: russianText,
    english_translation: englishTranslation,
    optional_highlight: optionalHighlight,
    note,
    sort_order: sortOrder,
  });

  if (error) {
    console.error("Error creating grammar example:", { grammarPointId, error });
    throw new Error("Failed to create grammar example");
  }

  const path = getPointEditPath(grammarSetId, grammarPointId);
  revalidatePath(path);
  revalidatePath("/grammar");
  redirect(path);
}

export async function updateGrammarExampleAction(formData: FormData) {
  await requireGrammarAdmin();

  const grammarSetId = getTrimmedString(formData, "grammarSetId");
  const grammarPointId = getTrimmedString(formData, "grammarPointId");
  const grammarExampleId = getTrimmedString(formData, "grammarExampleId");
  const russianText = getTrimmedString(formData, "russianText");
  const englishTranslation = getTrimmedString(formData, "englishTranslation");
  const optionalHighlight = getOptionalString(formData, "optionalHighlight");
  const note = getOptionalString(formData, "note");
  const sortOrder = getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0;

  if (
    !grammarSetId ||
    !grammarPointId ||
    !grammarExampleId ||
    !russianText ||
    !englishTranslation
  ) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("grammar_examples")
    .update({
      russian_text: russianText,
      english_translation: englishTranslation,
      optional_highlight: optionalHighlight,
      note,
      sort_order: sortOrder,
    })
    .eq("id", grammarExampleId)
    .eq("grammar_point_id", grammarPointId);

  if (error) {
    console.error("Error updating grammar example:", {
      grammarExampleId,
      grammarPointId,
      error,
    });
    throw new Error("Failed to update grammar example");
  }

  const path = getPointEditPath(grammarSetId, grammarPointId);
  revalidatePath(path);
  revalidatePath("/grammar");
  redirect(path);
}

export async function deleteGrammarExampleAction(formData: FormData) {
  await requireGrammarAdmin();

  const grammarSetId = getTrimmedString(formData, "grammarSetId");
  const grammarPointId = getTrimmedString(formData, "grammarPointId");
  const grammarExampleId = getTrimmedString(formData, "grammarExampleId");

  if (!grammarSetId || !grammarPointId || !grammarExampleId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("grammar_examples")
    .delete()
    .eq("id", grammarExampleId)
    .eq("grammar_point_id", grammarPointId);

  if (error) {
    console.error("Error deleting grammar example:", {
      grammarExampleId,
      grammarPointId,
      error,
    });
    throw new Error("Failed to delete grammar example");
  }

  const path = getPointEditPath(grammarSetId, grammarPointId);
  revalidatePath(path);
  revalidatePath("/grammar");
  redirect(path);
}
