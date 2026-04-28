import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import VisualPlaceholder from "@/components/ui/visual-placeholder";
import { loadModulePageData } from "@/lib/courses/course-helpers-db";
import { getVariantPath, getLessonPath } from "@/lib/access/routes";
import { getModuleProgress } from "@/lib/progress/progress-module";
import { getLessonAccessStateFromMeta } from "@/lib/access/access";
import { getCurrentCourseAccess, getCurrentProfile } from "@/lib/auth/auth";
import {
  formatCoursePathMinutes,
  formatCoursePathRemainingMinutes,
} from "@/lib/courses/path-progress";

type ModulePageProps = {
  params: Promise<{
    courseSlug: string;
    variantSlug: string;
    moduleSlug: string;
  }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { courseSlug, variantSlug, moduleSlug } = await params;

  const { course, module, lessons } = await loadModulePageData(
    courseSlug,
    variantSlug,
    moduleSlug
  );

  if (!course || !module) {
    notFound();
  }

  const progress = await getModuleProgress(courseSlug, variantSlug, moduleSlug);
  const completedMap = new Map(progress.map((p) => [p.lesson_slug, p.completed]));
  const completedCount = lessons.filter((lesson) => completedMap.get(lesson.slug)).length;
  const totalLessons = lessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const estimatedMinutes = lessons.reduce<number | null>(
    (total, lesson) =>
      lesson.estimated_minutes ? (total ?? 0) + lesson.estimated_minutes : total,
    null
  );
  const remainingMinutes = lessons.reduce<number | null>((total, lesson) => {
    if (completedMap.get(lesson.slug)) return total;
    return lesson.estimated_minutes ? (total ?? 0) + lesson.estimated_minutes : total;
  }, null);

  const [profile, access] = await Promise.all([
    getCurrentProfile(),
    getCurrentCourseAccess(courseSlug, variantSlug),
  ]);
  const lessonAccessEntries = lessons.map((lesson) => {
    const accessState = getLessonAccessStateFromMeta(lesson, profile, access);

    return [lesson.slug, accessState] as const;
  });

  const lessonAccessMap = new Map(lessonAccessEntries);

  const firstAccessibleIncompleteLesson =
    lessons.find((lesson) => {
      const accessState = lessonAccessMap.get(lesson.slug);
      const isCompleted = completedMap.get(lesson.slug);
      return accessState === "accessible" && !isCompleted;
    }) ?? null;
  const firstAccessibleLesson =
    lessons.find((lesson) => lessonAccessMap.get(lesson.slug) === "accessible") ?? null;
  const primaryLesson = firstAccessibleIncompleteLesson ?? firstAccessibleLesson;
  const isModuleComplete = totalLessons > 0 && completedCount === totalLessons;
  const momentumMessage = isModuleComplete
    ? "Module complete. Review any lesson to keep the knowledge warm."
    : firstAccessibleIncompleteLesson
      ? `${firstAccessibleIncompleteLesson.title} is your next guided step.`
      : "Open the first available lesson when it unlocks.";

  return (
    <main className="space-y-8">
      <PageHeader
        title={module.title}
        description={
          module.description ?? "Work through the lessons in this module step by step."
        }
      />

      <section className="app-surface-brand app-section-padding-lg">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] xl:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                {course.title}
              </Badge>
              <Badge tone="muted" icon="modules">
                {totalLessons} lesson{totalLessons === 1 ? "" : "s"}
              </Badge>
              <Badge tone="success" icon="completed">
                {completedCount} completed
              </Badge>
              <Badge tone="muted" icon="pending">
                {formatCoursePathRemainingMinutes(remainingMinutes, isModuleComplete)}
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-heading-hero max-w-3xl">
                {isModuleComplete ? "Module complete" : "Continue this module"}
              </h2>
              <p className="app-subtitle max-w-2xl">{momentumMessage}</p>
            </div>

            <div className="app-mobile-action-stack flex flex-wrap gap-3">
              {primaryLesson ? (
                <Button
                  href={getLessonPath(
                    course.slug,
                    variantSlug,
                    module.slug,
                    primaryLesson.slug
                  )}
                  variant="primary"
                  icon="next"
                >
                  {firstAccessibleIncompleteLesson ? "Continue lesson" : "Review lesson"}
                </Button>
              ) : null}

              <Button
                href={getVariantPath(course.slug, variantSlug)}
                variant="secondary"
                icon="back"
              >
                Back to path
              </Button>
            </div>
          </div>

          <DashboardCard title="Module progress" headingLevel={3} className="h-full">
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-[var(--text-primary)]">
                    {progressPercent}% complete
                  </span>
                  <span className="app-text-muted">
                    {completedCount} of {totalLessons}
                  </span>
                </div>
                <div className="app-progress-track">
                  <div
                    className="app-progress-bar"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="app-stat-tile">
                  <div className="app-stat-label">Progress</div>
                  <div className="app-stat-value">
                    {completedCount} / {totalLessons}
                  </div>
                </div>

                <div className="app-stat-tile">
                  <div className="app-stat-label">Next step</div>
                  <div className="app-stat-value">
                    {firstAccessibleIncompleteLesson
                      ? firstAccessibleIncompleteLesson.title
                      : "Module complete"}
                  </div>
                </div>

                <div className="app-stat-tile">
                  <div className="app-stat-label">Time left</div>
                  <div className="app-stat-value">
                    {formatCoursePathRemainingMinutes(remainingMinutes, isModuleComplete)}
                  </div>
                </div>
              </div>

              <p className="text-sm app-text-muted">
                {isModuleComplete
                  ? `You have completed all ${totalLessons} lessons. Revision is ready whenever you need it.`
                  : `${formatCoursePathMinutes(estimatedMinutes)} in this module, with ${formatCoursePathMinutes(remainingMinutes)} still to work through.`}
              </p>
            </div>
          </DashboardCard>
        </div>
      </section>

      {lessons.length === 0 ? (
        <EmptyState
          title="No lessons available yet"
          description="This module does not contain any visible lessons right now."
          visual={
            <VisualPlaceholder
              category="learningPath"
              ariaLabel="Lessons empty state placeholder"
            />
          }
          action={
            <Button
              href={getVariantPath(course.slug, variantSlug)}
              variant="secondary"
              icon="back"
            >
              Back to path
            </Button>
          }
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {lessons.map((lesson, index) => {
            const isCompleted = !!completedMap.get(lesson.slug);
            const accessState = lessonAccessMap.get(lesson.slug);
            const canAccessLesson = accessState === "accessible";
            const isNextLesson =
              firstAccessibleIncompleteLesson?.slug === lesson.slug && !isCompleted;

            const cardContent = (
              <DashboardCard className="h-full transition hover:-translate-y-0.5">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="muted" icon="lesson">
                      Lesson {index + 1}
                    </Badge>
                    <Badge tone="muted" icon="pending">
                      {formatCoursePathMinutes(lesson.estimated_minutes)}
                    </Badge>

                    {isCompleted ? (
                      <Badge tone="success" icon="completed">
                        Completed
                      </Badge>
                    ) : isNextLesson ? (
                      <Badge tone="info" icon="next">
                        Continue here
                      </Badge>
                    ) : canAccessLesson ? (
                      <Badge tone="muted" icon="pending">
                        Available
                      </Badge>
                    ) : (
                      <Badge tone="warning" icon="locked">
                        Locked
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="app-heading-subsection">{lesson.title}</h3>

                    <p className="app-text-body-muted">
                      {lesson.summary ?? "Open this lesson to continue your learning."}
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                      <span className="font-medium text-[var(--text-primary)]">
                        {isCompleted
                          ? "Ready for revision"
                          : isNextLesson
                            ? "Your next step"
                            : canAccessLesson
                              ? "Available when ready"
                              : "Locked for now"}
                      </span>
                      <span className="app-text-muted">
                        Step {index + 1} of {totalLessons}
                      </span>
                    </div>
                    <div className="app-progress-track">
                      <div
                        className="app-progress-bar"
                        style={{ width: isCompleted ? "100%" : "0%" }}
                      />
                    </div>
                  </div>

                  <div className="pt-1 text-sm font-medium app-brand-text">
                    {isCompleted
                      ? "Review lesson"
                      : canAccessLesson
                        ? "Open lesson"
                        : "Locked until previous progress"}
                  </div>
                </div>
              </DashboardCard>
            );

            return canAccessLesson ? (
              <Link
                key={lesson.slug}
                href={getLessonPath(course.slug, variantSlug, module.slug, lesson.slug)}
                className="block"
              >
                {cardContent}
              </Link>
            ) : (
              <div key={lesson.slug} className="cursor-not-allowed opacity-75">
                {cardContent}
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}
