import { createClient } from "@/lib/supabase/server";
import { buildVocabularySetCoverageSummary } from "@/lib/vocabulary/coverage-summary";
import { getVocabularyThemeLabel } from "@/lib/vocabulary/labels";
import { getVocabularyListsBySetIdDb } from "@/lib/vocabulary/list-queries";
import {
  chunkValues,
  fetchSupabasePages,
} from "@/lib/vocabulary/pagination";
import {
  normalizeVocabularyItem,
  normalizeVocabularyItemCoverage,
  normalizeVocabularySet,
} from "@/lib/vocabulary/normalizers";
import {
  LESSON_VOCABULARY_SET_USAGE_SELECT,
  VOCABULARY_ITEM_COVERAGE_SELECT,
  VOCABULARY_ITEM_SELECT,
  VOCABULARY_SET_SELECT,
} from "@/lib/vocabulary/selects";
import {
  attachVocabularyCountsAndUsage,
  applyVocabularySetFilters,
} from "@/lib/vocabulary/set-listing";
import {
  getVocabularySetByIdDb,
  getVocabularySetByRefDb,
  getVocabularySetBySlugDb,
} from "@/lib/vocabulary/set-queries";
import {
  buildVocabularyUsageStats,
  filterVocabularyListsForStudyVariant,
  getVocabularyItemAppliesToStudyVariant,
} from "@/lib/vocabulary/study-variants";
import type {
  DbLessonVocabularySetUsage,
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  DbVocabularySetOption,
  DbVocabularySetUsageStats,
  LoadedVocabularySetDb,
  LoadedVocabularySetDetailDb,
  VocabularySetFilters,
  VocabularySetLoadOptions,
} from "@/lib/vocabulary/types";
export {
  getVocabularySetByIdDb,
  getVocabularySetByRefDb,
  getVocabularySetBySlugDb,
} from "@/lib/vocabulary/set-queries";
export {
  ensureDefaultVocabularyListForSetDb,
  getDefaultVocabularyListBySetIdDb,
  getVocabularyListByIdDb,
  getVocabularyListsBySetIdDb,
} from "@/lib/vocabulary/list-queries";
export {
  groupVocabularyItemsBySource,
  getVocabularyDisplayVariantLabel,
  getVocabularyListModeLabel,
  getVocabularyProductiveReceptiveLabel,
  getVocabularySetTypeLabel,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
  getVocabularyTopicLabel,
} from "@/lib/vocabulary/labels";
export {
  buildVocabularyUsageStats,
  filterVocabularyListsForStudyVariant,
  getCoverageTotalItemIdsForVariant,
  getRequiredVocabularyCoverageVariants,
  getVocabularyCoverageVariantCount,
  getVocabularyCoverageVariantLabel,
  getVocabularyCoverageVariantUsed,
  getVocabularyItemAppliesToStudyVariant,
  getVocabularyListAppliesToStudyVariant,
} from "@/lib/vocabulary/study-variants";

export type {
  DbLessonVocabularySetUsage,
  DbVocabularyAspect,
  DbVocabularyCoverageVariant,
  DbVocabularyDisplayVariant,
  DbVocabularyGender,
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  DbVocabularyItemPriority,
  DbVocabularyItemSourceType,
  DbVocabularyItemType,
  DbVocabularyList,
  DbVocabularyListItem,
  DbVocabularyListMode,
  DbVocabularyPartOfSpeech,
  DbVocabularyProductiveReceptive,
  DbVocabularySet,
  DbVocabularySetCoverageSummary,
  DbVocabularySetListItem,
  DbVocabularySetOption,
  DbVocabularySetType,
  DbVocabularySetUsageStats,
  DbVocabularyStudyVariant,
  DbVocabularyTier,
  DbVocabularyUsageType,
  DbVocabularyUsageVariant,
  LoadedVocabularySetDb,
  LoadedVocabularySetDetailDb,
  VocabularySetFilters,
  VocabularySetLoadOptions,
} from "@/lib/vocabulary/types";
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

