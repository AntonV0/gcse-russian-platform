import type { DbMockExamQuestion } from "@/lib/mock-exams/mock-exam-helpers-db";
import {
  getNumberArray,
  getRecordArray,
  getString,
  getStringArray,
} from "./preview-data";

export function MockExamOptionsPreview({ question }: { question: DbMockExamQuestion }) {
  const options = getStringArray(question.data.options);
  const correctAnswers = getNumberArray(question.data.correctAnswers);

  if (options.length === 0) return null;

  return (
    <div className="grid gap-2">
      {options.map((option, optionIndex) => (
        <div
          key={`${question.id}-option-${optionIndex}`}
          className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-3 py-2 text-sm"
        >
          <span className="font-medium text-[var(--text-primary)]">
            {String.fromCharCode(65 + optionIndex)}.
          </span>{" "}
          <span className="text-[var(--text-secondary)]">{option}</span>
          {correctAnswers.includes(optionIndex) ? (
            <span className="ml-2 text-xs font-semibold text-[var(--success)]">
              model answer
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function MockExamMatchingPreview({ question }: { question: DbMockExamQuestion }) {
  const prompts = getStringArray(question.data.prompts);
  const options = getStringArray(question.data.options);

  if (prompts.length === 0 && options.length === 0) return null;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
          Prompts
        </div>
        {prompts.map((prompt, promptIndex) => (
          <div
            key={`${question.id}-matching-prompt-${promptIndex}`}
            className="rounded-xl bg-[var(--background-muted)] px-3 py-2 text-sm text-[var(--text-secondary)]"
          >
            {prompt}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
          Options
        </div>
        {options.map((option, optionIndex) => (
          <div
            key={`${question.id}-matching-option-${optionIndex}`}
            className="rounded-xl bg-[var(--background-muted)] px-3 py-2 text-sm text-[var(--text-secondary)]"
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockExamStatementsPreview({
  question,
}: {
  question: DbMockExamQuestion;
}) {
  const statements = getStringArray(question.data.statements);

  if (statements.length === 0) return null;

  return (
    <div className="grid gap-2">
      {statements.map((statement, statementIndex) => (
        <div
          key={`${question.id}-statement-${statementIndex}`}
          className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-3 py-2 text-sm text-[var(--text-secondary)]"
        >
          {statement}
        </div>
      ))}
    </div>
  );
}

export function MockExamFieldsPreview({ question }: { question: DbMockExamQuestion }) {
  const fields = getRecordArray(question.data.fields);

  if (fields.length === 0) return null;

  return (
    <div className="grid gap-2">
      {fields.map((field, fieldIndex) => (
        <div
          key={`${question.id}-field-${fieldIndex}`}
          className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-3 py-2 text-sm"
        >
          <span className="text-[var(--text-secondary)]">
            {getString(field.prompt) || `Field ${fieldIndex + 1}`}
          </span>
        </div>
      ))}
    </div>
  );
}
