import "server-only";

import type { DbMockExamQuestion, DbMockExamResponse } from "@/lib/mock-exams/types";
import { getOpenAiRequestTimeoutMs } from "@/lib/ai-marking/mock-exam-ai-marking-guards";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const AI_MARKING_PROMPT_VERSION = "mock-exam-ai-marking-v1";
export const AI_MARKING_RUBRIC_VERSION = "question-data-marking-metadata-v1";

export type AiMarkingInputKind = "typed_text" | "handwriting_image" | "audio" | "mixed";

export type AiMarkingOutput = {
  extractedText: string;
  transcriptionConfidence: "low" | "medium" | "high";
  suggestedMarks: number;
  maxMarks: number;
  band: string;
  confidence: "low" | "medium" | "high";
  rationale: string;
  evidence: string;
  strengths: string;
  targets: string;
  flags: string[];
  rawJson: Record<string, unknown>;
  models: {
    extractionModel: string | null;
    markingModel: string;
    transcriptionModel: string | null;
  };
};

type StoredResponseFile = {
  bucket: string;
  path: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

type ExtractionOutput = {
  extractedText: string;
  confidence: "low" | "medium" | "high";
  unreadableSegments: string[];
  notes: string;
};

type MarkingOutput = {
  suggestedMarks: number;
  band: string;
  confidence: "low" | "medium" | "high";
  rationale: string;
  evidence: string;
  strengths: string;
  targets: string;
  flags: string[];
  moderationRequired: boolean;
};

const writingQuestionTypes = new Set<DbMockExamQuestion["question_type"]>([
  "writing_task",
  "simple_sentences",
  "short_paragraph",
  "extended_writing",
  "translation_into_russian",
]);

const speakingQuestionTypes = new Set<DbMockExamQuestion["question_type"]>([
  "role_play",
  "photo_card",
  "conversation",
]);

const supportedImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function getOpenAiApiKey() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  return apiKey;
}

export function getAiMarkingModel() {
  return process.env.OPENAI_MARKING_MODEL || "gpt-5.4-mini";
}

export function getAiTranscriptionModel() {
  return process.env.OPENAI_TRANSCRIPTION_MODEL || "gpt-4o-mini-transcribe";
}

function getRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
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

function clampMarks(value: number, maxMarks: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), maxMarks);
}

function normalizeConfidence(value: unknown): "low" | "medium" | "high" {
  return value === "high" || value === "medium" || value === "low" ? value : "low";
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export function detectAiMarkingInputKind(response: DbMockExamResponse) {
  const file = getStoredFile(response.response_payload.file);
  const audio = getStoredFile(response.response_payload.audio);
  const typedDraft = getString(response.response_payload.typedDraft);
  const responseText = response.response_text ?? "";

  if (audio) return "audio" satisfies AiMarkingInputKind;
  if (file && (typedDraft || responseText)) return "mixed" satisfies AiMarkingInputKind;
  if (file) return "handwriting_image" satisfies AiMarkingInputKind;
  return "typed_text" satisfies AiMarkingInputKind;
}

async function downloadStoredFile(file: StoredResponseFile) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.storage.from(file.bucket).download(file.path);

  if (error || !data) {
    throw new Error(`Failed to download response file: ${error?.message ?? "unknown"}`);
  }

  return data;
}

async function toDataUrl(file: StoredResponseFile) {
  if (!supportedImageMimeTypes.has(file.mimeType)) {
    throw new Error(
      `AI handwriting marking currently supports JPEG, PNG, or WebP uploads. ${file.fileName} is ${file.mimeType}.`
    );
  }

  const blob = await downloadStoredFile(file);
  const bytes = Buffer.from(await blob.arrayBuffer());
  return `data:${file.mimeType};base64,${bytes.toString("base64")}`;
}

