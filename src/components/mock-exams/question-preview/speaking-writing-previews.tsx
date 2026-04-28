import Badge from "@/components/ui/badge";
import type { DbMockExamQuestion } from "@/lib/mock-exams/types";
import { getRecordArray, getString, getStringArray } from "./preview-data";
import { MockExamPromptsPreview } from "./text-previews";

export function MockExamBulletsPreview({ question }: { question: DbMockExamQuestion }) {
  const bullets = getStringArray(question.data.bullets);

  if (bullets.length === 0) return null;

  return (
    <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
      {bullets.map((bullet, bulletIndex) => (
        <li key={`${question.id}-bullet-${bulletIndex}`}>- {bullet}</li>
      ))}
    </ul>
  );
}

export function MockExamRolePlayPreview({ question }: { question: DbMockExamQuestion }) {
  const scenario = getString(question.data.scenario);
  const prompts = getRecordArray(question.data.prompts);

  return (
    <div className="space-y-3">
      {scenario ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          {scenario}
        </div>
      ) : null}

      {prompts.length > 0 ? (
        <div className="grid gap-2">
          {prompts.map((prompt, promptIndex) => (
            <div
              key={`${question.id}-role-play-${promptIndex}`}
              className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm"
            >
              <span className="font-medium text-[var(--text-primary)]">
                Prompt {promptIndex + 1}:
              </span>{" "}
              <span className="text-[var(--text-secondary)]">
                {getString(prompt.text)}
              </span>
              {getString(prompt.type) ? (
                <Badge tone="muted" className="ml-2">
                  {getString(prompt.type)}
                </Badge>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function MockExamPhotoCardPreview({ question }: { question: DbMockExamQuestion }) {
  const imageUrl = getString(question.data.imageUrl);

  return (
    <div className="space-y-3">
      {imageUrl ? (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 text-sm font-medium app-brand-text"
        >
          Open image reference
        </a>
      ) : null}
      <MockExamPromptsPreview question={question} />
    </div>
  );
}
