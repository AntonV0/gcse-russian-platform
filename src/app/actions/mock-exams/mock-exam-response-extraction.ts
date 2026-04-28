import { getTrimmedString } from "@/app/actions/shared/form-data";
import type { DbMockExamQuestion, DbMockExamResponse } from "@/lib/mock-exams/types";
import { createClient } from "@/lib/supabase/server";
import {
  getExistingStoredFile,
  isUsableFile,
  uploadMockExamAudioDataUrl,
  uploadMockExamResponseFile,
} from "@/app/actions/mock-exams/mock-exam-response-storage";

export type ExtractedResponse = {
  responseText: string | null;
  responsePayload: Record<string, unknown>;
};

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

function parseIndexList(value: string) {
  return value
    .split(",")
    .map((item) => Number(item.trim()) - 1)
    .filter((item) => Number.isInteger(item) && item >= 0);
}

function parseSequencingSelects(question: DbMockExamQuestion, formData: FormData) {
  const items = getStringArray(question.data.items);
  if (items.length === 0) return [];

  return items
    .map((_, index) =>
      Number(getTrimmedString(formData, `response_order_${question.id}_${index}`))
    )
    .filter((item) => Number.isInteger(item) && item >= 0);
}

const writingResponseTypes = new Set<DbMockExamQuestion["question_type"]>([
  "writing_task",
  "simple_sentences",
  "short_paragraph",
  "extended_writing",
  "translation_into_russian",
]);

const speakingResponseTypes = new Set<DbMockExamQuestion["question_type"]>([
  "role_play",
  "photo_card",
  "conversation",
]);

export async function extractQuestionResponse(
  question: DbMockExamQuestion,
  formData: FormData,
  params: {
    attemptId: string;
    userId: string;
    supabase: Awaited<ReturnType<typeof createClient>>;
    existingResponse?: DbMockExamResponse;
  }
): Promise<ExtractedResponse> {
  switch (question.question_type) {
    case "multiple_choice": {
      const selectedOption = getTrimmedString(formData, `response_choice_${question.id}`);

      return {
        responseText: selectedOption ? `Option ${Number(selectedOption) + 1}` : null,
        responsePayload: { selectedOption },
      };
    }

    case "multiple_response": {
      const selectedOptions = formData
        .getAll(`response_choices_${question.id}`)
        .map((value) => String(value));

      return {
        responseText:
          selectedOptions.length > 0
            ? selectedOptions.map((value) => `Option ${Number(value) + 1}`).join(", ")
            : null,
        responsePayload: { selectedOptions },
      };
    }

    case "matching": {
      const prompts = getStringArray(question.data.prompts);
      const responsePayload: Record<string, unknown> = {};
      const responseParts: string[] = [];

      prompts.forEach((prompt, index) => {
        const value = getTrimmedString(
          formData,
          `response_match_${question.id}_${index}`
        );
        responsePayload[`match_${index}`] = value;
        if (value) responseParts.push(`${prompt}: ${Number(value) + 1}`);
      });

      return {
        responseText: responseParts.join("; ") || null,
        responsePayload,
      };
    }

    case "sequencing": {
      const selectedOrder = parseSequencingSelects(question, formData);
      const legacyOrderText = getTrimmedString(formData, `response_order_${question.id}`);
      const order =
        selectedOrder.length > 0 ? selectedOrder : parseIndexList(legacyOrderText);
      const orderText =
        order.length > 0
          ? order.map((item) => String(item + 1)).join(", ")
          : legacyOrderText;

      return {
        responseText: orderText || null,
        responsePayload: {
          orderText,
          order,
        },
      };
    }

    case "opinion_recognition":
    case "true_false_not_mentioned": {
      const statements = getStringArray(question.data.statements);
      const responsePayload: Record<string, unknown> = {};
      const responseParts: string[] = [];

      statements.forEach((statement, index) => {
        const value = getTrimmedString(
          formData,
          `response_statement_${question.id}_${index}`
        );
        responsePayload[`statement_${index}`] = value;
        if (value) responseParts.push(`${statement}: ${value}`);
      });

      return {
        responseText: responseParts.join("; ") || null,
        responsePayload,
      };
    }

    case "gap_fill":
    case "note_completion": {
      const fields =
        question.question_type === "gap_fill"
          ? getRecordArray(question.data.gaps)
          : getRecordArray(question.data.fields);
      const responsePayload: Record<string, unknown> = {};
      const responseParts: string[] = [];

      fields.forEach((field, index) => {
        const value = getTrimmedString(
          formData,
          `response_field_${question.id}_${index}`
        );
        responsePayload[`field_${index}`] = value;
        const prompt =
          typeof field.prompt === "string" ? field.prompt : `Answer ${index + 1}`;
        if (value) responseParts.push(`${prompt}: ${value}`);
      });

      return {
        responseText: responseParts.join("; ") || null,
        responsePayload,
      };
    }

    default: {
      if (writingResponseTypes.has(question.question_type)) {
        const planningNotes = getTrimmedString(
          formData,
          `response_planning_notes_${question.id}`
        );
        const typedDraft = getTrimmedString(formData, `response_draft_${question.id}`);
        const file = formData.get(`response_file_${question.id}`);
        const uploadedFile = isUsableFile(file)
          ? await uploadMockExamResponseFile({
              supabase: params.supabase,
              attemptId: params.attemptId,
              questionId: question.id,
              userId: params.userId,
              file,
              prefix: "writing",
            })
          : getExistingStoredFile(params.existingResponse, "file");

        return {
          responseText:
            typedDraft ||
            planningNotes ||
            (uploadedFile ? `Uploaded file: ${uploadedFile.fileName}` : null),
          responsePayload: {
            responseMode: "writing_upload",
            planningNotes,
            typedDraft,
            ...(uploadedFile ? { file: uploadedFile } : {}),
          },
        };
      }

      if (speakingResponseTypes.has(question.question_type)) {
        const prepNotes = getTrimmedString(
          formData,
          `response_prep_notes_${question.id}`
        );
        const audioData = getTrimmedString(
          formData,
          `response_audio_data_${question.id}`
        );
        const audioFile = formData.get(`response_audio_file_${question.id}`);
        const uploadedAudioFromFile = isUsableFile(audioFile)
          ? await uploadMockExamResponseFile({
              supabase: params.supabase,
              attemptId: params.attemptId,
              questionId: question.id,
              userId: params.userId,
              file: audioFile,
              prefix: "speaking",
            })
          : null;
        const uploadedAudio =
          uploadedAudioFromFile ??
          (audioData
            ? await uploadMockExamAudioDataUrl({
                supabase: params.supabase,
                attemptId: params.attemptId,
                questionId: question.id,
                userId: params.userId,
                dataUrl: audioData,
              })
            : getExistingStoredFile(params.existingResponse, "audio"));

        return {
          responseText:
            prepNotes ||
            (uploadedAudio ? `Audio response: ${uploadedAudio.fileName}` : null),
          responsePayload: {
            responseMode: "speaking_recording",
            prepNotes,
            ...(uploadedAudio ? { audio: uploadedAudio } : {}),
          },
        };
      }

      const responseText = getTrimmedString(formData, `response_text_${question.id}`);

      return {
        responseText: responseText || null,
        responsePayload: {},
      };
    }
  }
}
