"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import type {
  DbVocabularyDisplayVariant,
  DbVocabularyListMode,
  DbVocabularySetType,
  DbVocabularyTier,
} from "@/lib/vocabulary/vocabulary-helpers-db";
import { ensureDefaultVocabularyListForSetDb } from "@/lib/vocabulary/vocabulary-helpers-db";
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

function assertVocabularyTier(value: string): DbVocabularyTier {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("Invalid vocabulary tier");
}

function assertVocabularyListMode(value: string): DbVocabularyListMode {
  if (
    value === "spec_only" ||
    value === "extended_only" ||
    value === "spec_and_extended" ||
    value === "custom"
  ) {
    return value;
  }

  throw new Error("Invalid vocabulary list mode");
}

function assertVocabularySetType(value: string): DbVocabularySetType {
  if (
    value === "specification" ||
    value === "core" ||
    value === "theme" ||
    value === "phrase_bank" ||
    value === "exam_prep" ||
    value === "lesson_custom"
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

export async function createVocabularySetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const title = getTrimmedString(formData, "title");
  const slug = getOptionalString(formData, "slug");
  const description = getOptionalString(formData, "description");
  const themeKey = getOptionalString(formData, "themeKey");
  const topicKey = getOptionalString(formData, "topicKey");
  const tier = assertVocabularyTier(getTrimmedString(formData, "tier") || "both");
  const listMode = assertVocabularyListMode(
    getTrimmedString(formData, "listMode") || "custom"
  );
  const setType = assertVocabularySetType(
    getTrimmedString(formData, "setType") || "lesson_custom"
  );
  const defaultDisplayVariant = assertVocabularyDisplayVariant(
    getTrimmedString(formData, "defaultDisplayVariant") || "single_column"
  );
  const isPublished = getBoolean(formData, "isPublished");
  const sortOrder = getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0;
  const sourceKey = getOptionalString(formData, "sourceKey");
  const sourceVersion = getOptionalString(formData, "sourceVersion");
  const importKey = getOptionalString(formData, "importKey");

  if (!title) {
    throw new Error("Title is required");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_sets")
    .insert({
      title,
      slug,
      description,
      theme_key: themeKey,
      topic_key: topicKey,
      tier,
      list_mode: listMode,
      set_type: setType,
      default_display_variant: defaultDisplayVariant,
      is_published: isPublished,
      sort_order: sortOrder,
      source_key: sourceKey,
      source_version: sourceVersion,
      import_key: importKey,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error creating vocabulary set:", error);
    throw new Error("Failed to create vocabulary set");
  }

  if (data) {
    await ensureDefaultVocabularyListForSetDb({
      ...data,
      source_key: data.source_key ?? null,
      source_version: data.source_version ?? null,
      import_key: data.import_key ?? null,
    });
  }

  redirect("/admin/vocabulary");
}

export async function updateVocabularySetAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const vocabularySetId = getTrimmedString(formData, "vocabularySetId");
  const title = getTrimmedString(formData, "title");
  const slug = getOptionalString(formData, "slug");
  const description = getOptionalString(formData, "description");
  const themeKey = getOptionalString(formData, "themeKey");
  const topicKey = getOptionalString(formData, "topicKey");
  const tier = assertVocabularyTier(getTrimmedString(formData, "tier") || "both");
  const listMode = assertVocabularyListMode(
    getTrimmedString(formData, "listMode") || "custom"
  );
  const setType = assertVocabularySetType(
    getTrimmedString(formData, "setType") || "lesson_custom"
  );
  const defaultDisplayVariant = assertVocabularyDisplayVariant(
    getTrimmedString(formData, "defaultDisplayVariant") || "single_column"
  );
  const isPublished = getBoolean(formData, "isPublished");
  const sortOrder = getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0;
  const sourceKey = getOptionalString(formData, "sourceKey");
  const sourceVersion = getOptionalString(formData, "sourceVersion");
  const importKey = getOptionalString(formData, "importKey");

  if (!vocabularySetId || !title) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("vocabulary_sets")
    .update({
      title,
      slug,
      description,
      theme_key: themeKey,
      topic_key: topicKey,
      tier,
      list_mode: listMode,
      set_type: setType,
      default_display_variant: defaultDisplayVariant,
      is_published: isPublished,
      sort_order: sortOrder,
      source_key: sourceKey,
      source_version: sourceVersion,
      import_key: importKey,
    })
    .eq("id", vocabularySetId);

  if (error) {
    console.error("Error updating vocabulary set:", error);
    throw new Error("Failed to update vocabulary set");
  }

  redirect("/admin/vocabulary");
}
