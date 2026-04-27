import FormField from "@/components/ui/form-field";
import Textarea from "@/components/ui/textarea";
import type {
  LessonOption,
  QuestionSetOption,
} from "@/lib/assignments/assignment-helpers-db";

type TeacherAssignmentResourceSelectorsProps = {
  availableLessons: LessonOption[];
  questionSets: QuestionSetOption[];
  selectedLessonIds: string[];
  selectedQuestionSetIds: string[];
  customTaskValue: string;
  onToggleLesson: (lessonId: string) => void;
  onToggleQuestionSet: (questionSetId: string) => void;
  onCustomTaskChange: (value: string) => void;
};

export default function TeacherAssignmentResourceSelectors({
  availableLessons,
  questionSets,
  selectedLessonIds,
  selectedQuestionSetIds,
  customTaskValue,
  onToggleLesson,
  onToggleQuestionSet,
  onCustomTaskChange,
}: TeacherAssignmentResourceSelectorsProps) {
  return (
    <>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Attach lessons
        </p>

        {availableLessons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-4 text-sm app-text-muted">
            No lessons available for this group yet.
          </div>
        ) : (
          <div className="space-y-2">
            {availableLessons.map((lesson) => (
              <label
                key={lesson.id}
                className="flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3 transition hover:border-[var(--border-strong)]"
              >
                <input
                  type="checkbox"
                  checked={selectedLessonIds.includes(lesson.id)}
                  onChange={() => onToggleLesson(lesson.id)}
                  className="app-focus-ring app-checkbox-input mt-1"
                />
                <span>
                  <span className="block font-medium text-[var(--text-primary)]">
                    {lesson.title}
                  </span>
                  <span className="block text-sm app-text-muted">
                    {lesson.module_title}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Attach question sets
        </p>

        {questionSets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-4 text-sm app-text-muted">
            No question sets available yet.
          </div>
        ) : (
          <div className="space-y-2">
            {questionSets.map((questionSet) => (
              <label
                key={questionSet.id}
                className="flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-3 transition hover:border-[var(--border-strong)]"
              >
                <input
                  type="checkbox"
                  checked={selectedQuestionSetIds.includes(questionSet.id)}
                  onChange={() => onToggleQuestionSet(questionSet.id)}
                  className="app-focus-ring app-checkbox-input mt-1"
                />
                <span>
                  <span className="block font-medium text-[var(--text-primary)]">
                    {questionSet.title}
                  </span>
                  {questionSet.description ? (
                    <span className="block text-sm app-text-muted">
                      {questionSet.description}
                    </span>
                  ) : null}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <FormField label="Custom task">
        <Textarea
          value={customTaskValue}
          onChange={(event) => onCustomTaskChange(event.target.value)}
          rows={4}
          placeholder="Optional: add a written task or teacher instruction..."
        />
      </FormField>
    </>
  );
}
