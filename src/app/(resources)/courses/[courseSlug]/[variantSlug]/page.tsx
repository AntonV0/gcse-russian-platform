import { notFound } from "next/navigation";
import JourneyProgressBar from "@/components/courses/journey-progress-bar";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import ActionPill from "@/components/ui/action-pill";
import LockedContentCard from "@/components/ui/locked-content-card";
import PendingLinkCard from "@/components/ui/pending-link-card";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { loadVariantPageData } from "@/lib/courses/course-helpers-db";
import { getCoursePath, getModulePath } from "@/lib/access/routes";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  formatCoursePathRemainingMinutes,
  getVariantPathProgressSummary,
} from "@/lib/courses/path-progress";
import {
  formatLessonProgressLabel,
  formatLessonProgressRatio,
} from "@/lib/courses/progress-labels";
import { getVariantDisplayName, getVariantTone } from "@/lib/courses/journey-state";

type VariantPageProps = {
  params: Promise<{
    courseSlug: string;
    variantSlug: string;
  }>;
};

export default async function VariantPage({ params }: VariantPageProps) {
  const { courseSlug, variantSlug } = await params;
  const dashboard = await getDashboardInfo();
  const { course, variant, modules } = await loadVariantPageData(
    courseSlug,
    variantSlug,
    {
      includeAdminTestingModules: dashboard.role === "admin",
    }
  );

  if (!course || !variant) {
    notFound();
  }

  if (dashboard.role === "guest") {
    return (
      <main className="space-y-8">
        <PageHeader
          title={variant.title}
          description={variant.description ?? "This course path opens inside trial."}
        />

        <LockedContentCard
          title="Start a trial to open this path"
          description="Course modules and lessons are available after signup so your Foundation or Higher choice is saved to your dashboard."
          accessLabel="Trial account"
          statusLabel="Signup required"
          primaryActionHref="/signup"
          primaryActionLabel="Start trial"
          secondaryActionHref={getCoursePath(course.slug)}
          secondaryActionLabel={`Back to ${course.title}`}
        />
      </main>
    );
  }

  const pathModules = modules.filter((module) => module.position > 0);
  const testingModuleCount = modules.length - pathModules.length;
  const moduleCountLabel =
    testingModuleCount > 0
      ? `${pathModules.length} modules + Module 0`
      : `${modules.length} module${modules.length === 1 ? "" : "s"}`;
  const primaryModule = pathModules[0] ?? null;
  const pathSummary = await getVariantPathProgressSummary(
    course.slug,
    variant,
    pathModules
  );
  const moduleSummaryMap = new Map(
    pathSummary.moduleSummaries.map((summary) => [summary.moduleSlug, summary])
  );
  const primaryActionHref =
    pathSummary.nextLesson?.href ??
    (primaryModule ? getModulePath(course.slug, variant.slug, primaryModule.slug) : null);
  const primaryActionLabel = pathSummary.nextLesson
    ? pathSummary.completedLessons > 0
      ? "Continue lesson"
      : "Start first lesson"
    : pathSummary.isComplete
      ? "Review this path"
      : primaryModule
        ? `Start ${primaryModule.title}`
        : null;

  return (
    <main className="space-y-8">
      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] xl:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                {course.title}
              </Badge>
              <Badge tone={getVariantTone(variant.slug)} icon="layers">
                {getVariantDisplayName(variant.slug, variant.title)}
              </Badge>
              <Badge tone="muted" icon="modules">
                {moduleCountLabel}
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="app-heading-hero max-w-3xl">{variant.title}</h1>
              <p className="app-subtitle max-w-2xl">
                {variant.description ??
                  "Work through the modules in order to keep your learning structured and easier to follow."}
              </p>
              {variant.description ? (
                <p className="text-sm app-text-muted">
                  Choose your next module and keep your learning route easy to follow.
                </p>
              ) : null}
            </div>

            <div className="app-mobile-action-stack flex flex-wrap gap-3">
              {primaryActionHref && primaryActionLabel ? (
                <Button
                  href={primaryActionHref}
                  variant="journey"
                  icon="next"
                  iconPosition="right"
                  ariaLabel={
                    pathSummary.nextLesson
                      ? `Open ${pathSummary.nextLesson.title}`
                      : primaryActionLabel
                  }
                >
                  {primaryActionLabel}
                </Button>
              ) : null}

              <Button href={getCoursePath(course.slug)} variant="secondary" icon="back">
                Back to {course.title}
              </Button>
            </div>
          </div>

          <DashboardCard title="Path overview" className="h-full">
            <div className="space-y-4">
              <VisualPlaceholder
                category="learningPath"
                ariaLabel="Learning path overview placeholder"
                className="mx-auto"
              />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="app-stat-tile">
                  <div className="app-stat-label">Progress</div>
                  <div className="app-stat-value">
                    {formatLessonProgressRatio(
                      pathSummary.completedLessons,
                      pathSummary.totalLessons
                    )}
                  </div>
                </div>

                <div className="app-stat-tile">
                  <div className="app-stat-label">Time left</div>
                  <div className="app-stat-value">
                    {formatCoursePathRemainingMinutes(
                      pathSummary.remainingMinutes,
                      pathSummary.isComplete
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-[var(--text-primary)]">
                    {pathSummary.progressPercent}% complete
                  </span>
                  <span className="app-text-muted">
                    {pathSummary.totalModules} module
                    {pathSummary.totalModules === 1 ? "" : "s"}
                  </span>
                </div>
                <JourneyProgressBar
                  value={pathSummary.progressPercent}
                  label={`${variant.title} path progress`}
                  isComplete={pathSummary.isComplete}
                />
              </div>

              <p className="text-sm app-text-muted">
                {pathSummary.nextLesson
                  ? `${pathSummary.nextLesson.moduleTitle} is next in your guided route.`
                  : pathSummary.isComplete
                    ? "Every lesson in this path is complete. Revisit modules whenever you want revision."
                    : "Start with the first available module, then continue in order as lessons unlock."}
              </p>
            </div>
          </DashboardCard>
        </div>
      </section>

      {modules.length === 0 ? (
        <EmptyState
          title="No modules available yet"
          description="This learning path does not have any visible modules right now."
          visual={
            <VisualPlaceholder
              category="learningPath"
              ariaLabel="Modules empty state placeholder"
            />
          }
          action={
            <Button href={getCoursePath(course.slug)} variant="secondary" icon="back">
              Back to {course.title}
            </Button>
          }
        />
      ) : (
        <section aria-labelledby="modules-heading">
          <div className="mb-4">
            <h2 id="modules-heading" className="app-heading-section">
              Modules
            </h2>
            <p className="mt-2 max-w-2xl app-text-body-muted">
              Work through modules in order. The current card points to the next available
              lesson when one is ready.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => {
              const summary = moduleSummaryMap.get(module.slug);
              const href =
                summary?.nextLesson?.href ??
                getModulePath(course.slug, variant.slug, module.slug);
              const moduleLabel =
                module.position === 0 ? "Module 0" : `Module ${module.position}`;
              const moduleActionLabel = summary?.nextLesson
                ? summary.completedLessons > 0
                  ? "Continue module"
                  : "Start module"
                : summary?.isComplete
                  ? "Review module"
                  : "Open module";
              const moduleAriaLabel = summary?.nextLesson
                ? `${moduleActionLabel}: ${summary.nextLesson.title}`
                : `${moduleActionLabel}: ${module.title}`;

              return (
                <PendingLinkCard
                  key={module.slug}
                  href={href}
                  className="app-focus-ring group block rounded-2xl"
                  ariaLabel={moduleAriaLabel}
                  pendingLabel="Opening module..."
                >
                  <DashboardCard className="app-card-interaction-subtle h-full">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="muted" icon="modules">
                          {moduleLabel}
                        </Badge>

                        {summary?.isComplete ? (
                          <Badge tone="success" icon="completed">
                            Complete
                          </Badge>
                        ) : summary?.nextLesson ? (
                          <Badge tone="info" icon="next">
                            Up next
                          </Badge>
                        ) : module.position === 1 ? (
                          <Badge tone="success">Start here</Badge>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <h3 className="app-heading-subsection">{module.title}</h3>

                        <p className="app-text-body-muted">
                          {module.description ??
                            "Open this module to view lessons and continue learning."}
                        </p>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                          <span className="font-medium text-[var(--text-primary)]">
                            {summary?.progressPercent ?? 0}% complete
                          </span>
                          <span className="app-text-muted">
                            {formatLessonProgressLabel(
                              summary?.completedLessons,
                              summary?.totalLessons
                            )}
                          </span>
                        </div>
                        <JourneyProgressBar
                          value={summary?.progressPercent}
                          label={`${module.title} progress`}
                          isComplete={!!summary?.isComplete}
                        />
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="app-stat-tile">
                          <div className="app-stat-label">Next lesson</div>
                          <div className="app-stat-value">
                            {summary?.nextLesson?.title ??
                              (summary?.isComplete ? "Review ready" : "Open module")}
                          </div>
                        </div>

                        <div className="app-stat-tile">
                          <div className="app-stat-label">Time left</div>
                          <div className="app-stat-value">
                            {formatCoursePathRemainingMinutes(
                              summary?.remainingMinutes,
                              !!summary?.isComplete
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-1">
                        <ActionPill>{moduleActionLabel}</ActionPill>
                      </div>
                    </div>
                  </DashboardCard>
                </PendingLinkCard>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