async function openAiJson(path: string, body: unknown) {
  let response: Response;

  try {
    response = await fetch(`https://api.openai.com/v1/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getOpenAiApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(getOpenAiRequestTimeoutMs()),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new Error("OpenAI request timed out");
    }

    throw error;
  }

  const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    const error = getRecord(json.error);
    const message =
      getString(error.message) || `OpenAI request failed: ${response.status}`;
    throw new Error(message);
  }

  return json;
}

function extractResponseText(response: Record<string, unknown>) {
  const direct = getString(response.output_text);
  if (direct) return direct;

  const output = Array.isArray(response.output) ? response.output : [];
  for (const item of output) {
    const record = getRecord(item);
    const content: unknown[] = Array.isArray(record.content) ? record.content : [];
    for (const contentItem of content) {
      const contentRecord = getRecord(contentItem);
      const text = getString(contentRecord.text);
      if (text) return text;
    }
  }

  throw new Error("OpenAI response did not include text output");
}

function parseJsonResponse<T>(response: Record<string, unknown>) {
  const text = extractResponseText(response);

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("OpenAI response was not valid JSON");
  }
}

function jsonSchemaFormat(name: string, schema: Record<string, unknown>) {
  return {
    format: {
      type: "json_schema",
      name,
      strict: true,
      schema,
    },
  };
}

function baseQuestionContext(question: DbMockExamQuestion) {
  const markingMetadata = getRecord(question.data.markingMetadata);

  return [
    `Question type: ${question.question_type}`,
    `Maximum marks: ${question.marks}`,
    `Prompt: ${question.prompt}`,
    `Question data JSON: ${JSON.stringify(question.data)}`,
    `Marking metadata JSON: ${JSON.stringify(markingMetadata)}`,
    "Use the stored rubric/marking metadata where present. If it is thin, apply a conservative GCSE Russian teacher-marking judgement for task fulfilment, communication, range, accuracy, and clarity.",
    "Return feedback in English. Cite short evidence from the student response. Do not claim to be an official Pearson examiner.",
  ].join("\n");
}

async function extractWritingFromImage(params: {
  question: DbMockExamQuestion;
  imageDataUrl: string;
}) {
  const model = getAiMarkingModel();
  const response = await openAiJson("responses", {
    model,
    store: false,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: "You transcribe GCSE Russian handwritten answers. Preserve Russian exactly where readable. Do not correct grammar. Mark uncertain text with [?].",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              "Extract the student's handwritten response for this task.",
              baseQuestionContext(params.question),
            ].join("\n\n"),
          },
          {
            type: "input_image",
            image_url: params.imageDataUrl,
            detail: "high",
          },
        ],
      },
    ],
    text: jsonSchemaFormat("writing_extraction", {
      type: "object",
      additionalProperties: false,
      properties: {
        extractedText: { type: "string" },
        confidence: { type: "string", enum: ["low", "medium", "high"] },
        unreadableSegments: { type: "array", items: { type: "string" } },
        notes: { type: "string" },
      },
      required: ["extractedText", "confidence", "unreadableSegments", "notes"],
    }),
  });
  const parsed = parseJsonResponse<ExtractionOutput>(response);

  return {
    extractedText: getString(parsed.extractedText),
    confidence: normalizeConfidence(parsed.confidence),
    unreadableSegments: normalizeStringArray(parsed.unreadableSegments),
    notes: getString(parsed.notes),
    rawResponse: response,
    model,
  };
}

async function markTranscript(params: {
  question: DbMockExamQuestion;
  transcript: string;
  sourceKind: AiMarkingInputKind;
  extractionConfidence: "low" | "medium" | "high";
  extractionNotes?: string[];
}) {
  const model = getAiMarkingModel();
  const response = await openAiJson("responses", {
    model,
    store: false,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: "You are a GCSE Russian AI marking assistant for teachers. Suggest marks conservatively, identify evidence, and flag uncertainty. The teacher's mark remains authoritative.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: [
              baseQuestionContext(params.question),
              `Response source: ${params.sourceKind}`,
              `Extraction/transcription confidence: ${params.extractionConfidence}`,
              params.extractionNotes?.length
                ? `Extraction/transcription notes: ${params.extractionNotes.join("; ")}`
                : "",
              "Student response transcript:",
              params.transcript || "[No readable response]",
              "Suggested marks must be between 0 and the maximum marks. Use half marks only when the rubric supports that granularity or the judgement is genuinely between bands.",
            ]
              .filter(Boolean)
              .join("\n\n"),
          },
        ],
      },
    ],
    text: jsonSchemaFormat("mock_exam_marking", {
      type: "object",
      additionalProperties: false,
      properties: {
        suggestedMarks: { type: "number" },
        band: { type: "string" },
        confidence: { type: "string", enum: ["low", "medium", "high"] },
        rationale: { type: "string" },
        evidence: { type: "string" },
        strengths: { type: "string" },
        targets: { type: "string" },
        flags: { type: "array", items: { type: "string" } },
        moderationRequired: { type: "boolean" },
      },
      required: [
        "suggestedMarks",
        "band",
        "confidence",
        "rationale",
        "evidence",
        "strengths",
        "targets",
        "flags",
        "moderationRequired",
      ],
    }),
  });
  const parsed = parseJsonResponse<MarkingOutput>(response);
  const flags = normalizeStringArray(parsed.flags);

  if (parsed.moderationRequired && !flags.includes("teacher_moderation_required")) {
    flags.push("teacher_moderation_required");
  }

  return {
    suggestedMarks: clampMarks(Number(parsed.suggestedMarks), params.question.marks),
    band: getString(parsed.band),
    confidence: normalizeConfidence(parsed.confidence),
    rationale: getString(parsed.rationale),
    evidence: getString(parsed.evidence),
    strengths: getString(parsed.strengths),
    targets: getString(parsed.targets),
    flags,
    rawResponse: response,
    model,
  };
}

async function transcribeAudio(response: DbMockExamResponse) {
  const audio = getStoredFile(response.response_payload.audio);

  if (!audio) {
    throw new Error("No audio response is available for AI speaking marking");
  }

  if (audio.sizeBytes > 25 * 1024 * 1024) {
    throw new Error("OpenAI transcription currently supports audio uploads up to 25 MB");
  }

  const blob = await downloadStoredFile(audio);
  const formData = new FormData();
  formData.append("model", getAiTranscriptionModel());
  formData.append("file", blob, audio.fileName);
  formData.append("response_format", "json");

  let openAiResponse: Response;

  try {
    openAiResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getOpenAiApiKey()}`,
      },
      body: formData,
      signal: AbortSignal.timeout(getOpenAiRequestTimeoutMs()),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new Error("OpenAI transcription timed out");
    }

    throw error;
  }
  const json = (await openAiResponse.json().catch(() => ({}))) as Record<string, unknown>;

  if (!openAiResponse.ok) {
    const error = getRecord(json.error);
    const message =
      getString(error.message) || `OpenAI transcription failed: ${openAiResponse.status}`;
    throw new Error(message);
  }

  return {
    transcript: getString(json.text),
    rawResponse: json,
    model: getAiTranscriptionModel(),
  };
}

