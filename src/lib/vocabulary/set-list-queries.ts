import { createClient } from "@/lib/supabase/server";
import { normalizeVocabularySet } from "@/lib/vocabulary/normalizers";
import { fetchSupabasePages } from "@/lib/vocabulary/pagination";
import { VOCABULARY_SET_SELECT } from "@/lib/vocabulary/selects";
import {
  attachVocabularyCountsAndUsage,
  applyVocabularySetFilters,
} from "@/lib/vocabulary/set-listing";
import type { VocabularySetFilters } from "@/lib/vocabulary/types";

export async function getVocabularySetsDb(options?: {
  publishedOnly?: boolean;
  filters?: VocabularySetFilters;
}) {
  const supabase = await createClient();
  const filters = options?.filters;
  const tier = filters?.tier && filters.tier !== "all" ? filters.tier : null;
  const themeKey = filters?.themeKey?.trim();
  const listMode =
    filters?.listMode && filters.listMode !== "all" ? filters.listMode : null;
  const setType = filters?.setType && filters.setType !== "all" ? filters.setType : null;
  const sourceKey = filters?.sourceKey?.trim();
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

      if (setType) {
        query = query.eq("set_type", setType);
      }

      if (sourceKey) {
        query = query.eq("source_key", sourceKey);
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
