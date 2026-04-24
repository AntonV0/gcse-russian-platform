"use client";

import { useState, useTransition } from "react";
import { reopenAssignmentSubmissionAction } from "@/app/actions/teacher/teacher-assignment-actions";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";

type ReopenSubmissionButtonProps = {
  submissionId: string;
};

export default function ReopenSubmissionButton({
  submissionId,
}: ReopenSubmissionButtonProps) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setSaved(false);
    setError(null);

    startTransition(async () => {
      const result = await reopenAssignmentSubmissionAction(submissionId);

      if (result.success) {
        setSaved(true);
      } else {
        setError("Submission could not be reopened.");
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        variant="secondary"
        size="sm"
      >
        {isPending ? "Reopening..." : "Reopen for resubmission"}
      </Button>

      {saved ? (
        <FeedbackBanner tone="success" description="Submission reopened successfully." />
      ) : null}

      {error ? <FeedbackBanner tone="danger" description={error} /> : null}
    </div>
  );
}
