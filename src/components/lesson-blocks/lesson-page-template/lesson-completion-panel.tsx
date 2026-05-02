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
  return (
    <div className="dev-marker-host relative app-study-block app-study-block-practice space-y-4 p-5">
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
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Finish this lesson
          </h2>
          <p className="mt-1 text-sm app-text-muted">
            Mark it complete when you have opened every section and feel ready to move on.
          </p>
        </div>

        <Badge tone={completed ? "success" : allVisited ? "info" : "warning"}>
          {completed ? "Completed" : allVisited ? "Ready" : "Review remaining"}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4 text-sm">
          <div className="font-medium text-[var(--text-primary)]">Lesson sections</div>
          <div className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
            {visitedCount} / {totalSections}
          </div>
          <div className="mt-1 app-text-muted">
            {allVisited
              ? "Every section has been opened."
              : "Open each section before saving this lesson as complete."}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4 text-sm">
          <div className="font-medium text-[var(--text-primary)]">Before you go</div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <Badge tone={allVisited ? "success" : "warning"} icon="list">
                {allVisited ? "Checked" : "Incomplete"}
              </Badge>
              <span className="app-text-muted">All sections visited</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={completed ? "success" : "muted"} icon="completed">
                {completed ? "Saved" : "Pending"}
              </Badge>
              <span className="app-text-muted">Lesson progress saved</span>
            </div>
          </div>
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
