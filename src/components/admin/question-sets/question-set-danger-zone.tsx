import { deleteQuestionSetAction } from "@/app/actions/admin/admin-question-actions";
import type { DbQuestionSet } from "@/lib/questions/question-db-types";
import Button from "@/components/ui/button";
import DangerZone from "@/components/ui/danger-zone";

export function QuestionSetDangerZone({
  questionSet,
  usageCount,
}: {
  questionSet: DbQuestionSet;
  usageCount: number;
}) {
  return (
    <DangerZone
      title="Delete question set"
      description="Remove this set and all attached questions, options, and accepted answers."
    >
      <form action={deleteQuestionSetAction} className="space-y-4">
        <input type="hidden" name="questionSetId" value={questionSet.id} />

        <p>
          Delete this question set and all of its questions, options, and accepted
          answers.
        </p>

        {usageCount > 0 ? (
          <p className="font-medium text-[var(--danger)]">
            Warning: This question set is used in {usageCount} assignment
            {usageCount > 1 ? "s" : ""}.
          </p>
        ) : null}

        <Button type="submit" variant="danger" icon="delete">
          Delete question set
        </Button>
      </form>
    </DangerZone>
  );
}
