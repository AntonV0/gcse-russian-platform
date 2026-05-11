import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { getModulePath } from "@/lib/access/routes";
import { getCurrentUser } from "@/lib/auth/auth";
import { loadVariantPageData } from "@/lib/courses/course-helpers-db";
import {
  formatCoursePathRemainingMinutes,
  getVariantPathProgressSummary,
  type ModulePathProgressSummary,
} from "@/lib/courses/path-progress";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  getDashboardAccessLabel,
  getDashboardNextStep,
  getDashboardVariantLabel,
  getStudentLearningPlan,
} from "@/lib/dashboard/learning-plan";
import {
  getLearningMilestone,
  getMasterySignals,
  type MasterySignal,
} from "@/lib/dashboard/mastery-signals";
import {
  getStudentDashboardActionQueue,
  getStudentDashboardActivity,
  type StudentDashboardAction,
} from "@/lib/dashboard/student-next-actions";
import { getCourseProgressSummary } from "@/lib/progress/progress";

function ProgressUnavailableState({
  title,
  description,
  actionHref,
  actionLabel,
  icon,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  icon: "courses" | "billing";
}) {
  return (
    <main>
      <EmptyState
        icon={icon}
        iconTone="brand"
        title={title}
        description={description}
        headingLevel={1}
        action={
          <Button href={actionHref} variant="primary" icon={icon}>
            {actionLabel}
          </Button>
        }
      />
    </main>
  );
}

function SkillReadinessList({ signals }: { signals: MasterySignal[] }) {
  return (
    <DashboardCard title="Skill readiness" headingLevel={2} className="h-full">
      <div className="grid gap-3 md:grid-cols-2">
        {signals.map((signal) => (
          <div key={signal.title} className="app-tactile-row rounded-xl border p-3">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--text-secondary)]">
                <AppIcon icon={signal.icon} size={16} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate font-semibold text-[var(--text-primary)]">
                    {signal.title}
                  </div>
                  <div className="shrink-0 font-semibold text-[var(--accent-ink)]">
                    {signal.value}%
                  </div>
                </div>

                <div className="app-progress-track mt-2 h-1.5">
                  <div
                    className="app-progress-bar"
                    style={{ width: `${signal.value}%` }}
                  />
                </div>

                <p className="mt-2 app-text-caption">{signal.evidence}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

function ModuleProgressList({
  courseSlug,
  variantSlug,
  modules,
  summaries,
}: {
  courseSlug: string;
  variantSlug: string;
  modules: { slug: string; title: string }[];
  summaries: ModulePathProgressSummary[];
}) {
  const moduleTitlesBySlug = new Map(
    modules.map((courseModule) => [courseModule.slug, courseModule.title])
  );

  return (
    <DashboardCard title="Module progress" headingLevel={2}>
      <div className="space-y-3">
        {summaries.map((summary) => {
          const title = moduleTitlesBySlug.get(summary.moduleSlug) ?? summary.moduleSlug;
          const href =
            summary.nextLesson?.href ??
            getModulePath(courseSlug, variantSlug, summary.moduleSlug);

          return (
            <div
              key={summary.moduleSlug}
              className="app-tactile-row rounded-xl border p-3"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      tone={summary.isComplete ? "success" : "muted"}
                      icon={summary.isComplete ? "completed" : "modules"}
                    >
                      {summary.isComplete ? "Complete" : "In progress"}
                    </Badge>
                    <Badge tone="muted">
                      {summary.completedLessons} / {summary.totalLessons || "-"} lessons
                    </Badge>
                  </div>

                  <div className="mt-2 app-heading-card">{title}</div>
                  <p className="mt-1 app-text-body-muted">
                    {summary.nextLesson
                      ? `Next lesson: ${summary.nextLesson.title}`
                      : summary.isComplete
                        ? "All available lessons in this module are complete."
                        : "Open the module to choose the first available lesson."}
                  </p>

                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                      <span className="font-medium text-[var(--text-primary)]">
                        {summary.progressPercent}% complete
                      </span>
                      <span className="app-text-muted">
                        {formatCoursePathRemainingMinutes(
                          summary.remainingMinutes,
                          summary.isComplete
                        )}
                      </span>
                    </div>
                    <div className="app-progress-track h-1.5">
                      <div
                        className="app-progress-bar"
                        style={{ width: `${summary.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  href={href}
                  variant={summary.nextLesson ? "journey" : "secondary"}
                  size="sm"
                  icon={summary.nextLesson ? "next" : "modules"}
                  iconPosition={summary.nextLesson ? "right" : "left"}
                >
                  {summary.nextLesson ? "Continue" : "Open"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}

function NextActionList({ actions }: { actions: StudentDashboardAction[] }) {
  return (
    <DashboardCard title="Next actions" headingLevel={2} className="h-full">
      <div className="space-y-3">
        {actions.slice(0, 4).map((action, index) => (
          <div key={action.id} className="app-tactile-row rounded-xl border p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    tone={index === 0 ? "info" : action.badgeTone}
                    icon={action.icon}
                  >
                    {index === 0 ? "Next up" : action.badgeLabel}
                  </Badge>
                  {action.metaLabel ? (
                    <Badge tone="muted">{action.metaLabel}</Badge>
                  ) : null}
                </div>
                <div className="mt-2 app-heading-card">{action.title}</div>
                <p className="mt-1 line-clamp-2 app-text-body-muted">
                  {action.description}
                </p>
              </div>

              <Button
                href={action.href}
                variant={index === 0 ? "journey" : "secondary"}
                size="sm"
                icon={action.icon}
              >
                {action.label}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

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
        description="Progress appears after Foundation, Higher, or Volna access is attached to your account."
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
  const nextActions = getStudentDashboardActionQueue(activity, nextStep, {
    preferLearningPlan: dashboard.accessMode === "volna",
  });
  const masterySignals = getMasterySignals({ learningPlan, activity });
  const milestone = getLearningMilestone({ learningPlan, activity });

  return (
    <main className="space-y-8">
      <PageIntroPanel
        eyebrow="Progress"
        title="Your GCSE Russian progress"
        description="Track your course path, module movement, skill readiness, and the next actions that matter most."
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
            <Button href={nextStep.href} variant="journey" icon={nextStep.icon}>
              {nextStep.label}
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
              {pathSummary.completedLessons} of {pathSummary.totalLessons || "-"} lessons
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
          value={pathSummary.totalModules}
          description="in current path"
          icon="modules"
          compact
        />
        <SummaryStatCard
          title="Study time left"
          value={formatCoursePathRemainingMinutes(
            pathSummary.remainingMinutes,
            pathSummary.isComplete
          )}
          description="estimated from lesson data"
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <SkillReadinessList signals={masterySignals} />
        <NextActionList actions={nextActions} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <ModuleProgressList
          courseSlug={variantData.course.slug}
          variantSlug={variantData.variant.slug}
          modules={variantData.modules}
          summaries={pathSummary.moduleSummaries}
        />

        <DashboardCard title="Next milestone" headingLevel={2} className="h-full">
          <div className="app-soft-panel p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-elevated)] text-[var(--accent-ink)]">
                <AppIcon icon={milestone.icon} size={19} />
              </span>
              <div>
                <Badge
                  tone={milestone.tone === "brand" ? "info" : milestone.tone}
                  icon={milestone.icon}
                >
                  {milestone.badge}
                </Badge>
                <div className="mt-3 app-heading-card">{milestone.title}</div>
                <p className="mt-1 app-text-body-muted">{milestone.description}</p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}
