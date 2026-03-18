import { markLessonComplete, markLessonIncomplete } from "@/app/actions/progress";

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
    <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-semibold">Lesson progress</h2>
          <p className="text-sm text-gray-600">
            {completed
              ? "This lesson is marked as complete."
              : "Mark this lesson as complete when finished."}
          </p>
        </div>

        {completed ? (
          <form action={markLessonIncomplete}>
            <input type="hidden" name="courseSlug" value={courseSlug} />
            <input type="hidden" name="variantSlug" value={variantSlug} />
            <input type="hidden" name="moduleSlug" value={moduleSlug} />
            <input type="hidden" name="lessonSlug" value={lessonSlug} />
            <button
              type="submit"
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Mark incomplete
            </button>
          </form>
        ) : (
          <form action={markLessonComplete}>
            <input type="hidden" name="courseSlug" value={courseSlug} />
            <input type="hidden" name="variantSlug" value={variantSlug} />
            <input type="hidden" name="moduleSlug" value={moduleSlug} />
            <input type="hidden" name="lessonSlug" value={lessonSlug} />
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90"
            >
              Mark complete
            </button>
          </form>
        )}
      </div>
    </div>
  );
}