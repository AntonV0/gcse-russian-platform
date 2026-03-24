"use client";

import { useState, useTransition } from "react";
import { reviewAssignmentSubmissionAction } from "@/app/actions/teacher-assignment-actions";

type TeacherSubmissionReviewFormProps = {
  submissionId: string;
  initialMark?: number | null;
  initialFeedback?: string | null;
};

export default function TeacherSubmissionReviewForm({
  submissionId,
  initialMark = null,
  initialFeedback = null,
}: TeacherSubmissionReviewFormProps) {
  const [mark, setMark] = useState(initialMark == null ? "" : String(initialMark));
  const [feedback, setFeedback] = useState(initialFeedback ?? "");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      const parsedMark =
        mark.trim() === "" ? null : Number.isNaN(Number(mark)) ? null : Number(mark);

      const result = await reviewAssignmentSubmissionAction({
        submissionId,
        mark: parsedMark,
        feedback: feedback.trim() || null,
      });

      setSaved(result.success);
    });
  }

  return (
    <div className="space-y-3 rounded border p-3">
      <div className="space-y-1">
        <label className="block text-sm font-medium">Mark</label>
        <input
          type="number"
          step="0.01"
          value={mark}
          onChange={(e) => setMark(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save review"}
      </button>

      {saved ? <p className="text-sm font-medium text-green-600">Review saved.</p> : null}
    </div>
  );
}
