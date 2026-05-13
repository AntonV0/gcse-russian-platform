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
import {
  getProgressDomainSummaries,
  getProgressRecentWins,
  getProgressWeakAreas,
  isNewStudentProgressEmpty,
  type ProgressDomainSummary,
  type ProgressRecentWin,
  type ProgressWeakArea,
} from "@/lib/progress/progress-insights";

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

                <div
                  className="app-progress-track mt-2 h-1.5"
                  role="progressbar"
                  aria-label={`${signal.title} readiness`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={signal.value}
                >
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

  if (
    summaries.length === 0 ||
    summaries.every((summary) => summary.totalLessons === 0)
  ) {
    return (
      <DashboardCard title="Module progress" headingLevel={2}>
        <ProgressEmptyBlock
          icon="modules"
          title="Modules are ready to explore"
          description="Published lesson progress will appear here as soon as you open and complete course content."
          action={
            <Button
              href={`/courses/${courseSlug}/${variantSlug}`}
              variant="secondary"
              size="sm"
              icon="courses"
            >
              Open course path
            </Button>
          }
        />
      </DashboardCard>
    );
  }

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
                ariaLabel={`${action.label}: ${action.title}`}
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

function RecommendedActionCard({ action }: { action: StudentDashboardAction }) {
  return (
    <DashboardCard title="Recommended next action" headingLevel={2} className="h-full">
      <div className="app-soft-panel p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-elevated)] text-[var(--accent-ink)]">
            <AppIcon icon={action.icon} size={19} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge tone={action.badgeTone} icon={action.icon}>
                {action.badgeLabel}
              </Badge>
              {action.metaLabel ? <Badge tone="muted">{action.metaLabel}</Badge> : null}
            </div>

            <div className="mt-3 app-heading-card">{action.title}</div>
            <p className="mt-1 app-text-body-muted">{action.description}</p>

            <Button
              href={action.href}
              variant="journey"
              size="sm"
              icon={action.icon}
              className="mt-4 w-full sm:w-auto"
              ariaLabel={`${action.label}: ${action.title}`}
            >
              {action.label}
            </Button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

function DomainProgressGrid({ domains }: { domains: ProgressDomainSummary[] }) {
  return (
    <section className="grid gap-4 lg:grid-cols-3" aria-label="Progress by study area">
      {domains.map((domain) => (
        <DashboardCard key={domain.id} title={domain.title} headingLevel={2}>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--text-secondary)]">
                <AppIcon icon={domain.icon} size={18} />
              </span>
              <Badge tone={domain.tone} icon={domain.icon}>
                {domain.value}%
              </Badge>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-[var(--text-primary)]">
                  {domain.label}
                </span>
                <span className="app-text-muted">{domain.value}% ready</span>
              </div>
              <div
                className="app-progress-track h-1.5"
                role="progressbar"
                aria-label={`${domain.title} readiness`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={domain.value}
              >
                <div className="app-progress-bar" style={{ width: `${domain.value}%` }} />
              </div>
            </div>

            <p className="app-text-body-muted">{domain.evidence}</p>
            <Button
              href={domain.href}
              variant="secondary"
              size="sm"
              icon={domain.icon}
              className="w-full sm:w-auto"
            >
              {domain.actionLabel}
            </Button>
          </div>
        </DashboardCard>
      ))}
    </section>
  );
}

function ProgressEmptyBlock({
  icon,
  title,
  description,
  action,
}: {
  icon: StudentDashboardAction["icon"];
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="app-empty-dashed-warm rounded-2xl border px-4 py-6 text-center">
      <div className="mb-4 flex justify-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
          <AppIcon icon={icon} size={18} />
        </span>
      </div>
      <div className="app-heading-card">{title}</div>
      <p className="mx-auto mt-2 max-w-[24rem] app-text-body-muted">{description}</p>
      <div className="mt-5 flex justify-center">{action}</div>
    </div>
  );
}

function WeakAreasCard({ weakAreas }: { weakAreas: ProgressWeakArea[] }) {
  return (
    <DashboardCard title="Weak areas" headingLevel={2} className="h-full">
      {weakAreas.length === 0 ? (
        <ProgressEmptyBlock
          icon="success"
          title="No urgent weak areas"
          description="Nothing is currently asking for emergency attention. Keep the next lesson moving and use feedback when it appears."
          action={
            <Button href="/courses" variant="secondary" size="sm" icon="courses">
              Open course path
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {weakAreas.map((area) => (
            <div key={area.id} className="app-tactile-row rounded-xl border p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={area.tone} icon={area.icon}>
                      Focus
                    </Badge>
                  </div>
                  <div className="mt-2 app-heading-card">{area.title}</div>
                  <p className="mt-1 app-text-body-muted">{area.description}</p>
                </div>

                <Button
                  href={area.href}
                  variant="secondary"
                  size="sm"
                  icon={area.icon}
                  ariaLabel={`${area.actionLabel}: ${area.title}`}
                >
                  {area.actionLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

function RecentWinsCard({ wins }: { wins: ProgressRecentWin[] }) {
  return (
    <DashboardCard title="Recent wins" headingLevel={2} className="h-full">
      {wins.length === 0 ? (
        <ProgressEmptyBlock
          icon="star"
          title="First win is ready"
          description="Complete a lesson, submit work, or finish a mock and this space will start recording progress evidence."
          action={
            <Button href="/courses" variant="secondary" size="sm" icon="next">
              Start a lesson
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {wins.map((win) => (
            <div key={win.id} className="app-tactile-row rounded-xl border p-3">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-muted)] text-[var(--text-secondary)]">
                  <AppIcon icon={win.icon} size={16} />
                </span>

                <div className="min-w-0">
                  <Badge tone={win.tone} icon={win.icon}>
                    Win
                  </Badge>
                  <div className="mt-2 app-heading-card">{win.title}</div>
                  <p className="mt-1 app-text-body-muted">{win.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

function NewStudentKickstartCard({ action }: { action: StudentDashboardAction }) {
  const steps = [
    {
      title: "Start one lesson",
      description: "Open the first available lesson and complete the core task.",
      icon: "lessons" as const,
    },
    {
      title: "Add one recall rep",
      description: "Use vocabulary or grammar practice to make the lesson stick.",
      icon: "brain" as const,
    },
    {
      title: "Check the next action",
      description: "Return here after each session to see the highest-value follow-up.",
      icon: "next" as const,
    },
  ];

  return (
    <DashboardCard title="First progress steps" headingLevel={2}>
      <div className="grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="app-soft-panel p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--background-elevated)] text-[var(--accent-ink)]">
                <AppIcon icon={step.icon} size={16} />
              </span>
              <div>
                <Badge tone={index === 0 ? "info" : "muted"}>Step {index + 1}</Badge>
                <div className="mt-2 app-heading-card">{step.title}</div>
                <p className="mt-1 app-text-body-muted">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        href={action.href}
        variant="journey"
        icon={action.icon}
        className="mt-4 w-full sm:w-auto"
        ariaLabel={`${action.label}: ${action.title}`}
      >
        {action.label}
      </Button>
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
        description={`Track course completion, vocabulary, grammar, exam prep, weak areas, recent wins, and the next move: ${primaryAction.title}.`}
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
