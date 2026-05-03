import LessonCompletionForm from "@/components/lesson-blocks/lesson-completion-form";
import Badge from "@/components/ui/badge";
import DevComponentMarker from "@/components/ui/dev-component-marker";

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
    <div className="dev-marker-host relative rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-5">
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
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Nice work - you have a first introduction.
          </h2>
          <p className="mt-1 text-sm app-text-muted">
            Mark the lesson complete when you can say the short model without looking.
          </p>
        </div>

        <Badge tone={completed ? "success" : allVisited ? "info" : "warning"}>
          {completed ? "Completed" : allVisited ? "Ready" : "Review remaining"}
        </Badge>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-muted)_38%,var(--background-elevated))] p-4 text-sm">
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

      <LessonCompletionForm
        courseSlug={courseSlug}
        variantSlug={variantSlug}
        moduleSlug={moduleSlug}
        lessonSlug={lessonSlug}
        completed={completed}
        canComplete={allVisited}
      />
    </div>
  );
}
