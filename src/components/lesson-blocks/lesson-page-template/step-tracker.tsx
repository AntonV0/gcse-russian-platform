import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";
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

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getStepStatus({
  isActive,
  isVisited,
  isUnlocked,
}: {
  isActive: boolean;
  isVisited: boolean;
  isUnlocked: boolean;
}) {
  if (isActive) {
    return {
      label: "Current",
      icon: "sparkles" as const,
      rowClassName:
        "border-[color-mix(in_srgb,var(--accent)_20%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_4%,var(--background-elevated))] before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-r-full before:bg-[var(--accent-fill)]",
      nodeClassName:
        "h-9 w-9 rounded-full border-[color-mix(in_srgb,var(--accent-fill)_72%,var(--border))] bg-[var(--accent-fill)] text-sm text-[var(--brand-white)] shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_18%,transparent)]",
      badgeClassName:
        "border-[color-mix(in_srgb,var(--accent)_22%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background-elevated))] text-[var(--accent-ink)]",
      segmentClassName: "bg-[var(--accent-fill)]",
    };
  }

  if (isVisited) {
    return {
      label: "Done",
      icon: "completed" as const,
      rowClassName:
        "border-transparent text-[var(--text-primary)] hover:border-[var(--border-subtle)] hover:bg-[var(--background-muted)]/70",
      nodeClassName:
        "border-transparent bg-transparent text-[var(--accent-fill)]",
      badgeClassName:
        "border-[var(--border-subtle)] bg-[var(--background-muted)] text-[var(--text-muted)]",
      segmentClassName:
        "bg-[color-mix(in_srgb,var(--accent)_38%,var(--background-muted))]",
    };
  }

  if (isUnlocked) {
    return {
      label: "Next",
      icon: "unlocked" as const,
      rowClassName:
        "border-transparent text-[var(--text-primary)] hover:border-[color-mix(in_srgb,var(--accent)_14%,var(--border-subtle))] hover:bg-[var(--background-muted)]",
      nodeClassName:
        "border-[color-mix(in_srgb,var(--accent)_18%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_6%,var(--background-muted))] text-[var(--accent-ink)]",
      badgeClassName:
        "border-[color-mix(in_srgb,var(--accent)_16%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_5%,var(--background-elevated))] text-[var(--accent-ink)]",
      segmentClassName:
        "bg-[color-mix(in_srgb,var(--accent)_24%,var(--background-muted))]",
    };
  }

  return {
    label: "Locked",
    icon: "lock" as const,
    rowClassName: "border-transparent text-[var(--text-muted)] opacity-70",
    nodeClassName:
      "border-transparent bg-transparent text-[var(--text-muted)]",
    badgeClassName:
      "border-[var(--border-subtle)] bg-[var(--background-muted)] text-[var(--text-muted)]",
    segmentClassName:
      "bg-[color-mix(in_srgb,var(--text-primary)_8%,var(--background-muted))]",
  };
}

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
  const visitedCount = sections.filter((section) =>
    visitedSectionIds.has(section.id)
  ).length;
  const progressPercent =
    sections.length > 0 ? Math.round((visitedCount / sections.length) * 100) : 0;
  const progressBarWidth = `${progressPercent}%`;
  const nextStepIndex = sections.findIndex(
    (section, index) =>
      index > currentStepIndex &&
      index <= allowedMaxIndex &&
      !visitedSectionIds.has(section.id)
  );

  return (
    <div className="dev-marker-host relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-2">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="StepTracker"
          filePath="src/components/lesson-blocks/lesson-page-template/step-tracker.tsx"
          tier="semantic"
          componentRole="Lesson step tracker showing current, visited, available, and locked sections"
          bestFor="Student lesson sidebars where section progress and unlocked lesson steps need to remain visible."
          usageExamples={[
            "Section-based lesson sidebar",
            "Student lesson progress tracking",
            "Foundation/Higher lesson navigation",
            "Volna lesson assignment flow",
          ]}
          notes="Use for lesson section tracking. Do not use for course module navigation or admin builder sidebars."
        />
      ) : null}

      <div className="px-2 pb-2 pt-1.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] app-text-soft">
              Sections
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-tight text-[var(--text-primary)]">
              {currentStepIndex + 1} of {sections.length}
            </p>
          </div>

          <span className="sr-only">
            {visitedCount} of {sections.length} sections opened
          </span>
        </div>

        <div className="mt-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--background-muted)] shadow-[inset_0_0_0_1px_var(--border-subtle)]">
            <div
              className="h-full rounded-full [background:var(--accent-progress-gradient)]"
              style={{ width: progressBarWidth }}
            />
          </div>

          <nav
            className="mt-1.5 grid grid-flow-col auto-cols-fr gap-1"
            aria-label="Lesson section shortcuts"
          >
            {sections.map((section, index) => {
              const isActive = index === currentStepIndex;
              const isVisited = visitedSectionIds.has(section.id);
              const isUnlocked = index <= allowedMaxIndex;
              const status = getStepStatus({ isActive, isVisited, isUnlocked });
              const stepNumber = index + 1;
              const segmentWrapperClassName = [
                "group/segment flex h-4 items-center rounded-full",
                isUnlocked ? "app-focus-ring" : "cursor-not-allowed opacity-70",
              ].join(" ");
              const segmentBarClassName = [
                "block h-1.5 w-full rounded-full transition-[filter,box-shadow] duration-150",
                status.segmentClassName,
                isUnlocked
                  ? "group-hover/segment:brightness-105 group-hover/segment:shadow-[0_4px_10px_color-mix(in_srgb,var(--accent)_14%,transparent)]"
                  : "",
              ].join(" ");

              if (!isUnlocked) {
                return (
                  <span
                    key={section.id}
                    className={segmentWrapperClassName}
                    aria-label={`Section ${stepNumber} locked`}
                    aria-disabled="true"
                  >
                    <span className={segmentBarClassName} aria-hidden="true" />
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
                  prefetch={false}
                  className={segmentWrapperClassName}
                  aria-label={`Go to section ${stepNumber}: ${section.title}`}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className={segmentBarClassName} aria-hidden="true" />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <nav className="mt-1 space-y-1" aria-label="Lesson sections">
        {sections.map((section, index) => {
          const stepNumber = index + 1;
          const isActive = index === currentStepIndex;
          const isVisited = visitedSectionIds.has(section.id);
          const isUnlocked = index <= allowedMaxIndex;
          const isNextStep = index === nextStepIndex;
          const status = getStepStatus({ isActive, isVisited, isUnlocked });
          const showStatusBadge = !isUnlocked;

          const content = (
            <div
              className={[
                "relative flex items-center gap-2.5 overflow-hidden rounded-lg border px-2.5 py-2 transition-colors app-focus-ring",
                status.rowClassName,
              ].join(" ")}
            >
              <div
                className={[
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold",
                  status.nodeClassName,
                ].join(" ")}
              >
                {isVisited && !isActive ? (
                  <AppIcon icon="completed" size={17} />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <div className="min-w-0 text-sm font-semibold leading-5 text-[var(--text-primary)]">
                    {section.title}
                  </div>

                  {showStatusBadge ? (
                    <span
                      className={[
                        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                        status.badgeClassName,
                      ].join(" ")}
                      aria-label={status.label}
                      title={status.label}
                    >
                      <AppIcon icon={status.icon} size={12} />
                    </span>
                  ) : null}
                </div>

                <span className="sr-only">
                  {isActive ? "Current section" : isNextStep ? "Next section" : ""}
                </span>
              </div>
            </div>
          );

          if (!isUnlocked) {
            return <div key={section.id}>{content}</div>;
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
              prefetch={false}
              className="group block"
              aria-current={isActive ? "step" : undefined}
            >
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
