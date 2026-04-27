"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOptionalString, getTrimmedString } from "@/app/actions/shared/form-data";
import {
  assertVocabularyAspect,
  assertVocabularyGender,
  assertVocabularyItemPriority,
  assertVocabularyItemSourceType,
  assertVocabularyItemType,
  assertVocabularyPartOfSpeech,
  assertVocabularyProductiveReceptive,
  assertVocabularyTier,
  buildItemsPath,
  getOptionalNonNegativeNumber,
  getRequiredString,
} from "@/app/actions/admin/vocabulary/item-action-helpers";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import type {
  DbVocabularyAspect,
  DbVocabularyGender,
  DbVocabularyItemPriority,
  DbVocabularyItemSourceType,
  DbVocabularyItemType,
  DbVocabularyPartOfSpeech,
  DbVocabularyProductiveReceptive,
  DbVocabularyTier,
} from "@/lib/vocabulary/types";

export async function updateVocabularyItemAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const vocabularyItemId = getRequiredString(formData, "vocabularyItemId");
  const vocabularySetId = getRequiredString(formData, "vocabularySetId");
  const vocabularyListId = getOptionalString(formData, "vocabularyListId");
  const russian = getRequiredString(formData, "russian");
  const english = getRequiredString(formData, "english");
  const canonicalKey = getOptionalString(formData, "canonicalKey");
  const transliteration = getOptionalString(formData, "transliteration");
  const exampleRu = getOptionalString(formData, "exampleRu");
  const exampleEn = getOptionalString(formData, "exampleEn");
  const notes = getOptionalString(formData, "notes");
  const plural = getOptionalString(formData, "plural");
  const caseGoverned = getOptionalString(formData, "caseGoverned");
  const themeKey = getOptionalString(formData, "themeKey");
  const topicKey = getOptionalString(formData, "topicKey");
  const categoryKey = getOptionalString(formData, "categoryKey");
  const subcategoryKey = getOptionalString(formData, "subcategoryKey");
  const sourceKey = getOptionalString(formData, "sourceKey");
  const sourceVersion = getOptionalString(formData, "sourceVersion");
  const sourceSectionRef = getOptionalString(formData, "sourceSectionRef");
  const importKey = getOptionalString(formData, "importKey");
  const itemType = assertVocabularyItemType(
    getTrimmedString(formData, "itemType") || "word"
  );
  const sourceType = assertVocabularyItemSourceType(
    getTrimmedString(formData, "sourceType") || "custom"
  );
  const priority = assertVocabularyItemPriority(
    getTrimmedString(formData, "priority") || "core"
  );
  const partOfSpeech = assertVocabularyPartOfSpeech(
    getTrimmedString(formData, "partOfSpeech") || "unknown"
  );
  const gender = assertVocabularyGender(
    getTrimmedString(formData, "gender") || "unknown"
  );
  const productiveReceptive = assertVocabularyProductiveReceptive(
    getTrimmedString(formData, "productiveReceptive") || "unknown"
  );
  const tier = assertVocabularyTier(getTrimmedString(formData, "tier") || "unknown");
  const aspect = assertVocabularyAspect(
    getTrimmedString(formData, "aspect") || "unknown"
  );
  const isReflexive = getTrimmedString(formData, "isReflexive") === "true";
  const manualPosition = getOptionalNonNegativeNumber(formData, "position");

  const supabase = await createClient();

  const payload: {
    russian: string;
    english: string;
    canonical_key: string | null;
    transliteration: string | null;
    example_ru: string | null;
    example_en: string | null;
    notes: string | null;
    item_type: DbVocabularyItemType;
    source_type: DbVocabularyItemSourceType;
    priority: DbVocabularyItemPriority;
    part_of_speech: DbVocabularyPartOfSpeech;
    gender: DbVocabularyGender;
    plural: string | null;
    productive_receptive: DbVocabularyProductiveReceptive;
    tier: DbVocabularyTier;
    theme_key: string | null;
    topic_key: string | null;
    category_key: string | null;
    subcategory_key: string | null;
    aspect: DbVocabularyAspect;
    case_governed: string | null;
    is_reflexive: boolean;
    source_key: string | null;
    source_version: string | null;
    source_section_ref: string | null;
    import_key: string | null;
    position?: number;
  } = {
    russian,
    english,
    canonical_key: canonicalKey,
    transliteration,
    example_ru: exampleRu,
    example_en: exampleEn,
    notes,
    item_type: itemType,
    source_type: sourceType,
    priority,
    part_of_speech: partOfSpeech,
    gender,
    plural,
    productive_receptive: productiveReceptive,
    tier,
    theme_key: themeKey,
    topic_key: topicKey,
    category_key: categoryKey,
    subcategory_key: subcategoryKey,
    aspect,
    case_governed: caseGoverned,
    is_reflexive: isReflexive,
    source_key: sourceKey,
    source_version: sourceVersion,
    source_section_ref: sourceSectionRef,
    import_key: importKey,
  };

  if (manualPosition !== null) {
    payload.position = manualPosition;
  }

  if (vocabularyListId && manualPosition !== null) {
    const { error: listItemError } = await supabase
      .from("vocabulary_list_items")
      .update({
        position: manualPosition,
        productive_receptive_override:
          productiveReceptive === "unknown" ? null : productiveReceptive,
        tier_override: tier === "unknown" ? null : tier,
        source_section_ref: sourceSectionRef,
        import_key: importKey,
      })
      .eq("vocabulary_list_id", vocabularyListId)
      .eq("vocabulary_item_id", vocabularyItemId);

    if (listItemError) {
      console.error("Error updating vocabulary list item:", {
        vocabularyItemId,
        vocabularyListId,
        error: listItemError,
      });
      throw new Error("Failed to update vocabulary list item");
    }
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
