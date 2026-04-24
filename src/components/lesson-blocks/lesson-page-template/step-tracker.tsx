import Link from "next/link";
import type { LessonSection } from "@/types/lesson";
import { buildLessonStepHref } from "./lesson-step-routes";

type StepTrackerProps = {
  sections: LessonSection[];
  currentStepIndex: number;
  allowedMaxIndex: number;
  visitedSectionIds: Set<string>;
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
};

export function StepTracker({
  sections,
  currentStepIndex,
  allowedMaxIndex,
  visitedSectionIds,
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
}: StepTrackerProps) {
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
