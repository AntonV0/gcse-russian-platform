import { createClient } from "@/lib/supabase/server";

import { getVocabularyThemeLabel } from "./labels";
import { normalizeVocabularySetSummaryRow } from "./normalizers";
import { chunkValues, fetchSupabasePages } from "./pagination";
import { VOCABULARY_SET_SUMMARY_SELECT } from "./selects";
import { buildVocabularyUsageStats } from "./study-variants";
import type {
  DbVocabularySet,
  DbVocabularySetListItem,
  DbVocabularySetSummaryRow,
  DbVocabularyUsageVariant,
  VocabularySetFilters,
} from "./types";

async function getVocabularySetSummaryRowsBySetIdsDb(vocabularySetIds: string[]) {
  const uniqueVocabularySetIds = Array.from(new Set(vocabularySetIds));

  if (uniqueVocabularySetIds.length === 0) {
    return new Map<string, DbVocabularySetSummaryRow>();
  }

  const supabase = await createClient();
  const data = (
    await Promise.all(
      chunkValues(uniqueVocabularySetIds).map((setIdBatch) =>
        fetchSupabasePages<Record<string, unknown>>({
          queryFactory: () =>
            supabase
              .from("vocabulary_set_summaries")
              .select(VOCABULARY_SET_SUMMARY_SELECT)
              .in("vocabulary_set_id", setIdBatch),
          errorMessage: "Error fetching vocabulary set summaries:",
          errorContext: { vocabularySetIds: setIdBatch },
        })
      )
    )
  ).flat();

  return new Map(
    data.map((row) => {
      const summary = normalizeVocabularySetSummaryRow(row);
      return [summary.vocabulary_set_id, summary];
    })
  );
}

export async function attachVocabularyCountsAndUsage(
  vocabularySets: DbVocabularySet[]
): Promise<DbVocabularySetListItem[]> {
  if (vocabularySets.length === 0) {
    return [];
  }

  const vocabularySetIds = vocabularySets.map((vocabularySet) => vocabularySet.id);
  const summariesBySetId = await getVocabularySetSummaryRowsBySetIdsDb(
    vocabularySetIds
  );

  return vocabularySets.map((vocabularySet) => {
    const summary = summariesBySetId.get(vocabularySet.id);
    const usageRows: { variant: DbVocabularyUsageVariant }[] = [
      ...Array.from({ length: summary?.foundation_occurrences ?? 0 }, () => ({
        variant: "foundation" as const,
      })),
      ...Array.from({ length: summary?.higher_occurrences ?? 0 }, () => ({
        variant: "higher" as const,
      })),
      ...Array.from({ length: summary?.volna_occurrences ?? 0 }, () => ({
        variant: "volna" as const,
      })),
    ];

    return {
      ...vocabularySet,
      item_count: summary?.item_count ?? 0,
      list_count: summary?.list_count ?? 0,
      usage_stats: buildVocabularyUsageStats(usageRows),
      coverage_summary: {
        totalItems: summary?.item_count ?? 0,
        foundationTotalItems: summary?.foundation_total_items ?? 0,
        higherTotalItems: summary?.higher_total_items ?? 0,
        volnaTotalItems: summary?.volna_total_items ?? 0,
        customListTotalItems: summary?.custom_list_total_items ?? 0,
        foundationUsedItems: summary?.foundation_used_items ?? 0,
        higherUsedItems: summary?.higher_used_items ?? 0,
        volnaUsedItems: summary?.volna_used_items ?? 0,
        customListUsedItems: summary?.custom_list_used_items ?? 0,
      },
    };
  });
}

export function applyVocabularySetFilters(
  vocabularySets: DbVocabularySetListItem[],
  filters?: VocabularySetFilters
) {
  const search = filters?.search?.trim().toLowerCase();
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const themeKey = filters?.themeKey?.trim();
  const listMode =
    filters?.listMode && filters.listMode !== "all" ? filters.listMode : null;
  const published = filters?.published ?? "all";

  return vocabularySets.filter((vocabularySet) => {
    if (search) {
      const haystack = [
        vocabularySet.title,
        vocabularySet.description,
        getVocabularyThemeLabel(vocabularySet.theme_key),
        vocabularySet.topic_key,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(search)) return false;
    }

    if (tier && vocabularySet.tier !== tier && vocabularySet.tier !== "both") {
      return false;
    }

    if (themeKey && vocabularySet.theme_key !== themeKey) {
      return false;
    }

    if (listMode && vocabularySet.list_mode !== listMode) {
      return false;
    }

    if (published === "published" && !vocabularySet.is_published) {
      return false;
    }

    if (published === "draft" && vocabularySet.is_published) {
      return false;
    }

    return true;
  });
}
