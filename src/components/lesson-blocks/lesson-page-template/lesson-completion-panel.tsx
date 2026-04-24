import LessonCompletionForm from "@/components/lesson-blocks/lesson-completion-form";
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
    <div className="dev-marker-host relative app-card p-5 space-y-4">
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

      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Finish lesson
        </h2>
        <p className="mt-1 text-sm app-text-muted">
          Lesson completion stays manual, but section visit progress is tracked
          automatically.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4 text-sm">
        <div className="font-medium text-[var(--text-primary)]">
          Visited sections: {visitedCount} / {totalSections}
        </div>
        <div className="mt-1 app-text-muted">
          {allVisited
            ? "You have visited every section in this lesson."
            : "Visit all sections before marking the lesson complete for the best learning flow."}
        </div>
      </div>

      <LessonCompletionForm
        courseSlug={courseSlug}
        variantSlug={variantSlug}
        moduleSlug={moduleSlug}
        lessonSlug={lessonSlug}
        completed={completed}
      />
    </div>
  );
}
