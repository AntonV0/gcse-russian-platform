import { redirect } from "next/navigation";
import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import { StudyMissionPanel } from "@/components/lesson-blocks/learning-warmth-kit";
import { LessonCompletionPanel } from "@/components/lesson-blocks/lesson-page-template/lesson-completion-panel";
import { buildLessonStepHref } from "@/components/lesson-blocks/lesson-page-template/lesson-step-routes";
import {
  clampStepIndex,
  getAllowedMaxIndex,
  getEffectiveStepIndex,
  getLessonProgressSummary,
  getMaxVisitedIndex,
} from "@/components/lesson-blocks/lesson-page-template/progress-helpers";
import { SectionPager } from "@/components/lesson-blocks/lesson-page-template/section-pager";
import { StepTracker } from "@/components/lesson-blocks/lesson-page-template/step-tracker";
import type { LessonSection } from "@/types/lesson";
import {
  filterVisibleLessonSections,
  getLessonRendererVariant,
} from "@/lib/lessons/variant-visibility";
import { loadLessonPageData } from "@/lib/courses/course-helpers-db";
import {
  getLessonProgress,
  getVisitedLessonSectionIds,
  markLessonSectionVisited,
} from "@/lib/progress/progress";
import { getLessonPath, getModulePath } from "@/lib/access/routes";

type LessonPageTemplateProps = {
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  sections: LessonSection[];
  currentStep?: string;
  lessonPageData?: Awaited<ReturnType<typeof loadLessonPageData>>;
  lessonProgress?: Awaited<ReturnType<typeof getLessonProgress>>;
};

