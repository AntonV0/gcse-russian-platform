"use client";

import { useMemo, useState, useTransition } from "react";
import { submitAssignmentAction } from "@/app/actions/assignments/assignment-actions";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import PanelCard from "@/components/ui/panel-card";
import Textarea from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

type AssignmentSubmissionFormProps = {
  assignmentId: string;
  initialValue?: string;
  initialFilePath?: string | null;
  initialFileName?: string | null;
  allowFileUpload?: boolean;
  status?: "not_started" | "submitted" | "reviewed";
  mark?: number | null;
  feedback?: string | null;
};

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

export default function AssignmentSubmissionForm({
  assignmentId,
  initialValue = "",
  initialFilePath = null,
  initialFileName = null,
  allowFileUpload = false,
  status = "not_started",
  mark = null,
  feedback = null,
}: AssignmentSubmissionFormProps) {
  const [value, setValue] = useState(initialValue);
  const [saved, setSaved] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(
    initialFilePath
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(
    initialFileName
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const supabase = useMemo(() => createClient(), []);
  const isLocked = status === "reviewed";
  const hasExistingSubmission = Boolean(initialValue || initialFilePath);
  const hasUnsavedTextChange = value !== initialValue;
  const hasUnsavedFileChange = Boolean(selectedFile);
  const hasUnsavedChanges = hasUnsavedTextChange || hasUnsavedFileChange;
  const wordCount = countWords(value);
  const characterCount = value.length;

  async function uploadSelectedFile() {
    if (!selectedFile) {
      return {
        success: true as const,
        filePath: uploadedFilePath,
        fileName: uploadedFileName,
      };
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false as const, error: "You must be signed in." };
    }

    const safeFileName = sanitizeFileName(selectedFile.name);
    const filePath = `${assignmentId}/${user.id}/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("assignment-submissions")
      .upload(filePath, selectedFile, {
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading assignment file:", uploadError);
      return {
        success: false as const,
        error: "File upload failed. Please try again.",
      };
    }

    return {
      success: true as const,
      filePath,
      fileName: selectedFile.name,
    };
  }

  function handleSubmit() {
    setUploadError(null);

    startTransition(async () => {
      const uploadResult = await uploadSelectedFile();

      if (!uploadResult.success) {
        setUploadError(uploadResult.error);
        return;
      }

      const result = await submitAssignmentAction({
        assignmentId,
        submittedText: value,
        submittedFilePath: uploadResult.filePath ?? null,
        submittedFileName: uploadResult.fileName ?? null,
      });

      if (result.success) {
        setUploadedFilePath(uploadResult.filePath ?? null);
        setUploadedFileName(uploadResult.fileName ?? null);
        setSelectedFile(null);
        setSaved(true);
      } else {
        setSaved(false);

        if (result.error === "already_reviewed") {
          setUploadError("This assignment has already been reviewed and is locked.");
        } else {
          setUploadError("Submission could not be saved.");
        }
      }
    });
  }

  const canSubmit =
    value.trim().length > 0 || (allowFileUpload && (selectedFile || uploadedFilePath));

  return (
    <PanelCard
      title={isLocked ? "Submitted homework" : "Submit homework"}
      description={
        isLocked
          ? "Reviewed by your teacher. This response is locked."
          : hasExistingSubmission
            ? "Your latest submission is saved. Resubmit here until your teacher reviews it."
            : "Save your written response and any allowed attachment here."
      }
      tone="student"
      density="compact"
      contentClassName="space-y-4"
    >
      {isLocked ? (
        <FeedbackBanner
          tone="warning"
          title="Reviewed response"
          description="This assignment has been reviewed and can no longer be edited."
        />
      ) : null}

      {!isLocked && hasExistingSubmission && hasUnsavedChanges ? (
        <FeedbackBanner
          tone="info"
          description="You have unsaved changes. Save again before leaving this assignment."
        />
      ) : null}

      <FormField label="Homework response">
        <Textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
          disabled={isLocked}
          rows={6}
          placeholder="Write your homework response here..."
        />
      </FormField>

      <div className="flex flex-wrap gap-2">
        <Badge tone={wordCount > 0 ? "info" : "muted"} icon="text">
          {wordCount} word{wordCount === 1 ? "" : "s"}
        </Badge>
        <Badge tone="muted" icon="write">
          {characterCount} character{characterCount === 1 ? "" : "s"}
        </Badge>
        {uploadedFileName ? (
          <Badge tone="success" icon="file">
            File saved
          </Badge>
        ) : null}
        {selectedFile ? (
          <Badge tone="warning" icon="upload">
            New file selected
          </Badge>
        ) : null}
      </div>

      {isLocked && (mark !== null || feedback) ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4 text-sm">
          <p className="mb-1 font-medium text-[var(--text-primary)]">Teacher feedback</p>

          {mark !== null ? <p className="mb-1">Mark: {mark}</p> : null}

          {feedback ? (
            <p className="text-[var(--text-secondary)]">{feedback}</p>
          ) : (
            <p className="app-text-muted">No feedback provided.</p>
          )}
        </div>
      ) : null}

      {allowFileUpload ? (
        <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
          <label className="block text-sm font-medium text-[var(--text-primary)]">
            Upload written work
          </label>

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.webp"
            disabled={isLocked}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setSelectedFile(file);
              setSaved(false);
              setUploadError(null);
            }}
            className="app-file-input"
          />

          {selectedFile ? (
            <p className="text-sm text-[var(--text-secondary)]">
              Selected file: {selectedFile.name}
            </p>
          ) : null}

          {!selectedFile && uploadedFileName ? (
            <p className="text-sm text-[var(--text-secondary)]">
              Existing uploaded file: {uploadedFileName}
            </p>
          ) : null}

          <p className="text-xs app-text-soft">Accepted formats: JPG, PNG, WEBP, PDF</p>
        </div>
      ) : null}

      {uploadError ? <FeedbackBanner tone="danger" description={uploadError} /> : null}

      <div className="app-mobile-action-stack flex">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !canSubmit || isLocked}
          variant="primary"
          icon={hasExistingSubmission ? "save" : "submitted"}
        >
          {isPending
            ? "Saving..."
            : hasExistingSubmission
              ? "Save changes"
              : "Submit homework"}
        </Button>
      </div>

      {saved ? (
        <FeedbackBanner tone="success" description="Submission saved successfully." />
      ) : null}
    </PanelCard>
  );
}
