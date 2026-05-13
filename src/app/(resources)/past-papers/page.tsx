import type { Metadata } from "next";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  examPaperPathways,
  getExamPaperPathway,
  getResourceActionLabel,
  getResourcePracticeHint,
  getResourceTypeIcon,
} from "@/lib/exam-prep/exam-prep-helpers";
import {
  filterPastPaperResourcesForDashboardAccess,
  getPastPaperExamSeriesOptions,
  getPastPaperResourceTypeLabel,
  getPastPaperTierLabel,
  getPublishedPastPaperResourcesDb,
  groupPastPaperResourcesBySeries,
  pastPaperResourceTypes,
  pastPaperTiers,
  type PastPaperResourceFilters,
  type PastPaperResourceType,
  type PastPaperTier,
} from "@/lib/past-papers/past-paper-helpers-db";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Past Papers",
  description:
    "Browse official Pearson Edexcel GCSE Russian 1RU0 past paper resources by series, paper, tier, and resource type.",
  path: "/past-papers",
  ogTitle: "GCSE Russian Past Papers",
  ogDescription:
    "Find official GCSE Russian past papers, mark schemes, transcripts, audio, and exam resources.",
  ogImagePath: getOgImagePath("past-papers"),
});

type PastPapersPageProps = {
  searchParams?: Promise<{
    examSeries?: string;
    paperNumber?: string;
    tier?: string;
    resourceType?: string;
  }>;
};

function normalizePaperNumberFilter(
  value?: string
): PastPaperResourceFilters["paperNumber"] {
  const numberValue = Number(value);

  if ([1, 2, 3, 4].includes(numberValue)) {
    return numberValue;
  }

  return "all";
}

function normalizeTierFilter(value?: string): PastPaperResourceFilters["tier"] {
  if (pastPaperTiers.includes(value as PastPaperTier)) {
    return value as PastPaperTier;
  }

  return "all";
}

function normalizeResourceTypeFilter(
  value?: string
): PastPaperResourceFilters["resourceType"] {
  if (pastPaperResourceTypes.includes(value as PastPaperResourceType)) {
    return value as PastPaperResourceType;
  }

  return "all";
}

