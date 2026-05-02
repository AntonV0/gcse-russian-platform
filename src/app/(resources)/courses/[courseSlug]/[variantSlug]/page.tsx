import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LockedContentCard from "@/components/ui/locked-content-card";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { loadVariantPageData } from "@/lib/courses/course-helpers-db";
import { getCoursePath, getModulePath } from "@/lib/access/routes";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  formatCoursePathRemainingMinutes,
  getVariantPathProgressSummary,
} from "@/lib/courses/path-progress";

type VariantPageProps = {
  params: Promise<{
    courseSlug: string;
    variantSlug: string;
  }>;
};

function getVariantTone(slug: string): "info" | "success" | "muted" {
  if (slug === "higher") return "info";
  if (slug === "foundation") return "success";
  return "muted";
}

function getVariantLabel(slug: string) {
  if (slug === "higher") return "Higher";
  if (slug === "foundation") return "Foundation";
  return "Volna";
}

export default async function VariantPage({ params }: VariantPageProps) {
  const { courseSlug, variantSlug } = await params;
  const [{ course, variant, modules }, dashboard] = await Promise.all([
    loadVariantPageData(courseSlug, variantSlug),
    getDashboardInfo(),
  ]);

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

  const primaryModule = modules[0] ?? null;
  const pathSummary = await getVariantPathProgressSummary(course.slug, variant, modules);
  const moduleSummaryMap = new Map(
    pathSummary.moduleSummaries.map((summary) => [summary.moduleSlug, summary])
  );
  const primaryActionHref =
    pathSummary.nextLesson?.href ??
    (primaryModule ? getModulePath(course.slug, variant.slug, primaryModule.slug) : null);
  const primaryActionLabel = pathSummary.nextLesson
    ? `Continue: ${pathSummary.nextLesson.title}`
    : pathSummary.isComplete
      ? "Review this path"
      : primaryModule
        ? `Start ${primaryModule.title}`
        : null;

  return (
    <main className="space-y-8">
      <PageHeader
        title={variant.title}
        description={
          variant.description ?? "Choose a module and continue your learning journey."
        }
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] xl:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                {course.title}
              </Badge>
              <Badge tone={getVariantTone(variant.slug)} icon="layers">
                {getVariantLabel(variant.slug)}
              </Badge>
              <Badge tone="muted" icon="modules">
                {modules.length} module{modules.length === 1 ? "" : "s"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-heading-hero max-w-3xl">Choose your next module</h2>
              <p className="app-subtitle max-w-2xl">
                Work through the modules in order to keep your learning structured and
                easier to follow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {primaryActionHref && primaryActionLabel ? (
                <Button href={primaryActionHref} variant="primary" icon="next">
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
                    {pathSummary.completedLessons} / {pathSummary.totalLessons || "-"}
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
                <div
                  className="app-progress-track"
                  role="progressbar"
                  aria-label={`${variant.title} path progress`}
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
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module, index) => {
            const summary = moduleSummaryMap.get(module.slug);
            const href =
              summary?.nextLesson?.href ??
              getModulePath(course.slug, variant.slug, module.slug);

            return (
              <Link
                key={module.slug}
                href={href}
                className="app-focus-ring block rounded-2xl"
                aria-label={`Open ${module.title}`}
              >
                <DashboardCard className="h-full transition hover:-translate-y-0.5">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="muted" icon="modules">
                        Module {index + 1}
                      </Badge>

                      {summary?.isComplete ? (
                        <Badge tone="success" icon="completed">
                          Complete
                        </Badge>
                      ) : summary?.nextLesson ? (
                        <Badge tone="info" icon="next">
                          Up next
                        </Badge>
                      ) : index === 0 ? (
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
                          {summary?.completedLessons ?? 0} of{" "}
                          {summary?.totalLessons || "-"}
                        </span>
                      </div>
                      <div
                        className="app-progress-track"
                        role="progressbar"
                        aria-label={`${module.title} progress`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={summary?.progressPercent ?? 0}
                      >
                        <div
                          className="app-progress-bar"
                          style={{ width: `${summary?.progressPercent ?? 0}%` }}
                        />
                      </div>
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

                    <div className="pt-1 text-sm font-medium app-brand-text">
                      {summary?.nextLesson
                        ? `Continue: ${summary.nextLesson.title}`
                        : summary?.isComplete
                          ? "Review module"
                          : "Open module"}
                    </div>
                  </div>
                </DashboardCard>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}
