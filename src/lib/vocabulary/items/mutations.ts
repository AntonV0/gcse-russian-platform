import { createClient } from "@/lib/supabase/server";

import {
  ensureDefaultVocabularyListForSetDb,
  getVocabularyListByIdDb,
} from "@/lib/vocabulary/sets/list-queries";
import { normalizeVocabularySet } from "@/lib/vocabulary/shared/normalizers";
import { getVocabularySetByIdDb } from "@/lib/vocabulary/sets/set-queries";
import { VOCABULARY_SET_SELECT } from "@/lib/vocabulary/shared/selects";
import type {
  DbVocabularyAspect,
  DbVocabularyDisplayVariant,
  DbVocabularyGender,
  DbVocabularyItemPriority,
  DbVocabularyItemSourceType,
  DbVocabularyItemType,
  DbVocabularyListMode,
  DbVocabularyPartOfSpeech,
  DbVocabularyProductiveReceptive,
  DbVocabularySet,
  DbVocabularySetType,
  DbVocabularyTier,
} from "@/lib/vocabulary/shared/types";

export type VocabularySetMutationPayload = {
  title: string;
  slug: string | null;
  description: string | null;
  theme_key: string | null;
  topic_key: string | null;
  tier: DbVocabularyTier;
  list_mode: DbVocabularyListMode;
  set_type: DbVocabularySetType;
  default_display_variant: DbVocabularyDisplayVariant;
  is_published: boolean;
  sort_order: number;
  source_key: string | null;
  source_version: string | null;
  import_key: string | null;
};

export type VocabularyItemMutationPayload = {
  canonical_key: string | null;
  russian: string;
  english: string;
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
};

export type BulkVocabularyItemInput = {
  russian: string;
  english: string;
};

export type BulkVocabularyItemMutationPayload = Pick<
  VocabularyItemMutationPayload,
  | "item_type"
  | "source_type"
  | "priority"
  | "part_of_speech"
  | "productive_receptive"
  | "tier"
  | "theme_key"
  | "topic_key"
  | "category_key"
  | "source_key"
  | "source_version"
  | "source_section_ref"
  | "import_key"
>;

export async function createVocabularySetDb(
  payload: VocabularySetMutationPayload
): Promise<DbVocabularySet> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vocabulary_sets")
    .insert(payload)
    .select(VOCABULARY_SET_SELECT)
    .single();

  if (error) {
    console.error("Error creating vocabulary set:", error);
    throw new Error("Failed to create vocabulary set");
  }

  const vocabularySet = normalizeVocabularySet(data);
  try {
    await ensureDefaultVocabularyListForSetDb(vocabularySet);
  } catch (listError) {
    const { error: cleanupError } = await supabase
      .from("vocabulary_sets")
      .delete()
      .eq("id", vocabularySet.id);

    if (cleanupError) {
      console.error("Error cleaning up vocabulary set after list creation failure:", {
        vocabularySetId: vocabularySet.id,
        error: cleanupError,
      });
    }

    throw listError;
  }

  return vocabularySet;
}

export async function updateVocabularySetDb(
  vocabularySetId: string,
  payload: VocabularySetMutationPayload
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("vocabulary_sets")
    .update(payload)
    .eq("id", vocabularySetId);

  if (error) {
    console.error("Error updating vocabulary set:", error);
    throw new Error("Failed to update vocabulary set");
  }
}

export async function deleteVocabularySetDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("vocabulary_sets")
    .delete()
    .eq("id", vocabularySetId);

  if (error) {
    console.error("Error deleting vocabulary set:", { vocabularySetId, error });
    throw new Error("Failed to delete vocabulary set");
  }
}

