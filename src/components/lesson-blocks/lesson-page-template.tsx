import Link from "next/link";
import { redirect } from "next/navigation";
import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import LessonCompletionForm from "@/components/lesson-blocks/lesson-completion-form";
import type { LessonSection } from "@/types/lesson";
import { loadLessonPageData } from "@/lib/courses/course-helpers-db";
import {
  getLessonProgress,
  getLessonSectionProgressSummary,
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

function clampStepIndex(stepValue: string | undefined, totalSteps: number) {
  if (totalSteps <= 0) return 0;

  const parsed = Number(stepValue);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  const normalized = Math.floor(parsed) - 1;

  if (normalized < 0) return 0;
  if (normalized >= totalSteps) return totalSteps - 1;

  return normalized;
}

function buildLessonStepHref(params: {
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  stepNumber: number;
}) {
  return `${getLessonPath(
    params.courseSlug,
    params.variantSlug,
    params.moduleSlug,
    params.lessonSlug
  )}?step=${params.stepNumber}`;
}

function getMaxVisitedIndex(sections: LessonSection[], visitedSectionIds: Set<string>) {
  let maxVisitedIndex = -1;

  sections.forEach((section, index) => {
    if (visitedSectionIds.has(section.id)) {
      maxVisitedIndex = index;
    }
  });

  return maxVisitedIndex;
}

function getAllowedMaxIndex(totalSteps: number, maxVisitedIndex: number) {
  if (totalSteps <= 0) return 0;
  return Math.min(maxVisitedIndex + 1, totalSteps - 1);
}

function StepMetaBar({
  currentStepNumber,
  totalSteps,
  sectionKind,
  sectionDescription,
  visitedPercent,
}: {
  currentStepNumber: number;
  totalSteps: number;
  sectionKind: string;
  sectionDescription?: string;
  visitedPercent: number;
}) {
  return (
    <div className="app-card app-section-padding">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide app-text-soft">
              Step {currentStepNumber} of {totalSteps} ·{" "}
              {sectionKind.replaceAll("_", " ")}
            </div>

            {sectionDescription ? (
              <p className="mt-1 text-sm app-text-muted">{sectionDescription}</p>
            ) : null}
          </div>

          <div className="text-sm app-text-muted">
            Visited progress: {visitedPercent}%
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[var(--background-muted)]">
          <div
            className="h-full rounded-full bg-[var(--brand-blue)] transition-all"
            style={{ width: `${visitedPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function StepTracker({
  sections,
  currentStepIndex,
  allowedMaxIndex,
  visitedSectionIds,
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
}: {
  sections: LessonSection[];
  currentStepIndex: number;
  allowedMaxIndex: number;
  visitedSectionIds: Set<string>;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  return (
    <div className="app-card app-section-padding">
      <div className="mb-4">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Section {currentStepIndex + 1} of {sections.length}
        </p>
        <p className="mt-1 text-sm app-text-muted">
          Visited sections stay available. The next new section unlocks as you go.
        </p>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {sections.map((section, index) => {
          const stepNumber = index + 1;
          const isActive = index === currentStepIndex;
          const isVisited = visitedSectionIds.has(section.id);
          const isUnlocked = index <= allowedMaxIndex;

          const className = isActive
            ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white"
            : isVisited
              ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
              : isUnlocked
                ? "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-secondary)] hover:bg-[var(--background-muted)]"
                : "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-muted)] cursor-not-allowed";

          if (!isUnlocked) {
            return (
              <span
                key={section.id}
                className={`min-w-[2.75rem] rounded-full border px-3 py-2 text-center text-sm font-medium transition ${className}`}
              >
                {stepNumber}
              </span>
            );
          }

          return (
            <Link
              key={section.id}
              href={buildLessonStepHref({
                courseSlug,
                variantSlug,
                moduleSlug,
                lessonSlug,
                stepNumber,
              })}
              className={`min-w-[2.75rem] rounded-full border px-3 py-2 text-center text-sm font-medium transition ${className}`}
              aria-current={isActive ? "step" : undefined}
            >
              {stepNumber}
            </Link>
          );
        })}
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => {
          const stepNumber = index + 1;
          const isActive = index === currentStepIndex;
          const isVisited = visitedSectionIds.has(section.id);
          const isUnlocked = index <= allowedMaxIndex;

          const className = isActive
            ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white"
            : isVisited
              ? "border-green-200 bg-green-50 text-green-900 hover:bg-green-100"
              : isUnlocked
                ? "border-[var(--border)] bg-[var(--background-elevated)] hover:bg-[var(--background-muted)]"
                : "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-muted)]";

          const descriptionClass = isActive
            ? "text-blue-100"
            : isVisited
              ? "text-green-700"
              : isUnlocked
                ? "text-[var(--text-muted)]"
                : "text-[var(--text-muted)]";

          const content = (
            <>
              <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wide opacity-75">
                <span>Step {stepNumber}</span>
                {isActive ? (
                  <span>Current</span>
                ) : isVisited ? (
                  <span>Visited</span>
                ) : isUnlocked ? (
                  <span>Available</span>
                ) : (
                  <span>Locked</span>
                )}
              </div>

              <div className="text-sm font-medium">{section.title}</div>

              {section.description ? (
                <div className={`mt-1 line-clamp-2 text-xs ${descriptionClass}`}>
                  {section.description}
                </div>
              ) : null}
            </>
          );

          if (!isUnlocked) {
            return (
              <div
                key={section.id}
                className={`block rounded-xl border px-3 py-3 transition ${className}`}
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={section.id}
              href={buildLessonStepHref({
                courseSlug,
                variantSlug,
                moduleSlug,
                lessonSlug,
                stepNumber,
              })}
              className={`block rounded-xl border px-3 py-3 transition ${className}`}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SectionPager({
  currentStepIndex,
  allowedMaxIndex,
  totalSteps,
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
}: {
  currentStepIndex: number;
  allowedMaxIndex: number;
  totalSteps: number;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  const hasPrevious = currentStepIndex > 0;
  const hasNext = currentStepIndex < Math.min(allowedMaxIndex, totalSteps - 1);

  const previousHref = hasPrevious
    ? buildLessonStepHref({
        courseSlug,
        variantSlug,
        moduleSlug,
        lessonSlug,
        stepNumber: currentStepIndex,
      })
    : null;

  const nextHref = hasNext
    ? buildLessonStepHref({
        courseSlug,
        variantSlug,
        moduleSlug,
        lessonSlug,
        stepNumber: currentStepIndex + 2,
      })
    : null;

  return (
    <div className="app-card app-section-padding">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-[var(--text-primary)]">Section navigation</h2>
          <p className="mt-1 text-sm app-text-muted">
            Move forward step by step, and revisit sections you have already opened.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {previousHref ? (
            <Link
              href={previousHref}
              className="app-btn-base app-btn-secondary rounded-lg px-4 py-2 text-sm"
            >
              ← Previous section
            </Link>
          ) : (
            <span className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm app-text-soft">
              ← Previous section
            </span>
          )}

          {nextHref ? (
            <Link
              href={nextHref}
              className="app-btn-base app-btn-primary rounded-lg px-4 py-2 text-sm"
            >
              Next section →
            </Link>
          ) : (
            <span className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm app-text-soft">
              Next section →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function LessonCompletionPanel({
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
  completed,
  visitedCount,
  totalSections,
  allVisited,
}: {
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  completed: boolean;
  visitedCount: number;
  totalSections: number;
  allVisited: boolean;
}) {
  return (
    <div className="app-card p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Finish lesson
        </h2>
        <p className="mt-1 text-sm app-text-muted">
          Lesson completion stays manual, but section visit progress is tracked
          automatically.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4 text-sm">
        <div className="font-medium text-[var(--text-primary)]">
          Visited sections: {visitedCount} / {totalSections}
        </div>
        <div className="mt-1 app-text-muted">
          {allVisited
            ? "You have visited every section in this lesson."
            : "Visit all sections before marking the lesson complete for the best learning flow."}
        </div>
      </div>

      <LessonCompletionForm
        courseSlug={courseSlug}
        variantSlug={variantSlug}
        moduleSlug={moduleSlug}
        lessonSlug={lessonSlug}
        completed={completed}
      />
    </div>
  );
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
    return <main>Lesson not found.</main>;
  }

  const requestedStepIndex = clampStepIndex(currentStep, sections.length);
  const requestedSection = sections[requestedStepIndex];

  await markLessonSectionVisited(lesson.id, requestedSection.id);

  const visitedIds = new Set(await getVisitedLessonSectionIds(lesson.id));
  const progressSummary = await getLessonSectionProgressSummary(
    lesson.id,
    sections.length
  );

  const maxVisitedIndex = getMaxVisitedIndex(sections, visitedIds);
  const allowedMaxIndex = getAllowedMaxIndex(sections.length, maxVisitedIndex);
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

  const currentSection = sections[effectiveStepIndex];
  const moduleHref = getModulePath(course.slug, variantSlug, moduleSlug);
  const currentStepNumber = effectiveStepIndex + 1;
  const isFinalStep = effectiveStepIndex === sections.length - 1;

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
              Step {currentStepNumber} of {sections.length}
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
            totalSteps={sections.length}
            sectionKind={currentSection.sectionKind}
            sectionDescription={currentSection.description}
            visitedPercent={progressSummary.percent}
          />

          <div className="app-card app-section-padding">
            <LessonRenderer sections={[currentSection]} lessonId={lesson.id} />
          </div>

          <SectionPager
            currentStepIndex={effectiveStepIndex}
            allowedMaxIndex={allowedMaxIndex}
            totalSteps={sections.length}
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

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <StepTracker
            sections={sections}
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
