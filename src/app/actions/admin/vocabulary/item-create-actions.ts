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
  getNextVocabularyListItemPosition,
  getRequiredString,
  getVocabularyListForItemWrite,
  parseBulkVocabularyLines,
} from "@/app/actions/admin/vocabulary/item-action-helpers";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";

export async function createVocabularyItemAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

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

  const supabase = await createClient();
  const vocabularyList = await getVocabularyListForItemWrite({
    vocabularySetId,
    vocabularyListId,
  });
  const position = await getNextVocabularyListItemPosition(vocabularyList.id);

  const { data: item, error } = await supabase
    .from("vocabulary_items")
    .insert({
      vocabulary_set_id: vocabularySetId,
      canonical_key: canonicalKey,
      russian,
      english,
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
      position,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating vocabulary item:", {
      vocabularySetId,
      error,
    });
    throw new Error("Failed to create vocabulary item");
  }

  const { error: listItemError } = await supabase.from("vocabulary_list_items").insert({
    vocabulary_list_id: vocabularyList.id,
    vocabulary_item_id: item.id,
    position,
    productive_receptive_override:
      productiveReceptive === "unknown" ? null : productiveReceptive,
    tier_override: tier === "unknown" ? null : tier,
    source_section_ref: sourceSectionRef,
    import_key: importKey,
  });

  if (listItemError) {
    console.error("Error linking vocabulary item to list:", {
      vocabularySetId,
      vocabularyListId: vocabularyList.id,
      error: listItemError,
    });
    throw new Error("Failed to link vocabulary item to list");
  }

  const path = buildItemsPath(vocabularySetId);
  revalidatePath("/admin/vocabulary");
  revalidatePath(path);
  redirect(path);
}

export async function bulkCreateVocabularyItemsAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const vocabularySetId = getRequiredString(formData, "vocabularySetId");
  const vocabularyListId = getOptionalString(formData, "vocabularyListId");
  const bulkItems = parseBulkVocabularyLines(getRequiredString(formData, "bulkItems"));
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
  const productiveReceptive = assertVocabularyProductiveReceptive(
    getTrimmedString(formData, "productiveReceptive") || "unknown"
  );
  const tier = assertVocabularyTier(getTrimmedString(formData, "tier") || "unknown");
  const themeKey = getOptionalString(formData, "themeKey");
  const topicKey = getOptionalString(formData, "topicKey");
  const categoryKey = getOptionalString(formData, "categoryKey");
  const sourceKey = getOptionalString(formData, "sourceKey");
  const sourceVersion = getOptionalString(formData, "sourceVersion");
  const sourceSectionRef = getOptionalString(formData, "sourceSectionRef");

  if (bulkItems.length === 0) {
    throw new Error("Add at least one valid Russian and English pair");
  }

  const supabase = await createClient();
  const vocabularyList = await getVocabularyListForItemWrite({
    vocabularySetId,
    vocabularyListId,
  });
  const startingPosition = await getNextVocabularyListItemPosition(vocabularyList.id);

  const itemPayloads = bulkItems.map((item, index) => ({
    vocabulary_set_id: vocabularySetId,
    russian: item.russian,
    english: item.english,
    item_type: itemType,
    source_type: sourceType,
    priority,
    part_of_speech: partOfSpeech,
    productive_receptive: productiveReceptive,
    tier,
    theme_key: themeKey,
    topic_key: topicKey,
    category_key: categoryKey,
    source_key: sourceKey,
    source_version: sourceVersion,
    source_section_ref: sourceSectionRef,
    position: startingPosition + index,
  }));

  const { data: insertedItems, error } = await supabase
    .from("vocabulary_items")
    .insert(itemPayloads)
    .select("id, position");

  if (error) {
    console.error("Error bulk creating vocabulary items:", {
      vocabularySetId,
      error,
    });
    throw new Error("Failed to bulk create vocabulary items");
  }

  const listItemPayloads = (insertedItems ?? []).map((item) => ({
    vocabulary_list_id: vocabularyList.id,
    vocabulary_item_id: item.id,
    position: item.position,
    productive_receptive_override:
      productiveReceptive === "unknown" ? null : productiveReceptive,
    tier_override: tier === "unknown" ? null : tier,
    source_section_ref: sourceSectionRef,
  }));

  if (listItemPayloads.length > 0) {
    const { error: listItemError } = await supabase
      .from("vocabulary_list_items")
      .insert(listItemPayloads);

    if (listItemError) {
      console.error("Error linking bulk vocabulary items to list:", {
        vocabularySetId,
        vocabularyListId: vocabularyList.id,
        error: listItemError,
      });
      throw new Error("Failed to link bulk vocabulary items to list");
    }
  }

  const path = buildItemsPath(vocabularySetId);
  revalidatePath("/admin/vocabulary");
  revalidatePath(path);
  redirect(path);
}
