"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import {
  getUnansweredMockExamAttemptQuestions,
  type MockExamAttemptReviewQuestion,
} from "@/lib/mock-exams/attempt-submit-review";

export type MockExamAttemptFormQuestion = MockExamAttemptReviewQuestion;

type MockExamAttemptFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  attemptId: string;
  questions: MockExamAttemptFormQuestion[];
  showControls: boolean;
  startedAt?: string;
  timeLimitMinutes?: number | null;
  children: React.ReactNode;
};

function MockExamSubmitButton({
  intent,
  idleLabel,
  pendingLabel,
  variant,
  icon,
  ariaLabel,
  disabled,
}: {
  intent: "save" | "submit";
  idleLabel: string;
  pendingLabel: string;
  variant: "primary" | "secondary";
  icon: "save" | "confirm";
  ariaLabel: string;
  disabled?: boolean;
}) {
  const { pending, data } = useFormStatus();
  const isCurrentPending = pending && data?.get("submitIntent") === intent;

  return (
    <Button
      type="submit"
      name="submitIntent"
      value={intent}
      variant={variant}
      icon={icon}
      ariaLabel={ariaLabel}
      disabled={pending || disabled}
      loading={isCurrentPending}
      loadingLabel={pendingLabel}
    >
      {idleLabel}
    </Button>
  );
}

export default function MockExamAttemptForm({
  action,
  attemptId,
  questions,
  showControls,
  startedAt,
  timeLimitMinutes,
  children,
}: MockExamAttemptFormProps) {
  const endsAt = useMemo(() => {
    if (!startedAt || !timeLimitMinutes) return null;
    return new Date(startedAt).getTime() + timeLimitMinutes * 60 * 1000;
  }, [startedAt, timeLimitMinutes]);
  const [now, setNow] = useState(() => Date.now());
  const [unansweredQuestions, setUnansweredQuestions] = useState<
    MockExamAttemptFormQuestion[]
  >([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const submitAnywayRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const allowIncompleteSubmitRef = useRef(false);
  const shouldRestoreFocusRef = useRef(true);
  const isExpired = Boolean(endsAt && now > endsAt);

  useEffect(() => {
    if (!endsAt || !showControls) return;

    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [endsAt, showControls]);

  useEffect(() => {
    if (!isReviewOpen) return;

    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsReviewOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (shouldRestoreFocusRef.current) {
        previousActiveElement?.focus();
      }
      shouldRestoreFocusRef.current = true;
    };
  }, [isReviewOpen]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const nativeEvent = event.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as
      | HTMLButtonElement
      | HTMLInputElement
      | null;

    if (submitter?.value !== "submit") {
      return;
    }

    if (allowIncompleteSubmitRef.current) {
      allowIncompleteSubmitRef.current = false;
      return;
    }

    const formData = new FormData(event.currentTarget);
    const nextUnansweredQuestions = getUnansweredMockExamAttemptQuestions(
      questions,
      formData
    );

    if (nextUnansweredQuestions.length === 0) {
      return;
    }

    event.preventDefault();
    setUnansweredQuestions(nextUnansweredQuestions);
    shouldRestoreFocusRef.current = true;
    setIsReviewOpen(true);
  }

  function submitWithUnansweredQuestions() {
    allowIncompleteSubmitRef.current = true;
    shouldRestoreFocusRef.current = false;
    setIsReviewOpen(false);
    submitAnywayRef.current?.click();
  }

  function closeReviewDialog() {
    shouldRestoreFocusRef.current = true;
    setIsReviewOpen(false);
  }

  function closeAndJumpToQuestion() {
    shouldRestoreFocusRef.current = false;
    setIsReviewOpen(false);
  }

  return (
    <form
      action={action}
      className="space-y-4"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="attemptId" value={attemptId} />

      {children}

      {showControls ? (
        <div className="space-y-3">
          {isExpired ? (
            <div className="rounded-xl border border-[var(--warning-border)] bg-[var(--warning-surface)] px-4 py-3 text-sm leading-6 text-[var(--warning-text)]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="warning" icon="pending">
                  Time elapsed
                </Badge>
                <span>
                  Draft saving is closed for this timed attempt. Submit now so the work
                  can be reviewed.
                </span>
              </div>
            </div>
          ) : null}

          <div className="app-mobile-action-stack flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <MockExamSubmitButton
              intent="save"
              idleLabel="Save draft"
              pendingLabel="Saving draft..."
              variant="secondary"
              icon="save"
              ariaLabel="Save mock exam draft"
              disabled={isExpired}
            />
            <MockExamSubmitButton
              intent="submit"
              idleLabel={isExpired ? "Submit timed attempt" : "Submit attempt"}
              pendingLabel="Submitting attempt..."
              variant="primary"
              icon="confirm"
              ariaLabel="Submit mock exam attempt for marking"
            />
          </div>
        </div>
      ) : null}

      <button
        ref={submitAnywayRef}
        type="submit"
        name="submitIntent"
        value="submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      {isReviewOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[color-mix(in_srgb,var(--text-primary)_38%,transparent)] px-4 py-5 sm:items-center"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeReviewDialog();
            }
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mock-exam-unanswered-title"
            aria-describedby="mock-exam-unanswered-description"
            tabIndex={-1}
            className="app-focus-ring max-h-[min(86vh,40rem)] w-full max-w-xl overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background-elevated)] shadow-[var(--shadow-lg)]"
          >
            <div className="border-b border-[var(--border)] bg-[var(--surface-header-bg)] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Badge tone="warning" icon="warning">
                    Check before submitting
                  </Badge>
                  <h2
                    id="mock-exam-unanswered-title"
                    className="mt-3 app-card-title"
                  >
                    {unansweredQuestions.length} question
                    {unansweredQuestions.length === 1 ? "" : "s"} still look
                    unanswered
                  </h2>
                  <p
                    id="mock-exam-unanswered-description"
                    className="mt-2 app-card-desc"
                  >
                    You can jump back to any missing answer, or submit anyway if this is
                    intentional.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="quiet"
                  size="sm"
                  icon="cancel"
                  iconOnly
                  ariaLabel="Close unanswered questions dialog"
                  onClick={closeReviewDialog}
                />
              </div>
            </div>

            <div className="max-h-[18rem] overflow-y-auto px-5 py-4">
              <div className="grid gap-2">
                {unansweredQuestions.map((question) => (
                  <a
                    key={question.anchorId}
                    href={`#${question.anchorId}`}
                    className="app-focus-ring rounded-lg border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 text-sm transition hover:border-[var(--border-strong)] hover:bg-[var(--background-elevated)]"
                    onClick={closeAndJumpToQuestion}
                  >
                    <span className="block font-semibold text-[var(--text-primary)]">
                      {question.label}
                    </span>
                    <span className="mt-1 block text-[var(--text-secondary)]">
                      {question.sectionTitle}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="app-mobile-action-stack flex flex-col gap-2 border-t border-[var(--border)] bg-[var(--background-muted)] px-5 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                icon="back"
                onClick={closeReviewDialog}
              >
                Go back and answer
              </Button>
              <Button
                type="button"
                variant="warning"
                icon="confirm"
                onClick={submitWithUnansweredQuestions}
              >
                Submit anyway
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
