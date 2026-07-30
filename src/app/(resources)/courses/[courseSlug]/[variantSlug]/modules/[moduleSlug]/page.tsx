import { notFound } from "next/navigation";
import JourneyProgressBar from "@/components/courses/journey-progress-bar";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import ActionPill from "@/components/ui/action-pill";
import EmptyState from "@/components/ui/empty-state";
import LearningSheet, {
  LearningSheetHeader,
  LearningSheetSection,
} from "@/components/ui/learning-sheet";
import LockedContentCard from "@/components/ui/locked-content-card";
import PendingLinkCard from "@/components/ui/pending-link-card";
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
import { getLessonJourneyState } from "@/lib/courses/journey-state";
import { getLessonIdsWithPublishedSectionsDb } from "@/lib/lessons/lesson-content-helpers-db";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

type ModulePageProps = {
  params: Promise<{
    courseSlug: string;
    variantSlug: string;
    moduleSlug: string;
  }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { courseSlug, variantSlug, moduleSlug } = await params;

  const dashboard = await getDashboardInfo();
  const { course, module, lessons } = await loadModulePageData(
    courseSlug,
    variantSlug,
    moduleSlug,
    {
      includeAdminTestingModules: dashboard.role === "admin",
    }
  );

  if (!course || !module) {
    notFound();
  }

  if (dashboard.role === "guest") {
    return (
      <main>
        <LearningSheet>
          <LearningSheetHeader
            eyebrow="Module preview"
            title={module.title}
            description={module.description ?? "This module opens inside trial."}
          />

          <LearningSheetSection muted>
            <LockedContentCard
              title="Create a trial account to open modules"
              description="Module lessons require a trial account so your tier choice and lesson progress are saved."
              accessLabel="Trial account"
              statusLabel="Signup required"
              primaryActionHref="/signup?from=app"
              primaryActionLabel="Start trial"
              secondaryActionHref={getVariantPath(course.slug, variantSlug)}
              secondaryActionLabel="Back to path"
            />
          </LearningSheetSection>
        </LearningSheet>
      </main>
    );
  }

  const [profile, access] = await Promise.all([
    getCurrentProfile(),
    getCurrentCourseAccess(courseSlug, variantSlug),
  ]);
  const canSeeDraftLessons = !!profile?.is_admin || !!profile?.is_teacher;
  const isAdminTestingModule = module.position === 0 && !!profile?.is_admin;
  const contentReadyLessonIds = await getLessonIdsWithPublishedSectionsDb(
    lessons.map((lesson) => lesson.id),
    variantSlug as "foundation" | "higher" | "volna",
    { useServiceRole: true }
  );
  const visibleLessons = lessons.filter(
    (lesson) =>
      (canSeeDraftLessons || lesson.is_published) &&
      (canSeeDraftLessons || isAdminTestingModule || contentReadyLessonIds.has(lesson.id))
  );
  const hiddenDraftLessonCount = lessons.length - visibleLessons.length;
  const progress = await getModuleProgress(courseSlug, variantSlug, moduleSlug);
  const completedMap = new Map(progress.map((p) => [p.lesson_slug, p.completed]));
  const completedCount = visibleLessons.filter((lesson) =>
    completedMap.get(lesson.slug)
  ).length;
  const totalLessons = visibleLessons.length;
  const lessonCountLabel = isAdminTestingModule
    ? "testing"
    : canSeeDraftLessons
      ? "visible"
      : "published";
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const estimatedMinutes = visibleLessons.reduce<number | null>(
    (total, lesson) =>
      lesson.estimated_minutes ? (total ?? 0) + lesson.estimated_minutes : total,
    null
  );
  const remainingMinutes = visibleLessons.reduce<number | null>((total, lesson) => {
    if (completedMap.get(lesson.slug)) return total;
    return lesson.estimated_minutes ? (total ?? 0) + lesson.estimated_minutes : total;
  }, null);

  const lessonAccessEntries = visibleLessons.map((lesson) => {
    const accessState = getLessonAccessStateFromMeta(lesson, profile, access);

    return [lesson.slug, accessState] as const;
  });

  const lessonAccessMap = new Map(lessonAccessEntries);

  const firstAccessibleIncompleteLesson =
    visibleLessons.find((lesson) => {
      const accessState = lessonAccessMap.get(lesson.slug);
      const isCompleted = completedMap.get(lesson.slug);
      return accessState === "accessible" && !isCompleted;
    }) ?? null;
  const firstAccessibleLesson =
    visibleLessons.find((lesson) => lessonAccessMap.get(lesson.slug) === "accessible") ??
    null;
  const firstCompletedLesson =
    visibleLessons.find((lesson) => completedMap.get(lesson.slug)) ?? null;
  const primaryLesson =
    firstAccessibleIncompleteLesson ?? firstAccessibleLesson ?? firstCompletedLesson;
  const hasPublishedLessons = totalLessons > 0;
  const isModuleComplete = totalLessons > 0 && completedCount === totalLessons;
  const momentumMessage = !hasPublishedLessons
    ? "Published lesson content for this module is not available for this path yet."
    : isModuleComplete
      ? "Module complete. Review any lesson to keep the knowledge warm."
      : firstAccessibleIncompleteLesson
        ? `${firstAccessibleIncompleteLesson.title} is your next guided step.`
        : "Open the first available lesson when it unlocks.";

  return (
    <main>
      <LearningSheet>
      <LearningSheetSection divided={false}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] xl:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="school">
                {course.title}
              </Badge>
              <Badge tone="muted" icon="modules">
                {totalLessons} {lessonCountLabel} lesson{totalLessons === 1 ? "" : "s"}
              </Badge>
              <Badge tone="success" icon="completed">
                {completedCount} completed
              </Badge>
              <Badge tone="muted" icon="pending">
                {formatCoursePathRemainingMinutes(remainingMinutes, isModuleComplete)}
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="app-heading-hero max-w-3xl">{module.title}</h1>
              <p className="app-subtitle max-w-2xl">
                {module.description ?? momentumMessage}
              </p>
              {module.description ? (
                <p className="text-sm app-text-muted">{momentumMessage}</p>
              ) : null}
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
                  variant="journey"
                  icon="next"
                  iconPosition="right"
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
                <JourneyProgressBar
                  value={progressPercent}
                  label={`${module.title} progress`}
                  isComplete={isModuleComplete}
                />
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
                    {!hasPublishedLessons
                      ? "Content pending"
                      : firstAccessibleIncompleteLesson
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
                  : hasPublishedLessons
                    ? `${formatCoursePathMinutes(estimatedMinutes)} in this module, with ${formatCoursePathMinutes(remainingMinutes)} still to work through.`
                    : "Published lessons will appear here when they are ready for this course path."}
              </p>
            </div>
          </DashboardCard>
        </div>
      </LearningSheetSection>

      {visibleLessons.length === 0 ? (
        <LearningSheetSection>
          <EmptyState
            title={
              lessons.length > 0
                ? "No published lesson content yet"
                : "No lessons available yet"
            }
            description={
              lessons.length > 0
                ? `${hiddenDraftLessonCount} lesson${hiddenDraftLessonCount === 1 ? "" : "s"} exist in this module, but published content is not available for this path yet.`
                : "This module does not contain any visible lessons right now."
            }
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
        </LearningSheetSection>
      ) : (
        <LearningSheetSection>
        <section aria-labelledby="lessons-heading">
          <div className="mb-4">
            <h2 id="lessons-heading" className="app-heading-section">
              Lessons
            </h2>
            <p className="mt-2 max-w-2xl app-text-body-muted">
              Follow the lesson cards from current to complete. Locked cards explain the
              access needed without reducing readability.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {visibleLessons.map((lesson, index) => {
              const isCompleted = !!completedMap.get(lesson.slug);
              const accessState = lessonAccessMap.get(lesson.slug);
              const canAccessLesson = accessState === "accessible";
              const isNextLesson =
                firstAccessibleIncompleteLesson?.slug === lesson.slug && !isCompleted;
              const lockedLabel =
                dashboard.accessMode === "trial"
                  ? "Trial sample limit"
                  : dashboard.accessState === "full_foundation" &&
                      variantSlug === "higher"
                    ? "Higher upgrade required"
                    : "Access required";
              const lessonState = getLessonJourneyState({
                isCompleted,
                isNextLesson,
                canAccessLesson,
                lockedLabel,
              });

              const cardContent = (
                <DashboardCard
                  className={[
                    "h-full",
                    lessonState.canOpen
                      ? "app-card-interaction-subtle"
                      : "border-dashed border-[color-mix(in_srgb,var(--warning-display)_28%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--warning-display)_4%,var(--surface-elevated))]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="w-full text-xs font-semibold uppercase tracking-[0.14em] app-text-soft sm:w-auto">
                        Lesson {index + 1}
                      </p>
                      <Badge tone="muted" icon="pending">
                        {formatCoursePathMinutes(lesson.estimated_minutes)}
                      </Badge>

                      <Badge tone={lessonState.badgeTone} icon={lessonState.badgeIcon}>
                        {lessonState.badgeLabel}
                      </Badge>
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
                          {lessonState.statusLabel}
                        </span>
                        <span className="app-text-muted">
                          Step {index + 1} of {totalLessons}
                        </span>
                      </div>
                      <JourneyProgressBar
                        value={lessonState.progressValue}
                        label={`${lesson.title} progress`}
                        isComplete={isCompleted}
                      />
                    </div>

                    <div className="pt-1">
                      <ActionPill
                        icon={lessonState.actionIcon}
                        tone={lessonState.actionTone}
                      >
                        {lessonState.actionLabel}
                      </ActionPill>
                    </div>
                  </div>
                </DashboardCard>
              );

              return lessonState.canOpen ? (
                <PendingLinkCard
                  key={lesson.slug}
                  href={getLessonPath(course.slug, variantSlug, module.slug, lesson.slug)}
                  className="app-focus-ring group block rounded-2xl"
                  ariaLabel={`${lessonState.actionLabel}: ${lesson.title}`}
                  pendingLabel="Opening lesson..."
                >
                  {cardContent}
                </PendingLinkCard>
              ) : (
                <div
                  key={lesson.slug}
                  role="group"
                  aria-disabled="true"
                  aria-label={`${lesson.title}: ${lockedLabel}`}
                  className="rounded-2xl"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </section>
        </LearningSheetSection>
      )}
      </LearningSheet>
    </main>
  );
}
