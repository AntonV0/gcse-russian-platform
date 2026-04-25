import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import AppIcon from "@/components/ui/app-icon";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
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

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Past papers"
        title="Past Papers"
        description="Browse official Pearson Edexcel GCSE Russian 1RU0 resource links by series, paper, tier, and resource type."
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
            <Button href="/dashboard" variant="secondary" icon="dashboard">
              Dashboard
            </Button>
            <Button href="/mock-exams" variant="secondary" icon="mockExam">
              Mock exams
            </Button>
          </>
        }
      />

      <FeedbackBanner
        tone="info"
        title="External Pearson resources"
        description="These links open official Pearson pages or files in a new tab. Downloads happen from Pearson, not from this platform."
      />

      <SectionCard
        title="Find resources"
        description="Filter by paper, tier, exam series, and resource type."
        tone="student"
      >
        <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="w-full lg:max-w-[190px]">
            <Select name="examSeries" defaultValue={params.examSeries ?? ""}>
              <option value="">All series</option>
              {examSeriesOptions.map((examSeries) => (
                <option key={examSeries} value={examSeries}>
                  {examSeries}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full lg:max-w-[160px]">
            <Select
              name="paperNumber"
              defaultValue={String(filters.paperNumber ?? "all")}
            >
              <option value="all">All papers</option>
              <option value="1">Paper 1</option>
              <option value="2">Paper 2</option>
              <option value="3">Paper 3</option>
              <option value="4">Paper 4</option>
            </Select>
          </div>

          <div className="w-full lg:max-w-[180px]">
            <Select name="tier" defaultValue={filters.tier ?? "all"}>
              <option value="all">All tiers</option>
              {pastPaperTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {getPastPaperTierLabel(tier)}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full lg:max-w-[240px]">
            <Select name="resourceType" defaultValue={filters.resourceType ?? "all"}>
              <option value="all">All resource types</option>
              {pastPaperResourceTypes.map((resourceType) => (
                <option key={resourceType} value={resourceType}>
                  {getPastPaperResourceTypeLabel(resourceType)}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="primary" icon="filter">
              Apply
            </Button>
            <Button href="/past-papers" variant="secondary" icon="refresh">
              Reset
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Official resources"
        description={`${resources.length} resource${resources.length === 1 ? "" : "s"} available for your filters.`}
        tone="student"
      >
        {groupedResources.length === 0 ? (
          <EmptyState
            icon="search"
            iconTone="brand"
            title="No past paper resources found"
            description="Try clearing filters, or check back once more official links have been published."
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
                      className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 space-y-3">
                          <div>
                            <h3 className="font-semibold leading-6 text-[var(--text-primary)]">
                              {resource.title}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                              {resource.paper_name} · {resource.source_label}
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

                        <a
                          href={resource.official_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="app-btn-base app-btn-primary min-h-10 gap-2 rounded-2xl px-4 py-2.5 text-sm"
                        >
                          Open Pearson resource
                          <AppIcon icon="externalLink" size={14} />
                        </a>
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
