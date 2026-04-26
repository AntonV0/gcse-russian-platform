import Image from "next/image";
import Badge from "@/components/ui/badge";
import AudioPlayer from "@/components/questions/audio-player";
import type { DbMockExamQuestion } from "@/lib/mock-exams/mock-exam-helpers-db";
import { getMockExamQuestionTypeLabel } from "@/lib/mock-exams/mock-exam-helpers-db";

type MockExamQuestionPreviewProps = {
  question: DbMockExamQuestion;
  index: number;
};

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getNumberArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is number => typeof item === "number");
}

function getNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function getRecordArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is Record<string, unknown> =>
      Boolean(item) && typeof item === "object" && !Array.isArray(item)
  );
}

function RenderMedia({ question }: { question: DbMockExamQuestion }) {
  const audioUrl = getString(question.data.audioUrl);
  const imageUrl = getString(question.data.imageUrl);

  if (!audioUrl && !imageUrl) return null;

  return (
    <div className="space-y-3">
      {audioUrl ? (
        <AudioPlayer
          src={audioUrl}
          maxPlays={getNumber(question.data.audioMaxPlays)}
          listeningMode={question.question_type === "listening_comprehension"}
        />
      ) : null}

      {imageUrl ? (
        <figure className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background-muted)]">
          <Image
            src={imageUrl}
            alt="Mock exam visual prompt"
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, 900px"
            unoptimized
            className="max-h-[420px] w-full object-contain"
          />
        </figure>
      ) : null}
    </div>
  );
}

function RenderOptions({ question }: { question: DbMockExamQuestion }) {
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

function RenderTextSource({ question }: { question: DbMockExamQuestion }) {
  const text = getString(question.data.text) || getString(question.data.sourceText);

  if (!text) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
      {text}
    </div>
  );
}

function RenderBullets({ question }: { question: DbMockExamQuestion }) {
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

function RenderPrompts({ question }: { question: DbMockExamQuestion }) {
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

function RenderMatching({ question }: { question: DbMockExamQuestion }) {
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

function RenderStatements({ question }: { question: DbMockExamQuestion }) {
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

function RenderFields({ question }: { question: DbMockExamQuestion }) {
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

function RenderRolePlay({ question }: { question: DbMockExamQuestion }) {
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

function RenderPhotoCard({ question }: { question: DbMockExamQuestion }) {
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
      <RenderPrompts question={question} />
    </div>
  );
}

function RenderQuestionSpecificPreview({
  question,
}: {
  question: DbMockExamQuestion;
}) {
  switch (question.question_type) {
    case "multiple_choice":
    case "multiple_response":
      return <RenderOptions question={question} />;

    case "matching":
      return <RenderMatching question={question} />;

    case "gap_fill":
    case "translation_into_english":
    case "translation_into_russian":
    case "reading_comprehension":
    case "listening_comprehension":
      return <RenderTextSource question={question} />;

    case "sequencing":
      return <RenderPrompts question={{ ...question, data: { prompts: question.data.items } }} />;

    case "opinion_recognition":
    case "true_false_not_mentioned":
      return <RenderStatements question={question} />;

    case "note_completion":
      return <RenderFields question={question} />;

    case "writing_task":
    case "simple_sentences":
    case "short_paragraph":
      return <RenderBullets question={question} />;

    case "extended_writing":
    case "conversation":
      return <RenderPrompts question={question} />;

    case "role_play":
      return <RenderRolePlay question={question} />;

    case "photo_card":
      return <RenderPhotoCard question={question} />;

    case "sentence_builder":
      return <RenderPrompts question={{ ...question, data: { prompts: question.data.wordBank } }} />;

    case "short_answer":
    case "other":
    default:
      return null;
  }
}

export default function MockExamQuestionPreview({
  question,
  index,
}: MockExamQuestionPreviewProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)]/55 p-4">
      <div>
        <h3 className="font-semibold leading-6 text-[var(--text-primary)]">
          Question {index + 1}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {question.prompt}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge tone="info" icon="question">
          {getMockExamQuestionTypeLabel(question.question_type)}
        </Badge>
        <Badge tone="muted">{question.marks} mark(s)</Badge>
      </div>

      <RenderMedia question={question} />
      <RenderQuestionSpecificPreview question={question} />
    </div>
  );
}
