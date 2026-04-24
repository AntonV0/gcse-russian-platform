import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  filterMockExamsForDashboardAccess,
  getMockExamTierLabel,
  getPublishedMockExamSetsDb,
  mockExamTiers,
  type MockExamFilters,
  type MockExamTier,
} from "@/lib/mock-exams/mock-exam-helpers-db";

type MockExamsPageProps = {
  searchParams?: Promise<{
    paperNumber?: string;
    tier?: string;
  }>;
};

function normalizePaperNumberFilter(value?: string): MockExamFilters["paperNumber"] {
  const numberValue = Number(value);

  if ([1, 2, 3, 4].includes(numberValue)) {
    return numberValue;
  }

  return "all";
}

function normalizeTierFilter(value?: string): MockExamFilters["tier"] {
  if (mockExamTiers.includes(value as MockExamTier)) {
    return value as MockExamTier;
  }

  return "all";
}

export default async function MockExamsPage({ searchParams }: MockExamsPageProps) {
  const params = (await searchParams) ?? {};
  const dashboard = await getDashboardInfo();
  const filters: MockExamFilters = {
    paperNumber: normalizePaperNumberFilter(params.paperNumber),
    tier: normalizeTierFilter(params.tier),
  };
  const exams = filterMockExamsForDashboardAccess(
    await getPublishedMockExamSetsDb(filters),
    dashboard
  );

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow="Mock exams"
        title="Mock Exams"
        description="Preview original GCSE-style mock exams built for this course. Attempt, submission, and scoring flows will be added later."
        badges={
          <>
            <Badge tone="info" icon="exercise">
              Original practice
            </Badge>
            <Badge tone="muted" icon="school">
              Pearson-style structure
            </Badge>
            <Badge tone="warning" icon="pending">
              Preview mode
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/past-papers" variant="secondary" icon="file">
              Past papers
            </Button>
            <Button href="/dashboard" variant="secondary" icon="dashboard">
              Dashboard
            </Button>
          </>
        }
      />

      <FeedbackBanner
        tone="info"
        title="Preview foundation"
        description="These mock exams are separate from official Pearson past papers. They are original platform content and currently show read-only previews."
      />

      <SectionCard
        title="Find mock exams"
        description="Filter by paper and tier."
        tone="student"
      >
        <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="w-full lg:max-w-[170px]">
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

          <div className="w-full lg:max-w-[190px]">
            <Select name="tier" defaultValue={filters.tier ?? "all"}>
              <option value="all">All tiers</option>
              {mockExamTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {getMockExamTierLabel(tier)}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="primary" icon="filter">
              Apply
            </Button>
            <Button href="/mock-exams" variant="secondary" icon="refresh">
              Reset
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Available mock exams"
        description={`${exams.length} exam${exams.length === 1 ? "" : "s"} available for your access level.`}
        tone="student"
      >
        {exams.length === 0 ? (
          <EmptyState
            icon="exercise"
            iconTone="brand"
            title="No mock exams found"
            description="Try clearing filters, or check back once mock exams have been published."
          />
        ) : (
          <div className="grid gap-3">
            {exams.map((exam) => (
              <CardListItem
                key={exam.id}
                href={`/mock-exams/${exam.slug}`}
                title={exam.title}
                subtitle={exam.description ?? "Original GCSE-style mock exam."}
                badges={
                  <>
                    <Badge tone="info" icon="file">
                      Paper {exam.paper_number}
                    </Badge>
                    <Badge tone="muted" icon="school">
                      {getMockExamTierLabel(exam.tier)}
                    </Badge>
                    <Badge tone="muted">
                      {exam.time_limit_minutes
                        ? `${exam.time_limit_minutes} minutes`
                        : "Untimed preview"}
                    </Badge>
                    <Badge tone="muted">{exam.total_marks} marks</Badge>
                  </>
                }
                actions={
                  <Button
                    href={`/mock-exams/${exam.slug}`}
                    variant="quiet"
                    size="sm"
                    icon="next"
                    iconOnly
                    ariaLabel={`Open ${exam.title}`}
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