export async function generateMockExamAiMarking(params: {
  question: DbMockExamQuestion;
  response: DbMockExamResponse;
}) {
  const inputKind = detectAiMarkingInputKind(params.response);

  if (
    !writingQuestionTypes.has(params.question.question_type) &&
    !speakingQuestionTypes.has(params.question.question_type)
  ) {
    throw new Error("AI marking is only available for writing and speaking questions");
  }

  let extractedText = "";
  let transcriptionConfidence: "low" | "medium" | "high" = "high";
  let extractionModel: string | null = null;
  let transcriptionModel: string | null = null;
  const extractionNotes: string[] = [];
  const rawJson: Record<string, unknown> = {};

  if (inputKind === "audio") {
    const transcription = await transcribeAudio(params.response);
    extractedText = transcription.transcript;
    transcriptionModel = transcription.model;
    transcriptionConfidence = extractedText ? "medium" : "low";
    rawJson.transcription = transcription.rawResponse;
    extractionNotes.push(
      "Audio was marked from transcript; pronunciation and intonation are not fully assessed in this version."
    );
  } else {
    const file = getStoredFile(params.response.response_payload.file);
    const typedDraft = getString(params.response.response_payload.typedDraft);
    const responseText = params.response.response_text ?? "";

    if (file) {
      const extraction = await extractWritingFromImage({
        question: params.question,
        imageDataUrl: await toDataUrl(file),
      });
      extractedText = extraction.extractedText;
      transcriptionConfidence = extraction.confidence;
      extractionModel = extraction.model;
      rawJson.extraction = extraction.rawResponse;
      if (extraction.notes) extractionNotes.push(extraction.notes);
      extraction.unreadableSegments.forEach((segment) =>
        extractionNotes.push(`Unreadable: ${segment}`)
      );
    }

    if (typedDraft) {
      extractedText = [extractedText, `Typed draft:\n${typedDraft}`]
        .filter(Boolean)
        .join("\n\n");
    } else if (!extractedText && responseText) {
      extractedText = responseText;
    }
  }

  if (!extractedText.trim()) {
    throw new Error("No readable response text was available for AI marking");
  }

  const marking = await markTranscript({
    question: params.question,
    transcript: extractedText,
    sourceKind: inputKind,
    extractionConfidence: transcriptionConfidence,
    extractionNotes,
  });
  rawJson.marking = marking.rawResponse;

  return {
    extractedText,
    transcriptionConfidence,
    suggestedMarks: marking.suggestedMarks,
    maxMarks: params.question.marks,
    band: marking.band,
    confidence: transcriptionConfidence === "low" ? "low" : marking.confidence,
    rationale: marking.rationale,
    evidence: marking.evidence,
    strengths: marking.strengths,
    targets: marking.targets,
    flags:
      transcriptionConfidence === "low"
        ? [...marking.flags, "low_extraction_confidence"]
        : marking.flags,
    rawJson,
    models: {
      extractionModel,
      markingModel: marking.model,
      transcriptionModel,
    },
  } satisfies AiMarkingOutput;
}
