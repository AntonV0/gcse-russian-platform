import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import AppIcon from "@/components/ui/app-icon";
import type { CSSProperties } from "react";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { getButtonClassName } from "@/components/ui/button-styles";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getPublishedVocabularySetsDb,
  getVocabularyListModeLabel,
  getVocabularySetThemeKeysDb,
  getVocabularySetsDb,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
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

function normalizeVocabularyKey(value: string | null) {
  return value?.replaceAll("-", "_") ?? null;
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function getCoveragePercentage(usedItems: number, totalItems: number) {
  if (totalItems <= 0) return 0;
  return clampPercentage(Math.round((usedItems / totalItems) * 100));
}

function getCoverageRingColor(usedItems: number, totalItems: number) {
  switch (getCoverageTone(usedItems, totalItems)) {
    case "success":
      return "var(--success)";
    case "warning":
      return "var(--warning)";
    case "danger":
      return "var(--danger)";
    case "info":
    default:
      return "var(--info)";
  }
}

function CoverageProgressRing({
  letter,
  label,
  usedItems,
  totalItems,
}: {
  letter: string;
  label: string;
  usedItems: number;
  totalItems: number;
}) {
  const percentage = getCoveragePercentage(usedItems, totalItems);
  const progressDegrees = Math.round((percentage / 100) * 360);
  const ringColor = getCoverageRingColor(usedItems, totalItems);
  const style = {
    background: `conic-gradient(${ringColor} ${progressDegrees}deg, color-mix(in srgb, ${ringColor} 16%, var(--background-muted)) ${progressDegrees}deg 360deg)`,
  } satisfies CSSProperties;

  return (
    <span
      role="meter"
      aria-label={`${label} vocabulary coverage: ${percentage}% (${usedItems} of ${totalItems} items)`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
      title={`${label}: ${usedItems}/${totalItems} items (${percentage}%)`}
      className="flex min-w-[3.75rem] flex-col items-center gap-1 text-center"
    >
      <span
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full p-1 shadow-[0_8px_18px_color-mix(in_srgb,var(--text-primary)_7%,transparent)]"
        style={style}
      >
        <span className="flex h-full w-full flex-col items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--background-elevated)] leading-none">
          <span className="text-[0.78rem] font-bold text-[var(--text-primary)]">
            {letter}
          </span>
          <span className="mt-0.5 text-[0.68rem] font-semibold text-[var(--text-secondary)]">
            {percentage}%
          </span>
        </span>
      </span>
      <span className="sr-only">
        {label} {usedItems} of {totalItems}
      </span>
    </span>
  );
}

function VocabularySetCoverageBadges({
  coverageSummary,
  fallbackTotalItems,
}: {
  coverageSummary: DbVocabularySetCoverageSummary;
  fallbackTotalItems: number;
}) {
  const totalItems = coverageSummary.totalItems || fallbackTotalItems;

  if (totalItems === 0) return null;

  return (
    <>
      <CoverageProgressRing
        letter="F"
        label="Foundation"
        usedItems={coverageSummary.foundationUsedItems}
        totalItems={coverageSummary.foundationTotalItems || totalItems}
      />
      <CoverageProgressRing
        letter="H"
        label="Higher"
        usedItems={coverageSummary.higherUsedItems}
        totalItems={coverageSummary.higherTotalItems || totalItems}
      />
      <CoverageProgressRing
        letter="V"
        label="Volna"
        usedItems={coverageSummary.volnaUsedItems}
        totalItems={coverageSummary.volnaTotalItems || totalItems}
      />
      <CoverageProgressRing
        letter="C"
        label="Custom list"
        usedItems={coverageSummary.customListUsedItems}
        totalItems={coverageSummary.customListTotalItems || totalItems}
      />
    </>
  );
}

type VocabularyThemeSectionDefinition = {
  keys: readonly string[];
  order: number;
  title: string;
};

const VOCABULARY_THEME_SECTION_DEFINITIONS: VocabularyThemeSectionDefinition[] = [
  {
    keys: ["high_frequency_language"],
    order: 1,
    title: "Section 1: High-frequency language",
  },
  {
    keys: ["identity_and_culture"],
    order: 2,
    title: "Section 2: Identity and culture",
  },
  {
    keys: ["local_area_holiday_travel", "local_area_holiday_and_travel"],
    order: 3,
    title: "Section 3: Local area, holiday and travel",
  },
  {
    keys: ["school"],
    order: 4,
    title: "Section 4: School",
  },
  {
    keys: ["future_aspirations_study_work", "future_aspirations_study_and_work"],
    order: 5,
    title: "Section 5: Future aspirations, study and work",
  },
  {
    keys: ["international_global_dimension"],
    order: 6,
    title: "Section 6: International and global dimension",
  },
] as const;

function getVocabularyThemeSectionByKey(themeKey: string | null) {
  const normalizedThemeKey = normalizeVocabularyKey(themeKey);

  return VOCABULARY_THEME_SECTION_DEFINITIONS.find((section) =>
    normalizedThemeKey ? section.keys.includes(normalizedThemeKey) : false
  );
}

function getVocabularySectionTitle(vocabularySet: {
  import_key: string | null;
  theme_key: string | null;
}) {
  const section = getVocabularyThemeSectionByKey(vocabularySet.theme_key);

  if (section) {
    return section.title;
  }

  const importKey = vocabularySet.import_key ?? "";

  if (importKey.startsWith("section-1:")) {
    return "Section 1: High-frequency language";
  }

  if (importKey.startsWith("section-2:")) {
    return `Section 2: ${toTitleCase(getVocabularyThemeLabel(vocabularySet.theme_key))}`;
  }

  return "Custom Vocabulary";
}

function getVocabularySectionOrder(sectionTitle: string) {
  if (sectionTitle === "Custom Vocabulary") {
    return 1000;
  }

  const matchingSection = VOCABULARY_THEME_SECTION_DEFINITIONS.find(
    (section) => section.title === sectionTitle
  );

  if (matchingSection) {
    return matchingSection.order;
  }

  return 900;
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

function SectionToggleButton() {
  return (
    <span
      className={getButtonClassName({
        variant: "secondary",
        size: "sm",
        className: "pointer-events-none",
      })}
      aria-hidden="true"
    >
      <span className="shrink-0">
        <AppIcon icon="next" size={16} />
      </span>
      <span className="truncate">Open</span>
    </span>
  );
}

function VocabularySetBadges({
  vocabularySet,
  canSeeCoverage,
}: {
  vocabularySet: Awaited<ReturnType<typeof getVocabularySetsDb>>[number];
  canSeeCoverage: boolean;
}) {
  return (
    <>
      <span className="flex flex-wrap gap-2">
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
      </span>

      {canSeeCoverage ? (
        <span className="flex basis-full flex-wrap gap-2 pt-1" aria-label="Coverage by vocabulary source">
          <VocabularySetCoverageBadges
            coverageSummary={vocabularySet.coverage_summary}
            fallbackTotalItems={vocabularySet.item_count}
          />
        </span>
      ) : null}
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
  const canSeeCoverage = dashboard.role === "admin";
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

          <div className="app-mobile-action-stack flex shrink-0 flex-wrap gap-2 md:col-span-2 xl:col-span-1 xl:flex-nowrap xl:justify-end">
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
              <details key={group.title} className="group app-card p-4">
                <summary className="app-focus-ring flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg">
                  <span className="min-w-0">
                    <span className="block text-base font-semibold text-[var(--text-primary)]">
                      {group.title}
                    </span>
                    <span className="mt-1 block text-sm text-[var(--text-secondary)]">
                      {group.sets.length} set{group.sets.length === 1 ? "" : "s"}
                    </span>
                  </span>

                  <SectionToggleButton />
                </summary>

                <div className="mt-4 grid gap-3">
                  {group.sets.map((vocabularySet) => (
                    <CardListItem
                      key={vocabularySet.id}
                      href={getVocabularySetHref(vocabularySet)}
                      title={vocabularySet.title}
                      subtitle={
                        vocabularySet.description ?? "Vocabulary set ready for study."
                      }
                      badges={
                        <VocabularySetBadges
                          vocabularySet={vocabularySet}
                          canSeeCoverage={canSeeCoverage}
                        />
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
              </details>
            ))}
          </div>
        )}
      </SectionCard>
    </main>
  );
}
