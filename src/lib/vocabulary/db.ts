import { createClient } from "@/lib/supabase/server";
import { getVocabularyThemeLabel } from "@/lib/vocabulary/labels";
import {
  getVocabularyItemsBySetIdDb,
} from "@/lib/vocabulary/item-queries";
import { getVocabularyListsBySetIdDb } from "@/lib/vocabulary/list-queries";
import {
  chunkValues,
  fetchSupabasePages,
} from "@/lib/vocabulary/pagination";
import { normalizeVocabularySet } from "@/lib/vocabulary/normalizers";
import {
  LESSON_VOCABULARY_SET_USAGE_SELECT,
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
} from "@/lib/vocabulary/study-variants";
import type {
  DbLessonVocabularySetUsage,
  DbVocabularySet,
  DbVocabularySetOption,
  DbVocabularySetOptionList,
  DbVocabularySetUsageStats,
  LoadedVocabularySetDb,
  LoadedVocabularySetDetailDb,
  VocabularySetFilters,
  VocabularySetLoadOptions,
} from "@/lib/vocabulary/types";
export {
  getVocabularyItemCountBySetIdDb,
  getVocabularyItemCoverageByItemIdsDb,
  getVocabularyItemsByListIdDb,
  getVocabularyItemsByListIdsDb,
  getVocabularyItemsBySetIdDb,
  getVocabularyListCountBySetIdDb,
  getVocabularySetCoverageSummaryBySetIdDb,
} from "@/lib/vocabulary/item-queries";
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
  DbVocabularySetOptionList,
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
  const vocabularyListSlug = options?.vocabularyListSlug?.trim();
  const vocabularyList =
    vocabularyListSlug
      ? lists.find((list) => list.slug === vocabularyListSlug) ?? null
      : lists[0] ?? null;
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
  const vocabularyListSlug = options?.vocabularyListSlug?.trim();
  const vocabularyList =
    vocabularyListSlug
      ? lists.find((list) => list.slug === vocabularyListSlug) ?? null
      : lists[0] ?? null;
  const items = await getVocabularyItemsBySetIdDb(vocabularySet.id, options);

  return {
    vocabularySet,
    vocabularyList,
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
  const vocabularyListSlug = options?.vocabularyListSlug?.trim();
  const vocabularyList =
    vocabularyListSlug
      ? lists.find((list) => list.slug === vocabularyListSlug) ?? null
      : lists[0] ?? null;
  const items = await getVocabularyItemsBySetIdDb(vocabularySet.id, options);

  return {
    vocabularySet,
    vocabularyList,
    lists,
    items,
  };
}

async function getVocabularyOptionListsBySetIdsDb(
  vocabularySetIds: string[]
) {
  const uniqueVocabularySetIds = Array.from(new Set(vocabularySetIds));

  if (uniqueVocabularySetIds.length === 0) {
    return new Map<string, DbVocabularySetOptionList[]>();
  }

  const supabase = await createClient();
  const rows = (
    await Promise.all(
      chunkValues(uniqueVocabularySetIds).map((setIdBatch) =>
        fetchSupabasePages<DbVocabularySetOptionList>({
          queryFactory: () =>
            supabase
              .from("vocabulary_lists")
              .select(
                "id, vocabulary_set_id, title, slug, tier, list_mode, sort_order, is_published"
              )
              .in("vocabulary_set_id", setIdBatch)
              .order("sort_order", { ascending: true })
              .order("title", { ascending: true }),
          errorMessage: "Error fetching vocabulary list options:",
          errorContext: { vocabularySetIds: setIdBatch },
        })
      )
    )
  ).flat();

  const listsBySetId = new Map<string, DbVocabularySetOptionList[]>();

  for (const row of rows) {
    const nextRows = listsBySetId.get(row.vocabulary_set_id) ?? [];
    nextRows.push(row);
    listsBySetId.set(row.vocabulary_set_id, nextRows);
  }

  return listsBySetId;
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
  const data = await fetchSupabasePages<
    Pick<
      DbVocabularySet,
      "id" | "title" | "slug" | "is_published" | "tier" | "list_mode" | "sort_order"
    >
  >({
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

  const sets = data
    .filter((set) => typeof set.slug === "string" && set.slug.trim().length > 0)
    .sort((a, b) => {
      if (a.is_published !== b.is_published) {
        return a.is_published ? -1 : 1;
      }

      return a.title.localeCompare(b.title);
    });
  const listsBySetId = await getVocabularyOptionListsBySetIdsDb(
    sets.map((set) => set.id)
  );

  return sets.map((set): DbVocabularySetOption => ({
    ...set,
    slug: set.slug,
    lists: listsBySetId.get(set.id) ?? [],
  }));
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
