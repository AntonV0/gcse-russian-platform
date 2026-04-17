import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { appIcons } from "@/lib/shared/icons";
import { loadModulePageData } from "@/lib/courses/course-helpers-db";
import { getVariantPath, getLessonPath } from "@/lib/access/routes";
import { getModuleProgress } from "@/lib/progress/progress-module";
import { getLessonAccessState } from "@/lib/access/access";

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
    return <main>Module not found.</main>;
  }

  const progress = await getModuleProgress(courseSlug, variantSlug, moduleSlug);
  const completedMap = new Map(progress.map((p) => [p.lesson_slug, p.completed]));
  const completedCount = progress.filter((p) => p.completed).length;
  const totalLessons = lessons.length;

  const lessonAccessEntries = await Promise.all(
    lessons.map(async (lesson) => {
      const accessState = await getLessonAccessState(
        courseSlug,
        variantSlug,
        moduleSlug,
        lesson.slug
      );

      return [lesson.slug, accessState] as const;
    })
  );

  const lessonAccessMap = new Map(lessonAccessEntries);

  const firstAccessibleIncompleteLesson =
    lessons.find((lesson) => {
      const accessState = lessonAccessMap.get(lesson.slug);
      const isCompleted = completedMap.get(lesson.slug);
      return accessState === "accessible" && !isCompleted;
    }) ??
    lessons.find((lesson) => lessonAccessMap.get(lesson.slug) === "accessible") ??
    null;

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
              <Badge tone="info" icon={appIcons.school}>
                {course.title}
              </Badge>
              <Badge tone="muted" icon={appIcons.modules}>
                {totalLessons} lesson{totalLessons === 1 ? "" : "s"}
              </Badge>
              <Badge tone="success" icon={appIcons.completed}>
                {completedCount} completed
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="app-title max-w-3xl">Continue this module</h2>
              <p className="app-subtitle max-w-2xl">
                Follow the lesson sequence in order so your progress stays structured and
                unlocked correctly.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {firstAccessibleIncompleteLesson ? (
                <Button
                  href={getLessonPath(
                    course.slug,
                    variantSlug,
                    module.slug,
                    firstAccessibleIncompleteLesson.slug
                  )}
                  variant="primary"
                  icon={appIcons.next}
                >
                  Continue lesson
                </Button>
              ) : null}

              <Button
                href={getVariantPath(course.slug, variantSlug)}
                variant="secondary"
                icon={appIcons.back}
              >
                Back to path
              </Button>
            </div>
          </div>

          <DashboardCard title="Module progress" className="h-full">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-xl bg-[var(--background-muted)] p-3">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                    Progress
                  </div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    {completedCount} / {totalLessons}
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--background-muted)] p-3">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                    Next step
                  </div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    {firstAccessibleIncompleteLesson
                      ? firstAccessibleIncompleteLesson.title
                      : "Module complete"}
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--background-muted)] p-3">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide app-text-soft">
                    Access
                  </div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    Progressive
                  </div>
                </div>
              </div>

              <p className="text-sm app-text-muted">
                Lessons unlock progressively, so students are guided through the module
                instead of jumping ahead without context.
              </p>
            </div>
          </DashboardCard>
        </div>
      </section>

      {lessons.length === 0 ? (
        <EmptyState
          title="No lessons available yet"
          description="This module does not contain any visible lessons right now."
          action={
            <Button
              href={getVariantPath(course.slug, variantSlug)}
              variant="secondary"
              icon={appIcons.back}
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
                    <Badge tone="muted" icon={appIcons.lesson}>
                      Lesson {index + 1}
                    </Badge>

                    {isCompleted ? (
                      <Badge tone="success" icon={appIcons.completed}>
                        Completed
                      </Badge>
                    ) : isNextLesson ? (
                      <Badge tone="info" icon={appIcons.next}>
                        Continue here
                      </Badge>
                    ) : canAccessLesson ? (
                      <Badge tone="muted" icon={appIcons.pending}>
                        Available
                      </Badge>
                    ) : (
                      <Badge tone="warning" icon={appIcons.locked}>
                        Locked
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {lesson.title}
                    </h3>

                    <p className="text-sm app-text-muted">
                      {lesson.summary ?? "Open this lesson to continue your learning."}
                    </p>
                  </div>

                  <div className="pt-1 text-sm font-medium app-brand-text">
                    {canAccessLesson ? "Open lesson →" : "Locked until previous progress"}
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
