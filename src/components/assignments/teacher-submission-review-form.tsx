"use client";

import { useState, useTransition } from "react";
import { reviewAssignmentSubmissionAction } from "@/app/actions/teacher-assignment-actions";

type Props = {
  submissionId: string;
  initialMark?: number | null;
  initialFeedback?: string | null;
};

export default function TeacherSubmissionReviewForm({
  submissionId,
  initialMark = null,
  initialFeedback = null,
}: Props) {
  const [mark, setMark] = useState(initialMark == null ? "" : String(initialMark));
  const [feedback, setFeedback] = useState(initialFeedback ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);

    startTransition(async () => {
      const parsedMark =
        mark.trim() === "" ? null : Number.isNaN(Number(mark)) ? null : Number(mark);

      const result = await reviewAssignmentSubmissionAction({
        submissionId,
        mark: parsedMark,
        feedback: feedback.trim() || null,
      });

      if (result.success) {
        setSaved(true);
      } else {
        setSaved(false);
        setError("Review could not be saved.");
      }
    });
  }

  function handleMarkChange(value: string) {
    setMark(value);
    setSaved(false);
    setError(null);
  }

  function handleFeedbackChange(value: string) {
    setFeedback(value);
    setSaved(false);
    setError(null);
  }

  return (
    <div className="space-y-3 rounded border bg-white p-4">
      <p className="text-sm font-medium">Review submission</p>

      <div className="space-y-1">
        <label className="text-sm font-medium">Mark</label>
        <input
          type="number"
          step="0.01"
          value={mark}
          onChange={(e) => handleMarkChange(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="Optional"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => handleFeedbackChange(e.target.value)}
          rows={4}
          className="w-full rounded border px-3 py-2"
          placeholder="Write feedback for the student..."
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save review"}
      </button>

      {saved ? (
        <p className="text-sm font-medium text-green-600">Review saved successfully.</p>
      ) : null}

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
