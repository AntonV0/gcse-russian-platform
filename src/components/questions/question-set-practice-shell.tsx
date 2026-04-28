"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Button from "@/components/ui/button";
import AppIcon from "@/components/ui/app-icon";
import {
  QUESTION_ATTEMPT_SUBMITTED_EVENT,
  type QuestionAttemptSubmittedDetail,
} from "@/components/questions/question-attempt-events";

type QuestionSummary = {
  id: string;
  number: number;
  prompt: string;
};

type SavedAttempt = QuestionAttemptSubmittedDetail & {
  answeredAt: string;
};

type QuestionSetPracticeShellProps = {
  questionSetSlug: string;
  questions: QuestionSummary[];
  children: ReactNode;
};

function getStorageKey(questionSetSlug: string) {
  return `question-set-practice:${questionSetSlug}:v1`;
}

function readSavedAttempts(storageKey: string) {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function writeSavedAttempts(storageKey: string, attempts: Record<string, SavedAttempt>) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(attempts));
  } catch {
    // The set summary is best-effort; the submitted answer is still saved server-side.
  }
}

function parseSavedAttempts(
  value: string | null,
  allowedQuestionIds: Set<string>
): Record<string, SavedAttempt> {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const attempts: Record<string, SavedAttempt> = {};

    Object.entries(parsed as Record<string, unknown>).forEach(([questionId, attempt]) => {
      if (
        !allowedQuestionIds.has(questionId) ||
        !attempt ||
        typeof attempt !== "object" ||
        Array.isArray(attempt)
      ) {
        return;
      }

      const record = attempt as Record<string, unknown>;
      const isCorrect = record.isCorrect;
      const answeredAt = record.answeredAt;

      if (typeof isCorrect !== "boolean" || typeof answeredAt !== "string") {
        return;
      }

      attempts[questionId] = {
        questionId,
        isCorrect,
        answeredAt,
        statusLabel:
          typeof record.statusLabel === "string" ? record.statusLabel : undefined,
        correctAnswerText:
          typeof record.correctAnswerText === "string" ? record.correctAnswerText : null,
        feedback: typeof record.feedback === "string" ? record.feedback : null,
      };
    });

    return attempts;
  } catch {
    return {};
  }
}

export default function QuestionSetPracticeShell({
  questionSetSlug,
  questions,
  children,
}: QuestionSetPracticeShellProps) {
  const [attempts, setAttempts] = useState<Record<string, SavedAttempt>>({});
  const questionIds = useMemo(
    () => new Set(questions.map((question) => question.id)),
    [questions]
  );
  const storageKey = getStorageKey(questionSetSlug);

  useEffect(() => {
    setAttempts(parseSavedAttempts(readSavedAttempts(storageKey), questionIds));
  }, [questionIds, storageKey]);

  useEffect(() => {
    function handleAttempt(event: Event) {
      const customEvent = event as CustomEvent<
        QuestionAttemptSubmittedDetail | undefined
      >;
      const detail = customEvent.detail;

      if (!detail || !questionIds.has(detail.questionId)) {
        return;
      }

      setAttempts((current) => {
        const next = {
          ...current,
          [detail.questionId]: {
            ...detail,
            answeredAt: new Date().toISOString(),
          },
        };

        writeSavedAttempts(storageKey, next);

        return next;
      });
    }

    window.addEventListener(QUESTION_ATTEMPT_SUBMITTED_EVENT, handleAttempt);

    return () => {
      window.removeEventListener(QUESTION_ATTEMPT_SUBMITTED_EVENT, handleAttempt);
    };
  }, [questionIds, storageKey]);

  const answeredCount = questions.filter((question) => attempts[question.id]).length;
  const correctCount = questions.filter(
    (question) => attempts[question.id]?.isCorrect
  ).length;
  const totalQuestions = questions.length;
  const isComplete = totalQuestions > 0 && answeredCount === totalQuestions;
  const progressPercent =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const scorePercent =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const incorrectQuestions = questions.filter(
    (question) => attempts[question.id] && !attempts[question.id].isCorrect
  );

  const progressLabel = isComplete
    ? `Complete: ${correctCount}/${totalQuestions} correct`
    : `${answeredCount}/${totalQuestions} answered`;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="app-text-meta">Practice progress</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {progressLabel}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="app-pill app-pill-muted">{progressPercent}% attempted</span>
            {isComplete ? (
              <span
                className={[
                  "app-pill",
                  incorrectQuestions.length > 0 ? "app-pill-warning" : "app-pill-success",
                ].join(" ")}
              >
                {scorePercent}% score
              </span>
            ) : null}
          </div>
        </div>

        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--background-elevated)]"
          role="progressbar"
          aria-label="Question set practice progress"
          aria-valuemin={0}
          aria-valuemax={totalQuestions}
          aria-valuenow={answeredCount}
          aria-valuetext={progressLabel}
        >
          <div
            className="h-full rounded-full bg-[var(--accent-fill)] transition-[width] duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {children}

      {isComplete ? (
        <div
          role="status"
          aria-live="polite"
          className={[
            "app-question-feedback p-4",
            incorrectQuestions.length > 0
              ? "app-feedback-banner-warning"
              : "app-question-feedback-success",
          ].join(" ")}
        >
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-base font-semibold">
                <AppIcon
                  icon={incorrectQuestions.length > 0 ? "warning" : "success"}
                  size={17}
                />
                <p>
                  {incorrectQuestions.length > 0
                    ? "Set finished. Review the missed answers."
                    : "Set finished. Every answer was correct."}
                </p>
              </div>
              <p className="text-sm leading-6">
                Final score: {correctCount}/{totalQuestions} correct.
              </p>
            </div>

            {incorrectQuestions.length > 0 ? (
              <Button
                href="#question-set-review"
                variant="warning"
                size="sm"
                icon="preview"
                ariaLabel="Review missed answers in this question set"
              >
                Review missed answers
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {incorrectQuestions.length > 0 ? (
        <div
          id="question-set-review"
          className="rounded-xl border border-[var(--warning-border)] bg-[var(--warning-surface)] p-4 text-[var(--warning-text)]"
        >
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <AppIcon icon="warning" size={17} />
            <p>Questions to review</p>
          </div>

          <ul className="space-y-3">
            {incorrectQuestions.map((question) => {
              const attempt = attempts[question.id];

              return (
                <li
                  key={question.id}
                  className="rounded-lg border border-[color-mix(in_srgb,var(--warning)_18%,transparent)] bg-[color-mix(in_srgb,var(--warning)_7%,transparent)] p-3"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">Question {question.number}</p>
                      <p className="text-sm leading-6">{question.prompt}</p>
                      {attempt?.correctAnswerText ? (
                        <p className="text-sm leading-6">
                          <span className="font-medium">Correct answer:</span>{" "}
                          {attempt.correctAnswerText}
                        </p>
                      ) : null}
                    </div>

                    <Button
                      href={`#question-${question.id}`}
                      variant="secondary"
                      size="sm"
                      icon="back"
                      ariaLabel={`Go back to question ${question.number}`}
                    >
                      Go back
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
