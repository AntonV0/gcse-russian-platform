import { redirect } from "next/navigation";
import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import LessonRenderer, {
  isSectionVisible,
  type LessonRendererVariant,
} from "@/components/lesson-blocks/lesson-renderer";
import { LessonCompletionPanel } from "@/components/lesson-blocks/lesson-page-template/lesson-completion-panel";
import { buildLessonStepHref } from "@/components/lesson-blocks/lesson-page-template/lesson-step-routes";
import {
  clampStepIndex,
  getAllowedMaxIndex,
  getMaxVisitedIndex,
} from "@/components/lesson-blocks/lesson-page-template/progress-helpers";
import { SectionPager } from "@/components/lesson-blocks/lesson-page-template/section-pager";
import { StepMetaBar } from "@/components/lesson-blocks/lesson-page-template/step-meta-bar";
import { StepTracker } from "@/components/lesson-blocks/lesson-page-template/step-tracker";
import type { LessonSection } from "@/types/lesson";
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
};

function getLessonRendererVariant(variantSlug: string): LessonRendererVariant {
  if (variantSlug === "higher" || variantSlug === "volna") {
    return variantSlug;
  }

  return "foundation";
}

export default async function LessonPageTemplate({
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
  sections,
  currentStep,
}: LessonPageTemplateProps) {
  const { course, module, lesson, previousLesson, nextLesson } = await loadLessonPageData(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

  const progress = await getLessonProgress(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

  if (!course || !module || !lesson) {
    return (
      <main>
        <EmptyState
          icon="search"
          iconTone="brand"
          title="Lesson not found"
          description="This lesson could not be found. Return to the module and choose an available lesson."
          action={
            <Button href={getModulePath(courseSlug, variantSlug, moduleSlug)} variant="primary" icon="back">
              Back to module
            </Button>
          }
        />
      </main>
    );
  }

  const moduleHref = getModulePath(course.slug, variantSlug, moduleSlug);
  const currentVariant = getLessonRendererVariant(variantSlug);
  const visibleSections = sections.filter((section) =>
    isSectionVisible(section, currentVariant)
  );

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
  const maxVisitedIndex = getMaxVisitedIndex(visibleSections, visitedIdsBeforeVisit);
  const allowedMaxIndex = getAllowedMaxIndex(visibleSections.length, maxVisitedIndex);
  const effectiveStepIndex = Math.min(requestedStepIndex, allowedMaxIndex);

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
  await markLessonSectionVisited(lesson.id, currentSection.id);

  const visitedIds = new Set(await getVisitedLessonSectionIds(lesson.id));
  const visitedVisibleCount = visibleSections.reduce(
    (count, section) => (visitedIds.has(section.id) ? count + 1 : count),
    0
  );
  const progressSummary = {
    visitedCount: visitedVisibleCount,
    totalSections: visibleSections.length,
    percent: Math.round((visitedVisibleCount / visibleSections.length) * 100),
    allVisited: visitedVisibleCount >= visibleSections.length,
  };
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

      <section className="app-surface-brand app-section-padding">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="app-pill app-pill-info">{course.title}</span>
            <span className="app-pill app-pill-muted">{module.title}</span>
            <span className="app-pill app-pill-muted">
              Step {currentStepNumber} of {visibleSections.length}
            </span>
          </div>

          <div>
            <h2 className="app-section-title text-lg">{currentSection.title}</h2>
            {currentSection.description ? (
              <p className="mt-1 text-sm app-text-muted">{currentSection.description}</p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <StepMetaBar
            currentStepNumber={currentStepNumber}
            totalSteps={visibleSections.length}
            sectionKind={currentSection.sectionKind}
            sectionDescription={currentSection.description}
            visitedPercent={progressSummary.percent}
          />

          <div className="app-card app-section-padding">
            <LessonRenderer
              sections={[currentSection]}
              lessonId={lesson.id}
              currentVariant={currentVariant}
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
