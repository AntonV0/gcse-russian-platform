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
              variant="primary"
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
          title="No sections for this course path"
          description="This lesson exists, but none of its sections are available for the current course variant."
          action={
            <Button href={moduleHref} variant="primary" icon="back">
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

  return (
    <main className="space-y-6">
      <LessonHeader
        backHref={moduleHref}
        backLabel="Back to module"
        moduleTitle={module.title}
        lessonTitle={lesson.title}
        lessonDescription={lesson.summary ?? ""}
      />

      <StudyMissionPanel
        courseTitle={course.title}
        moduleTitle={module.title}
        sectionTitle={currentSection.title}
        sectionDescription={currentSection.description}
        sectionKind={currentSection.sectionKind}
        currentStepNumber={currentStepNumber}
        totalSteps={visibleSections.length}
        visitedPercent={progressSummary.percent}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="space-y-6">
            <LessonRenderer
              sections={[currentSection]}
              lessonId={lesson.id}
              currentVariant={currentVariant}
              sectionSurface="flat"
              showSectionHeader={false}
            />
          </div>

          <SectionPager
            currentStepIndex={effectiveStepIndex}
            allowedMaxIndex={allowedMaxIndex}
            totalSteps={visibleSections.length}
            courseSlug={courseSlug}
            variantSlug={variantSlug}
            moduleSlug={moduleSlug}
            lessonSlug={lessonSlug}
          />

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

        <aside className="xl:sticky xl:top-[var(--sticky-site-offset)] xl:self-start">
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
        </aside>
      </div>

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
    </main>
  );
}
