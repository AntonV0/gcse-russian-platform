import Link from "next/link";
import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import LessonCompletionForm from "@/components/lesson-blocks/lesson-completion-form";
import type { LessonSection } from "@/types/lesson";
import { loadLessonPageData } from "@/lib/course-helpers-db";
import { getLessonProgress } from "@/lib/progress";
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
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
}: {
  sections: LessonSection[];
  currentStepIndex: number;
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
        <p className="text-sm text-gray-600">Jump to any lesson section.</p>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {sections.map((section, index) => {
          const stepNumber = index + 1;
          const isActive = index === currentStepIndex;

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
              className={`min-w-[2.75rem] rounded-full border px-3 py-2 text-center text-sm font-medium transition ${
                isActive
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
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
              className={`block rounded-xl border px-3 py-3 transition ${
                isActive
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="mb-1 text-xs uppercase tracking-wide opacity-75">
                Step {stepNumber}
              </div>
              <div className="text-sm font-medium">{section.title}</div>
              {section.description ? (
                <div
                  className={`mt-1 text-xs ${
                    isActive ? "text-gray-200" : "text-gray-500"
                  } line-clamp-2`}
                >
                  {section.description}
                </div>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SectionPager({
  currentStepIndex,
  totalSteps,
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
}: {
  currentStepIndex: number;
  totalSteps: number;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}) {
  const hasPrevious = currentStepIndex > 0;
  const hasNext = currentStepIndex < totalSteps - 1;

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
            Continue through the lesson at your own pace.
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

  const moduleHref = getModulePath(course.slug, variantSlug, moduleSlug);
  const currentStepIndex = clampStepIndex(currentStep, sections.length);
  const currentSection = sections[currentStepIndex];
  const currentStepNumber = currentStepIndex + 1;
  const isFinalStep = currentStepIndex === sections.length - 1;

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
            currentStepIndex={currentStepIndex}
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
            currentStepIndex={currentStepIndex}
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
