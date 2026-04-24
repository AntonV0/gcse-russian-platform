"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import type {
  DbVocabularyAspect,
  DbVocabularyGender,
  DbVocabularyItemPriority,
  DbVocabularyItemSourceType,
  DbVocabularyItemType,
  DbVocabularyPartOfSpeech,
  DbVocabularyProductiveReceptive,
  DbVocabularyTier,
} from "@/lib/vocabulary/vocabulary-helpers-db";
import {
  ensureDefaultVocabularyListForSetDb,
  getVocabularyListByIdDb,
  getVocabularySetByIdDb,
} from "@/lib/vocabulary/vocabulary-helpers-db";
import {
  getOptionalString,
  getTrimmedString,
} from "@/app/actions/shared/form-data";

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

function assertVocabularyPartOfSpeech(value: string): DbVocabularyPartOfSpeech {
  if (
    value === "noun" ||
    value === "verb" ||
    value === "adjective" ||
    value === "adverb" ||
    value === "pronoun" ||
    value === "preposition" ||
    value === "conjunction" ||
    value === "number" ||
    value === "phrase" ||
    value === "interjection" ||
    value === "other" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("Invalid part of speech");
}

function assertVocabularyGender(value: string): DbVocabularyGender {
  if (
    value === "masculine" ||
    value === "feminine" ||
    value === "neuter" ||
    value === "plural_only" ||
    value === "common" ||
    value === "not_applicable" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("Invalid vocabulary gender");
}

function assertVocabularyProductiveReceptive(
  value: string
): DbVocabularyProductiveReceptive {
  if (
    value === "productive" ||
    value === "receptive" ||
    value === "both" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("Invalid productive/receptive value");
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

function assertVocabularyAspect(value: string): DbVocabularyAspect {
  if (
    value === "perfective" ||
    value === "imperfective" ||
    value === "both" ||
    value === "not_applicable" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("Invalid vocabulary aspect");
}

async function getVocabularyListForItemWrite(params: {
  vocabularySetId: string;
  vocabularyListId?: string | null;
}) {
  if (params.vocabularyListId) {
    const list = await getVocabularyListByIdDb(params.vocabularyListId);

    if (list && list.vocabulary_set_id === params.vocabularySetId) {
      return list;
    }
  }

  const vocabularySet = await getVocabularySetByIdDb(params.vocabularySetId);

  if (!vocabularySet) {
    throw new Error("Vocabulary set not found");
  }

  return ensureDefaultVocabularyListForSetDb(vocabularySet);
}

async function getNextVocabularyListItemPosition(vocabularyListId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_list_items")
    .select("position")
    .eq("vocabulary_list_id", vocabularyListId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error loading last vocabulary list item position:", {
      vocabularyListId,
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
  const gender = assertVocabularyGender(getTrimmedString(formData, "gender") || "unknown");
  const productiveReceptive = assertVocabularyProductiveReceptive(
    getTrimmedString(formData, "productiveReceptive") || "unknown"
  );
  const tier = assertVocabularyTier(getTrimmedString(formData, "tier") || "unknown");
  const aspect = assertVocabularyAspect(getTrimmedString(formData, "aspect") || "unknown");
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
  const gender = assertVocabularyGender(getTrimmedString(formData, "gender") || "unknown");
  const productiveReceptive = assertVocabularyProductiveReceptive(
    getTrimmedString(formData, "productiveReceptive") || "unknown"
  );
  const tier = assertVocabularyTier(getTrimmedString(formData, "tier") || "unknown");
  const aspect = assertVocabularyAspect(getTrimmedString(formData, "aspect") || "unknown");
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
