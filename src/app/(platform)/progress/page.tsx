import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getCurrentUser } from "@/lib/auth/auth";
import { loadVariantPageData } from "@/lib/courses/course-helpers-db";
import {
  formatCoursePathRemainingMinutes,
  getVariantPathProgressSummary,
} from "@/lib/courses/path-progress";
import { formatLessonProgressLabel } from "@/lib/courses/progress-labels";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardAccessLabel,
  getDashboardNextStep,
  getDashboardVariantLabel,
  getStudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import { getLearningMilestone, getMasterySignals } from "@/lib/dashboard/mastery-signals";
import {
  getStudentDashboardActionQueue,
  getStudentDashboardActivity,
  type StudentDashboardAction,
} from "@/lib/dashboard/student-next-actions";
import { getCourseProgressSummary } from "@/lib/progress/progress";
import {
  getProgressDomainSummaries,
  getProgressRecentWins,
  getProgressWeakAreas,
  isNewStudentProgressEmpty,
} from "@/lib/progress/progress-insights";

import {
  ModuleProgressList,
  NextActionList,
  RecommendedActionCard,
} from "./progress-action-cards";
import { ProgressUnavailableState } from "./progress-empty-states";
import {
  DomainProgressGrid,
  NewStudentKickstartCard,
  ProgressMilestoneCard,
  RecentWinsCard,
  SkillReadinessList,
  WeakAreasCard,
} from "./progress-insight-cards";

