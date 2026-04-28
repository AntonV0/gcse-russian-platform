import type { ExtractedResponse } from "@/app/actions/mock-exams/mock-exam-response-extraction";
import type { DbMockExamQuestion } from "@/lib/mock-exams/types";

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

function fullMarksIfCorrect(
  question: DbMockExamQuestion,
  isCorrect: boolean
): MarkResult {
  return {
    awardedMarks: isCorrect ? question.marks : 0,
    feedback: isCorrect ? "Auto-marked correct." : "Auto-marked incorrect.",
  };
}

export function markQuestion(
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
