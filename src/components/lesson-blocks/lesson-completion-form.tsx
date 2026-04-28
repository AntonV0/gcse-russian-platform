import {
  markLessonComplete,
  markLessonIncomplete,
} from "@/app/actions/progress/progress";
import Button from "@/components/ui/button";

type LessonCompletionFormProps = {
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  completed: boolean;
  canComplete?: boolean;
};

export default function LessonCompletionForm({
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
  completed,
  canComplete = true,
}: LessonCompletionFormProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm app-text-muted">
        {completed
          ? "This lesson is already saved as complete."
          : canComplete
            ? "Save this lesson to your course progress."
            : "Visit every section before marking the lesson complete."}
      </div>

      {completed ? (
        <form action={markLessonIncomplete}>
          <input type="hidden" name="courseSlug" value={courseSlug} />
          <input type="hidden" name="variantSlug" value={variantSlug} />
          <input type="hidden" name="moduleSlug" value={moduleSlug} />
          <input type="hidden" name="lessonSlug" value={lessonSlug} />
          <Button type="submit" variant="secondary" size="sm" icon="refresh">
            Mark incomplete
          </Button>
        </form>
      ) : (
        <form action={markLessonComplete}>
          <input type="hidden" name="courseSlug" value={courseSlug} />
          <input type="hidden" name="variantSlug" value={variantSlug} />
          <input type="hidden" name="moduleSlug" value={moduleSlug} />
          <input type="hidden" name="lessonSlug" value={lessonSlug} />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon="completed"
            disabled={!canComplete}
          >
            Mark complete
          </Button>
        </form>
      )}
    </div>
  );
}
