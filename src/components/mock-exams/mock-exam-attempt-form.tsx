"use client";

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
          <Button
            type="submit"
            name="submitIntent"
            value="save"
            variant="secondary"
            icon="save"
          >
            Save draft
          </Button>
          <Button
            type="submit"
            name="submitIntent"
            value="submit"
            variant="primary"
            icon="confirm"
          >
            Submit attempt
          </Button>
        </div>
      ) : null}
    </form>
  );
}
