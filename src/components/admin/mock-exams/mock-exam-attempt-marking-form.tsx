import { markMockExamAttemptAction } from "@/app/actions/admin/admin-mock-exam-actions";
import MockExamMarkingAssistant from "@/components/mock-exams/mock-exam-marking-assistant";
import MockExamQuestionPreview from "@/components/mock-exams/mock-exam-question-preview";
import MockExamResponseSummary from "@/components/mock-exams/mock-exam-response-summary";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import SectionCard from "@/components/ui/section-card";
import Textarea from "@/components/ui/textarea";
import { getMockExamSectionTypeLabel } from "@/lib/mock-exams/labels";
import type {
  DbMockExamAttempt,
  DbMockExamQuestion,
  DbMockExamResponse,
  DbMockExamScore,
  DbMockExamSection,
} from "@/lib/mock-exams/types";
import { getString } from "@/components/admin/mock-exams/mock-exam-attempt-review-utils";

type MockExamAttemptMarkingFormProps = {
  attempt: DbMockExamAttempt;
  sections: DbMockExamSection[];
  questionsBySectionId: Record<string, DbMockExamQuestion[]>;
  responsesByQuestionId: Record<string, DbMockExamResponse>;
  score: DbMockExamScore | null;
  canMark: boolean;
};

function MarkGuidance({ value }: { value: unknown }) {
  const markGuidance = getString(value);

  if (!markGuidance) return null;

  return (
    <div className="rounded-xl border border-[var(--info-border)] bg-[var(--info-soft)] px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
        Mark guidance
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
        {markGuidance}
      </p>
    </div>
  );
}

function MockExamAttemptQuestionMarkingCard({
  question,
  questionIndex,
  response,
  canMark,
}: {
  question: DbMockExamQuestion;
  questionIndex: number;
  response: DbMockExamResponse | undefined;
  canMark: boolean;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
      <MockExamQuestionPreview question={question} index={questionIndex} />

      <MarkGuidance value={question.data.markGuidance} />

      <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
          Student response
        </div>
        <div className="mt-2">
          <MockExamResponseSummary response={response} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
        <FormField label={`Marks / ${question.marks}`}>
          <Input
            name={`awardedMarks_${question.id}`}
            type="number"
            min="0"
            max={String(question.marks)}
            step="0.5"
            defaultValue={
              response?.awarded_marks === null || response?.awarded_marks === undefined
                ? ""
                : String(response.awarded_marks)
            }
            disabled={!canMark}
          />
        </FormField>

        <FormField label="Feedback">
          <Textarea
            name={`feedback_${question.id}`}
            rows={3}
            defaultValue={response?.feedback ?? ""}
            disabled={!canMark}
          />
        </FormField>
      </div>

      <MockExamMarkingAssistant
        question={question}
        response={response}
        disabled={!canMark}
      />

      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <input
          type="checkbox"
          name={`isFlagged_${question.id}`}
          value="true"
          defaultChecked={response?.is_flagged ?? false}
          disabled={!canMark}
        />
        Flag this response for follow-up
      </label>
    </div>
  );
}

function MockExamAttemptSectionMarkingPanel({
  section,
  questions,
  responsesByQuestionId,
  canMark,
}: {
  section: DbMockExamSection;
  questions: DbMockExamQuestion[];
  responsesByQuestionId: Record<string, DbMockExamResponse>;
  canMark: boolean;
}) {
  return (
    <SectionCard
      title={section.title}
      description={section.instructions ?? undefined}
      tone="admin"
      density="compact"
      actions={
        <Badge tone="muted" icon="list">
          {getMockExamSectionTypeLabel(section.section_type)}
        </Badge>
      }
    >
      {questions.length === 0 ? (
        <EmptyState
          icon="question"
          iconTone="brand"
          title="No questions in this section"
          description="There are no responses to review in this section."
        />
      ) : (
        <div className="space-y-4">
          {questions.map((question, questionIndex) => (
            <MockExamAttemptQuestionMarkingCard
              key={question.id}
              question={question}
              questionIndex={questionIndex}
              response={responsesByQuestionId[question.id]}
              canMark={canMark}
            />
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function MockExamAttemptFinalScorePanel({
  attempt,
  score,
  canMark,
}: {
  attempt: DbMockExamAttempt;
  score: DbMockExamScore | null;
  canMark: boolean;
}) {
  return (
    <SectionCard
      title="Final score and feedback"
      description="Save overall feedback and an optional predicted grade note for the student's results view."
      tone="admin"
    >
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <FormField label="Predicted grade">
          <Input
            name="predictedGrade"
            defaultValue={getString(score?.score_payload.predictedGrade)}
            placeholder="e.g. Grade 7"
            disabled={!canMark}
          />
        </FormField>

        <FormField label="Overall feedback">
          <Textarea
            name="overallFeedback"
            rows={4}
            defaultValue={attempt.feedback ?? score?.feedback ?? ""}
            disabled={!canMark}
          />
        </FormField>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <FormField label="AI summary">
          <Textarea
            name="aiSummary"
            rows={3}
            defaultValue={getString(score?.score_payload.aiSummary)}
            placeholder="Optional summary of AI-assisted marking signals across the attempt."
            disabled={!canMark}
          />
        </FormField>

        <FormField label="Moderation notes">
          <Textarea
            name="teacherModerationNotes"
            rows={3}
            defaultValue={getString(score?.score_payload.teacherModerationNotes)}
            placeholder="Teacher notes explaining accepted, edited, or rejected AI suggestions."
            disabled={!canMark}
          />
        </FormField>
      </div>

      {canMark ? (
        <div className="mt-4">
          <Button type="submit" variant="primary" icon="save">
            Save marking
          </Button>
        </div>
      ) : null}
    </SectionCard>
  );
}

export default function MockExamAttemptMarkingForm({
  attempt,
  sections,
  questionsBySectionId,
  responsesByQuestionId,
  score,
  canMark,
}: MockExamAttemptMarkingFormProps) {
  if (sections.length === 0) {
    return (
      <SectionCard
        title="No sections"
        description="This attempt has no exam sections to review."
        tone="admin"
      >
        <EmptyState
          icon="list"
          iconTone="brand"
          title="Nothing to mark"
          description="Add sections and questions to the mock exam before attempts are reviewed."
        />
      </SectionCard>
    );
  }

  return (
    <form action={markMockExamAttemptAction} className="space-y-4">
      <input type="hidden" name="attemptId" value={attempt.id} />

      {sections.map((section) => (
        <MockExamAttemptSectionMarkingPanel
          key={section.id}
          section={section}
          questions={questionsBySectionId[section.id] ?? []}
          responsesByQuestionId={responsesByQuestionId}
          canMark={canMark}
        />
      ))}

      <MockExamAttemptFinalScorePanel attempt={attempt} score={score} canMark={canMark} />
    </form>
  );
}
