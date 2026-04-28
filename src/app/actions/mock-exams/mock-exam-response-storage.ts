import type { DbMockExamResponse } from "@/lib/mock-exams/types";
import { createClient } from "@/lib/supabase/server";

export type StoredMockExamResponseFile = {
  bucket: "mock-exam-responses";
  path: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

function getRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function parseAudioDataUrl(value: string) {
  const match = value.match(/^data:(audio\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    bytes: Buffer.from(match[2], "base64"),
  };
}

function extensionForMimeType(mimeType: string) {
  if (mimeType.includes("mpeg")) return "mp3";
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4")) return "m4a";
  return "webm";
}

export function isUsableFile(value: unknown): value is File {
  return value instanceof File && value.size > 0;
}

export function getExistingStoredFile(
  response: DbMockExamResponse | undefined,
  key: "file" | "audio"
) {
  const value = response?.response_payload[key];
  const record = getRecord(value);

  if (
    record.bucket === "mock-exam-responses" &&
    typeof record.path === "string" &&
    typeof record.fileName === "string" &&
    typeof record.mimeType === "string" &&
    typeof record.sizeBytes === "number"
  ) {
    return record as StoredMockExamResponseFile;
  }

  return null;
}

export async function uploadMockExamResponseFile(params: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  attemptId: string;
  questionId: string;
  userId: string;
  file: File;
  prefix: "writing" | "speaking";
}) {
  const safeFileName = sanitizeFileName(params.file.name || `${params.prefix}-response`);
  const path = [
    params.attemptId,
    params.userId,
    params.questionId,
    `${Date.now()}-${safeFileName}`,
  ].join("/");

  const { error } = await params.supabase.storage
    .from("mock-exam-responses")
    .upload(path, params.file, {
      contentType: params.file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading mock exam response file:", {
      attemptId: params.attemptId,
      questionId: params.questionId,
      error,
    });
    throw new Error(`Failed to upload response file: ${error.message}`);
  }

  return {
    bucket: "mock-exam-responses",
    path,
    fileName: params.file.name || safeFileName,
    mimeType: params.file.type || "application/octet-stream",
    sizeBytes: params.file.size,
  } satisfies StoredMockExamResponseFile;
}

export async function uploadMockExamAudioDataUrl(params: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  attemptId: string;
  questionId: string;
  userId: string;
  dataUrl: string;
}) {
  const parsed = parseAudioDataUrl(params.dataUrl);

  if (!parsed) {
    return null;
  }

  const extension = extensionForMimeType(parsed.mimeType);
  const fileName = `recording-${Date.now()}.${extension}`;
  const path = [params.attemptId, params.userId, params.questionId, fileName].join("/");

  const { error } = await params.supabase.storage
    .from("mock-exam-responses")
    .upload(path, parsed.bytes, {
      contentType: parsed.mimeType,
      upsert: false,
    });

  if (error) {
    console.error("Error uploading mock exam audio recording:", {
      attemptId: params.attemptId,
      questionId: params.questionId,
      error,
    });
    throw new Error(`Failed to upload audio recording: ${error.message}`);
  }

  return {
    bucket: "mock-exam-responses",
    path,
    fileName,
    mimeType: parsed.mimeType,
    sizeBytes: parsed.bytes.byteLength,
  } satisfies StoredMockExamResponseFile;
}
