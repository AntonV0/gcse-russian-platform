import { describe, expect, it } from "vitest";
import type { DbMockExamQuestion, DbMockExamResponse } from "@/lib/mock-exams/types";
import {
  getMockExamAnswerFieldNames,
  getMockExamResponseWorkflow,
  hasMockExamResponseAnswerEvidence,
  isMockExamQuestionAutoMarkable,
} from "@/lib/mock-exams/response-workflow";

function question(
  question_type: DbMockExamQuestion["question_type"],
  data: Record<string, unknown> = {}
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

function response(
  response_text: string | null,
  response_payload: Record<string, unknown>
): DbMockExamResponse {
  return {
    id: "response-1",
    attempt_id: "attempt-1",
    question_id: "question-1",
    response_text,
    response_payload,
    awarded_marks: null,
    feedback: null,
    is_flagged: false,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("mock exam response workflow", () => {
  it("derives objective answer field names from question data", () => {
    expect(
      getMockExamAnswerFieldNames(
        question("matching", { prompts: ["One", "Two"], options: ["A", "B"] })
      )
    ).toEqual(["response_match_question-1_0", "response_match_question-1_1"]);

    expect(
      getMockExamAnswerFieldNames(question("sequencing", { items: ["A", "B"] }))
    ).toEqual(["response_order_question-1_0", "response_order_question-1_1"]);
  });

  it("uses responseWorkflow metadata for writing uploads and typed drafts", () => {
    const workflow = getMockExamResponseWorkflow(
      question("simple_sentences", {
        responseWorkflow: {
          responseMode: "tile_builder",
          allowTypedDraft: true,
          uploadRequired: false,
        },
      })
    );

    expect(workflow.kind).toBe("writing");
    expect(workflow.supportsTypedDraft).toBe(true);
    expect(workflow.supportsUpload).toBe(false);
    expect(workflow.answerFieldNames).toEqual(["response_draft_question-1"]);
  });

  it("uses responseWorkflow metadata for speaking typed drafts", () => {
    const workflow = getMockExamResponseWorkflow(
      question("photo_card", {
        responseWorkflow: {
          responseMode: "audio_recording",
          allowAudioRecording: true,
          allowTypedDraft: true,
        },
      })
    );

    expect(workflow.kind).toBe("speaking");
    expect(workflow.answerFieldNames).toContain("response_draft_question-1");
    expect(workflow.answerFieldNames).toContain("response_audio_file_question-1");
  });

  it("keeps teacher-marked workflows out of auto-marking", () => {
    expect(isMockExamQuestionAutoMarkable(question("multiple_choice"))).toBe(true);
    expect(isMockExamQuestionAutoMarkable(question("photo_card"))).toBe(false);
    expect(isMockExamQuestionAutoMarkable(question("writing_task"))).toBe(false);
  });

  it("treats notes as auxiliary, not answer evidence", () => {
    expect(
      hasMockExamResponseAnswerEvidence(
        response("plan", {
          responseMode: "handwriting_upload",
          planningNotes: "plan",
        })
      )
    ).toBe(false);
    expect(
      hasMockExamResponseAnswerEvidence(
        response(null, {
          responseMode: "audio_recording",
          prepNotes: "prep only",
        })
      )
    ).toBe(false);
  });

  it("detects typed drafts, files, and audio as answer evidence", () => {
    expect(
      hasMockExamResponseAnswerEvidence(
        response(null, {
          responseMode: "tile_builder",
          typedDraft: "I live in London.",
        })
      )
    ).toBe(true);
    expect(
      hasMockExamResponseAnswerEvidence(
        response(null, {
          responseMode: "audio_recording",
          audio: { bucket: "mock-exam-responses", path: "a.webm" },
        })
      )
    ).toBe(true);
  });
});
