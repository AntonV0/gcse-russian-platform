"use client";

import { useState, useTransition } from "react";
import { submitAssignmentAction } from "@/app/actions/assignment-actions";

type AssignmentSubmissionFormProps = {
  assignmentId: string;
  initialValue?: string;
};

export default function AssignmentSubmissionForm({
  assignmentId,
  initialValue = "",
}: AssignmentSubmissionFormProps) {
  const [value, setValue] = useState(initialValue);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitAssignmentAction({
        assignmentId,
        submittedText: value,
      });

      setSaved(result.success);
    });
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={6}
        className="w-full rounded border px-3 py-2"
        placeholder="Write your homework response here..."
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || !value.trim()}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit homework"}
      </button>

      {saved ? (
        <p className="text-sm font-medium text-green-600">Submitted successfully.</p>
      ) : null}
    </div>
  );
}