import GrammarAdminIntro from "@/components/admin/grammar/list/grammar-admin-intro";
import GrammarMetadataHealthPanel from "@/components/admin/grammar/list/grammar-metadata-health-panel";
import GrammarSetsTable from "@/components/admin/grammar/list/grammar-sets-table";
import GrammarSummaryStats from "@/components/admin/grammar/list/grammar-summary-stats";
import SavedGrammarViews from "@/components/admin/grammar/list/saved-grammar-views";
import type {
  AdminGrammarListStats,
  AdminGrammarSearchParams,
} from "@/components/admin/grammar/list/types";
import {
  getGrammarSetContentHealthBySetIdsDb,
  getGrammarSetsDb,
  type DbGrammarSetListItem,
  type GrammarSetFilters,
} from "@/lib/grammar/grammar-helpers-db";

const ADMIN_GRAMMAR_PAGE_SIZE = 25;

type AdminGrammarPageProps = {
  searchParams?: Promise<AdminGrammarSearchParams>;
};

function normalizePublishedFilter(value?: string): GrammarSetFilters["published"] {
  if (value === "published" || value === "draft") return value;
  return "all";
}

function normalizeTierFilter(value?: string): GrammarSetFilters["tier"] {
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

function normalizeUsageVariantFilter(value?: string): GrammarSetFilters["usageVariant"] {
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

function normalizePageParam(value?: string) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

function getUniqueSortedValues(values: (string | null | undefined)[]) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b));
}

function getGrammarListStats(grammarSets: DbGrammarSetListItem[]): AdminGrammarListStats {
  const totalSets = grammarSets.length;
  const publishedSets = grammarSets.filter((set) => set.is_published).length;
  const draftSets = totalSets - publishedSets;
  const totalPoints = grammarSets.reduce((sum, set) => sum + set.point_count, 0);
  const totalUsages = grammarSets.reduce(
    (sum, set) => sum + set.usage_stats.totalOccurrences,
    0
  );

  return { totalSets, publishedSets, draftSets, totalPoints, totalUsages };
}

export default async function AdminGrammarPage({ searchParams }: AdminGrammarPageProps) {
  const params = (await searchParams) ?? {};
  const filters: GrammarSetFilters = {
    search: params.search ?? null,
    tier: normalizeTierFilter(params.tier),
    topicKey: params.topicKey ?? null,
    sourceKey: params.sourceKey ?? null,
    usageVariant: normalizeUsageVariantFilter(params.usageVariant),
    published: normalizePublishedFilter(params.published),
  };
  const [grammarSets, allGrammarSets] = await Promise.all([
    getGrammarSetsDb(filters),
    getGrammarSetsDb(),
  ]);
  const contentHealthBySetId = await getGrammarSetContentHealthBySetIdsDb(
    grammarSets.map((grammarSet) => grammarSet.id)
  );
  const stats = getGrammarListStats(grammarSets);
  const topicKeys = getUniqueSortedValues(allGrammarSets.map((set) => set.topic_key));
  const sourceKeys = getUniqueSortedValues(allGrammarSets.map((set) => set.source_key));
  const metadataHealth = {
    missingSourceSets: allGrammarSets.filter((set) => !set.source_key).length,
    missingTopicSets: allGrammarSets.filter((set) => !set.topic_key).length,
  };
  const requestedPage = normalizePageParam(params.page);
  const totalPages = Math.max(1, Math.ceil(grammarSets.length / ADMIN_GRAMMAR_PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageStartIndex = (currentPage - 1) * ADMIN_GRAMMAR_PAGE_SIZE;
  const paginatedGrammarSets = grammarSets.slice(
    pageStartIndex,
    pageStartIndex + ADMIN_GRAMMAR_PAGE_SIZE
  );
  const pagination = {
    currentPage,
    totalPages,
    pageSize: ADMIN_GRAMMAR_PAGE_SIZE,
    totalItems: grammarSets.length,
    startItem: grammarSets.length === 0 ? 0 : pageStartIndex + 1,
    endItem: Math.min(pageStartIndex + ADMIN_GRAMMAR_PAGE_SIZE, grammarSets.length),
  };

  return (
    <main className="space-y-4">
      <GrammarAdminIntro
        totalSets={stats.totalSets}
        publishedSets={stats.publishedSets}
      />

      <GrammarSummaryStats stats={stats} usageVariant={filters.usageVariant} />

      <SavedGrammarViews />

      <GrammarSetsTable
        grammarSets={paginatedGrammarSets}
        filters={filters}
        params={params}
        topicKeys={topicKeys}
        sourceKeys={sourceKeys}
        contentHealthBySetId={contentHealthBySetId}
        pagination={pagination}
      />

      <GrammarMetadataHealthPanel metadataHealth={metadataHealth} />
    </main>
  );
}
