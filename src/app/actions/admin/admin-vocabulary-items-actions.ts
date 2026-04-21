"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import type {
  DbVocabularyItemPriority,
  DbVocabularyItemSourceType,
  DbVocabularyItemType,
} from "@/lib/vocabulary/vocabulary-helpers-db";

function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getOptionalString(formData: FormData, key: string) {
  const value = getTrimmedString(formData, key);
  return value.length > 0 ? value : null;
}

function getRequiredString(formData: FormData, key: string) {
  const value = getTrimmedString(formData, key);

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

function getOptionalNonNegativeNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);

  if (!raw) return null;

  const value = Number(raw);

  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${key} must be a non-negative number`);
  }

  return value;
}

function assertVocabularyItemType(value: string): DbVocabularyItemType {
  if (value === "word" || value === "phrase") {
    return value;
  }

  throw new Error("Invalid vocabulary item type");
}

function assertVocabularyItemSourceType(value: string): DbVocabularyItemSourceType {
  if (value === "spec_required" || value === "extended" || value === "custom") {
    return value;
  }

  throw new Error("Invalid vocabulary item source type");
}

function assertVocabularyItemPriority(value: string): DbVocabularyItemPriority {
  if (value === "core" || value === "extension") {
    return value;
  }

  throw new Error("Invalid vocabulary item priority");
}

async function getNextVocabularyItemPosition(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_items")
    .select("position")
    .eq("vocabulary_set_id", vocabularySetId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error loading last vocabulary item position:", {
      vocabularySetId,
      error,
    });
    throw new Error("Failed to calculate vocabulary item position");
  }

  return (data?.position ?? -1) + 1;
}

function buildItemsPath(vocabularySetId: string) {
  return `/admin/vocabulary/${vocabularySetId}/items`;
}

export async function createVocabularyItemAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const vocabularySetId = getRequiredString(formData, "vocabularySetId");
  const russian = getRequiredString(formData, "russian");
  const english = getRequiredString(formData, "english");
  const transliteration = getOptionalString(formData, "transliteration");
  const exampleRu = getOptionalString(formData, "exampleRu");
  const exampleEn = getOptionalString(formData, "exampleEn");
  const notes = getOptionalString(formData, "notes");
  const itemType = assertVocabularyItemType(
    getTrimmedString(formData, "itemType") || "word"
  );
  const sourceType = assertVocabularyItemSourceType(
    getTrimmedString(formData, "sourceType") || "custom"
  );
  const priority = assertVocabularyItemPriority(
    getTrimmedString(formData, "priority") || "core"
  );

  const supabase = await createClient();
  const position = await getNextVocabularyItemPosition(vocabularySetId);

  const { error } = await supabase.from("vocabulary_items").insert({
    vocabulary_set_id: vocabularySetId,
    russian,
    english,
    transliteration,
    example_ru: exampleRu,
    example_en: exampleEn,
    notes,
    item_type: itemType,
    source_type: sourceType,
    priority,
    position,
  });

  if (error) {
    console.error("Error creating vocabulary item:", {
      vocabularySetId,
      error,
    });
    throw new Error("Failed to create vocabulary item");
  }

  const path = buildItemsPath(vocabularySetId);
  revalidatePath("/admin/vocabulary");
  revalidatePath(path);
  redirect(path);
}

export async function updateVocabularyItemAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const vocabularyItemId = getRequiredString(formData, "vocabularyItemId");
  const vocabularySetId = getRequiredString(formData, "vocabularySetId");
  const russian = getRequiredString(formData, "russian");
  const english = getRequiredString(formData, "english");
  const transliteration = getOptionalString(formData, "transliteration");
  const exampleRu = getOptionalString(formData, "exampleRu");
  const exampleEn = getOptionalString(formData, "exampleEn");
  const notes = getOptionalString(formData, "notes");
  const itemType = assertVocabularyItemType(
    getTrimmedString(formData, "itemType") || "word"
  );
  const sourceType = assertVocabularyItemSourceType(
    getTrimmedString(formData, "sourceType") || "custom"
  );
  const priority = assertVocabularyItemPriority(
    getTrimmedString(formData, "priority") || "core"
  );
  const manualPosition = getOptionalNonNegativeNumber(formData, "position");

  const supabase = await createClient();

  const payload: {
    russian: string;
    english: string;
    transliteration: string | null;
    example_ru: string | null;
    example_en: string | null;
    notes: string | null;
    item_type: DbVocabularyItemType;
    source_type: DbVocabularyItemSourceType;
    priority: DbVocabularyItemPriority;
    position?: number;
  } = {
    russian,
    english,
    transliteration,
    example_ru: exampleRu,
    example_en: exampleEn,
    notes,
    item_type: itemType,
    source_type: sourceType,
    priority,
  };

  if (manualPosition !== null) {
    payload.position = manualPosition;
  }

  const { error } = await supabase
    .from("vocabulary_items")
    .update(payload)
    .eq("id", vocabularyItemId)
    .eq("vocabulary_set_id", vocabularySetId);

  if (error) {
    console.error("Error updating vocabulary item:", {
      vocabularyItemId,
      vocabularySetId,
      error,
    });
    throw new Error("Failed to update vocabulary item");
  }

  const path = buildItemsPath(vocabularySetId);
  revalidatePath("/admin/vocabulary");
  revalidatePath(path);
  redirect(path);
}

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