export async function getVocabularyItemCoverageByItemIdsDb(vocabularyItemIds: string[]) {
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

export async function getVocabularySetCoverageSummaryBySetIdDb(vocabularySetId: string) {
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

export async function getVocabularySetUsagesBySetIdDb(vocabularySetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_vocabulary_set_usages")
    .select(LESSON_VOCABULARY_SET_USAGE_SELECT)
    .eq("vocabulary_set_id", vocabularySetId);

  if (error) {
    console.error("Error fetching vocabulary set usages by set id:", {
      vocabularySetId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbLessonVocabularySetUsage[];
}

export async function getVocabularySetUsageStatsBySetIdDb(
  vocabularySetId: string
): Promise<DbVocabularySetUsageStats> {
  const usages = await getVocabularySetUsagesBySetIdDb(vocabularySetId);
  return buildVocabularyUsageStats(usages);
}

export async function loadVocabularySetByIdDb(
  vocabularySetId: string,
  options?: VocabularySetLoadOptions
): Promise<LoadedVocabularySetDetailDb> {
  const vocabularySet = await getVocabularySetByIdDb(vocabularySetId);

  if (!vocabularySet) {
    return {
      vocabularySet: null,
      vocabularyList: null,
      lists: [],
      items: [],
      usageStats: {
        totalOccurrences: 0,
        foundationOccurrences: 0,
        higherOccurrences: 0,
        volnaOccurrences: 0,
        usedInFoundation: false,
        usedInHigher: false,
        usedInVolna: false,
      },
    };
  }

  const lists = await getVocabularyListsBySetIdDb(vocabularySet.id);
  const vocabularyList = lists[0] ?? null;
  const [items, usageStats] = await Promise.all([
    getVocabularyItemsBySetIdDb(vocabularySet.id, options),
    getVocabularySetUsageStatsBySetIdDb(vocabularySet.id),
  ]);

  return {
    vocabularySet,
    vocabularyList,
    lists,
    items,
    usageStats,
  };
}

export async function loadVocabularySetBySlugDb(
  vocabularySetSlug: string,
  options?: VocabularySetLoadOptions
): Promise<LoadedVocabularySetDb> {
  const vocabularySet = await getVocabularySetBySlugDb(vocabularySetSlug);

  if (!vocabularySet) {
    return {
      vocabularySet: null,
      vocabularyList: null,
      lists: [],
      items: [],
    };
  }

  const lists = await getVocabularyListsBySetIdDb(vocabularySet.id);
  const items = await getVocabularyItemsBySetIdDb(vocabularySet.id, options);

  return {
    vocabularySet,
    vocabularyList: lists[0] ?? null,
    lists,
    items,
  };
}

export async function loadVocabularySetByRefDb(
  vocabularySetRef: string,
  options?: VocabularySetLoadOptions
): Promise<LoadedVocabularySetDb> {
  const vocabularySet = await getVocabularySetByRefDb(vocabularySetRef);

  if (!vocabularySet) {
    return {
      vocabularySet: null,
      vocabularyList: null,
      lists: [],
      items: [],
    };
  }

  const lists = await getVocabularyListsBySetIdDb(vocabularySet.id);
  const items = await getVocabularyItemsBySetIdDb(vocabularySet.id, options);

  return {
    vocabularySet,
    vocabularyList: lists[0] ?? null,
    lists,
    items,
  };
}

export async function getVocabularySetsDb(options?: {
  publishedOnly?: boolean;
  filters?: VocabularySetFilters;
}) {
  const supabase = await createClient();
  const filters = options?.filters;
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const themeKey = filters?.themeKey?.trim();
  const listMode = filters?.listMode && filters.listMode !== "all" ? filters.listMode : null;
  const published = filters?.published ?? "all";

  const data = await fetchSupabasePages<Record<string, unknown>>({
    queryFactory: () => {
      let query = supabase
        .from("vocabulary_sets")
        .select(VOCABULARY_SET_SELECT)
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (options?.publishedOnly || published === "published") {
        query = query.eq("is_published", true);
      } else if (published === "draft") {
        query = query.eq("is_published", false);
      }

      if (tier) {
        query = query.in("tier", [tier, "both"]);
      }

      if (themeKey) {
        query = query.eq("theme_key", themeKey);
      }

      if (listMode) {
        query = query.eq("list_mode", listMode);
      }

      return query;
    },
    errorMessage: "Error fetching vocabulary sets:",
    errorContext: { options },
  });

  const withCounts = await attachVocabularyCountsAndUsage(
    data.map(normalizeVocabularySet)
  );

  return applyVocabularySetFilters(withCounts, filters);
}

export async function getPublishedVocabularySetsDb(filters?: VocabularySetFilters) {
  return getVocabularySetsDb({ publishedOnly: true, filters });
}

export async function getVocabularySetOptionsDb(options?: {
  publishedOnly?: boolean;
}) {
  const supabase = await createClient();
  const data = await fetchSupabasePages<DbVocabularySetOption>({
    queryFactory: () => {
      let query = supabase
        .from("vocabulary_sets")
        .select("id, title, slug, is_published, tier, list_mode, sort_order")
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (options?.publishedOnly) {
        query = query.eq("is_published", true);
      }

      return query;
    },
    errorMessage: "Error fetching vocabulary set options:",
    errorContext: { options },
  });

  return data
    .filter((set) => typeof set.slug === "string" && set.slug.trim().length > 0)
    .sort((a, b) => {
      if (a.is_published !== b.is_published) {
        return a.is_published ? -1 : 1;
      }

      return a.title.localeCompare(b.title);
    });
}

export async function getVocabularySetThemeKeysDb(options?: {
  publishedOnly?: boolean;
}) {
  const supabase = await createClient();
  const data = await fetchSupabasePages<{ theme_key: string | null }>({
    queryFactory: () => {
      let query = supabase
        .from("vocabulary_sets")
        .select("theme_key")
        .not("theme_key", "is", null)
        .order("theme_key", { ascending: true });

      if (options?.publishedOnly) {
        query = query.eq("is_published", true);
      }

      return query;
    },
    errorMessage: "Error fetching vocabulary theme keys:",
    errorContext: { options },
  });

  return Array.from(
    new Set(
      data
        .map((row) => row.theme_key)
        .filter((themeKey): themeKey is string => Boolean(themeKey))
    )
  ).sort((a, b) => getVocabularyThemeLabel(a).localeCompare(getVocabularyThemeLabel(b)));
}
