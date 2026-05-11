"use client";

import { useFormStatus } from "react-dom";
import Button from "@/components/ui/button";

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
  children: React.ReactNode;
};

function MockExamSubmitButton({
  intent,
  idleLabel,
  pendingLabel,
  variant,
  icon,
  ariaLabel,
}: {
  intent: "save" | "submit";
  idleLabel: string;
  pendingLabel: string;
  variant: "primary" | "secondary";
  icon: "save" | "confirm";
  ariaLabel: string;
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
      disabled={pending}
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
  children,
}: MockExamAttemptFormProps) {
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
        <div className="app-mobile-action-stack flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <MockExamSubmitButton
            intent="save"
            idleLabel="Save draft"
            pendingLabel="Saving draft..."
            variant="secondary"
            icon="save"
            ariaLabel="Save mock exam draft"
          />
          <MockExamSubmitButton
            intent="submit"
            idleLabel="Submit attempt"
            pendingLabel="Submitting attempt..."
            variant="primary"
            icon="confirm"
            ariaLabel="Submit mock exam attempt for marking"
          />
        </div>
      ) : null}
    </form>
  );
}
