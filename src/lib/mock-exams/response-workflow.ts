import type { ResponseWorkflowMetadata } from "@/lib/questions/task-metadata";
import type {
  DbMockExamQuestion,
  DbMockExamResponse,
  MockExamQuestionType,
} from "@/lib/mock-exams/types";

type ResponseWorkflowKind =
  | "choice"
  | "multi_choice"
  | "matching"
  | "sequencing"
  | "statement_select"
  | "field_text"
  | "writing"
  | "speaking"
  | "text";

export type MockExamResponseWorkflow = {
  kind: ResponseWorkflowKind;
  responseMode: ResponseWorkflowMetadata["responseMode"];
  answerFieldNames: string[];
  auxiliaryFieldNames: string[];
  answerPayloadKeys: string[];
  auxiliaryPayloadKeys: string[];
  supportsTypedDraft: boolean;
  supportsUpload: boolean;
  supportsAudioRecording: boolean;
  autoMarkable: boolean;
  teacherMarked: boolean;
};

const autoMarkableQuestionTypes = new Set<MockExamQuestionType>([
  "multiple_choice",
  "multiple_response",
  "matching",
  "sequencing",
  "opinion_recognition",
  "true_false_not_mentioned",
  "gap_fill",
  "note_completion",
  "short_answer",
  "sentence_builder",
]);

const writingQuestionTypes = new Set<MockExamQuestionType>([
  "writing_task",
  "simple_sentences",
  "short_paragraph",
  "extended_writing",
  "translation_into_russian",
]);

const speakingQuestionTypes = new Set<MockExamQuestionType>([
  "role_play",
  "photo_card",
  "conversation",
]);

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function getRecordArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, unknown> =>
      Boolean(item) && typeof item === "object" && !Array.isArray(item)
  );
}

function getWorkflowMetadata(question: DbMockExamQuestion) {
  const workflow = question.data.responseWorkflow;

  return workflow && typeof workflow === "object" && !Array.isArray(workflow)
    ? (workflow as Partial<ResponseWorkflowMetadata>)
    : {};
}

