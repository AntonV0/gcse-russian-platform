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

function SectionProgressBar({
  currentStepNumber,
  totalSteps,
}: {
  currentStepNumber: number;
  totalSteps: number;
}) {
  const progressPercent =
    totalSteps <= 1 ? 100 : Math.round((currentStepNumber / totalSteps) * 100);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Lesson section {currentStepNumber} of {totalSteps}
          </p>
          <p className="text-sm text-gray-600">
            Work through the lesson one step at a time.
          </p>
        </div>

        <div className="text-sm font-medium text-gray-700">{progressPercent}%</div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-black transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

function SectionStepNav({
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
      <div className="mb-3">
        <h2 className="font-semibold">Lesson sections</h2>
        <p className="text-sm text-gray-600">Jump to any section in this lesson.</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
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
              className={`rounded-xl border px-3 py-3 text-sm transition ${
                isActive
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="mb-1 text-xs uppercase tracking-wide opacity-75">
                Step {stepNumber}
              </div>
              <div className="font-medium">{section.title}</div>
              {section.description ? (
                <div
                  className={`mt-1 text-xs ${
                    isActive ? "text-gray-200" : "text-gray-500"
                  }`}
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
          <h2 className="font-semibold">Section navigation</h2>
          <p className="text-sm text-gray-600">
            Move through the lesson section by section.
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

      <SectionProgressBar
        currentStepNumber={currentStepNumber}
        totalSteps={sections.length}
      />

      {sections.length > 1 ? (
        <SectionStepNav
          sections={sections}
          currentStepIndex={currentStepIndex}
          courseSlug={courseSlug}
          variantSlug={variantSlug}
          moduleSlug={moduleSlug}
          lessonSlug={lessonSlug}
        />
      ) : null}

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
