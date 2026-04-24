import Link from "next/link";
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
              â† Previous section
            </Link>
          ) : (
            <span className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm app-text-soft">
              â† Previous section
            </span>
          )}

          {nextHref ? (
            <Link
              href={nextHref}
              className="app-btn-base app-btn-primary rounded-lg px-4 py-2 text-sm"
            >
              Next section â†’
            </Link>
          ) : (
            <span className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm app-text-soft">
              Next section â†’
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