async function getVocabularyListForItemWriteDb(params: {
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

async function getNextVocabularyListItemPositionDb(vocabularyListId: string) {
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

export async function createVocabularyItemDb(params: {
  vocabularySetId: string;
  vocabularyListId?: string | null;
  payload: VocabularyItemMutationPayload;
}) {
  const supabase = await createClient();
  const vocabularyList = await getVocabularyListForItemWriteDb({
    vocabularySetId: params.vocabularySetId,
    vocabularyListId: params.vocabularyListId,
  });
  const position = await getNextVocabularyListItemPositionDb(vocabularyList.id);

  const { data: item, error } = await supabase
    .from("vocabulary_items")
    .insert({
      vocabulary_set_id: params.vocabularySetId,
      ...params.payload,
      position,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating vocabulary item:", {
      vocabularySetId: params.vocabularySetId,
      error,
    });
    throw new Error("Failed to create vocabulary item");
  }

  const { error: listItemError } = await supabase.from("vocabulary_list_items").insert({
    vocabulary_list_id: vocabularyList.id,
    vocabulary_item_id: item.id,
    position,
    productive_receptive_override:
      params.payload.productive_receptive === "unknown"
        ? null
        : params.payload.productive_receptive,
    tier_override: params.payload.tier === "unknown" ? null : params.payload.tier,
    source_section_ref: params.payload.source_section_ref,
    import_key: params.payload.import_key,
  });

  if (listItemError) {
    const { error: cleanupError } = await supabase
      .from("vocabulary_items")
      .delete()
      .eq("id", item.id)
      .eq("vocabulary_set_id", params.vocabularySetId);

    if (cleanupError) {
      console.error("Error cleaning up vocabulary item after list link failure:", {
        vocabularyItemId: item.id,
        vocabularySetId: params.vocabularySetId,
        error: cleanupError,
      });
    }

    console.error("Error linking vocabulary item to list:", {
      vocabularySetId: params.vocabularySetId,
      vocabularyListId: vocabularyList.id,
      error: listItemError,
    });
    throw new Error("Failed to link vocabulary item to list");
  }
}

export async function bulkCreateVocabularyItemsDb(params: {
  vocabularySetId: string;
  vocabularyListId?: string | null;
  items: BulkVocabularyItemInput[];
  payload: BulkVocabularyItemMutationPayload;
}) {
  const supabase = await createClient();
  const vocabularyList = await getVocabularyListForItemWriteDb({
    vocabularySetId: params.vocabularySetId,
    vocabularyListId: params.vocabularyListId,
  });
  const startingPosition = await getNextVocabularyListItemPositionDb(vocabularyList.id);

  const itemPayloads = params.items.map((item, index) => ({
    vocabulary_set_id: params.vocabularySetId,
    russian: item.russian,
    english: item.english,
    ...params.payload,
    position: startingPosition + index,
  }));

  const { data: insertedItems, error } = await supabase
    .from("vocabulary_items")
    .insert(itemPayloads)
    .select("id, position");

  if (error) {
    console.error("Error bulk creating vocabulary items:", {
      vocabularySetId: params.vocabularySetId,
      error,
    });
    throw new Error("Failed to bulk create vocabulary items");
  }

  const listItemPayloads = (insertedItems ?? []).map((item) => ({
    vocabulary_list_id: vocabularyList.id,
    vocabulary_item_id: item.id,
    position: item.position,
    productive_receptive_override:
      params.payload.productive_receptive === "unknown"
        ? null
        : params.payload.productive_receptive,
    tier_override: params.payload.tier === "unknown" ? null : params.payload.tier,
    source_section_ref: params.payload.source_section_ref,
    import_key: params.payload.import_key,
  }));

  if (listItemPayloads.length > 0) {
    const { error: listItemError } = await supabase
      .from("vocabulary_list_items")
      .insert(listItemPayloads);

    if (listItemError) {
      const insertedItemIds = (insertedItems ?? []).map((item) => item.id);
      const { error: cleanupError } = await supabase
        .from("vocabulary_items")
        .delete()
        .in("id", insertedItemIds)
        .eq("vocabulary_set_id", params.vocabularySetId);

      if (cleanupError) {
        console.error("Error cleaning up bulk vocabulary items after list link failure:", {
          vocabularySetId: params.vocabularySetId,
          vocabularyItemIds: insertedItemIds,
          error: cleanupError,
        });
      }

      console.error("Error linking bulk vocabulary items to list:", {
        vocabularySetId: params.vocabularySetId,
        vocabularyListId: vocabularyList.id,
        error: listItemError,
      });
      throw new Error("Failed to link bulk vocabulary items to list");
    }
  }
}

export async function updateVocabularyItemDb(params: {
  vocabularyItemId: string;
  vocabularySetId: string;
  vocabularyListId?: string | null;
  manualPosition: number | null;
  payload: VocabularyItemMutationPayload;
}) {
  const supabase = await createClient();
  const itemPayload = {
    ...params.payload,
    ...(params.manualPosition !== null ? { position: params.manualPosition } : {}),
  };

  if (params.vocabularyListId && params.manualPosition !== null) {
    const { error: listItemError } = await supabase
      .from("vocabulary_list_items")
      .update({
        position: params.manualPosition,
        productive_receptive_override:
          params.payload.productive_receptive === "unknown"
            ? null
            : params.payload.productive_receptive,
        tier_override: params.payload.tier === "unknown" ? null : params.payload.tier,
        source_section_ref: params.payload.source_section_ref,
        import_key: params.payload.import_key,
      })
      .eq("vocabulary_list_id", params.vocabularyListId)
      .eq("vocabulary_item_id", params.vocabularyItemId);

    if (listItemError) {
      console.error("Error updating vocabulary list item:", {
        vocabularyItemId: params.vocabularyItemId,
        vocabularyListId: params.vocabularyListId,
        error: listItemError,
      });
      throw new Error("Failed to update vocabulary list item");
    }
  }

  const { error } = await supabase
    .from("vocabulary_items")
    .update(itemPayload)
    .eq("id", params.vocabularyItemId)
    .eq("vocabulary_set_id", params.vocabularySetId);

  if (error) {
    console.error("Error updating vocabulary item:", {
      vocabularyItemId: params.vocabularyItemId,
      vocabularySetId: params.vocabularySetId,
      error,
    });
    throw new Error("Failed to update vocabulary item");
  }
}

export async function deleteVocabularyItemDb(params: {
  vocabularyItemId: string;
  vocabularySetId: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("vocabulary_items")
    .delete()
    .eq("id", params.vocabularyItemId)
    .eq("vocabulary_set_id", params.vocabularySetId);

  if (error) {
    console.error("Error deleting vocabulary item:", {
      vocabularyItemId: params.vocabularyItemId,
      vocabularySetId: params.vocabularySetId,
      error,
    });
    throw new Error("Failed to delete vocabulary item");
  }
}