export default async function PastPapersPage({ searchParams }: PastPapersPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await getDashboardInfo();
  const allAccessibleResources = filterPastPaperResourcesForDashboardAccess(
    await getPublishedPastPaperResourcesDb(),
    dashboard
  );
  const filters: PastPaperResourceFilters = {
    examSeries: params.examSeries ?? null,
    paperNumber: normalizePaperNumberFilter(params.paperNumber),
    tier: normalizeTierFilter(params.tier),
    resourceType: normalizeResourceTypeFilter(params.resourceType),
  };
  const resources = filterPastPaperResourcesForDashboardAccess(
    await getPublishedPastPaperResourcesDb(filters),
    dashboard
  );
  const groupedResources = groupPastPaperResourcesBySeries(resources);
  const examSeriesOptions = getPastPaperExamSeriesOptions(allAccessibleResources);
  const activePathway =
    typeof filters.paperNumber === "number"
      ? getExamPaperPathway(filters.paperNumber)
      : null;
  const hasActiveFilters = Boolean(
    params.examSeries ||
      filters.paperNumber !== "all" ||
      filters.tier !== "all" ||
      filters.resourceType !== "all"
  );

  return (
    <main className="flex flex-col gap-4">
      <PageIntroPanel
        className="order-1"
        tone="student"
        eyebrow="Past papers"
        title="Past Papers"
        description="Browse official Pearson Edexcel GCSE Russian 1RU0 resources and choose the next useful practice task with a paper, mark scheme, transcript, or audio file."
        badges={
          <>
            <Badge tone="info" icon="pastPapers">
              Pearson Edexcel 1RU0
            </Badge>
            <Badge tone="muted" icon="school">
              GCSE Russian
            </Badge>
            <Badge tone="success" icon="externalLink">
              Official links only
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/taking-your-exams" variant="primary" icon="exam">
              Exam guidance
            </Button>
            <Button href="/dashboard" variant="secondary" icon="dashboard">
              Dashboard
            </Button>
            <Button href="/mock-exams" variant="secondary" icon="mockExam">
              Mock exams
            </Button>
          </>
        }
        visual={
          <VisualPlaceholder
            category="pastPapers"
            size="wide"
            ariaLabel="Abstract past paper resource illustration"
          />
        }
      />

      <FeedbackBanner
        className="order-3 xl:order-2"
        tone="info"
        title="External Pearson resources"
        description="Open the question paper first, answer under timed conditions, then use mark schemes, audio, transcripts, and examiner reports to turn mistakes into the next practice task."
      />

      {dashboard.role === "guest" ? (
        <FeedbackBanner
          className="order-4 xl:order-3"
          tone="success"
          icon="unlocked"
          title="Past papers stay free"
          description="You can use every official link here without an account. Create a trial account when you want lessons, saved progress, and mock exam attempts."
        >
          <Button href="/signup" variant="primary" size="sm" icon="create">
            Start trial
          </Button>
        </FeedbackBanner>
      ) : dashboard.accessMode === "trial" ? (
        <FeedbackBanner
          className="order-4 xl:order-3"
          tone="info"
          icon="billing"
          title="Use papers alongside trial lessons"
          description="Past papers stay fully open. Upgrade when you want the full lesson path, richer practice, and all tier-specific course content."
        >
          <Button href="/account/billing" variant="secondary" size="sm" icon="billing">
            Review access
          </Button>
        </FeedbackBanner>
      ) : null}

      <SectionCard
        className="order-2 xl:order-4"
        title="Find resources"
        description={
          activePathway
            ? `${activePathway.paperName}: ${activePathway.practiceCue}`
            : "Filter by paper, tier, exam series, and resource type."
        }
        tone="student"
        actions={
          hasActiveFilters ? (
            <Badge tone="info" icon="filter">
              Filters active
            </Badge>
          ) : null
        }
      >
        <form className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:items-center">
          <div className="min-w-0">
            <Select
              name="examSeries"
              defaultValue={params.examSeries ?? ""}
              aria-label="Filter by exam series"
            >
              <option value="">All series</option>
              {examSeriesOptions.map((examSeries) => (
                <option key={examSeries} value={examSeries}>
                  {examSeries}
                </option>
              ))}
            </Select>
          </div>

          <div className="min-w-0">
            <Select
              name="paperNumber"
              defaultValue={String(filters.paperNumber ?? "all")}
              aria-label="Filter by paper"
            >
              <option value="all">All papers</option>
              <option value="1">Paper 1</option>
              <option value="2">Paper 2</option>
              <option value="3">Paper 3</option>
              <option value="4">Paper 4</option>
            </Select>
          </div>

          <div className="min-w-0">
            <Select
              name="tier"
              defaultValue={filters.tier ?? "all"}
              aria-label="Filter by tier"
            >
              <option value="all">All tiers</option>
              {pastPaperTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {getPastPaperTierLabel(tier)}
                </option>
              ))}
            </Select>
          </div>

          <div className="min-w-0">
            <Select
              name="resourceType"
              defaultValue={filters.resourceType ?? "all"}
              aria-label="Filter by resource type"
            >
              <option value="all">All resource types</option>
              {pastPaperResourceTypes.map((resourceType) => (
                <option key={resourceType} value={resourceType}>
                  {getPastPaperResourceTypeLabel(resourceType)}
                </option>
              ))}
            </Select>
          </div>

          <div className="app-mobile-action-stack flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:flex-wrap xl:col-span-4 xl:justify-end">
            <Button type="submit" variant="secondary" icon="filter">
              Apply
            </Button>
            <Button href="/past-papers" variant="quiet" icon="refresh">
              Reset
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        className="order-5"
        title="Choose a paper pathway"
        description="Students usually make faster progress when the next task is specific: one paper, one timing target, one review habit."
        tone="student"
        density="compact"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {examPaperPathways.map((pathway) => (
            <div key={pathway.paperNumber} className="app-soft-panel p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
                  <AppIcon icon={pathway.icon} size={18} />
                </span>
                <div className="min-w-0">
                  <h3 className="app-heading-card">{pathway.paperName}</h3>
                  <p className="mt-1 app-text-body-muted">{pathway.nextStep}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  href={pathway.pastPapersHref}
                  variant="secondary"
                  size="sm"
                  icon="pastPapers"
                >
                  Filter papers
                </Button>
                <Button
                  href={pathway.guideHref}
                  variant="quiet"
                  size="sm"
                  icon="examTip"
                >
                  Skill guide
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        className="order-6"
        title="Official resources"
        description={`${resources.length} resource${resources.length === 1 ? "" : "s"} available for your filters.`}
        tone="student"
        actions={
          activePathway ? (
            <Button
              href={activePathway.mockExamHref}
              variant="soft"
              size="sm"
              icon="mockExam"
            >
              Practise {activePathway.skill.toLowerCase()} mocks
            </Button>
          ) : null
        }
      >
        {groupedResources.length === 0 ? (
          <EmptyState
            icon="search"
            iconTone="brand"
            title="No past paper resources found"
            description="Try clearing one filter, or start from a paper pathway above and then narrow by tier or resource type."
            visual={
              <VisualPlaceholder
                category="pastPapers"
                ariaLabel="Past paper empty state placeholder"
              />
            }
          />
        ) : (
          <div className="space-y-5">
            {groupedResources.map((group) => (
              <section key={group.examSeries} className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="app-card-title">{group.examSeries}</h2>
                  <Badge tone="muted" icon="list">
                    {group.resources.length} resource
                    {group.resources.length === 1 ? "" : "s"}
                  </Badge>
                </div>

                <div className="grid gap-3">
                  {group.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-xs)]"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 gap-3">
                          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-muted)] text-[var(--accent-ink)]">
                            <AppIcon
                              icon={getResourceTypeIcon(resource.resource_type)}
                              size={18}
                            />
                          </span>

                          <div className="min-w-0 space-y-3">
                            <div>
                              <h3 className="font-semibold leading-6 text-[var(--text-primary)]">
                                {resource.title}
                              </h3>
                              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                                {resource.paper_name} &middot; {resource.source_label}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                                {getResourcePracticeHint(resource.resource_type)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge tone="info" icon="pastPapers">
                                Paper {resource.paper_number}
                              </Badge>
                              <Badge tone="muted" icon="school">
                                {getPastPaperTierLabel(resource.tier)}
                              </Badge>
                              <Badge tone="muted">
                                {getPastPaperResourceTypeLabel(resource.resource_type)}
                              </Badge>
                              {resource.is_official ? (
                                <Badge tone="success" icon="externalLink">
                                  Official
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <Button
                          href={resource.official_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="primary"
                          icon="externalLink"
                          className="w-full sm:w-auto lg:shrink-0"
                          aria-label={`${getResourceActionLabel(resource.resource_type)}: ${resource.title}`}
                        >
                          {getResourceActionLabel(resource.resource_type)}
                        </Button>
                      </div>
                    </div>
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
