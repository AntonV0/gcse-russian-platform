import { getTrimmedString } from "@/app/actions/shared/form-data";
import type { DbMockExamQuestion, DbMockExamResponse } from "@/lib/mock-exams/types";
import { createClient } from "@/lib/supabase/server";
import {
  getExistingStoredFile,
  isUsableFile,
  uploadMockExamAudioDataUrl,
  uploadMockExamResponseFile,
} from "@/app/actions/mock-exams/mock-exam-response-storage";
import { getMockExamResponseWorkflow } from "@/lib/mock-exams/response-workflow";

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
  const workflow = getMockExamResponseWorkflow(question);

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
      if (workflow.kind === "writing") {
        const planningNotes = getTrimmedString(
          formData,
          `response_planning_notes_${question.id}`
        );
        const typedDraft = workflow.supportsTypedDraft
          ? getTrimmedString(formData, `response_draft_${question.id}`)
          : "";
        const file = formData.get(`response_file_${question.id}`);
        const uploadedFile = workflow.supportsUpload
          ? isUsableFile(file)
            ? await uploadMockExamResponseFile({
                supabase: params.supabase,
                attemptId: params.attemptId,
                questionId: question.id,
                userId: params.userId,
                file,
                prefix: "writing",
              })
            : getExistingStoredFile(params.existingResponse, "file")
          : null;

        return {
          responseText:
            typedDraft ||
            (uploadedFile ? `Uploaded file: ${uploadedFile.fileName}` : null),
          responsePayload: {
            responseMode: workflow.responseMode,
            planningNotes,
            ...(workflow.supportsTypedDraft ? { typedDraft } : {}),
            ...(uploadedFile ? { file: uploadedFile } : {}),
          },
        };
      }

      if (workflow.kind === "speaking") {
        const prepNotes = getTrimmedString(
          formData,
          `response_prep_notes_${question.id}`
        );
        const typedDraft = workflow.supportsTypedDraft
          ? getTrimmedString(formData, `response_draft_${question.id}`)
          : "";
        const audioData = workflow.supportsAudioRecording
          ? getTrimmedString(formData, `response_audio_data_${question.id}`)
          : "";
        const audioFile = workflow.supportsAudioRecording
          ? formData.get(`response_audio_file_${question.id}`)
          : null;
        const uploadedAudioFromFile =
          workflow.supportsAudioRecording && isUsableFile(audioFile)
            ? await uploadMockExamResponseFile({
                supabase: params.supabase,
                attemptId: params.attemptId,
                questionId: question.id,
                userId: params.userId,
                file: audioFile,
                prefix: "speaking",
              })
            : null;
        const uploadedAudio = workflow.supportsAudioRecording
          ? uploadedAudioFromFile ??
            (audioData
              ? await uploadMockExamAudioDataUrl({
                  supabase: params.supabase,
                  attemptId: params.attemptId,
                  questionId: question.id,
                  userId: params.userId,
                  dataUrl: audioData,
                })
              : getExistingStoredFile(params.existingResponse, "audio"))
          : null;

        return {
          responseText:
            typedDraft ||
            (uploadedAudio ? `Audio response: ${uploadedAudio.fileName}` : null),
          responsePayload: {
            responseMode: workflow.responseMode,
            prepNotes,
            ...(workflow.supportsTypedDraft ? { typedDraft } : {}),
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
