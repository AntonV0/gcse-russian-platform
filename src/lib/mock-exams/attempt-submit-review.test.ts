import { describe, expect, it } from "vitest";
import {
  getUnansweredMockExamAttemptQuestions,
  isMockExamAttemptQuestionAnswered,
  type MockExamAttemptReviewQuestion,
} from "@/lib/mock-exams/attempt-submit-review";

function question(
  id: string,
  answerFieldNames: string[],
  persistedAttachmentSaved = false
): MockExamAttemptReviewQuestion {
  return {
    label: `Question ${id}`,
    sectionTitle: "Section A",
    answerFieldNames,
    persistedAttachmentSaved,
    anchorId: `question-${id}`,
  };
}

describe("mock exam attempt submit review", () => {
  it("treats trimmed text fields as unanswered", () => {
    const formData = new FormData();
    formData.set("response_text_1", "   ");

    expect(
      isMockExamAttemptQuestionAnswered(question("1", ["response_text_1"]), formData)
    ).toBe(false);
  });

  it("treats any answer field with content as answered", () => {
    const formData = new FormData();
    formData.set("response_draft_1", "");
    formData.set("response_file_1", new File(["content"], "answer.pdf"));

    expect(
      isMockExamAttemptQuestionAnswered(
        question("1", ["response_draft_1", "response_file_1"]),
        formData
      )
    ).toBe(true);
  });

  it("treats persisted attachments as answered", () => {
    expect(isMockExamAttemptQuestionAnswered(question("1", [], true), new FormData()))
      .toBe(true);
  });

  it("returns the unanswered questions for the submit dialog", () => {
    const formData = new FormData();
    formData.set("response_choice_1", "0");

    expect(
      getUnansweredMockExamAttemptQuestions(
        [
          question("1", ["response_choice_1"]),
          question("2", ["response_text_2"]),
          question("3", ["response_audio_file_3"], true),
        ],
        formData
      ).map((item) => item.label)
    ).toEqual(["Question 2"]);
  });
});
