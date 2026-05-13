import { describe, expect, it } from "vitest";
import { getQuestionOptionState } from "@/components/questions/question-option-state";

describe("question option state", () => {
  it("marks the selected option before submission", () => {
    expect(
      getQuestionOptionState({
        optionId: "a",
        selectedOptionId: "a",
        correctOptionId: "b",
        hasSubmitted: false,
      })
    ).toBe("selected");
  });

  it("marks selected wrong answers after submission", () => {
    expect(
      getQuestionOptionState({
        optionId: "a",
        selectedOptionId: "a",
        correctOptionId: "b",
        hasSubmitted: true,
        isCorrect: false,
      })
    ).toBe("incorrect");
  });

  it("marks the correct option after submission", () => {
    expect(
      getQuestionOptionState({
        optionId: "b",
        selectedOptionId: "a",
        correctOptionId: "b",
        hasSubmitted: true,
        isCorrect: false,
      })
    ).toBe("correct");
  });

  it("falls back to the submitted result when no correct option id is available", () => {
    expect(
      getQuestionOptionState({
        optionId: "a",
        selectedOptionId: "a",
        hasSubmitted: true,
        isCorrect: true,
      })
    ).toBe("correct");
  });
});
