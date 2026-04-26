import AudioPlayer from "@/components/questions/audio-player";
import Badge from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import type { DbMockExamResponse } from "@/lib/mock-exams/mock-exam-helpers-db";

type StoredResponseFile = {
  bucket: string;
  path: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

type MockExamResponseSummaryProps = {
  response?: DbMockExamResponse;
};

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getStoredFile(value: unknown): StoredResponseFile | null {
  const record = getRecord(value);

  if (
    typeof record.bucket === "string" &&
    typeof record.path === "string" &&
    typeof record.fileName === "string" &&
    typeof record.mimeType === "string" &&
    typeof record.sizeBytes === "number"
  ) {
    return record as StoredResponseFile;
  }

  return null;
}

async function getSignedUrl(file: StoredResponseFile | null) {
  if (!file) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(file.bucket)
    .createSignedUrl(file.path, 60 * 10);

  if (error) {
    console.error("Error creating mock exam response signed URL:", {
      path: file.path,
      error,
    });
    return null;
  }

  return data.signedUrl;
}

export default async function MockExamResponseSummary({
  response,
}: MockExamResponseSummaryProps) {
  if (!response) {
    return <p className="text-sm text-[var(--text-secondary)]">No response saved.</p>;
  }

  const payload = response.response_payload;
  const file = getStoredFile(payload.file);
  const audio = getStoredFile(payload.audio);
  const [fileUrl, audioUrl] = await Promise.all([
    getSignedUrl(file),
    getSignedUrl(audio),
  ]);

  const typedDraft = getString(payload.typedDraft);
  const planningNotes = getString(payload.planningNotes);
  const prepNotes = getString(payload.prepNotes);
  const hasStructuredResponse = Boolean(
    file || audio || typedDraft || planningNotes || prepNotes
  );

  if (!hasStructuredResponse) {
    if (response.response_text) {
      return (
        <pre className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
          {response.response_text}
        </pre>
      );
    }

    if (Object.keys(payload).length === 0) {
      return <p className="text-sm text-[var(--text-secondary)]">No response saved.</p>;
    }

    return (
      <pre className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
        {JSON.stringify(payload, null, 2)}
      </pre>
    );
  }

  return (
    <div className="space-y-4">
      {planningNotes ? (
        <div>
          <Badge tone="muted">Planning notes</Badge>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
            {planningNotes}
          </p>
        </div>
      ) : null}

      {typedDraft ? (
        <div>
          <Badge tone="muted">Typed draft</Badge>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
            {typedDraft}
          </p>
        </div>
      ) : null}

      {prepNotes ? (
        <div>
          <Badge tone="muted">Prep notes</Badge>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
            {prepNotes}
          </p>
        </div>
      ) : null}

      {file ? (
        <div>
          <Badge tone="info">Uploaded work</Badge>
          {fileUrl ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm font-medium app-brand-text"
            >
              {file.fileName}
            </a>
          ) : (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{file.fileName}</p>
          )}
        </div>
      ) : null}

      {audio ? (
        <div>
          <Badge tone="info">Audio response</Badge>
          {audioUrl ? (
            <div className="mt-2">
              <AudioPlayer src={audioUrl} />
            </div>
          ) : (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{audio.fileName}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
