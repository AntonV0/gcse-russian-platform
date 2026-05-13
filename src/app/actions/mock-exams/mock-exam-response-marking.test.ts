import { describe, expect, it } from "vitest";
import { markQuestion } from "@/app/actions/mock-exams/mock-exam-response-marking";
import type { DbMockExamQuestion } from "@/lib/mock-exams/types";

function question(
  question_type: DbMockExamQuestion["question_type"],
  data: Record<string, unknown>,
  marks = 2
): DbMockExamQuestion {
  return {
    id: "question-1",
    section_id: "section-1",
    question_type,
    prompt: "Prompt",
    data,
    marks,
    sort_order: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("mock exam response marking", () => {
  it("auto-marks objective questions through the shared workflow", () => {
    expect(
      markQuestion(
        question("multiple_choice", { correctAnswers: [1] }),
        {
          responseText: "Option 2",
          responsePayload: { selectedOption: "1" },
        }
      )
    ).toEqual({
      awardedMarks: 2,
      feedback: "Auto-marked correct.",
    });
  });

  it("leaves teacher-marked workflows pending", () => {
    expect(
      markQuestion(
        question("photo_card", {
          responseWorkflow: {
            responseMode: "audio_recording",
            allowAudioRecording: true,
            allowTypedDraft: true,
          },
        }),
        {
          responseText: "Typed speaking draft",
          responsePayload: { typedDraft: "Typed speaking draft" },
        }
      )
    ).toEqual({
      awardedMarks: null,
      feedback: null,
    });
  });
});
