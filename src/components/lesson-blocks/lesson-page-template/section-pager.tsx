import Link from "next/link";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import { buildLessonStepHref } from "./lesson-step-routes";

type SectionPagerProps = {
  currentStepIndex: number;
  allowedMaxIndex: number;
  totalSteps: number;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export function SectionPager({
  currentStepIndex,
  allowedMaxIndex,
  totalSteps,
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
}: SectionPagerProps) {
  const hasPrevious = currentStepIndex > 0;
  const hasNext = currentStepIndex < Math.min(allowedMaxIndex, totalSteps - 1);
  const currentStepNumber = currentStepIndex + 1;

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
    <div className="sticky bottom-0 z-30 -mb-9 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-6 lg:pb-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--background)_78%,transparent)] to-[var(--background)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[calc(100%-1.5rem)] bg-[var(--background)]"
        aria-hidden="true"
      />
      <div className="dev-marker-host relative flex w-full flex-col gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-3 py-3 shadow-[0_10px_26px_color-mix(in_srgb,var(--text-primary)_8%,transparent)] sm:flex-row sm:items-center sm:justify-between">
        {SHOW_UI_DEBUG ? (
          <DevComponentMarker
            componentName="SectionPager"
            filePath="src/components/lesson-blocks/lesson-page-template/section-pager.tsx"
            tier="semantic"
            componentRole="In-lesson section pager for moving between unlocked lesson steps"
            bestFor="Section-based lesson pages where students move sequentially through unlocked content."
            usageExamples={[
              "Foundation lesson section navigation",
              "Higher lesson step flow",
              "Volna assignment lesson steps",
              "Student course progression",
            ]}
            notes="Use for section-step navigation inside one lesson. Do not use for previous/next lesson navigation."
          />
        ) : null}

        <p className="text-sm app-text-muted">
          Section {currentStepNumber} of {totalSteps}
        </p>

        <div className="app-mobile-action-stack flex flex-col gap-3 sm:flex-row">
          {previousHref ? (
            <Link
              href={previousHref}
              prefetch={false}
              className="app-btn-base app-btn-secondary min-h-10 rounded-xl px-4 py-2 text-sm"
            >
              Back
            </Link>
          ) : (
            <span className="flex min-h-10 items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 text-sm app-text-soft">
              Back
            </span>
          )}

          {nextHref ? (
            <Link
              href={nextHref}
              prefetch={false}
              className="app-btn-base app-btn-primary min-h-10 rounded-xl px-4 py-2 text-sm"
            >
              Next
            </Link>
          ) : (
            <span className="flex min-h-10 items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 text-sm app-text-soft">
              Recap reached
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