export default async function LessonPageTemplate({
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
  sections,
  currentStep,
  lessonPageData,
  lessonProgress,
}: LessonPageTemplateProps) {
  const { course, module, lesson, previousLesson, nextLesson } =
    lessonPageData ??
    (await loadLessonPageData(courseSlug, variantSlug, moduleSlug, lessonSlug));

  const progress =
    lessonProgress === undefined
      ? await getLessonProgress(courseSlug, variantSlug, moduleSlug, lessonSlug)
      : lessonProgress;

  if (!course || !module || !lesson) {
    return (
      <main>
        <EmptyState
          icon="search"
          iconTone="brand"
          title="Lesson not found"
          description="This lesson could not be found. Return to the module and choose an available lesson."
          action={
            <Button
              href={getModulePath(courseSlug, variantSlug, moduleSlug)}
              variant="secondary"
              icon="back"
            >
              Back to module
            </Button>
          }
        />
      </main>
    );
  }

  const moduleHref = getModulePath(course.slug, variantSlug, moduleSlug);
  const currentVariant = getLessonRendererVariant(variantSlug);
  const visibleSections = filterVisibleLessonSections(sections, currentVariant);

  if (visibleSections.length === 0) {
    return (
      <main>
        <EmptyState
          icon="lessonContent"
          iconTone="brand"
          title={lesson.title}
          description="No sections are available for this course path yet. Return to the module and choose another lesson for now."
          headingLevel={1}
          action={
            <Button href={moduleHref} variant="secondary" icon="back">
              Back to module
            </Button>
          }
        />
      </main>
    );
  }

  const requestedStepIndex = clampStepIndex(currentStep, visibleSections.length);
  const visitedIdsBeforeVisit = new Set(await getVisitedLessonSectionIds(lesson.id));
  const maxVisitedIndexBeforeVisit = getMaxVisitedIndex(
    visibleSections,
    visitedIdsBeforeVisit
  );
  const allowedMaxIndexBeforeVisit = getAllowedMaxIndex(
    visibleSections.length,
    maxVisitedIndexBeforeVisit
  );
  const effectiveStepIndex = getEffectiveStepIndex(
    requestedStepIndex,
    allowedMaxIndexBeforeVisit
  );

  if (effectiveStepIndex !== requestedStepIndex) {
    redirect(
      buildLessonStepHref({
        courseSlug,
        variantSlug,
        moduleSlug,
        lessonSlug,
        stepNumber: effectiveStepIndex + 1,
      })
    );
  }

  const currentSection = visibleSections[effectiveStepIndex];
  const didMarkCurrentSection = await markLessonSectionVisited(
    lesson.id,
    currentSection.id
  );
  const visitedIds = new Set(visitedIdsBeforeVisit);
  if (didMarkCurrentSection) {
    visitedIds.add(currentSection.id);
  }
  const maxVisitedIndex = getMaxVisitedIndex(visibleSections, visitedIds);
  const allowedMaxIndex = getAllowedMaxIndex(visibleSections.length, maxVisitedIndex);
  const progressSummary = getLessonProgressSummary(visibleSections, visitedIds);
  const currentStepNumber = effectiveStepIndex + 1;
  const isFinalStep = effectiveStepIndex === visibleSections.length - 1;
  const lessonHeadingId = `lesson-${lesson.id}-heading`;
  const currentSectionHeadingId = `lesson-section-${currentSection.id}-heading`;

  return (
    <main className="space-y-4" aria-labelledby={lessonHeadingId}>
      <LessonHeader
        backHref={moduleHref}
        backLabel="Back to module"
        headingId={lessonHeadingId}
        moduleTitle={module.title}
        lessonTitle={lesson.title}
        lessonDescription={lesson.summary ?? ""}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="pb-4">
          <section className="app-lesson-page-surface">
            <StudyMissionPanel
              headingId={currentSectionHeadingId}
              courseTitle={course.title}
              moduleTitle={module.title}
              sectionTitle={currentSection.title}
              sectionDescription={currentSection.description}
              sectionKind={currentSection.sectionKind}
              currentStepNumber={currentStepNumber}
              totalSteps={visibleSections.length}
              visitedPercent={progressSummary.percent}
            />

            <article
              className="app-lesson-page-article px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-5 md:px-6 md:pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pt-6 xl:pb-32"
              aria-labelledby={currentSectionHeadingId}
            >
              <LessonRenderer
                sections={[currentSection]}
                lessonId={lesson.id}
                currentVariant={currentVariant}
                sectionSurface="flat"
                showSectionHeader={false}
              />
            </article>

            <div className="app-section-pager-shell px-4 pb-4 md:px-6">
              <SectionPager
                currentStepIndex={effectiveStepIndex}
                allowedMaxIndex={allowedMaxIndex}
                totalSteps={visibleSections.length}
                sectionTitle={currentSection.title}
                courseSlug={courseSlug}
                variantSlug={variantSlug}
                moduleSlug={moduleSlug}
                lessonSlug={lessonSlug}
              />
            </div>
          </section>

          {isFinalStep ? (
            <LessonCompletionPanel
              courseSlug={courseSlug}
              variantSlug={variantSlug}
              moduleSlug={moduleSlug}
              lessonSlug={lessonSlug}
              completed={!!progress?.completed}
              visitedCount={progressSummary.visitedCount}
              totalSections={progressSummary.totalSections}
              allVisited={progressSummary.allVisited}
            />
          ) : null}
        </div>

        <aside className="order-first xl:order-none xl:sticky xl:top-[var(--sticky-site-offset)] xl:z-[60] xl:self-start">
          <details className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3 shadow-[var(--shadow-xs)] xl:hidden">
            <summary className="app-focus-ring flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg">
              <span className="min-w-0">
                <span className="app-text-meta app-text-soft">Sections</span>
                <span className="mt-0.5 block text-sm font-semibold text-[var(--text-primary)]">
                  {currentStepNumber} of {visibleSections.length}
                </span>
              </span>
              <span className="inline-flex min-h-11 shrink-0 items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] px-3 text-sm font-semibold text-[var(--text-secondary)]">
                <span className="group-open:hidden">Open</span>
                <span className="hidden group-open:inline">Close</span>
              </span>
            </summary>
            <div className="mt-3 max-h-[min(42dvh,20rem)] overflow-y-auto overscroll-contain">
              <StepTracker
                sections={visibleSections}
                currentStepIndex={effectiveStepIndex}
                allowedMaxIndex={allowedMaxIndex}
                visitedSectionIds={visitedIds}
                courseSlug={courseSlug}
                variantSlug={variantSlug}
                moduleSlug={moduleSlug}
                lessonSlug={lessonSlug}
              />
            </div>
          </details>

          <div className="hidden xl:block">
            <StepTracker
              sections={visibleSections}
              currentStepIndex={effectiveStepIndex}
              allowedMaxIndex={allowedMaxIndex}
              visitedSectionIds={visitedIds}
              courseSlug={courseSlug}
              variantSlug={variantSlug}
              moduleSlug={moduleSlug}
              lessonSlug={lessonSlug}
            />
          </div>
        </aside>
      </div>

      {isFinalStep ? (
        <LessonFooterNav
          moduleHref={moduleHref}
          previousLesson={
            previousLesson
              ? {
                  href: getLessonPath(
                    course.slug,
                    variantSlug,
                    moduleSlug,
                    previousLesson.slug
                  ),
                  label: previousLesson.title,
                }
              : undefined
          }
          nextLesson={
            nextLesson
              ? {
                  href: getLessonPath(
                    course.slug,
                    variantSlug,
                    moduleSlug,
                    nextLesson.slug
                  ),
                  label: nextLesson.title,
                }
              : undefined
          }
        />
      ) : null}
    </main>
  );
}
