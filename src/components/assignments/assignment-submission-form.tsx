"use client";

import { useMemo, useState, useTransition } from "react";
import { submitAssignmentAction } from "@/app/actions/assignment-actions";
import { createClient } from "@/lib/supabase/client";

type AssignmentSubmissionFormProps = {
  assignmentId: string;
  initialValue?: string;
  initialFilePath?: string | null;
  initialFileName?: string | null;
  allowFileUpload?: boolean;
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
        setUploadError("Submission could not be saved.");
      }
    });
  }

  const canSubmit =
    value.trim().length > 0 || (allowFileUpload && (selectedFile || uploadedFilePath));

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        rows={6}
        className="w-full rounded border px-3 py-2"
        placeholder="Write your homework response here..."
      />

      {allowFileUpload ? (
        <div className="space-y-2 rounded border p-3">
          <label className="block text-sm font-medium">Upload written work</label>

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.webp"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setSelectedFile(file);
              setSaved(false);
              setUploadError(null);
            }}
            className="block w-full text-sm"
          />

          {selectedFile ? (
            <p className="text-sm text-gray-700">
              Selected file: {selectedFile.name}
            </p>
          ) : null}

          {!selectedFile && uploadedFileName ? (
            <p className="text-sm text-gray-700">
              Existing uploaded file: {uploadedFileName}
            </p>
          ) : null}

          <p className="text-xs text-gray-500">
            Accepted formats: JPG, PNG, WEBP, PDF
          </p>
        </div>
      ) : null}

      {uploadError ? (
        <p className="text-sm font-medium text-red-600">{uploadError}</p>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || !canSubmit}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Submitting..." : initialValue || initialFilePath ? "Update submission" : "Submit homework"}
      </button>

      {saved ? (
        <p className="text-sm font-medium text-green-600">
          Submission saved successfully.
        </p>
      ) : null}
    </div>
  );
}