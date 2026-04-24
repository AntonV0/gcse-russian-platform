"use client";

import { useState, useTransition } from "react";
import { reviewAssignmentSubmissionAction } from "@/app/actions/teacher/teacher-assignment-actions";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Textarea from "@/components/ui/textarea";

type Props = {
  submissionId: string;
  initialMark?: number | null;
  initialFeedback?: string | null;
  initiallyOpen?: boolean;
};

export default function TeacherSubmissionReviewForm({
  submissionId,
  initialMark = null,
  initialFeedback = null,
  initiallyOpen = true,
}: Props) {
  const [mark, setMark] = useState(initialMark == null ? "" : String(initialMark));
  const [feedback, setFeedback] = useState(initialFeedback ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(initiallyOpen);

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
        setIsOpen(false);
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

  if (!isOpen) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setSaved(false);
            setError(null);
          }}
          variant="secondary"
          size="sm"
          icon="edit"
        >
          Edit review
        </Button>

        {saved ? (
          <FeedbackBanner tone="success" description="Review saved successfully." />
        ) : null}
      </div>
    );
  }

  return (
    <PanelCard
      title="Review submission"
      tone="default"
      density="compact"
      contentClassName="space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div />
        <Button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setSaved(false);
            setError(null);
          }}
          variant="quiet"
          size="sm"
        >
          Cancel
        </Button>
      </div>

      <FormField label="Mark">
        <Input
          type="number"
          step="0.01"
          value={mark}
          onChange={(e) => handleMarkChange(e.target.value)}
          placeholder="Optional"
        />
      </FormField>

      <FormField label="Feedback">
        <Textarea
          value={feedback}
          onChange={(e) => handleFeedbackChange(e.target.value)}
          rows={4}
          placeholder="Write feedback for the student..."
        />
      </FormField>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        variant="primary"
        className="w-full"
      >
        {isPending ? "Saving..." : "Save review"}
      </Button>

      {saved ? (
        <FeedbackBanner tone="success" description="Review saved successfully." />
      ) : null}

      {error ? <FeedbackBanner tone="danger" description={error} /> : null}
    </PanelCard>
  );
}
