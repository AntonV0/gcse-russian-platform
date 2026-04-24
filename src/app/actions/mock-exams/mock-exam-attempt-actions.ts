"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import {
  canDashboardAccessMockExam,
  type DbMockExamQuestion,
  getMockExamSetBySlugDb,
  loadMockExamAttemptDb,
} from "@/lib/mock-exams/mock-exam-helpers-db";
import { createClient } from "@/lib/supabase/server";
import { getTrimmedString } from "@/app/actions/shared/form-data";

type ExtractedResponse = {
  responseText: string | null;
  responsePayload: Record<string, unknown>;
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

function fullMarksIfCorrect(question: DbMockExamQuestion, isCorrect: boolean): MarkResult {
  return {
    awardedMarks: isCorrect ? question.marks : 0,
    feedback: isCorrect ? "Auto-marked correct." : "Auto-marked incorrect.",
  };
}

function extractQuestionResponse(
  question: DbMockExamQuestion,
  formData: FormData
): ExtractedResponse {
  switch (question.question_type) {
    case "multiple_choice": {
      const selectedOption = getTrimmedString(
        formData,
        `response_choice_${question.id}`
      );

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
        const value = getTrimmedString(formData, `response_match_${question.id}_${index}`);
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
        const value = getTrimmedString(formData, `response_field_${question.id}_${index}`);
        responsePayload[`field_${index}`] = value;
        const prompt = typeof field.prompt === "string" ? field.prompt : `Answer ${index + 1}`;
        if (value) responseParts.push(`${prompt}: ${value}`);
      });

      return {
        responseText: responseParts.join("; ") || null,
        responsePayload,
      };
    }

    default: {
      const responseText = getTrimmedString(formData, `response_text_${question.id}`);

      return {
        responseText: responseText || null,
        responsePayload: {},
      };
    }
  }
}

function markQuestion(question: DbMockExamQuestion, response: ExtractedResponse): MarkResult {
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
          const acceptedAnswers = getStringArray(field.acceptedAnswers).map(normalizeAnswer);
          const submitted = normalizeAnswer(String(response.responsePayload[`field_${index}`] ?? ""));
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

  const { attempt, exam, sections, questionsBySectionId } =
    await loadMockExamAttemptDb(attemptId);

  if (!attempt || !exam || attempt.user_id !== user.id) {
    throw new Error("Attempt not found");
  }

  if (attempt.status !== "draft") {
    throw new Error("Only draft attempts can be edited");
  }

  const questions = sections.flatMap((section) =>
    questionsBySectionId[section.id] ?? []
  );
  const submitIntent = getTrimmedString(formData, "submitIntent");

  const rows = questions.map((question) => {
    const extractedResponse = extractQuestionResponse(question, formData);
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
  });

  const supabase = await createClient();

  if (rows.length > 0) {
    const { error } = await supabase
      .from("mock_exam_responses")
      .upsert(rows, {
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