export default async function ProgressPage() {
  const [user, dashboard] = await Promise.all([getCurrentUser(), getDashboardInfo()]);
  const hasActiveLearningPath =
    dashboard.variant !== null &&
    dashboard.accessState !== "trial_needs_tier" &&
    dashboard.accessState !== "expired";

  if (dashboard.accessState === "trial_needs_tier") {
    return (
      <ProgressUnavailableState
        icon="courses"
        title="Choose a course path to start progress"
        description="Progress appears after you choose Foundation, Higher, or Volna and start learning."
        actionHref="/courses"
        actionLabel="Choose path"
      />
    );
  }

  if (dashboard.accessState === "expired" || !hasActiveLearningPath) {
    return (
      <ProgressUnavailableState
        icon="billing"
        title="Course progress is paused"
        description="Restore course access to continue lessons, progress tracking, and account-based practice."
        actionHref="/account/billing"
        actionLabel="Review access"
      />
    );
  }

  const activeVariant = dashboard.variant;

  if (!activeVariant) {
    return (
      <ProgressUnavailableState
        icon="courses"
        title="Course path not found"
        description="Your account has access, but the current course path could not be resolved."
        actionHref="/courses"
        actionLabel="Open courses"
      />
    );
  }

  const progressSummary = await getCourseProgressSummary("gcse-russian", activeVariant);
  const [learningPlan, activity, variantData] = await Promise.all([
    getStudentLearningPlan(activeVariant, progressSummary.completedLessons),
    getStudentDashboardActivity(user?.id),
    loadVariantPageData("gcse-russian", activeVariant),
  ]);

  if (!variantData.course || !variantData.variant) {
    return (
      <ProgressUnavailableState
        icon="courses"
        title="Course path not found"
        description="Your account has access, but the current course path could not be loaded."
        actionHref="/courses"
        actionLabel="Open courses"
      />
    );
  }

  const pathSummary = await getVariantPathProgressSummary(
    variantData.course.slug,
    variantData.variant,
    variantData.modules
  );
  const nextStep = getDashboardNextStep(
    activeVariant,
    dashboard.accessMode,
    progressSummary.completedLessons,
    learningPlan
  );
  const nextActionQueue = getStudentDashboardActionQueue(activity, nextStep, {
    preferLearningPlan: dashboard.accessMode === "volna",
  });
  const nextActions: StudentDashboardAction[] = [];

  for (const action of nextActionQueue) {
    if (action) {
      nextActions.push(action);
    }
  }
  const masterySignals = getMasterySignals({ learningPlan, activity });
  const milestone = getLearningMilestone({ learningPlan, activity });
  const primaryAction =
    nextActions[0] ??
    ({
      id: "open-courses",
      title: "Open your course path",
      description: "Review available modules and choose the next GCSE Russian lesson.",
      href: "/courses",
      label: "Open courses",
      icon: "courses",
      badgeLabel: "Course path",
      badgeTone: "info",
    } satisfies StudentDashboardAction);
  const domainSummaries = getProgressDomainSummaries(masterySignals, activity);
  const isNewStudent = isNewStudentProgressEmpty(pathSummary, activity);
  const weakAreas = isNewStudent ? [] : getProgressWeakAreas(masterySignals, activity);
  const recentWins = getProgressRecentWins(pathSummary, activity);
  const completedModuleCount = pathSummary.moduleSummaries.filter(
    (summary) => summary.isComplete
  ).length;
  const studyTimeLeft = formatCoursePathRemainingMinutes(
    pathSummary.remainingMinutes,
    pathSummary.isComplete
  );
  const studyTimeLeftDisplay =
    studyTimeLeft === "Self-paced" ? "Self paced" : studyTimeLeft;

  return (
    <main className="space-y-8">
      <PageIntroPanel
        eyebrow="Progress"
        title="Your GCSE Russian progress"
        description={`See what is complete, what needs attention, and the next move to keep your GCSE Russian study on track: ${primaryAction.title}.`}
        tone="student"
        badges={
          <>
            <Badge tone="info" icon="school">
              GCSE Russian
            </Badge>
            <Badge tone="muted" icon="learning">
              {getDashboardVariantLabel(dashboard.variant)}
            </Badge>
            <Badge tone="muted" icon="student">
              {getDashboardAccessLabel(dashboard.accessMode)}
            </Badge>
          </>
        }
        actions={
          <>
            <Button
              href={primaryAction.href}
              variant="journey"
              icon={primaryAction.icon}
              ariaLabel={`${primaryAction.label}: ${primaryAction.title}`}
            >
              {primaryAction.label}
            </Button>
            <Button href="/exam-calendar" variant="secondary" icon="calendar">
              Exam calendar
            </Button>
          </>
        }
      >
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-[var(--text-primary)]">
              {pathSummary.progressPercent}% complete
            </span>
            <span className="app-text-muted">
              {formatLessonProgressLabel(
                pathSummary.completedLessons,
                pathSummary.totalLessons
              )}
            </span>
          </div>
          <div
            className="app-progress-track"
            role="progressbar"
            aria-label="Current course path progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pathSummary.progressPercent}
          >
            <div
              className="app-progress-bar"
              style={{ width: `${pathSummary.progressPercent}%` }}
            />
          </div>
        </div>
      </PageIntroPanel>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryStatCard
          title="Lessons complete"
          value={pathSummary.completedLessons}
          description={`${pathSummary.progressPercent}% of your path`}
          icon="completed"
          tone="brand"
          compact
        />
        <SummaryStatCard
          title="Modules"
          value={`${completedModuleCount}/${pathSummary.totalModules}`}
          description="modules complete"
          icon="modules"
          tone={completedModuleCount > 0 ? "success" : "default"}
          compact
        />
        <SummaryStatCard
          title="Study time left"
          value={
            <span className="text-[1.35rem] leading-tight">{studyTimeLeftDisplay}</span>
          }
          description="based on lesson estimates"
          icon="pending"
          tone="info"
          compact
        />
        <SummaryStatCard
          title="Feedback"
          value={activity.stats.recentFeedback}
          description="recent reviews"
          icon="feedback"
          tone={activity.stats.recentFeedback > 0 ? "success" : "default"}
          compact
        />
      </section>

      {isNewStudent ? <NewStudentKickstartCard action={primaryAction} /> : null}

      <DomainProgressGrid domains={domainSummaries} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <RecommendedActionCard action={primaryAction} />
        <NextActionList actions={nextActions} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <WeakAreasCard weakAreas={weakAreas} />
        <RecentWinsCard wins={recentWins} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <SkillReadinessList signals={masterySignals} />
        <ProgressMilestoneCard milestone={milestone} />
      </section>

      <section>
        <ModuleProgressList
          courseSlug={variantData.course.slug}
          variantSlug={variantData.variant.slug}
          modules={variantData.modules}
          summaries={pathSummary.moduleSummaries}
        />
      </section>
    </main>
  );
}
