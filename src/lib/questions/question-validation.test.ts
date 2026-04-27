import { describe, expect, it } from "vitest";
import {
  validateMultipleChoiceAnswer,
  validateSentenceBuilderAnswer,
  validateStructuredAnswer,
  validateTextAnswer,
} from "@/lib/questions/question-validation";
import type {
  RuntimeMultipleChoiceQuestion,
  RuntimeStructuredQuestion,
  RuntimeTextQuestion,
} from "@/lib/questions/runtime-types";

const baseQuestion = {
  id: "question",
  questionSetId: "set",
  prompt: "Prompt",
  promptRich: null,
  explanation: "Because.",
  difficulty: null,
  marks: 1,
  audioPath: null,
  imagePath: null,
  metadata: {},
  position: 1,
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("question validation helpers", () => {
  it("returns feedback details for incorrect multiple-choice answers", () => {
    const question: RuntimeMultipleChoiceQuestion = {
      ...baseQuestion,
      type: "multiple_choice",
      correctOptionId: "b",
      options: [
        { id: "a", text: "Alpha", isCorrect: false, position: 1 },
        { id: "b", text: "Beta", isCorrect: true, position: 2 },
      ],
    };

    expect(
      validateMultipleChoiceAnswer({ question, selectedOptionId: "a" })
    ).toMatchObject({
      isCorrect: false,
      selectedOptionText: "Alpha",
      correctAnswerText: "Beta",
      acceptedAnswerTexts: ["Beta"],
      statusLabel: "Not quite.",
    });
  });

  it("matches text answers using normalization options", () => {
    const question: RuntimeTextQuestion = {
      ...baseQuestion,
      type: "short_answer",
      acceptedAnswers: [
        {
          id: "answer",
          text: "the red book",
          normalizedText: "red book",
          isPrimary: true,
          caseSensitive: false,
          notes: null,
        },
      ],
    };

    const result = validateTextAnswer({
      question,
      submittedText: "Red, book!",
      options: { ignoreArticles: true, ignorePunctuation: true },
    });

    expect(result.isCorrect).toBe(true);
    expect(result.correctAnswerText).toBeNull();
    expect(result.acceptedAnswerTexts).toEqual([]);
  });

  it("honors case-sensitive accepted answers", () => {
    const question: RuntimeTextQuestion = {
      ...baseQuestion,
      type: "translation",
      acceptedAnswers: [
        {
          id: "answer",
          text: "GCSE",
          normalizedText: "gcse",
          isPrimary: true,
          caseSensitive: true,
          notes: null,
        },
      ],
    };

    expect(validateTextAnswer({ question, submittedText: "gcse" }).isCorrect).toBe(false);
    expect(validateTextAnswer({ question, submittedText: "GCSE" }).isCorrect).toBe(true);
  });

  it("validates structured answers regardless of selected option order", () => {
    const question: RuntimeStructuredQuestion = {
      ...baseQuestion,
      type: "multiple_response",
      correctOptionIds: ["a", "c"],
      options: [
        { id: "a", text: "Alpha", isCorrect: true, position: 1 },
        { id: "b", text: "Beta", isCorrect: false, position: 2 },
        { id: "c", text: "Gamma", isCorrect: true, position: 3 },
      ],
    };

    expect(
      validateStructuredAnswer({
        question,
        submittedPayload: { selectedOptionIds: ["c", "a"] },
      }).isCorrect
    ).toBe(true);
  });

  it("validates sentence-builder answers and exposes expected tokens", () => {
    const question: RuntimeTextQuestion = {
      ...baseQuestion,
      type: "short_answer",
      acceptedAnswers: [
        {
          id: "answer",
          text: "я люблю русский",
          normalizedText: "я люблю русский",
          isPrimary: true,
          caseSensitive: false,
          notes: null,
        },
      ],
    };

    const result = validateSentenceBuilderAnswer({
      question,
      submittedTokens: ["я", "люблю", "русский"],
    });

    expect(result.isCorrect).toBe(true);
    expect(result.expectedTokens).toEqual(["я", "люблю", "русский"]);
  });
});
