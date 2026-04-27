import {
  getBoolean,
  getOptionalString,
  getTrimmedString,
} from "@/app/actions/shared/form-data";
import type {
  DbMockExamQuestion,
  DbMockExamResponse,
} from "@/lib/mock-exams/mock-exam-helpers-db";

export function getManualMark(formData: FormData, key: string, maxMarks: number) {
  const raw = getTrimmedString(formData, key);
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0 || value > maxMarks) {
    throw new Error(`${key} must be between 0 and ${maxMarks}`);
  }

  return value;
}

function getAiSuggestedMark(formData: FormData, key: string, maxMarks: number) {
  const raw = getTrimmedString(formData, key);
  if (!raw) return null;

  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0 || value > maxMarks) {
    throw new Error(`${key} must be between 0 and ${maxMarks}`);
  }

  return value;
}

function getAiConfidence(value: string) {
  return ["low", "medium", "high"].includes(value) ? value : null;
}

function getAiTeacherDecision(value: string) {
  return ["pending", "accepted", "edited", "rejected"].includes(value)
    ? value
    : "pending";
}

function hasAiMarkingValue(value: Record<string, unknown>) {
  return Object.entries(value).some(([key, entry]) => {
    if (key === "teacherDecision") return entry !== "pending";
    return entry !== null && entry !== "";
  });
}

export function getAiMarkingPayload(
  formData: FormData,
  questionId: string,
  maxMarks: number,
  now: string
) {
  const payload = {
    suggestedMarks: getAiSuggestedMark(
      formData,
      `aiSuggestedMarks_${questionId}`,
      maxMarks
    ),
    confidence: getAiConfidence(getTrimmedString(formData, `aiConfidence_${questionId}`)),
    teacherDecision: getAiTeacherDecision(
      getTrimmedString(formData, `aiTeacherDecision_${questionId}`)
    ),
    teacherNotes: getOptionalString(formData, `aiTeacherNotes_${questionId}`),
    rationale: getOptionalString(formData, `aiRationale_${questionId}`),
    evidence: getOptionalString(formData, `aiEvidence_${questionId}`),
    strengths: getOptionalString(formData, `aiStrengths_${questionId}`),
    targets: getOptionalString(formData, `aiTargets_${questionId}`),
    reviewedAt: now,
  };

  return hasAiMarkingValue(payload) ? payload : null;
}

export function getMockExamMarkingPayloads(params: {
  formData: FormData;
  questions: DbMockExamQuestion[];
  responsesByQuestionId: Record<string, DbMockExamResponse>;
  attemptId: string;
  totalMarks: number;
  markedBy: string;
  now: string;
}) {
  const responseRows = params.questions.map((question) => {
    const existingResponse = params.responsesByQuestionId[question.id];
    const awardedMarks = getManualMark(
      params.formData,
      `awardedMarks_${question.id}`,
      question.marks
    );
    const feedback = getOptionalString(params.formData, `feedback_${question.id}`);
    const aiMarking = getAiMarkingPayload(
      params.formData,
      question.id,
      question.marks,
      params.now
    );

    return {
      attempt_id: params.attemptId,
      question_id: question.id,
      response_text: existingResponse?.response_text ?? null,
      response_payload: {
        ...(existingResponse?.response_payload ?? {}),
        ...(aiMarking ? { aiMarking } : {}),
      },
      awarded_marks: awardedMarks,
      feedback,
      is_flagged: getBoolean(params.formData, `isFlagged_${question.id}`),
      updated_at: params.now,
    };
  });
  const markedRows = responseRows.filter((row) => row.awarded_marks !== null);
  const awardedMarks = markedRows.reduce(
    (total, row) => total + Number(row.awarded_marks ?? 0),
    0
  );
  const overallFeedback = getOptionalString(params.formData, "overallFeedback");

  return {
    responseRows,
    markedRows,
    status: markedRows.length === params.questions.length ? "marked" : "submitted",
    attemptPayload: {
      status: markedRows.length === params.questions.length ? "marked" : "submitted",
      awarded_marks: markedRows.length > 0 ? awardedMarks : null,
      feedback: overallFeedback,
      updated_at: params.now,
    },
    scorePayload:
      markedRows.length > 0
        ? {
            total_marks: params.totalMarks,
            awarded_marks: awardedMarks,
            score_payload: {
              predictedGrade: getOptionalString(params.formData, "predictedGrade"),
              markedResponseCount: markedRows.length,
              totalQuestionCount: params.questions.length,
              isFullyMarked: markedRows.length === params.questions.length,
              aiSummary: getOptionalString(params.formData, "aiSummary"),
              teacherModerationNotes: getOptionalString(
                params.formData,
                "teacherModerationNotes"
              ),
            },
            feedback: overallFeedback,
            marked_by: params.markedBy,
            marked_at: params.now,
            updated_at: params.now,
          }
        : null,
  };
}
