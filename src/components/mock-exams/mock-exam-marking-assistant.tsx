import Badge from "@/components/ui/badge";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import type { DbMockExamQuestion, DbMockExamResponse } from "@/lib/mock-exams/types";

type MockExamMarkingAssistantProps = {
  question: DbMockExamQuestion;
  response?: DbMockExamResponse;
  disabled?: boolean;
};

function getRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getRecordArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item)
      )
    : [];
}

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getNumberString(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "";
}

function CriterionList({
  title,
  items,
}: {
  title: string;
  items: Record<string, unknown>[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
        {title}
      </div>
      <div className="grid gap-2">
        {items.map((item, index) => {
          const label = getString(item.label) || `${title} ${index + 1}`;
          const description = getString(item.description);
          const marks = getNumberString(item.marks);

          return (
            <div
              key={`${title}-${index}`}
              className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-3 py-2"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {label}
                </span>
                {marks ? <Badge tone="muted">{marks} marks</Badge> : null}
              </div>
              {description ? (
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                  {description}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MockExamMarkingAssistant({
  question,
  response,
  disabled = false,
}: MockExamMarkingAssistantProps) {
  const markingMetadata = getRecord(question.data.markingMetadata);
  const aiMarking = getRecord(response?.response_payload.aiMarking);
  const criteria = getRecordArray(markingMetadata.criteria);
  const levelDescriptors = getRecordArray(markingMetadata.levelDescriptors);
  const markSchemeReference = getString(markingMetadata.markSchemeReference);
  const wordCountGuidance = getString(markingMetadata.wordCountGuidance);
  const aiMarkingNotes = getString(markingMetadata.aiMarkingNotes);
  const hasRubric =
    criteria.length > 0 ||
    levelDescriptors.length > 0 ||
    markSchemeReference ||
    wordCountGuidance ||
    aiMarkingNotes;

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
            Teacher / AI marking assistant
          </div>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            Store AI suggestions as evidence for teacher review. The teacher mark remains
            authoritative.
          </p>
        </div>
        <Badge tone="warning">Teacher confirmed</Badge>
      </div>

      {hasRubric ? (
        <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] p-3">
          <CriterionList title="Criteria" items={criteria} />
          <CriterionList title="Level descriptors" items={levelDescriptors} />

          {markSchemeReference || wordCountGuidance || aiMarkingNotes ? (
            <div className="grid gap-2 text-sm leading-6 text-[var(--text-secondary)] md:grid-cols-3">
              {markSchemeReference ? (
                <div>
                  <span className="font-medium text-[var(--text-primary)]">
                    Mark scheme:
                  </span>{" "}
                  {markSchemeReference}
                </div>
              ) : null}
              {wordCountGuidance ? (
                <div>
                  <span className="font-medium text-[var(--text-primary)]">
                    Word count:
                  </span>{" "}
                  {wordCountGuidance}
                </div>
              ) : null}
              {aiMarkingNotes ? (
                <div>
                  <span className="font-medium text-[var(--text-primary)]">
                    AI notes:
                  </span>{" "}
                  {aiMarkingNotes}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[160px_180px_180px_minmax(0,1fr)]">
        <FormField label="AI suggested mark">
          <Input
            name={`aiSuggestedMarks_${question.id}`}
            type="number"
            min="0"
            max={String(question.marks)}
            step="0.5"
            defaultValue={getNumberString(aiMarking.suggestedMarks)}
            disabled={disabled}
          />
        </FormField>

        <FormField label="Confidence">
          <Select
            name={`aiConfidence_${question.id}`}
            defaultValue={getString(aiMarking.confidence)}
            disabled={disabled}
          >
            <option value="">Not set</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </FormField>

        <FormField label="Teacher decision">
          <Select
            name={`aiTeacherDecision_${question.id}`}
            defaultValue={getString(aiMarking.teacherDecision) || "pending"}
            disabled={disabled}
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="edited">Edited</option>
            <option value="rejected">Rejected</option>
          </Select>
        </FormField>

        <FormField label="Teacher moderation notes">
          <Input
            name={`aiTeacherNotes_${question.id}`}
            defaultValue={getString(aiMarking.teacherNotes)}
            disabled={disabled}
          />
        </FormField>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField label="AI rationale">
          <Textarea
            name={`aiRationale_${question.id}`}
            rows={3}
            defaultValue={getString(aiMarking.rationale)}
            disabled={disabled}
            placeholder="Paste or generate a concise rationale against the stored rubric."
          />
        </FormField>

        <FormField label="Evidence">
          <Textarea
            name={`aiEvidence_${question.id}`}
            rows={3}
            defaultValue={getString(aiMarking.evidence)}
            disabled={disabled}
            placeholder="Evidence from the response, such as phrases, task coverage, or errors."
          />
        </FormField>

        <FormField label="Strengths">
          <Textarea
            name={`aiStrengths_${question.id}`}
            rows={3}
            defaultValue={getString(aiMarking.strengths)}
            disabled={disabled}
          />
        </FormField>

        <FormField label="Targets">
          <Textarea
            name={`aiTargets_${question.id}`}
            rows={3}
            defaultValue={getString(aiMarking.targets)}
            disabled={disabled}
          />
        </FormField>
      </div>
    </div>
  );
}
