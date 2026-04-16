"use client";

import { useState, useTransition } from "react";
import { reopenAssignmentSubmissionAction } from "@/app/actions/teacher/teacher-assignment-actions";

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
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        {isPending ? "Reopening..." : "Reopen for resubmission"}
      </button>

      {saved ? (
        <p className="text-sm font-medium text-green-600">
          Submission reopened successfully.
        </p>
      ) : null}

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
