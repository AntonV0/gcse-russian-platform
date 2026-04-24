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
    <div className="dev-marker-host relative app-card app-section-padding">
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
              Previous section
            </Link>
          ) : (
            <span className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm app-text-soft">
              Previous section
            </span>
          )}

          {nextHref ? (
            <Link
              href={nextHref}
              className="app-btn-base app-btn-primary rounded-lg px-4 py-2 text-sm"
            >
              Next section
            </Link>
          ) : (
            <span className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm app-text-soft">
              Next section
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
