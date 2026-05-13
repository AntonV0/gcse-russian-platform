import LessonCompletionForm from "@/components/lesson-blocks/lesson-completion-form";
import Badge from "@/components/ui/badge";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import AppIcon from "@/components/ui/app-icon";

type LessonCompletionPanelProps = {
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  completed: boolean;
  visitedCount: number;
  totalSections: number;
  allVisited: boolean;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export function LessonCompletionPanel({
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
  completed,
  visitedCount,
  totalSections,
  allVisited,
}: LessonCompletionPanelProps) {
  const visitedPercent =
    totalSections > 0 ? Math.round((visitedCount / totalSections) * 100) : 0;
  const sectionProgressClass = [
    "app-progress-bar",
    allVisited ? "app-progress-bar-success" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className="dev-marker-host relative overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent-border-ink)_24%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--lesson-paper-bg)_88%,var(--background-elevated))] p-5 shadow-[var(--shadow-sm)]"
      aria-labelledby="lesson-completion-title"
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="LessonCompletionPanel"
          filePath="src/components/lesson-blocks/lesson-page-template/lesson-completion-panel.tsx"
          tier="semantic"
          componentRole="Final lesson completion region with visited-section summary and manual completion control"
          bestFor="End-of-lesson screens where students need to review section visit progress before marking a lesson complete."
          usageExamples={[
            "Student lesson completion",
            "Foundation course progress",
            "Higher lesson wrap-up",
            "Volna assigned lesson progress",
          ]}
          notes="Use only on the final lesson step. Do not use for intermediate section navigation or dashboard progress cards."
        />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--success-border)] bg-[var(--success-surface)] text-[var(--success-text)]">
            <AppIcon icon={completed ? "completed" : "success"} size={21} />
          </span>
          <div>
            <h2
              id="lesson-completion-title"
              className="text-xl font-semibold text-[var(--text-primary)]"
            >
              {completed ? "Lesson complete." : "Ready for a final check."}
            </h2>
            <p className="mt-1 text-sm app-text-muted">
              Save the lesson once you have opened every section and the main idea feels
              clear enough to revisit later.
            </p>
          </div>
        </div>

        <Badge tone={completed ? "success" : allVisited ? "info" : "warning"}>
          {completed ? "Completed" : allVisited ? "Ready" : "Review remaining"}
        </Badge>
      </div>

      <div className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-muted)_38%,var(--background-elevated))] p-4 text-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-medium text-[var(--text-primary)]">
              Sections opened: {visitedCount} of {totalSections}
            </div>
            <div className="mt-1 app-text-muted">
              {allVisited
                ? "You have reached every part of the lesson."
                : "Open each section before saving this lesson as complete."}
            </div>
          </div>

          <Badge tone={completed ? "success" : allVisited ? "info" : "warning"}>
            {completed ? "Saved" : allVisited ? "Ready to finish" : "Keep going"}
          </Badge>
        </div>

        <div
          className="app-progress-track mt-3"
          role="progressbar"
          aria-label="Visited lesson sections"
          aria-valuemin={0}
          aria-valuemax={totalSections}
          aria-valuenow={visitedCount}
        >
          <div className={sectionProgressClass} style={{ width: `${visitedPercent}%` }} />
        </div>
      </div>

      <div className="mt-4">
        <LessonCompletionForm
          courseSlug={courseSlug}
          variantSlug={variantSlug}
          moduleSlug={moduleSlug}
          lessonSlug={lessonSlug}
          completed={completed}
          canComplete={allVisited}
        />
      </div>
    </section>
  );
}
