import { notFound } from "next/navigation";
import JourneyProgressBar from "@/components/courses/journey-progress-bar";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import ActionPill from "@/components/ui/action-pill";
import EmptyState from "@/components/ui/empty-state";
import LockedContentCard from "@/components/ui/locked-content-card";
import PendingLinkCard from "@/components/ui/pending-link-card";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { loadCoursePageData } from "@/lib/courses/course-helpers-db";
import { getCoursesPath, getVariantPath } from "@/lib/access/routes";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  formatCoursePathRemainingMinutes,
  getVariantPathProgressSummaries,
} from "@/lib/courses/path-progress";
import {
  getDashboardVariantSlug,
  getPreferredCourseVariant,
  getVariantActionState,
  getVariantDisplayName,
  getVariantTone,
  getVisibleCourseVariants,
} from "@/lib/courses/journey-state";

type CoursePageProps = {
  params: Promise<{
    courseSlug: string;
  }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const [{ course, variants }, dashboard] = await Promise.all([
    loadCoursePageData(courseSlug),
    getDashboardInfo(),
  ]);

  if (!course) {
    notFound();
  }

  if (dashboard.role === "guest") {
    return (
      <main className="space-y-8">
        <PageHeader
          title={course.title}
          description={course.description ?? "Preview this GCSE Russian course."}
        />

        <LockedContentCard
          title="Create a trial account to choose a path"
          description="Foundation and Higher path selection is saved to your account, so course modules and lesson progress start after signup."
          accessLabel="Trial account"
          statusLabel="Signup required"
          primaryActionHref="/signup"
          primaryActionLabel="Start trial"
          secondaryActionHref="/courses"
          secondaryActionLabel="Back to courses"
        />
      </main>
    );
  }

  const pathSummaries = await getVariantPathProgressSummaries(course.slug, variants);
  const visibleVariants = getVisibleCourseVariants(variants, dashboard.accessState);
  const activeVariantSlug = getDashboardVariantSlug(dashboard.variant);
  const primaryVariant = getPreferredCourseVariant(visibleVariants, activeVariantSlug);
  const primaryVariantSummary = primaryVariant
    ? pathSummaries.get(primaryVariant.slug)
    : null;
  const primaryActionHref =
    primaryVariantSummary?.nextLesson?.href ??
    (primaryVariant ? getVariantPath(course.slug, primaryVariant.slug) : null);
  const primaryActionLabel = primaryVariantSummary?.nextLesson
    ? primaryVariantSummary.completedLessons > 0
      ? "Continue path"
      : "Start path"
    : primaryVariant
      ? primaryVariantSummary?.isComplete
        ? "Review path"
        : `Open ${getVariantDisplayName(primaryVariant.slug, primaryVariant.title)}`
      : null;
  const visibleSummaries = visibleVariants
    .map((variant) => pathSummaries.get(variant.slug))
    .filter((summary) => !!summary);
  const totalLessons = visibleSummaries.reduce(
    (total, summary) => total + summary.totalLessons,
    0
  );
  const completedLessons = visibleSummaries.reduce(
    (total, summary) => total + summary.completedLessons,
    0
  );
  const overallProgressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <main className="space-y-8">
      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] xl:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                GCSE Russian
              </Badge>
              <Badge tone="muted" icon="layers">
                Foundation and Higher
              </Badge>
              <Badge tone="muted" icon="language">
                Structured course journey
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="app-heading-hero max-w-3xl">{course.title}</h1>
              <p className="app-subtitle max-w-2xl">
                {course.description ??
                  "Start with the course path that matches your level and study goals, then work through modules and lessons step by step."}
              </p>
              {course.description ? (
                <p className="text-sm app-text-muted">
                  Choose the learning path that fits your study goals, then continue step
                  by step.
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              {primaryActionHref && primaryActionLabel ? (
                <Button
                  href={primaryActionHref}
                  variant="journey"
                  icon="next"
                  iconPosition="right"
                >
                  {primaryActionLabel}
                </Button>
              ) : null}

              <Button href={getCoursesPath()} variant="secondary" icon="back">
                Back to courses
              </Button>
            </div>
          </div>

          <DashboardCard title="Course overview" className="h-full">
            <div className="space-y-4">
              <VisualPlaceholder
                category="learningPath"
                ariaLabel="Course overview placeholder"
                className="mx-auto"
              />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="app-stat-tile">
                  <div className="app-stat-label">Progress</div>
                  <div className="app-stat-value">
                    {completedLessons} / {totalLessons || "-"}
                  </div>
                </div>

                <div className="app-stat-tile">
                  <div className="app-stat-label">Next up</div>
                  <div className="app-stat-value">
                    {primaryVariantSummary?.nextLesson?.title ??
                      (primaryVariantSummary?.isComplete
                        ? "Path complete"
                        : "Choose a path")}
                  </div>
                </div>
              </div>

              <JourneyProgressBar
                value={overallProgressPercent}
                label={`${course.title} visible path progress`}
                isComplete={totalLessons > 0 && completedLessons === totalLessons}
              />

              <p className="text-sm app-text-muted">
                {primaryVariantSummary?.nextLesson
                  ? `${primaryVariantSummary.nextLesson.title} is ready in ${primaryVariantSummary.nextLesson.moduleTitle}.`
                  : "Choose the path that matches your level, then follow the next available lesson to keep momentum visible."}
              </p>
            </div>
          </DashboardCard>
        </div>
      </section>

      {variants.length === 0 ? (
        <EmptyState
          title="No learning paths available yet"
          description="This course has no visible paths at the moment."
          visual={
            <VisualPlaceholder
              category="learningPath"
              ariaLabel="Learning path empty state placeholder"
            />
          }
          action={
            <Button href={getCoursesPath()} variant="secondary" icon="back">
              Back to courses
            </Button>
          }
        />
      ) : (
        <section aria-labelledby="course-paths-heading">
          <div className="mb-4">
            <h2 id="course-paths-heading" className="app-heading-section">
              Course paths
            </h2>
            <p className="mt-2 max-w-2xl app-text-body-muted">
              Select the route you are studying now. Higher appears as an upgrade path
              when your current access is Foundation-only.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleVariants.map((variant, index) => {
              const summary = pathSummaries.get(variant.slug);
              const isFoundationToHigherUpgrade =
                dashboard.accessState === "full_foundation" && variant.slug === "higher";
              const href = isFoundationToHigherUpgrade
                ? "/account/billing"
                : (summary?.nextLesson?.href ??
                  getVariantPath(course.slug, variant.slug));
              const actionState = getVariantActionState({
                isUpgrade: isFoundationToHigherUpgrade,
                hasNextLesson: !!summary?.nextLesson,
                isComplete: !!summary?.isComplete,
                completedLessons: summary?.completedLessons ?? 0,
              });
              const variantName = getVariantDisplayName(variant.slug, variant.title);

              return (
                <PendingLinkCard
                  key={variant.slug}
                  href={href}
                  className="app-focus-ring group block rounded-2xl"
                  ariaLabel={`${actionState.ariaPrefix} ${variantName} path`}
                  pendingLabel="Opening path..."
                >
                  <DashboardCard className="app-card-interaction-subtle h-full">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={getVariantTone(variant.slug)} icon="layers">
                          {variantName}
                        </Badge>

                        {summary?.isComplete ? (
                          <Badge tone="success" icon="completed">
                            Complete
                          </Badge>
                        ) : summary?.nextLesson ? (
                          <Badge tone="info" icon="next">
                            Up next
                          </Badge>
                        ) : dashboard.accessState === "full_foundation" &&
                          variant.slug === "higher" ? (
                          <Badge tone="warning" icon="billing">
                            Upgrade path
                          </Badge>
                        ) : index === 0 ? (
                          <Badge tone="muted">Suggested</Badge>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <h3 className="app-heading-subsection">{variant.title}</h3>

                        <p className="app-text-body-muted">
                          {variant.description ??
                            "Open this path to view modules and continue learning."}
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
                        <JourneyProgressBar
                          value={summary?.progressPercent}
                          label={`${variant.title} path progress`}
                          isComplete={!!summary?.isComplete}
                        />
                      </div>

                      {summary?.nextLesson ? (
                        <p className="text-sm app-text-muted">
                          Next: {summary.nextLesson.title}
                        </p>
                      ) : null}

                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="app-stat-tile">
                          <div className="app-stat-label">Lessons</div>
                          <div className="app-stat-value">
                            {summary?.totalLessons || "-"}
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
                        <ActionPill icon={actionState.icon}>
                          {actionState.label}
                        </ActionPill>
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
