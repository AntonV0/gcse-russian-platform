import SavedVocabularyViews from "@/components/admin/vocabulary/list/saved-vocabulary-views";
import type {
  AdminVocabularyListStats,
  AdminVocabularySearchParams,
} from "@/components/admin/vocabulary/list/types";
import VocabularyAdminIntro from "@/components/admin/vocabulary/list/vocabulary-admin-intro";
import VocabularyMetadataHealthPanel from "@/components/admin/vocabulary/list/vocabulary-metadata-health-panel";
import VocabularySetsTable from "@/components/admin/vocabulary/list/vocabulary-sets-table";
import VocabularySummaryStats from "@/components/admin/vocabulary/list/vocabulary-summary-stats";
import { getVocabularyMetadataHealthDb } from "@/lib/vocabulary/shared/metadata-health";
import { getVocabularySetsDb } from "@/lib/vocabulary/sets/set-list-queries";
import {
  getVocabularySetSourceKeysDb,
  getVocabularySetThemeKeysDb,
} from "@/lib/vocabulary/sets/set-options";
import type {
  DbVocabularySetListItem,
  VocabularySetFilters,
} from "@/lib/vocabulary/shared/types";

type AdminVocabularyPageProps = {
  searchParams?: Promise<AdminVocabularySearchParams>;
};

function normalizeTierFilter(value?: string): VocabularySetFilters["tier"] {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
  ) {
    return value;
  }

  return "all";
}

function normalizeListModeFilter(value?: string): VocabularySetFilters["listMode"] {
  if (
    value === "spec_only" ||
    value === "extended_only" ||
    value === "spec_and_extended" ||
    value === "custom"
  ) {
    return value;
  }

  return "all";
}

function normalizePublishedFilter(value?: string): VocabularySetFilters["published"] {
  if (value === "published" || value === "draft") return value;
  return "all";
}

function normalizeSetTypeFilter(value?: string): VocabularySetFilters["setType"] {
  if (
    value === "specification" ||
    value === "core" ||
    value === "theme" ||
    value === "phrase_bank" ||
    value === "exam_prep" ||
    value === "lesson_custom"
  ) {
    return value;
  }

  return "all";
}

function normalizeUsageVariantFilter(
  value?: string
): VocabularySetFilters["usageVariant"] {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "volna" ||
    value === "unused"
  ) {
    return value;
  }

  return "all";
}

function getVocabularyListStats(
  vocabularySets: DbVocabularySetListItem[]
): AdminVocabularyListStats {
  const totalSets = vocabularySets.length;
  const publishedSets = vocabularySets.filter((set) => set.is_published).length;
  const draftSets = totalSets - publishedSets;
  const totalItems = vocabularySets.reduce((sum, set) => sum + set.item_count, 0);
  const totalUsages = vocabularySets.reduce(
    (sum, set) => sum + set.usage_stats.totalOccurrences,
    0
  );

  return { totalSets, publishedSets, draftSets, totalItems, totalUsages };
}

export default async function AdminVocabularyPage({
  searchParams,
}: AdminVocabularyPageProps) {
  const params = (await searchParams) ?? {};
  const filters: VocabularySetFilters = {
    search: params.search ?? null,
    tier: normalizeTierFilter(params.tier),
    listMode: normalizeListModeFilter(params.listMode),
    setType: normalizeSetTypeFilter(params.setType),
    themeKey: params.themeKey ?? null,
    sourceKey: params.sourceKey ?? null,
    usageVariant: normalizeUsageVariantFilter(params.usageVariant),
    published: normalizePublishedFilter(params.published),
  };
  const [vocabularySets, themeKeys, sourceKeys, metadataHealth] = await Promise.all([
    getVocabularySetsDb({ filters }),
    getVocabularySetThemeKeysDb(),
    getVocabularySetSourceKeysDb(),
    getVocabularyMetadataHealthDb(),
  ]);
  const stats = getVocabularyListStats(vocabularySets);

  return (
    <main className="space-y-4">
      <VocabularyAdminIntro
        totalSets={stats.totalSets}
        publishedSets={stats.publishedSets}
      />

      <VocabularySummaryStats
        totalSets={stats.totalSets}
        publishedSets={stats.publishedSets}
        draftSets={stats.draftSets}
        totalItems={stats.totalItems}
        totalUsages={stats.totalUsages}
        usageVariant={filters.usageVariant}
      />

      <SavedVocabularyViews />

      <VocabularyMetadataHealthPanel metadataHealth={metadataHealth} />

      <VocabularySetsTable
        vocabularySets={vocabularySets}
        filters={filters}
        params={params}
        themeKeys={themeKeys}
        sourceKeys={sourceKeys}
      />
    </main>
  );
}