function getBoolean(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function getResponseMode(
  question: DbMockExamQuestion,
  fallback: ResponseWorkflowMetadata["responseMode"]
) {
  const workflow = getWorkflowMetadata(question);
  return typeof workflow.responseMode === "string"
    ? workflow.responseMode
    : fallback;
}

function getAnswerEvidenceFromPayload(payload: Record<string, unknown>, keys: string[]) {
  return keys.some((key) => {
    const value = payload[key];

    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") return Object.keys(value).length > 0;

    return value !== null && value !== undefined;
  });
}

function getWritingWorkflow(question: DbMockExamQuestion): MockExamResponseWorkflow {
  const workflow = getWorkflowMetadata(question);
  const responseMode = getResponseMode(question, "handwriting_upload");
  const supportsTypedDraft = getBoolean(workflow.allowTypedDraft) ?? true;
  const supportsUpload =
    getBoolean(workflow.uploadRequired) ??
    (responseMode === "handwriting_upload" ||
      question.question_type !== "simple_sentences");
  const answerFieldNames = [
    ...(supportsTypedDraft ? [`response_draft_${question.id}`] : []),
    ...(supportsUpload ? [`response_file_${question.id}`] : []),
  ];
  const answerPayloadKeys = [
    ...(supportsTypedDraft ? ["typedDraft"] : []),
    ...(supportsUpload ? ["file"] : []),
  ];

  return {
    kind: "writing",
    responseMode,
    answerFieldNames,
    auxiliaryFieldNames: [`response_planning_notes_${question.id}`],
    answerPayloadKeys,
    auxiliaryPayloadKeys: ["planningNotes", "responseMode"],
    supportsTypedDraft,
    supportsUpload,
    supportsAudioRecording: false,
    autoMarkable: false,
    teacherMarked: true,
  };
}

function getSpeakingWorkflow(question: DbMockExamQuestion): MockExamResponseWorkflow {
  const workflow = getWorkflowMetadata(question);
  const responseMode = getResponseMode(question, "audio_recording");
  const supportsTypedDraft = getBoolean(workflow.allowTypedDraft) ?? false;
  const supportsAudioRecording = getBoolean(workflow.allowAudioRecording) ?? true;

  return {
    kind: "speaking",
    responseMode,
    answerFieldNames: [
      ...(supportsTypedDraft ? [`response_draft_${question.id}`] : []),
      ...(supportsAudioRecording
        ? [
            `response_audio_data_${question.id}`,
            `response_audio_file_${question.id}`,
          ]
        : []),
    ],
    auxiliaryFieldNames: [`response_prep_notes_${question.id}`],
    answerPayloadKeys: [
      ...(supportsTypedDraft ? ["typedDraft"] : []),
      ...(supportsAudioRecording ? ["audio"] : []),
    ],
    auxiliaryPayloadKeys: ["prepNotes", "responseMode"],
    supportsTypedDraft,
    supportsUpload: false,
    supportsAudioRecording,
    autoMarkable: false,
    teacherMarked: true,
  };
}

export function getMockExamResponseWorkflow(
  question: DbMockExamQuestion
): MockExamResponseWorkflow {
  switch (question.question_type) {
    case "multiple_choice":
      return {
        kind: "choice",
        responseMode: "objective",
        answerFieldNames: [`response_choice_${question.id}`],
        auxiliaryFieldNames: [],
        answerPayloadKeys: ["selectedOption"],
        auxiliaryPayloadKeys: [],
        supportsTypedDraft: false,
        supportsUpload: false,
        supportsAudioRecording: false,
        autoMarkable: true,
        teacherMarked: false,
      };

    case "multiple_response":
      return {
        kind: "multi_choice",
        responseMode: "objective",
        answerFieldNames: [`response_choices_${question.id}`],
        auxiliaryFieldNames: [],
        answerPayloadKeys: ["selectedOptions"],
        auxiliaryPayloadKeys: [],
        supportsTypedDraft: false,
        supportsUpload: false,
        supportsAudioRecording: false,
        autoMarkable: true,
        teacherMarked: false,
      };

    case "matching":
      return {
        kind: "matching",
        responseMode: "objective",
        answerFieldNames: getStringArray(question.data.prompts).map(
          (_, index) => `response_match_${question.id}_${index}`
        ),
        auxiliaryFieldNames: [],
        answerPayloadKeys: getStringArray(question.data.prompts).map(
          (_, index) => `match_${index}`
        ),
        auxiliaryPayloadKeys: [],
        supportsTypedDraft: false,
        supportsUpload: false,
        supportsAudioRecording: false,
        autoMarkable: true,
        teacherMarked: false,
      };

    case "sequencing": {
      const items = getStringArray(question.data.items);

      return {
        kind: "sequencing",
        responseMode: "objective",
        answerFieldNames:
          items.length > 0
            ? items.map((_, index) => `response_order_${question.id}_${index}`)
            : [`response_order_${question.id}`],
        auxiliaryFieldNames: [],
        answerPayloadKeys: ["order", "orderText"],
        auxiliaryPayloadKeys: [],
        supportsTypedDraft: false,
        supportsUpload: false,
        supportsAudioRecording: false,
        autoMarkable: true,
        teacherMarked: false,
      };
    }

    case "opinion_recognition":
    case "true_false_not_mentioned":
      return {
        kind: "statement_select",
        responseMode: "objective",
        answerFieldNames: getStringArray(question.data.statements).map(
          (_, index) => `response_statement_${question.id}_${index}`
        ),
        auxiliaryFieldNames: [],
        answerPayloadKeys: getStringArray(question.data.statements).map(
          (_, index) => `statement_${index}`
        ),
        auxiliaryPayloadKeys: [],
        supportsTypedDraft: false,
        supportsUpload: false,
        supportsAudioRecording: false,
        autoMarkable: true,
        teacherMarked: false,
      };

    case "gap_fill":
    case "note_completion": {
      const fields =
        question.question_type === "gap_fill"
          ? getRecordArray(question.data.gaps)
          : getRecordArray(question.data.fields);

      return {
        kind: "field_text",
        responseMode: "short_text",
        answerFieldNames: fields.map(
          (_, index) => `response_field_${question.id}_${index}`
        ),
        auxiliaryFieldNames: [],
        answerPayloadKeys: fields.map((_, index) => `field_${index}`),
        auxiliaryPayloadKeys: [],
        supportsTypedDraft: false,
        supportsUpload: false,
        supportsAudioRecording: false,
        autoMarkable: true,
        teacherMarked: false,
      };
    }

    default:
      if (writingQuestionTypes.has(question.question_type)) {
        return getWritingWorkflow(question);
      }

      if (speakingQuestionTypes.has(question.question_type)) {
        return getSpeakingWorkflow(question);
      }

      return {
        kind: "text",
        responseMode: "short_text",
        answerFieldNames: [`response_text_${question.id}`],
        auxiliaryFieldNames: [],
        answerPayloadKeys: [],
        auxiliaryPayloadKeys: [],
        supportsTypedDraft: false,
        supportsUpload: false,
        supportsAudioRecording: false,
        autoMarkable: autoMarkableQuestionTypes.has(question.question_type),
        teacherMarked: !autoMarkableQuestionTypes.has(question.question_type),
      };
  }
}

export function getMockExamAnswerFieldNames(question: DbMockExamQuestion) {
  return getMockExamResponseWorkflow(question).answerFieldNames;
}

export function isMockExamQuestionAutoMarkable(question: DbMockExamQuestion) {
  return getMockExamResponseWorkflow(question).autoMarkable;
}

export function hasMockExamResponseAnswerEvidence(response?: DbMockExamResponse) {
  if (!response) return false;

  const payload = response.response_payload;
  const responseMode =
    typeof payload.responseMode === "string"
      ? (payload.responseMode as ResponseWorkflowMetadata["responseMode"])
      : null;
  const answerKeys =
    responseMode === "audio_recording"
      ? ["typedDraft", "audio"]
      : responseMode === "handwriting_upload" || responseMode === "tile_builder"
        ? ["typedDraft", "file"]
        : Object.keys(payload).filter(
            (key) => !["planningNotes", "prepNotes", "responseMode"].includes(key)
          );

  if (getAnswerEvidenceFromPayload(payload, answerKeys)) return true;

  const responseText = response.response_text?.trim();
  if (!responseText) return false;

  const planningNotes =
    typeof payload.planningNotes === "string" ? payload.planningNotes.trim() : "";
  const prepNotes = typeof payload.prepNotes === "string" ? payload.prepNotes.trim() : "";

  return responseText !== planningNotes && responseText !== prepNotes;
}
