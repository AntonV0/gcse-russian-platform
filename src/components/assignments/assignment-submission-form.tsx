"use client";

import { useMemo, useState, useTransition } from "react";
import { submitAssignmentAction } from "@/app/actions/assignments/assignment-actions";
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
    <div className="space-y-3 rounded-lg border p-4">
      {isLocked ? (
        <div className="rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          This assignment has been reviewed and can no longer be edited.
        </div>
      ) : null}

      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        disabled={isLocked}
        rows={6}
        className="w-full rounded border px-3 py-2 disabled:bg-gray-100 disabled:text-gray-600"
        placeholder="Write your homework response here..."
      />

      {isLocked && (mark !== null || feedback) ? (
        <div className="rounded border bg-gray-50 p-3 text-sm">
          <p className="mb-1 font-medium">Teacher feedback</p>

          {mark !== null ? <p className="mb-1">Mark: {mark}</p> : null}

          {feedback ? (
            <p className="text-gray-700">{feedback}</p>
          ) : (
            <p className="text-gray-600">No feedback provided.</p>
          )}
        </div>
      ) : null}

      {allowFileUpload ? (
        <div className="space-y-2 rounded border p-3">
          <label className="block text-sm font-medium">Upload written work</label>

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
            className="block w-full text-sm disabled:opacity-50"
          />

          {selectedFile ? (
            <p className="text-sm text-gray-700">Selected file: {selectedFile.name}</p>
          ) : null}

          {!selectedFile && uploadedFileName ? (
            <p className="text-sm text-gray-700">
              Existing uploaded file: {uploadedFileName}
            </p>
          ) : null}

          <p className="text-xs text-gray-500">Accepted formats: JPG, PNG, WEBP, PDF</p>
        </div>
      ) : null}

      {uploadError ? (
        <p className="text-sm font-medium text-red-600">{uploadError}</p>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || !canSubmit || isLocked}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending
          ? "Submitting..."
          : initialValue || initialFilePath
            ? "Update submission"
            : "Submit homework"}
      </button>

      {saved ? (
        <p className="text-sm font-medium text-green-600">
          Submission saved successfully.
        </p>
      ) : null}
    </div>
  );
}
