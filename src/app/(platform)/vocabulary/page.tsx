import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getPublishedVocabularySetsDb,
  getVocabularyListModeLabel,
  getVocabularySetThemeKeysDb,
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

function getTopicOptions(themeKeys: string[]) {
  return themeKeys.map((themeKey) => ({
    value: themeKey,
    label: getVocabularyThemeLabel(themeKey),
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
        totalItems={coverageSummary.foundationTotalItems || totalItems}
      />
      <CoverageRatioBadge
        label="Higher"
        usedItems={coverageSummary.higherUsedItems}
        totalItems={coverageSummary.higherTotalItems || totalItems}
      />
      <CoverageRatioBadge
        label="Volna"
        usedItems={coverageSummary.volnaUsedItems}
        totalItems={coverageSummary.volnaTotalItems || totalItems}
      />
      <CoverageRatioBadge
        label="Custom list"
        usedItems={coverageSummary.customListUsedItems}
        totalItems={coverageSummary.customListTotalItems || totalItems}
      />
    </>
  );
}

function getVocabularySectionTitle(vocabularySet: {
  import_key: string | null;
  theme_key: string | null;
}) {
  const importKey = vocabularySet.import_key ?? "";

  if (importKey.startsWith("section-1:")) {
    return "Section 1: High-frequency language";
  }

  if (importKey.startsWith("section-2:")) {
    return `Section 2: ${getVocabularyThemeLabel(vocabularySet.theme_key)}`;
  }

  return "Custom vocabulary";
}

function getVocabularySectionOrder(sectionTitle: string) {
  if (sectionTitle.startsWith("Section 1")) return 1;
  if (sectionTitle.includes("identity and culture")) return 2;
  if (sectionTitle.includes("local area")) return 3;
  if (sectionTitle.includes("school")) return 4;
  if (sectionTitle.includes("future aspirations")) return 5;
  if (sectionTitle.includes("international global dimension")) return 6;
  return 99;
}

function groupVocabularySetsBySection(
  vocabularySets: Awaited<ReturnType<typeof getVocabularySetsDb>>
) {
  const groups = new Map<string, typeof vocabularySets>();

  for (const vocabularySet of vocabularySets) {
    const sectionTitle = getVocabularySectionTitle(vocabularySet);
    groups.set(sectionTitle, [...(groups.get(sectionTitle) ?? []), vocabularySet]);
  }

  return Array.from(groups.entries())
    .map(([title, sets]) => ({ title, sets }))
    .sort(
      (a, b) =>
        getVocabularySectionOrder(a.title) - getVocabularySectionOrder(b.title) ||
        a.title.localeCompare(b.title)
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
  const [vocabularySets, themeKeys] = await Promise.all([
    canSeeDrafts
      ? getVocabularySetsDb({ filters })
      : getPublishedVocabularySetsDb(filters),
    getVocabularySetThemeKeysDb({ publishedOnly: !canSeeDrafts }),
  ]);
  const draftCount = vocabularySets.filter((set) => !set.is_published).length;
  const topicOptions = getTopicOptions(themeKeys);
  const vocabularySetGroups = groupVocabularySetsBySection(vocabularySets);

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
        visual={
          <VisualPlaceholder
            category="vocabulary"
            size="wide"
            ariaLabel="Abstract vocabulary card illustration"
          />
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
          <div className="space-y-6">
            {vocabularySetGroups.map((group) => (
              <section key={group.title} className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    {group.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {group.sets.length} set{group.sets.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="grid gap-3">
                  {group.sets.map((vocabularySet) => (
                    <CardListItem
                      key={vocabularySet.id}
                      href={getVocabularySetHref(vocabularySet)}
                      title={vocabularySet.title}
                      subtitle={
                        vocabularySet.description ?? "Vocabulary set ready for study."
                      }
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
                            <PublishStatusBadge
                              isPublished={vocabularySet.is_published}
                            />
                          ) : null}
                          {canSeeDrafts &&
                          shouldShowCoverageBadges(vocabularySet.list_mode) ? (
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
              </section>
            ))}
          </div>
        )}
      </SectionCard>
    </main>
  );
}
