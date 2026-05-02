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
        "border-[color-mix(in_srgb,var(--accent)_28%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_7%,var(--background-elevated))] shadow-[var(--shadow-sm)] before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-r-full before:bg-[var(--accent-fill)]",
      nodeClassName:
        "border-[color-mix(in_srgb,var(--accent-fill)_72%,var(--border))] bg-[var(--accent-fill)] text-[var(--accent-on-fill)]",
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
        "border-[var(--border-subtle)] bg-[var(--background-muted)] text-[var(--text-muted)]",
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
      "border-[var(--border-subtle)] bg-[var(--background-muted)] text-[var(--text-muted)]",
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
    <div className="dev-marker-host relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3 shadow-[var(--shadow-sm)]">
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

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--accent)_18%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_7%,var(--background-elevated))] text-[var(--accent-ink)]">
              <AppIcon icon="navigation" size={17} />
            </span>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] app-text-soft">
                Lesson map
              </p>
              <p className="mt-1 text-base font-semibold leading-tight text-[var(--text-primary)]">
                Section {currentStepIndex + 1} of {sections.length}
              </p>
              <p className="mt-1 text-xs leading-5 app-text-muted">
                Opened sections stay available for review.
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-[color-mix(in_srgb,var(--accent)_18%,var(--border-subtle))] bg-[var(--background-elevated)] px-2.5 py-1 text-xs font-bold text-[var(--accent-ink)] shadow-[var(--shadow-xs)]">
            {visitedCount}/{sections.length} opened
          </span>
        </div>

        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-[var(--text-primary)]">
              Opened for review
            </span>
            <span className="app-text-soft">{progressPercent}%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--background-elevated)] shadow-[inset_0_0_0_1px_var(--border-subtle)]">
            <div
              className="h-full rounded-full [background:var(--accent-progress-gradient)]"
              style={{ width: progressBarWidth }}
            />
          </div>

          <div className="mt-2 grid grid-flow-col auto-cols-fr gap-1" aria-hidden="true">
            {sections.map((section, index) => {
              const isActive = index === currentStepIndex;
              const isVisited = visitedSectionIds.has(section.id);
              const isUnlocked = index <= allowedMaxIndex;
              const status = getStepStatus({ isActive, isVisited, isUnlocked });

              return (
                <span
                  key={section.id}
                  className={["h-1 rounded-full", status.segmentClassName].join(" ")}
                />
              );
            })}
          </div>
        </div>
      </div>

      <nav className="mt-2 space-y-1" aria-label="Lesson sections">
        {sections.map((section, index) => {
          const stepNumber = index + 1;
          const isActive = index === currentStepIndex;
          const isVisited = visitedSectionIds.has(section.id);
          const isUnlocked = index <= allowedMaxIndex;
          const isNextStep = index === nextStepIndex;
          const status = getStepStatus({ isActive, isVisited, isUnlocked });
          const showStatusBadge = isActive || isNextStep || !isUnlocked;

          const content = (
            <div
              className={[
                "relative flex items-start gap-3 overflow-hidden rounded-xl border px-3 py-2.5 transition-colors app-focus-ring",
                status.rowClassName,
              ].join(" ")}
            >
              <div
                className={[
                  "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-bold",
                  status.nodeClassName,
                ].join(" ")}
              >
                {isVisited && !isActive ? (
                  <AppIcon icon="completed" size={14} />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 text-sm font-semibold leading-5 text-[var(--text-primary)]">
                    {section.title}
                  </div>

                  {showStatusBadge ? (
                    <span
                      className={[
                        "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                        status.badgeClassName,
                      ].join(" ")}
                    >
                      <AppIcon icon={status.icon} size={12} />
                      <span>{status.label}</span>
                    </span>
                  ) : null}
                </div>

                {isActive && section.description ? (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-5 app-text-muted">
                    {section.description}
                  </p>
                ) : null}
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
