"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  createVocabularySetDb,
  deleteVocabularySetDb,
  updateVocabularySetDb,
  type VocabularySetMutationPayload,
} from "@/lib/vocabulary/items/mutations";
import { loadVocabularySetByIdDb } from "@/lib/vocabulary/sets/loaders";
import type {
  DbVocabularyDisplayVariant,
  DbVocabularyListMode,
  DbVocabularySetType,
  DbVocabularyTier,
} from "@/lib/vocabulary/shared/types";
import {
  getBoolean,
  getOptionalString,
  getTrimmedString,
} from "@/app/actions/shared/form-data";

function getOptionalNonNegativeNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);

  if (!raw) return null;

  const value = Number(raw);

  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${key} must be a non-negative number`);
  }

  return value;
}

function assertVocabularyTier(
  value: string,
  { allowLegacy = false }: { allowLegacy?: boolean } = {}
): DbVocabularyTier {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    (allowLegacy && value === "unknown")
  ) {
    return value;
  }

  throw new Error("Invalid vocabulary tier");
}

function assertVocabularyListMode(
  value: string,
  { allowLegacy = false }: { allowLegacy?: boolean } = {}
): DbVocabularyListMode {
  if (
    value === "spec_only" ||
    value === "custom" ||
    (allowLegacy && value === "extended_only") ||
    (allowLegacy && value === "spec_and_extended")
  ) {
    return value;
  }

  throw new Error("Invalid vocabulary list mode");
}

function assertVocabularySetType(
  value: string,
  { allowLegacy = false }: { allowLegacy?: boolean } = {}
): DbVocabularySetType {
  if (
    value === "specification" ||
    value === "lesson_custom" ||
    (allowLegacy && value === "core") ||
    (allowLegacy && value === "theme") ||
    (allowLegacy && value === "phrase_bank") ||
    (allowLegacy && value === "exam_prep")
  ) {
    return value;
  }

  throw new Error("Invalid vocabulary set type");
}

function assertVocabularyDisplayVariant(value: string): DbVocabularyDisplayVariant {
  if (value === "single_column" || value === "two_column" || value === "compact_cards") {
    return value;
  }

  throw new Error("Invalid vocabulary display variant");
}

function getVocabularySetMutationPayload(
  formData: FormData,
  { allowLegacyMetadata = false }: { allowLegacyMetadata?: boolean } = {}
): VocabularySetMutationPayload {
  const title = getTrimmedString(formData, "title");
  const tier = assertVocabularyTier(getTrimmedString(formData, "tier") || "both", {
    allowLegacy: allowLegacyMetadata,
  });
  const listMode = assertVocabularyListMode(
    getTrimmedString(formData, "listMode") || "custom",
    { allowLegacy: allowLegacyMetadata }
  );
  const setType = assertVocabularySetType(
    getTrimmedString(formData, "setType") || "lesson_custom",
    { allowLegacy: allowLegacyMetadata }
  );
  const defaultDisplayVariant = assertVocabularyDisplayVariant(
    getTrimmedString(formData, "defaultDisplayVariant") || "single_column"
  );

  if (!title) {
    throw new Error("Title is required");
  }

  return {
    title,
    slug: getOptionalString(formData, "slug"),
    description: getOptionalString(formData, "description"),
    theme_key: getOptionalString(formData, "themeKey"),
    topic_key: getOptionalString(formData, "topicKey"),
    tier,
    list_mode: listMode,
    set_type: setType,
    default_display_variant: defaultDisplayVariant,
    is_published: getBoolean(formData, "isPublished"),
    sort_order: getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0,
    source_key: getOptionalString(formData, "sourceKey"),
    source_version: getOptionalString(formData, "sourceVersion"),
    import_key: getOptionalString(formData, "importKey"),
  };
}

export async function createVocabularySetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  await createVocabularySetDb(getVocabularySetMutationPayload(formData));

  revalidatePath("/admin/vocabulary");
  revalidatePath("/vocabulary");
  redirect("/admin/vocabulary");
}

export async function updateVocabularySetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const vocabularySetId = getTrimmedString(formData, "vocabularySetId");

  if (!vocabularySetId) {
    throw new Error("Missing required fields");
  }

  await updateVocabularySetDb(
    vocabularySetId,
    getVocabularySetMutationPayload(formData, { allowLegacyMetadata: true })
  );

  revalidatePath("/admin/vocabulary");
  revalidatePath(`/admin/vocabulary/${vocabularySetId}/edit`);
  revalidatePath("/vocabulary");
  redirect("/admin/vocabulary");
}

export async function deleteVocabularySetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const vocabularySetId = getTrimmedString(formData, "vocabularySetId");

  if (!vocabularySetId) {
    throw new Error("Vocabulary set id is required");
  }

  const { items, usageStats } = await loadVocabularySetByIdDb(vocabularySetId);

  if (usageStats.totalOccurrences > 0) {
    throw new Error("Remove this vocabulary set from lessons before deleting it");
  }

  if (items.length > 0) {
    throw new Error("Delete the vocabulary items before deleting this set");
  }

  await deleteVocabularySetDb(vocabularySetId);

  revalidatePath("/admin/vocabulary");
  revalidatePath("/vocabulary");
  redirect("/admin/vocabulary");
}
