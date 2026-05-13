import { describe, expect, it } from "vitest";
import { extractQuestionResponse } from "@/app/actions/mock-exams/mock-exam-response-extraction";
import type { DbMockExamQuestion } from "@/lib/mock-exams/types";

function question(
  question_type: DbMockExamQuestion["question_type"],
  data: Record<string, unknown>
): DbMockExamQuestion {
  return {
    id: "question-1",
    section_id: "section-1",
    question_type,
    prompt: "Prompt",
    data,
    marks: 4,
    sort_order: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("mock exam response extraction", () => {
  it("does not promote writing planning notes into response text", async () => {
    const formData = new FormData();
    formData.set("response_planning_notes_question-1", "Plan only");

    const extracted = await extractQuestionResponse(
      question("simple_sentences", {
        responseWorkflow: {
          responseMode: "tile_builder",
          allowTypedDraft: true,
          uploadRequired: false,
        },
      }),
      formData,
      {
        attemptId: "attempt-1",
        userId: "user-1",
        supabase: {} as never,
      }
    );

    expect(extracted.responseText).toBeNull();
    expect(extracted.responsePayload).toEqual({
      responseMode: "tile_builder",
      planningNotes: "Plan only",
      typedDraft: "",
    });
  });

  it("extracts speaking typed drafts when workflow metadata allows them", async () => {
    const formData = new FormData();
    formData.set("response_prep_notes_question-1", "Prep notes");
    formData.set("response_draft_question-1", "Typed speaking draft");

    const extracted = await extractQuestionResponse(
      question("photo_card", {
        responseWorkflow: {
          responseMode: "audio_recording",
          allowAudioRecording: true,
          allowTypedDraft: true,
        },
      }),
      formData,
      {
        attemptId: "attempt-1",
        userId: "user-1",
        supabase: {} as never,
      }
    );

    expect(extracted.responseText).toBe("Typed speaking draft");
    expect(extracted.responsePayload).toEqual({
      responseMode: "audio_recording",
      prepNotes: "Prep notes",
      typedDraft: "Typed speaking draft",
    });
  });
});
