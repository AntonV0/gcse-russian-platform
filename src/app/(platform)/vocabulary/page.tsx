import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getPublishedVocabularySetsDb,
  getVocabularyListModeLabel,
  getVocabularySetsDb,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
  type DbVocabularyListMode,
  type DbVocabularySetCoverageSummary,
  type VocabularySetFilters,
} from "@/lib/vocabulary/vocabulary-helpers-db";

type VocabularyPageProps = {
  searchParams?: Promise<{
    search?: string;
    tier?: string;
    listMode?: string;
    themeKey?: string;
  }>;
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

function getVocabularySetHref(vocabularySet: { id: string; slug: string | null }) {
  return `/vocabulary/${vocabularySet.slug ?? vocabularySet.id}`;
}

function shouldShowCoverageBadges(listMode: DbVocabularyListMode) {
  return (
    listMode === "spec_only" ||
    listMode === "extended_only" ||
    listMode === "spec_and_extended"
  );
}

function getCoverageTone(usedItems: number, totalItems: number) {
  if (totalItems === 0 || usedItems === 0) return "danger";
  if (usedItems === totalItems) return "success";
  if (usedItems < totalItems / 2) return "warning";
  return "info";
}

function getTopicOptions(
  vocabularySets: Awaited<ReturnType<typeof getVocabularySetsDb>>
) {
  return [...new Set(vocabularySets.map((set) => set.theme_key).filter(Boolean))]
    .sort((a, b) => getVocabularyThemeLabel(a).localeCompare(getVocabularyThemeLabel(b)))
    .map((themeKey) => ({
      value: themeKey as string,
      label: getVocabularyThemeLabel(themeKey as string),
    }));
}

function CoverageRatioBadge({
  label,
  usedItems,
  totalItems,
}: {
  label: string;
  usedItems: number;
  totalItems: number;
}) {
  return (
    <Badge
      tone={getCoverageTone(usedItems, totalItems)}
      icon={usedItems > 0 ? "success" : "cancel"}
    >
      {label} {usedItems}/{totalItems}
    </Badge>
  );
}

function VocabularySetCoverageBadges({
  coverageSummary,
}: {
  coverageSummary: DbVocabularySetCoverageSummary;
}) {
  const totalItems = coverageSummary.totalItems;

  if (totalItems === 0) return null;

  return (
    <>
      <CoverageRatioBadge
        label="Foundation"
        usedItems={coverageSummary.foundationUsedItems}
        totalItems={totalItems}
      />
      <CoverageRatioBadge
        label="Higher"
        usedItems={coverageSummary.higherUsedItems}
        totalItems={totalItems}
      />
      <CoverageRatioBadge
        label="Volna"
        usedItems={coverageSummary.volnaUsedItems}
        totalItems={totalItems}
      />
      <CoverageRatioBadge
        label="Custom list"
        usedItems={coverageSummary.customListUsedItems}
        totalItems={totalItems}
      />
    </>
  );
}

export default async function VocabularyPage({ searchParams }: VocabularyPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await getDashboardInfo();
  const filters: VocabularySetFilters = {
    search: params.search ?? null,
    tier: normalizeTierFilter(params.tier),
    listMode: normalizeListModeFilter(params.listMode),
    themeKey: params.themeKey ?? null,
  };
  const canSeeDrafts = dashboard.role === "admin" || dashboard.role === "teacher";
  const [vocabularySets, allVisibleVocabularySets] = await Promise.all([
    canSeeDrafts
      ? getVocabularySetsDb({ filters })
      : getPublishedVocabularySetsDb(filters),
    canSeeDrafts ? getVocabularySetsDb() : getPublishedVocabularySetsDb(),
  ]);
  const draftCount = vocabularySets.filter((set) => !set.is_published).length;
  const topicOptions = getTopicOptions(allVisibleVocabularySets);

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Vocabulary"
        title="Vocabulary"
        description="Browse GCSE Russian vocabulary by topic, tier, and source so you can find the right words to revise quickly."
        badges={
          <>
            <Badge tone="info" icon="vocabulary">
              Vocabulary hub
            </Badge>
            <Badge tone="muted" icon="school">
              GCSE Russian
            </Badge>
            {canSeeDrafts && draftCount > 0 ? (
              <Badge tone="warning" icon="draft">
                {draftCount} draft visible to staff
              </Badge>
            ) : null}
          </>
        }
        actions={
          <>
            <Button href="/dashboard" variant="secondary" icon="dashboard">
              Dashboard
            </Button>
            <Button href="/grammar" variant="secondary" icon="grammar">
              Grammar
            </Button>
          </>
        }
      />

      <SectionCard
        title="Find vocabulary"
        description="Search by keyword, then narrow by tier, list type, or topic."
        tone="student"
      >
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_minmax(140px,160px)_minmax(150px,170px)_minmax(150px,170px)_max-content] xl:items-center">
          <div className="min-w-0">
            <Input
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Search vocabulary..."
            />
          </div>

          <div className="min-w-0">
            <Select name="tier" defaultValue={filters.tier ?? "all"}>
              <option value="all">All tiers</option>
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
              <option value="both">Both tiers</option>
            </Select>
          </div>

          <div className="min-w-0">
            <Select name="listMode" defaultValue={filters.listMode ?? "all"}>
              <option value="all">All list types</option>
              <option value="spec_only">Exam list</option>
              <option value="extended_only">Extra practice</option>
              <option value="spec_and_extended">Exam + extra</option>
              <option value="custom">Custom sets</option>
            </Select>
          </div>

          <div className="min-w-0">
            <Select name="themeKey" defaultValue={filters.themeKey ?? ""}>
              <option value="">All topics</option>
              {topicOptions.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 md:col-span-2 xl:col-span-1 xl:flex-nowrap xl:justify-end">
            <Button type="submit" variant="primary" icon="search">
              Search
            </Button>
            <Button href="/vocabulary" variant="secondary" icon="refresh">
              Reset
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Vocabulary sets"
        description={`${vocabularySets.length} set${vocabularySets.length === 1 ? "" : "s"} available${canSeeDrafts ? " to your staff view" : ""}.`}
        tone="student"
      >
        {vocabularySets.length === 0 ? (
          <EmptyState
            icon="vocabulary"
            iconTone="brand"
            title="No vocabulary sets found"
            description="Try clearing filters, or publish vocabulary sets in admin so students can see them."
          />
        ) : (
          <div className="grid gap-3">
            {vocabularySets.map((vocabularySet) => (
              <CardListItem
                key={vocabularySet.id}
                href={getVocabularySetHref(vocabularySet)}
                title={vocabularySet.title}
                subtitle={vocabularySet.description ?? "Vocabulary set ready for study."}
                badges={
                  <>
                    <Badge tone="info" icon="school">
                      {getVocabularyTierLabel(vocabularySet.tier)}
                    </Badge>
                    <Badge tone="muted" icon="vocabularySet">
                      {getVocabularyListModeLabel(vocabularySet.list_mode)}
                    </Badge>
                    <Badge tone="muted" className="capitalize">
                      {getVocabularyThemeLabel(vocabularySet.theme_key)}
                    </Badge>
                    <Badge tone="muted" icon="list">
                      {vocabularySet.item_count} item
                      {vocabularySet.item_count === 1 ? "" : "s"}
                    </Badge>
                    {!vocabularySet.is_published ? (
                      <PublishStatusBadge isPublished={vocabularySet.is_published} />
                    ) : null}
                    {canSeeDrafts && shouldShowCoverageBadges(vocabularySet.list_mode) ? (
                      <VocabularySetCoverageBadges
                        coverageSummary={vocabularySet.coverage_summary}
                      />
                    ) : null}
                  </>
                }
                actions={
                  <Button
                    href={getVocabularySetHref(vocabularySet)}
                    variant="quiet"
                    size="sm"
                    icon="next"
                    iconOnly
                    ariaLabel={`Open ${vocabularySet.title}`}
                  />
                }
              />
            ))}
          </div>
        )}
      </SectionCard>
    </main>
  );
}
