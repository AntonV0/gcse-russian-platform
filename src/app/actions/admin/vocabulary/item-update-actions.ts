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
import { updateVocabularyItemDb } from "@/lib/vocabulary/items/mutations";

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

  await updateVocabularyItemDb({
    vocabularyItemId,
    vocabularySetId,
    vocabularyListId,
    manualPosition,
    payload: {
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
    },
  });

  const path = buildItemsPath(vocabularySetId);
  revalidatePath("/admin/vocabulary");
  revalidatePath(path);
  redirect(path);
}
