import { describe, expect, it } from "vitest";
import {
  getAttemptReviewCue,
  getExamPaperPathway,
  getMockExamAttemptState,
  getResourceActionLabel,
  getResourcePracticeHint,
  hasMockExamAnswerEvidence,
} from "@/lib/exam-prep/exam-prep-helpers";
import type { DbMockExamResponse } from "@/lib/mock-exams/types";

function mockResponse(
  responseText: string | null,
  responsePayload: Record<string, unknown>
): DbMockExamResponse {
  return {
    id: "response-1",
    attempt_id: "attempt-1",
    question_id: "question-1",
    response_text: responseText,
    response_payload: responsePayload,
    awarded_marks: null,
    feedback: null,
    is_flagged: false,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("exam prep helpers", () => {
  it("maps exam paper pathways to the correct student practice routes", () => {
    expect(getExamPaperPathway(1)?.guideHref).toBe("/gcse-russian-listening-exam");
    expect(getExamPaperPathway(4)?.mockExamHref).toBe("/mock-exams?paperNumber=4");
    expect(getExamPaperPathway(9)).toBeUndefined();
  });

  it("describes how past-paper resource types should be used", () => {
    expect(getResourceActionLabel("mark_scheme")).toBe("Open mark scheme");
    expect(getResourcePracticeHint("transcript")).toContain("missed clues");
  });

  it("summarises mock exam attempt states for student cards", () => {
    expect(getMockExamAttemptState(null)).toMatchObject({
      label: "Not started",
      actionLabel: "Preview exam",
    });
    expect(
      getMockExamAttemptState({
        status: "marked",
        awardedMarks: 42,
        totalMarks: 50,
      })
    ).toMatchObject({
      label: "Marked: 42 / 50",
      actionLabel: "Review marks",
    });
  });

  it("does not treat optional planning notes as answer evidence", () => {
    expect(
      hasMockExamAnswerEvidence(
        mockResponse("my plan", {
          responseMode: "writing_upload",
          planningNotes: "my plan",
          typedDraft: "",
        })
      )
    ).toBe(false);
    expect(
      hasMockExamAnswerEvidence(
        mockResponse(null, {
          responseMode: "speaking_recording",
          prepNotes: "say hello",
        })
      )
    ).toBe(false);
  });

  it("does treat typed drafts, uploaded files, and audio as answer evidence", () => {
    expect(
      hasMockExamAnswerEvidence(
        mockResponse("typed answer", {
          responseMode: "writing_upload",
          planningNotes: "plan",
          typedDraft: "typed answer",
        })
      )
    ).toBe(true);
    expect(
      hasMockExamAnswerEvidence(
        mockResponse(null, {
          responseMode: "speaking_recording",
          prepNotes: "plan",
          audio: { bucket: "mock", path: "a.webm", fileName: "a.webm" },
        })
      )
    ).toBe(true);
  });

  it("gives direct review cues for drafts and submitted attempts", () => {
    expect(
      getAttemptReviewCue({
        status: "draft",
        savedResponseCount: 2,
        questionCount: 5,
        markedResponseCount: 0,
      })
    ).toBe("3 questions still need attention.");
    expect(
      getAttemptReviewCue({
        status: "submitted",
        savedResponseCount: 5,
        questionCount: 5,
        markedResponseCount: 2,
      })
    ).toBe("2 of 5 questions marked so far.");
  });
});
