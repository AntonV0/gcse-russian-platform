import type { Metadata } from "next";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import LockedContentCard from "@/components/ui/locked-content-card";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import { getCurrentUser } from "@/lib/auth/auth";
import Select from "@/components/ui/select";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  examPaperPathways,
  getExamPaperPathway,
  getMockExamAttemptState,
} from "@/lib/exam-prep/exam-prep-helpers";
import { filterMockExamsForDashboardAccess } from "@/lib/mock-exams/access";
import { mockExamTiers } from "@/lib/mock-exams/constants";
import { getMockExamTierLabel } from "@/lib/mock-exams/labels";
import {
  getCurrentUserMockExamAttemptsByExamIdsDb,
  getPublishedMockExamSetsDb,
} from "@/lib/mock-exams/queries";
import { getOgImagePath } from "@/lib/seo/og-images";
import { buildPublicMetadata } from "@/lib/seo/site";
import type { MockExamFilters, MockExamTier } from "@/lib/mock-exams/types";

export const metadata: Metadata = buildPublicMetadata({
  title: "GCSE Russian Mock Exams",
  description:
    "Browse GCSE-style Russian mock exams and exam-condition practice built for structured Pearson Edexcel 1RU0 preparation.",
  path: "/mock-exams",
  ogTitle: "GCSE Russian Mock Exams",
  ogDescription:
    "Preview original GCSE-style Russian mock exams and start account-based attempts when ready.",
  ogImagePath: getOgImagePath("resources"),
});

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

  if (dashboard.role === "guest") {
    return (
      <main className="space-y-4">
        <PageIntroPanel
          tone="student"
          eyebrow="Mock exams"
          title="Mock Exams"
          description="Original GCSE-style mocks are saved, submitted, and reviewed inside a signed-in account."
          badges={
            <>
              <Badge tone="info" icon="mockExam">
                Original practice
              </Badge>
              <Badge tone="muted" icon="locked">
                Trial account required
              </Badge>
            </>
          }
          actions={
            <Button href="/past-papers" variant="secondary" icon="pastPapers">
              Past papers
            </Button>
          }
          visual={
            <VisualPlaceholder
              category="mockExam"
              size="wide"
              ariaLabel="Abstract mock exam practice illustration"
            />
          }
        />

        <LockedContentCard
          title="Create a trial account to open mock exams"
          description="Past papers remain free and open. Platform mock exams require signup so attempts, marks, drafts, and feedback can be saved."
          accessLabel="Trial account"
          statusLabel="Signup required"
          primaryActionHref="/signup"
          primaryActionLabel="Start trial"
          secondaryActionHref="/past-papers"
          secondaryActionLabel="Open past papers"
        />
      </main>
    );
  }

  const exams = filterMockExamsForDashboardAccess(
    await getPublishedMockExamSetsDb(filters),
    dashboard
  );
  const user = await getCurrentUser();
  const attempts = user
    ? await getCurrentUserMockExamAttemptsByExamIdsDb(
        exams.map((exam) => exam.id),
        user.id
      )
    : [];
  const latestAttemptByExamId = new Map(
    exams.map((exam) => [
      exam.id,
      attempts.find((attempt) => attempt.mock_exam_id === exam.id) ?? null,
    ])
  );
  const activePathway =
    typeof filters.paperNumber === "number"
      ? getExamPaperPathway(filters.paperNumber)
      : null;

  return (
    <main className="flex flex-col gap-4">
      <PageIntroPanel
        className="order-1"
        tone="student"
        eyebrow="Mock exams"
        title="Mock Exams"
        description="Attempt original GCSE-style mock exams, continue drafts, and review submitted or marked work without losing sight of the next skill to practise."
        badges={
          <>
            <Badge tone="info" icon="mockExam">
              Original practice
            </Badge>
            <Badge tone="muted" icon="school">
              Pearson-style structure
            </Badge>
            <Badge tone="success" icon="marked">
              Attempts and marking
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/taking-your-exams" variant="primary" icon="exam">
              Exam guidance
            </Button>
            <Button href="/past-papers" variant="secondary" icon="pastPapers">
              Past papers
            </Button>
            <Button href="/dashboard" variant="secondary" icon="dashboard">
              Dashboard
            </Button>
          </>
        }
        visual={
          <VisualPlaceholder
            category="mockExam"
            size="wide"
            ariaLabel="Abstract mock exam practice illustration"
          />
        }
      />

      <FeedbackBanner
        className="order-3 xl:order-2"
        tone="info"
        title="Original mock exams"
        description="These mocks use GCSE-style structures, but the questions are platform-created content. Official Pearson past papers remain linked separately in the Past Papers library."
      />

      <SectionCard
        className="order-4 xl:order-3"
        title="Volna School official virtual mocks"
        description="Volna School hosts two official virtual mock exam sessions each year for Volna School students."
        tone="brand"
        actions={
          <Badge tone="info" icon="school">
            Volna School students
          </Badge>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              Frequency
            </div>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              Two official virtual mock exam sessions are hosted during the year.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              Conditions
            </div>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              Sessions are run in exam conditions so the result is useful for planning and
              progress decisions.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              Predicted grade
            </div>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              Volna School can provide a predicted grade for Volna School students after
              reviewing mock exam performance.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        className="order-2 xl:order-4"
        title="Find mock exams"
        description={
          activePathway
            ? `${activePathway.paperName}: ${activePathway.nextStep}`
            : "Filter by paper and tier."
        }
        tone="student"
      >
        <form className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(160px,180px)_minmax(180px,220px)] xl:items-center">
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
              {mockExamTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {getMockExamTierLabel(tier)}
                </option>
              ))}
            </Select>
          </div>

          <div className="app-mobile-action-stack flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:flex-wrap xl:justify-end">
            <Button type="submit" variant="secondary" icon="filter">
              Apply
            </Button>
            <Button href="/mock-exams" variant="quiet" icon="refresh">
              Reset
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        className="order-5"
        title="Practice pathways"
        description="Pick the paper that feels most urgent, then use a mock attempt to expose exactly what to practise next."
        tone="student"
        density="compact"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {examPaperPathways.map((pathway) => (
            <div key={pathway.paperNumber} className="app-soft-panel p-4">
              <Badge tone="info" icon={pathway.icon}>
                {pathway.paperName}
              </Badge>
              <p className="mt-3 app-text-body-muted">{pathway.practiceCue}</p>
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  href={pathway.mockExamHref}
                  variant="secondary"
                  size="sm"
                  icon="mockExam"
                >
                  Filter mocks
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
        title="Available mock exams"
        description={`${exams.length} exam${exams.length === 1 ? "" : "s"} available for your access level.`}
        tone="student"
      >
        {exams.length === 0 ? (
          <EmptyState
            icon="mockExam"
            iconTone="brand"
            title="No mock exams found"
            description="Try clearing filters, or check back once mock exams have been published."
            visual={
              <VisualPlaceholder
                category="mockExam"
                ariaLabel="Mock exam empty state placeholder"
              />
            }
          />
        ) : (
          <div className="grid gap-3">
            {exams.map((exam) => {
              const latestAttempt = latestAttemptByExamId.get(exam.id);
              const attemptState = getMockExamAttemptState(
                latestAttempt
                  ? {
                      status: latestAttempt.status,
                      awardedMarks: latestAttempt.awarded_marks,
                      totalMarks: latestAttempt.total_marks_snapshot,
                    }
                  : null
              );
              const actionHref = latestAttempt
                ? `/mock-exams/${exam.slug}/attempts/${latestAttempt.id}`
                : `/mock-exams/${exam.slug}`;

              return (
                <CardListItem
                  key={exam.id}
                  href={actionHref}
                  title={exam.title}
                  subtitle={
                    exam.description
                      ? `${exam.description} ${attemptState.description}`
                      : attemptState.description
                  }
                  badges={
                    <>
                      <Badge tone="info" icon="mockExam">
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
                      <Badge tone={attemptState.tone} icon={attemptState.icon}>
                        {attemptState.label}
                      </Badge>
                    </>
                  }
                  actions={
                    <Button
                      href={actionHref}
                      variant={latestAttempt?.status === "draft" ? "primary" : "quiet"}
                      size="sm"
                      icon="next"
                      ariaLabel={`${attemptState.actionLabel}: ${exam.title}`}
                    >
                      {attemptState.actionLabel}
                    </Button>
                  }
                />
              );
            })}
          </div>
        )}
      </SectionCard>
    </main>
  );
}
