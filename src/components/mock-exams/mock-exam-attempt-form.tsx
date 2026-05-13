"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

export type MockExamAttemptFormQuestion = {
  label: string;
  sectionTitle: string;
  answerFieldNames: string[];
  persistedAttachmentSaved: boolean;
};

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

function hasUsableFormValue(value: FormDataEntryValue) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value.size > 0;
}

function isQuestionAnswered(question: MockExamAttemptFormQuestion, formData: FormData) {
  const hasEnteredResponse = question.answerFieldNames.some((fieldName) =>
    formData.getAll(fieldName).some(hasUsableFormValue)
  );

  return hasEnteredResponse || question.persistedAttachmentSaved;
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
  const isExpired = Boolean(endsAt && now > endsAt);

  useEffect(() => {
    if (!endsAt || !showControls) return;

    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [endsAt, showControls]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const nativeEvent = event.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as
      | HTMLButtonElement
      | HTMLInputElement
      | null;

    if (submitter?.value !== "submit") {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const unansweredQuestions = questions.filter(
      (question) => !isQuestionAnswered(question, formData)
    );

    if (unansweredQuestions.length === 0) {
      return;
    }

    const preview = unansweredQuestions
      .slice(0, 6)
      .map((question) => `${question.sectionTitle}: ${question.label}`)
      .join("\n");
    const remainingCount = unansweredQuestions.length - 6;
    const remainingText = remainingCount > 0 ? `\n...and ${remainingCount} more.` : "";

    const confirmed = window.confirm(
      [
        `${unansweredQuestions.length} question${
          unansweredQuestions.length === 1 ? "" : "s"
        } still look unanswered.`,
        preview,
        remainingText,
        "Submit this attempt anyway?",
      ]
        .filter(Boolean)
        .join("\n\n")
    );

    if (!confirmed) {
      event.preventDefault();
    }
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
    </form>
  );
}
