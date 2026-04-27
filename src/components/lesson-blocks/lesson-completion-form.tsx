import {
  markLessonComplete,
  markLessonIncomplete,
} from "@/app/actions/progress/progress";
import Button from "@/components/ui/button";
import PanelCard from "@/components/ui/panel-card";

type LessonCompletionFormProps = {
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  completed: boolean;
};

export default function LessonCompletionForm({
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
  completed,
}: LessonCompletionFormProps) {
  return (
    <PanelCard
      title="Lesson progress"
      description={
        completed
          ? "This lesson is marked as complete."
          : "Mark this lesson as complete when finished."
      }
      tone="student"
      density="compact"
      className="mt-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div />

        {completed ? (
          <form action={markLessonIncomplete}>
            <input type="hidden" name="courseSlug" value={courseSlug} />
            <input type="hidden" name="variantSlug" value={variantSlug} />
            <input type="hidden" name="moduleSlug" value={moduleSlug} />
            <input type="hidden" name="lessonSlug" value={lessonSlug} />
            <Button type="submit" variant="secondary" size="sm">
              Mark incomplete
            </Button>
          </form>
        ) : (
          <form action={markLessonComplete}>
            <input type="hidden" name="courseSlug" value={courseSlug} />
            <input type="hidden" name="variantSlug" value={variantSlug} />
            <input type="hidden" name="moduleSlug" value={moduleSlug} />
            <input type="hidden" name="lessonSlug" value={lessonSlug} />
            <Button type="submit" variant="primary" size="sm" icon="completed">
              Mark complete
            </Button>
          </form>
        )}
      </div>
    </PanelCard>
  );
}
