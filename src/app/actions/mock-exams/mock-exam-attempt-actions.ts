"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  canDashboardAccessMockExam,
  type DbMockExamQuestion,
  type DbMockExamResponse,
  getMockExamSetBySlugDb,
  loadMockExamAttemptDb,
} from "@/lib/mock-exams/mock-exam-helpers-db";
import { createClient } from "@/lib/supabase/server";
import { getTrimmedString } from "@/app/actions/shared/form-data";

type ExtractedResponse = {
  responseText: string | null;
  responsePayload: Record<string, unknown>;
};

type StoredMockExamResponseFile = {
  bucket: "mock-exam-responses";
  path: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

type MarkResult = {
  awardedMarks: number | null;
  feedback: string | null;
};

function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'[\]\\|<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function getNumberArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is number => typeof item === "number");
}

function getRecordArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, unknown> =>
      Boolean(item) && typeof item === "object" && !Array.isArray(item)
  );
}

function getRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseIndexList(value: string) {
  return value
    .split(",")
    .map((item) => Number(item.trim()) - 1)
    .filter((item) => Number.isInteger(item) && item >= 0);
}

function sameNumberSet(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const left = [...a].sort((x, y) => x - y);
  const right = [...b].sort((x, y) => x - y);
  return left.every((value, index) => value === right[index]);
}

