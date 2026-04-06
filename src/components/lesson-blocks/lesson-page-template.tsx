import Link from "next/link";
import { redirect } from "next/navigation";
import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import LessonCompletionForm from "@/components/lesson-blocks/lesson-completion-form";
import type { LessonSection } from "@/types/lesson";
import { loadLessonPageData } from "@/lib/course-helpers-db";
import {
  getLessonProgress,
  getVisitedLessonSectionIds,
  markLessonSectionVisited,
} from "@/lib/progress";
import { getLessonPath, getModulePath } from "@/lib/routes";

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
}: {
  currentStepNumber: number;
  totalSteps: number;
  sectionKind: string;
  sectionDescription?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white px-4 py-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Step {currentStepNumber} of {totalSteps} · {sectionKind.replaceAll("_", " ")}
          </div>
          {sectionDescription ? (
            <p className="mt-1 text-sm text-gray-600">{sectionDescription}</p>
          ) : null}
        </div>

        <div className="text-sm text-gray-500">One section at a time</div>
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
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-900">
          Section {currentStepIndex + 1} of {sections.length}
        </p>
        <p className="text-sm text-gray-600">
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
            ? "border-black bg-black text-white"
            : isVisited
              ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
              : isUnlocked
                ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed";

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
            ? "border-black bg-black text-white"
            : isVisited
              ? "border-green-200 bg-green-50 text-green-900 hover:bg-green-100"
              : isUnlocked
                ? "border-gray-200 bg-white hover:bg-gray-50"
                : "border-gray-200 bg-gray-50 text-gray-400";

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
                <div
                  className={`mt-1 line-clamp-2 text-xs ${
                    isActive
                      ? "text-gray-200"
                      : isVisited
                        ? "text-green-700"
                        : isUnlocked
                          ? "text-gray-500"
                          : "text-gray-400"
                  }`}
                >
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
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Section navigation</h2>
          <p className="text-sm text-gray-600">
            Move forward step by step, and revisit sections you have already opened.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {previousHref ? (
            <Link
              href={previousHref}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              ← Previous section
            </Link>
          ) : (
            <span className="rounded-lg border px-4 py-2 text-sm text-gray-400">
              ← Previous section
            </span>
          )}

          {nextHref ? (
            <Link
              href={nextHref}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90"
            >
              Next section →
            </Link>
          ) : (
            <span className="rounded-lg border px-4 py-2 text-sm text-gray-400">
              Next section →
            </span>
          )}
        </div>
      </div>
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

  // Mark the requested section as visited first so the unlock state is correct
  // in the same request.
  const requestedSection = sections[requestedStepIndex];
  await markLessonSectionVisited(lesson.id, requestedSection.id);

  // Read updated visited state after the write.
  const visitedIds = new Set(await getVisitedLessonSectionIds(lesson.id));
  const maxVisitedIndex = getMaxVisitedIndex(sections, visitedIds);
  const allowedMaxIndex = getAllowedMaxIndex(sections.length, maxVisitedIndex);

  // Clamp against the updated allowed index.
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <StepMetaBar
            currentStepNumber={currentStepNumber}
            totalSteps={sections.length}
            sectionKind={currentSection.sectionKind}
            sectionDescription={currentSection.description}
          />

          <LessonRenderer sections={[currentSection]} lessonId={lesson.id} />

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
            <LessonCompletionForm
              courseSlug={courseSlug}
              variantSlug={variantSlug}
              moduleSlug={moduleSlug}
              lessonSlug={lessonSlug}
              completed={!!progress?.completed}
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
