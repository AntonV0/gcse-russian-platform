"use client";

import { useState } from "react";
import { deleteTeacherAssignmentAction } from "@/app/actions/teacher/teacher-delete-assignment-actions";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";

type DeleteAssignmentButtonProps = {
  assignmentId: string;
};

export default function DeleteAssignmentButton({
  assignmentId,
}: DeleteAssignmentButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    const result = await deleteTeacherAssignmentAction(assignmentId);

    if (result && !result.success) {
      setError("Could not delete the assignment.");
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <Button
        type="button"
        onClick={() => setConfirming(true)}
        variant="danger"
        size="sm"
      >
        Delete assignment
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" onClick={handleDelete} variant="danger" size="sm">
        Confirm delete
      </Button>

      <Button
        type="button"
        onClick={() => {
          setConfirming(false);
          setError(null);
        }}
        variant="quiet"
        size="sm"
      >
        Cancel
      </Button>

      {error ? <FeedbackBanner tone="danger" description={error} /> : null}
    </div>
  );
}
