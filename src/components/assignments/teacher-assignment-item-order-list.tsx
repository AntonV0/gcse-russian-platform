import Button from "@/components/ui/button";
import type {
  LessonOption,
  QuestionSetOption,
} from "@/lib/assignments/assignment-helpers-db";
import type { AssignmentItem } from "@/components/assignments/teacher-assignment-form-types";

type TeacherAssignmentItemOrderListProps = {
  items: AssignmentItem[];
  availableLessons: LessonOption[];
  questionSets: QuestionSetOption[];
  onMoveItem: (index: number, direction: "up" | "down") => void;
  onRemoveItem: (index: number) => void;
};

function getItemLabel(
  item: AssignmentItem,
  availableLessons: LessonOption[],
  questionSets: QuestionSetOption[]
) {
  if (item.type === "lesson") {
    const lesson = availableLessons.find((entry) => entry.id === item.lessonId);

    return {
      title: lesson?.title ?? "Lesson",
      subtitle: lesson?.module_title ?? "",
    };
  }

  if (item.type === "question_set") {
    const questionSet = questionSets.find((entry) => entry.id === item.questionSetId);

    return {
      title: questionSet?.title ?? "Question set",
      subtitle: questionSet?.description ?? "",
    };
  }

  return {
    title: "Custom task",
    subtitle: item.customPrompt,
  };
}

export default function TeacherAssignmentItemOrderList({
  items,
  availableLessons,
  questionSets,
  onMoveItem,
  onRemoveItem,
}: TeacherAssignmentItemOrderListProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[var(--text-primary)]">
        Assignment items (order)
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-4 text-sm app-text-muted">
          No items added yet.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const label = getItemLabel(item, availableLessons, questionSets);

            return (
              <div
                key={`${item.type}-${index}`}
                className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3 text-sm sm:flex-row"
              >
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    {index + 1}. {label.title}
                  </p>
                  {label.subtitle ? (
                    <p className="app-text-muted">{label.subtitle}</p>
                  ) : null}
                </div>

                <div className="app-mobile-action-stack flex w-full flex-wrap gap-2 sm:w-auto">
                  <Button
                    type="button"
                    onClick={() => onMoveItem(index, "up")}
                    variant="secondary"
                    size="sm"
                    iconOnly
                    icon="up"
                    ariaLabel="Move item up"
                  >
                    Move item up
                  </Button>
                  <Button
                    type="button"
                    onClick={() => onMoveItem(index, "down")}
                    variant="secondary"
                    size="sm"
                    iconOnly
                    icon="down"
                    ariaLabel="Move item down"
                  >
                    Move item down
                  </Button>
                  <Button
                    type="button"
                    onClick={() => onRemoveItem(index)}
                    variant="danger"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
