import { createClient } from "@/lib/supabase/server";

import { buildVocabularySetCoverageSummary } from "./coverage-summary";
import { getVocabularyListsBySetIdDb } from "./list-queries";
import {
  normalizeVocabularyItem,
  normalizeVocabularyItemCoverage,
} from "./normalizers";
import { chunkValues, fetchSupabasePages } from "./pagination";
import {
  VOCABULARY_ITEM_COVERAGE_SELECT,
  VOCABULARY_ITEM_SELECT,
} from "./selects";
import {
  filterVocabularyListsForStudyVariant,
  getVocabularyItemAppliesToStudyVariant,
} from "./study-variants";
import type {
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  VocabularySetLoadOptions,
} from "./types";

export async function getVocabularyItemsByListIdDb(vocabularyListId: string) {
  const items = await getVocabularyItemsByListIdsDb([vocabularyListId]);
  return items;
}

export async function getVocabularyItemsByListIdsDb(vocabularyListIds: string[]) {
  const uniqueVocabularyListIds = Array.from(new Set(vocabularyListIds));

  if (uniqueVocabularyListIds.length === 0) {
    return [];
  }

  const supabase = await createClient();
  const rows = (
    await Promise.all(
      chunkValues(uniqueVocabularyListIds).map((listIdBatch) =>
        fetchSupabasePages<{
          position?: number;
          vocabulary_list_id?: string;
          vocabulary_items?: Record<string, unknown> | Record<string, unknown>[] | null;
        }>({
          queryFactory: () =>
            supabase
              .from("vocabulary_list_items")
              .select(
                `position, vocabulary_list_id, vocabulary_items(${VOCABULARY_ITEM_SELECT})`
              )
              .in("vocabulary_list_id", listIdBatch)
              .order("position", { ascending: true }),
          errorMessage: "Error fetching vocabulary items by list ids:",
          errorContext: { vocabularyListIds: listIdBatch },
        })
      )
    )
  ).flat();

  return rows
    .map((row) => {
      const joinedItem = Array.isArray(row.vocabulary_items)
        ? row.vocabulary_items[0]
        : row.vocabulary_items;

      if (!joinedItem) return null;

      return normalizeVocabularyItem({
        ...joinedItem,
        vocabulary_list_id: row.vocabulary_list_id ?? null,
        position: row.position ?? 0,
      });
    })
    .filter((item): item is DbVocabularyItem => Boolean(item));
}

async function getVocabularyItemsDirectBySetIdDb(vocabularySetId: string) {
  const supabase = await createClient();
  const data = await fetchSupabasePages<Record<string, unknown>>({
    queryFactory: () =>
      supabase
        .from("vocabulary_items")
        .select(VOCABULARY_ITEM_SELECT)
        .eq("vocabulary_set_id", vocabularySetId)
        .order("position", { ascending: true }),
    errorMessage: "Error fetching legacy vocabulary items by set id:",
    errorContext: { vocabularySetId },
  });

  return data.map(normalizeVocabularyItem);
}

export async function getVocabularyItemsBySetIdDb(
  vocabularySetId: string,
  options?: VocabularySetLoadOptions
) {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);
  const vocabularyListSlug = options?.vocabularyListSlug?.trim();

  if (vocabularyListSlug) {
    const explicitList = lists.find((list) => list.slug === vocabularyListSlug);

    if (!explicitList) {
      return [];
    }

    return getVocabularyItemsByListIdsDb([explicitList.id]);
  }

  const scopedLists = filterVocabularyListsForStudyVariant(
    lists,
    options?.scopeVariant
  );

  if (scopedLists.length > 0) {
    const listItems = await getVocabularyItemsByListIdsDb(
      scopedLists.map((list) => list.id)
    );

    if (listItems.length > 0) {
      return listItems;
    }
  }

  if (lists.length > 0) {
    const fallbackItems = await getVocabularyItemsDirectBySetIdDb(vocabularySetId);
    const scopeVariant = options?.scopeVariant;

    if (!scopeVariant || scopeVariant === "all") {
      return fallbackItems;
    }

    return fallbackItems.filter((item) =>
      getVocabularyItemAppliesToStudyVariant(item.tier, scopeVariant)
    );
  }

  const items = await getVocabularyItemsDirectBySetIdDb(vocabularySetId);
  const scopeVariant = options?.scopeVariant;

  if (!scopeVariant || scopeVariant === "all") {
    return items;
  }

  return items.filter((item) =>
    getVocabularyItemAppliesToStudyVariant(item.tier, scopeVariant)
  );
}

export async function getVocabularyItemCoverageByItemIdsDb(
  vocabularyItemIds: string[]
) {
  const uniqueVocabularyItemIds = Array.from(new Set(vocabularyItemIds));

  if (uniqueVocabularyItemIds.length === 0) {
    return new Map<string, DbVocabularyItemCoverage>();
  }

  const supabase = await createClient();
  const coverageRows: unknown[] = [];
  const batchSize = 400;

  for (let start = 0; start < uniqueVocabularyItemIds.length; start += batchSize) {
    const batchIds = uniqueVocabularyItemIds.slice(start, start + batchSize);
    const { data, error } = await supabase
      .from("vocabulary_item_coverage")
      .select(VOCABULARY_ITEM_COVERAGE_SELECT)
      .in("vocabulary_item_id", batchIds);

    if (error) {
      console.error("Error fetching vocabulary item coverage:", {
        vocabularyItemIds: batchIds,
        error,
      });
      return new Map<string, DbVocabularyItemCoverage>();
    }

    coverageRows.push(...(data ?? []));
  }

  return new Map(
    coverageRows.map((row) => {
      const coverage = normalizeVocabularyItemCoverage(row);
      return [coverage.vocabulary_item_id, coverage];
    })
  );
}

export async function getVocabularySetCoverageSummaryBySetIdDb(
  vocabularySetId: string
) {
  const [lists, items] = await Promise.all([
    getVocabularyListsBySetIdDb(vocabularySetId),
    getVocabularyItemsBySetIdDb(vocabularySetId, { scopeVariant: "all" }),
  ]);
  const uniqueItems = Array.from(
    new Map(items.map((item) => [item.id, item])).values()
  );
  const listItems = items
    .filter((item) => item.vocabulary_list_id)
    .map((item) => ({
      vocabulary_list_id: item.vocabulary_list_id as string,
      vocabulary_item_id: item.id,
    }));
  const itemCoverageById = await getVocabularyItemCoverageByItemIdsDb(
    uniqueItems.map((item) => item.id)
  );

  return buildVocabularySetCoverageSummary({
    lists,
    listItems,
    items: uniqueItems,
    itemCoverageById,
  });
}

export async function getVocabularyItemCountBySetIdDb(vocabularySetId: string) {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);

  if (lists.length > 0) {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("vocabulary_list_items")
      .select("id", { count: "exact", head: true })
      .in(
        "vocabulary_list_id",
        lists.map((list) => list.id)
      );

    if (error) {
      console.error("Error counting vocabulary list items by set id:", {
        vocabularySetId,
        error,
      });
      return 0;
    }

    return count ?? 0;
  }

  const supabase = await createClient();

  const { count, error } = await supabase
    .from("vocabulary_items")
    .select("id", { count: "exact", head: true })
    .eq("vocabulary_set_id", vocabularySetId);

  if (error) {
    console.error("Error counting legacy vocabulary items by set id:", {
      vocabularySetId,
      error,
    });
    return 0;
  }

  return count ?? 0;
}

export async function getVocabularyListCountBySetIdDb(vocabularySetId: string) {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);
  return lists.length;
}
