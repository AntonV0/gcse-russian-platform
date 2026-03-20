"use client";

import { useState } from "react";
import { deleteTeacherAssignmentAction } from "@/app/actions/teacher-delete-assignment-actions";

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
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm text-red-600 hover:underline"
      >
        Delete assignment
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleDelete}
        className="rounded bg-red-600 px-3 py-2 text-sm text-white"
      >
        Confirm delete
      </button>

      <button
        type="button"
        onClick={() => {
          setConfirming(false);
          setError(null);
        }}
        className="text-sm text-gray-600 hover:underline"
      >
        Cancel
      </button>

      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </div>
  );
}