function sameNumberList(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function isUsableFile(value: unknown): value is File {
  return value instanceof File && value.size > 0;
}

function getExistingStoredFile(
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

async function uploadMockExamResponseFile(params: {
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

async function uploadMockExamAudioDataUrl(params: {
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

function fullMarksIfCorrect(
  question: DbMockExamQuestion,
  isCorrect: boolean
): MarkResult {
  return {
    awardedMarks: isCorrect ? question.marks : 0,
    feedback: isCorrect ? "Auto-marked correct." : "Auto-marked incorrect.",
  };
}

function hasAttemptTimeExpired(startedAt: string, timeLimitMinutes: number | null) {
  if (!timeLimitMinutes) return false;

  const startedAtTime = new Date(startedAt).getTime();
  if (!Number.isFinite(startedAtTime)) return false;

  return Date.now() > startedAtTime + timeLimitMinutes * 60 * 1000;
}

async function extractQuestionResponse(
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
      const orderText = getTrimmedString(formData, `response_order_${question.id}`);

      return {
        responseText: orderText || null,
        responsePayload: {
          orderText,
          order: parseIndexList(orderText),
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

function markQuestion(
  question: DbMockExamQuestion,
  response: ExtractedResponse
): MarkResult {
  switch (question.question_type) {
    case "multiple_choice": {
      const selectedOption = Number(response.responsePayload.selectedOption);
      const correctAnswer = getNumberArray(question.data.correctAnswers)[0];
      return fullMarksIfCorrect(question, selectedOption === correctAnswer);
    }

    case "multiple_response": {
      const selectedOptions = Array.isArray(response.responsePayload.selectedOptions)
        ? response.responsePayload.selectedOptions.map((value) => Number(value))
        : [];
      return fullMarksIfCorrect(
        question,
        sameNumberSet(selectedOptions, getNumberArray(question.data.correctAnswers))
      );
    }

    case "matching": {
      const correctMatches = getNumberArray(question.data.correctMatches);
      const submittedMatches = correctMatches.map((_, index) =>
        Number(response.responsePayload[`match_${index}`])
      );

      return fullMarksIfCorrect(
        question,
        correctMatches.length > 0 && sameNumberList(submittedMatches, correctMatches)
      );
    }

    case "sequencing":
      return fullMarksIfCorrect(
        question,
        sameNumberList(
          Array.isArray(response.responsePayload.order)
            ? response.responsePayload.order.map((value) => Number(value))
            : [],
          getNumberArray(question.data.correctOrder)
        )
      );

    case "opinion_recognition":
    case "true_false_not_mentioned": {
      const answers = getStringArray(question.data.answers);
      const isCorrect =
        answers.length > 0 &&
        answers.every(
          (answer, index) => response.responsePayload[`statement_${index}`] === answer
        );
      return fullMarksIfCorrect(question, isCorrect);
    }

    case "gap_fill":
    case "note_completion": {
      const fields =
        question.question_type === "gap_fill"
          ? getRecordArray(question.data.gaps)
          : getRecordArray(question.data.fields);
      const isCorrect =
        fields.length > 0 &&
        fields.every((field, index) => {
          const acceptedAnswers = getStringArray(field.acceptedAnswers).map(
            normalizeAnswer
          );
          const submitted = normalizeAnswer(
            String(response.responsePayload[`field_${index}`] ?? "")
          );
          return acceptedAnswers.includes(submitted);
        });

      return fullMarksIfCorrect(question, isCorrect);
    }

    case "short_answer":
    case "sentence_builder": {
      const acceptedAnswers = getStringArray(question.data.acceptedAnswers).map(
        normalizeAnswer
      );
      const submitted = normalizeAnswer(response.responseText ?? "");
      return fullMarksIfCorrect(
        question,
        acceptedAnswers.length > 0 && acceptedAnswers.includes(submitted)
      );
    }

    default:
      return {
        awardedMarks: null,
        feedback: null,
      };
  }
}

export async function startMockExamAttemptAction(formData: FormData) {
  const mockExamSlug = getTrimmedString(formData, "mockExamSlug");

  if (!mockExamSlug) {
    throw new Error("Missing mock exam slug");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [exam, dashboard] = await Promise.all([
    getMockExamSetBySlugDb(mockExamSlug),
    getDashboardInfo(),
  ]);

  if (!exam || !exam.is_published || !canDashboardAccessMockExam(exam, dashboard)) {
    throw new Error("Mock exam not available");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mock_exam_attempts")
    .insert({
      mock_exam_id: exam.id,
      user_id: user.id,
      status: "draft",
      time_limit_minutes_snapshot: exam.time_limit_minutes,
      total_marks_snapshot: exam.total_marks,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error starting mock exam attempt:", {
      mockExamSlug,
      error,
    });
    throw new Error(`Failed to start mock exam attempt: ${error?.message ?? "unknown"}`);
  }

  redirect(`/mock-exams/${mockExamSlug}/attempts/${data.id}`);
}

export async function saveMockExamAttemptResponsesAction(formData: FormData) {
  const attemptId = getTrimmedString(formData, "attemptId");

  if (!attemptId) {
    throw new Error("Missing attempt id");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { attempt, exam, sections, questionsBySectionId, responsesByQuestionId } =
    await loadMockExamAttemptDb(attemptId);

  if (!attempt || !exam || attempt.user_id !== user.id) {
    throw new Error("Attempt not found");
  }

  if (attempt.status !== "draft") {
    throw new Error("Only draft attempts can be edited");
  }

  const questions = sections.flatMap((section) => questionsBySectionId[section.id] ?? []);
  const requestedSubmitIntent = getTrimmedString(formData, "submitIntent");
  const submitIntent =
    requestedSubmitIntent === "submit" ||
    hasAttemptTimeExpired(attempt.started_at, attempt.time_limit_minutes_snapshot)
      ? "submit"
      : "save";
  const supabase = await createClient();

  const rows = await Promise.all(
    questions.map(async (question) => {
      const extractedResponse = await extractQuestionResponse(question, formData, {
        attemptId: attempt.id,
        userId: user.id,
        supabase,
        existingResponse: responsesByQuestionId[question.id],
      });
      const markResult =
        submitIntent === "submit"
          ? markQuestion(question, extractedResponse)
          : { awardedMarks: null, feedback: null };

      return {
        attempt_id: attempt.id,
        question_id: question.id,
        response_text: extractedResponse.responseText,
        response_payload: extractedResponse.responsePayload,
        awarded_marks: markResult.awardedMarks,
        feedback: markResult.feedback,
        updated_at: new Date().toISOString(),
      };
    })
  );

  if (rows.length > 0) {
    const { error } = await supabase.from("mock_exam_responses").upsert(rows, {
      onConflict: "attempt_id,question_id",
    });

    if (error) {
      console.error("Error saving mock exam responses:", { attemptId, error });
      throw new Error(`Failed to save mock exam responses: ${error.message}`);
    }
  }

  if (submitIntent === "submit") {
    const autoMarkedRows = rows.filter((row) => row.awarded_marks !== null);
    const awardedMarks = autoMarkedRows.reduce(
      (total, row) => total + Number(row.awarded_marks ?? 0),
      0
    );
    const { error } = await supabase
      .from("mock_exam_attempts")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
        awarded_marks: autoMarkedRows.length > 0 ? awardedMarks : null,
        feedback:
          autoMarkedRows.length > 0
            ? "Objective questions were auto-marked. Manual review may still be needed."
            : hasAttemptTimeExpired(
                  attempt.started_at,
                  attempt.time_limit_minutes_snapshot
                )
              ? "Submitted after the time limit elapsed. Manual review may still be needed."
              : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", attempt.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error submitting mock exam attempt:", { attemptId, error });
      throw new Error(`Failed to submit mock exam attempt: ${error.message}`);
    }
  } else {
    const { error } = await supabase
      .from("mock_exam_attempts")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", attempt.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error touching mock exam attempt:", { attemptId, error });
      throw new Error(`Failed to save mock exam attempt: ${error.message}`);
    }
  }

  redirect(`/mock-exams/${exam.slug}/attempts/${attempt.id}`);
}
