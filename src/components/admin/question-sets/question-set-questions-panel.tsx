import {
  deleteQuestionAction,
  duplicateQuestionAction,
  moveQuestionAction,
  normalizeQuestionPositionsAction,
  toggleQuestionActiveAction,
} from "@/app/actions/admin/admin-question-actions";
import type { DbQuestion } from "@/lib/questions/question-db-types";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import EmptyState from "@/components/ui/empty-state";
import InlineActions from "@/components/ui/inline-actions";
import SectionHeader from "@/components/ui/section-header";

function formatQuestionType(value: string) {
  return value.replaceAll("_", " ");
}

export function QuestionSetQuestionsPanel({
  questionSetId,
  questions,
}: {
  questionSetId: string;
  questions: DbQuestion[];
}) {
  return (
    <>
      <SectionHeader
        className="mb-4"
        title="Questions"
        description="Questions currently attached to this set."
        actions={
          <form action={normalizeQuestionPositionsAction}>
            <input type="hidden" name="questionSetId" value={questionSetId} />
            <Button type="submit" variant="secondary" size="sm" icon="refresh">
              Normalize positions
            </Button>
          </form>
        }
      />

      {questions.length === 0 ? (
        <EmptyState
          icon="question"
          title="No questions yet"
          description="Add the first question to start building this reusable GCSE Russian set."
        />
      ) : (
        <div className="grid gap-4">
          {questions.map((question) => (
            <QuestionSetQuestionCard
              key={question.id}
              questionSetId={questionSetId}
              question={question}
              questionCount={questions.length}
            />
          ))}
        </div>
      )}
    </>
  );
}

function QuestionSetQuestionCard({
  questionSetId,
  question,
  questionCount,
}: {
  questionSetId: string;
  question: DbQuestion;
  questionCount: number;
}) {
  return (
    <DashboardCard title={`Q${question.position}`}>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge tone="info">{formatQuestionType(question.question_type)}</Badge>
          <Badge tone="muted">{question.marks} mark(s)</Badge>
          <Badge tone={question.is_active ? "success" : "warning"}>
            {question.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        <p className="text-[var(--text-primary)]">{question.prompt}</p>

        {question.audio_path ? (
          <p className="text-sm app-text-muted">
            <span className="font-medium text-[var(--text-primary)]">Audio path:</span>{" "}
            {question.audio_path}
          </p>
        ) : null}

        {question.metadata ? (
          <pre className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3 text-xs text-[var(--text-secondary)]">
            {JSON.stringify(question.metadata, null, 2)}
          </pre>
        ) : null}

        <QuestionSetQuestionActions
          questionSetId={questionSetId}
          question={question}
          questionCount={questionCount}
        />
      </div>
    </DashboardCard>
  );
}

function QuestionSetQuestionActions({
  questionSetId,
  question,
  questionCount,
}: {
  questionSetId: string;
  question: DbQuestion;
  questionCount: number;
}) {
  return (
    <InlineActions className="pt-1">
      <Button
        href={`/admin/questions/${question.id}`}
        variant="secondary"
        size="sm"
        icon="edit"
      >
        Edit question
      </Button>

      <form action={duplicateQuestionAction}>
        <input type="hidden" name="questionId" value={question.id} />
        <input type="hidden" name="questionSetId" value={questionSetId} />
        <Button type="submit" variant="secondary" size="sm" icon="create">
          Duplicate
        </Button>
      </form>

      <form action={moveQuestionAction}>
        <input type="hidden" name="questionId" value={question.id} />
        <input type="hidden" name="questionSetId" value={questionSetId} />
        <input type="hidden" name="direction" value="up" />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={question.position === 1}
        >
          Move up
        </Button>
      </form>

      <form action={moveQuestionAction}>
        <input type="hidden" name="questionId" value={question.id} />
        <input type="hidden" name="questionSetId" value={questionSetId} />
        <input type="hidden" name="direction" value="down" />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={question.position === questionCount}
        >
          Move down
        </Button>
      </form>

      <form action={toggleQuestionActiveAction}>
        <input type="hidden" name="questionId" value={question.id} />
        <input type="hidden" name="questionSetId" value={questionSetId} />
        <input
          type="hidden"
          name="nextState"
          value={question.is_active ? "inactive" : "active"}
        />
        <Button type="submit" variant="secondary" size="sm">
          {question.is_active ? "Deactivate" : "Activate"}
        </Button>
      </form>

      <form action={deleteQuestionAction}>
        <input type="hidden" name="questionId" value={question.id} />
        <input type="hidden" name="questionSetId" value={questionSetId} />
        <Button type="submit" variant="danger" size="sm" icon="delete">
          Delete
        </Button>
      </form>
    </InlineActions>
  );
}
