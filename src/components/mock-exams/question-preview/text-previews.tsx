import Badge from "@/components/ui/badge";
import type { DbMockExamQuestion } from "@/lib/mock-exams/mock-exam-helpers-db";
import {
  getNumber,
  getRecord,
  getString,
  getStringArray,
  getTaskStimulus,
} from "./preview-data";

export function MockExamTextSourcePreview({
  question,
}: {
  question: DbMockExamQuestion;
}) {
  const stimulus = getTaskStimulus(question);
  const text =
    getString(question.data.text) ||
    getString(question.data.sourceText) ||
    getString(stimulus.text);

  if (!text) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
      {text}
    </div>
  );
}

export function MockExamPromptsPreview({ question }: { question: DbMockExamQuestion }) {
  const prompts = getStringArray(question.data.prompts);

  if (prompts.length === 0) return null;

  return (
    <div className="grid gap-2">
      {prompts.map((prompt, promptIndex) => (
        <div
          key={`${question.id}-prompt-${promptIndex}`}
          className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-3 py-2 text-sm text-[var(--text-secondary)]"
        >
          {prompt}
        </div>
      ))}
    </div>
  );
}

export function MockExamReadingListeningTaskPreview({
  question,
}: {
  question: DbMockExamQuestion;
}) {
  const taskContext = getRecord(question.data.taskContext);
  const stimulus = getRecord(taskContext.stimulus);
  const childQuestionSetSlug = getString(stimulus.childQuestionSetSlug);
  const timeLimitSeconds = getNumber(taskContext.timeLimitSeconds);
  const childInteractionTypes = getStringArray(taskContext.childInteractionTypes);

  return (
    <div className="space-y-3">
      <MockExamTextSourcePreview question={question} />

      {childQuestionSetSlug || timeLimitSeconds || childInteractionTypes.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {childQuestionSetSlug ? (
            <Badge tone="muted">Linked set: {childQuestionSetSlug}</Badge>
          ) : null}
          {timeLimitSeconds ? (
            <Badge tone="muted">{Math.round(timeLimitSeconds / 60)} min task</Badge>
          ) : null}
          {childInteractionTypes.slice(0, 3).map((interactionType) => (
            <Badge key={`${question.id}-${interactionType}`} tone="muted">
              {interactionType.replaceAll("_", " ")}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
