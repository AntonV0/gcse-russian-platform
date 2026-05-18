import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import { getModulePath } from "@/lib/access/routes";
import {
  formatCoursePathRemainingMinutes,
  type ModulePathProgressSummary,
} from "@/lib/courses/path-progress";
import { formatLessonProgressRatio } from "@/lib/courses/progress-labels";
import type { StudentDashboardAction } from "@/lib/dashboard/student-next-actions";

import { ProgressEmptyBlock } from "./progress-empty-states";

export function ModuleProgressList({
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
          description="Lesson progress will appear here as soon as you open and complete course content."
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
                      {formatLessonProgressRatio(
                        summary.completedLessons,
                        summary.totalLessons
                      )}
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
                    <div
                      className="app-progress-track h-1.5"
                      role="progressbar"
                      aria-label={`${title} progress`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={summary.progressPercent}
                    >
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

export function NextActionList({ actions }: { actions: StudentDashboardAction[] }) {
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
                className="w-full sm:w-auto sm:shrink-0"
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

export function RecommendedActionCard({ action }: { action: StudentDashboardAction }) {
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
