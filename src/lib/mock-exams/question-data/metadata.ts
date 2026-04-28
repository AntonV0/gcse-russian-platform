import type { MockExamQuestionType } from "@/lib/mock-exams/types";
import { getMockExamQuestionDesignBridge } from "@/lib/questions/question-system-bridge";
import type {
  LongResponseMarkingMetadata,
  ResponseWorkflowMetadata,
} from "@/lib/questions/task-metadata";

import type { MockExamQuestionDataState } from "./state";
import {
  labelledRecordsFromText,
  optionalBoolean,
  optionalString,
} from "./text-codec-utils";

export function buildMarkingMetadata(state: MockExamQuestionDataState) {
  const criteria = labelledRecordsFromText(state.criteriaText);
  const levelDescriptors = labelledRecordsFromText(state.levelDescriptorsText);

  const metadata: LongResponseMarkingMetadata = {
    ...(criteria.length > 0 ? { criteria } : {}),
    ...(levelDescriptors.length > 0 ? { levelDescriptors } : {}),
    ...(optionalString(state.markSchemeReference)
      ? { markSchemeReference: optionalString(state.markSchemeReference) }
      : {}),
    ...(optionalString(state.wordCountGuidance)
      ? { wordCountGuidance: optionalString(state.wordCountGuidance) }
      : {}),
    ...(optionalString(state.aiMarkingNotes)
      ? { aiMarkingNotes: optionalString(state.aiMarkingNotes) }
      : {}),
  };

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

export function buildResponseWorkflow(
  state: MockExamQuestionDataState,
  defaults: ResponseWorkflowMetadata
) {
  return {
    ...defaults,
    ...(optionalString(state.responseMode)
      ? { responseMode: state.responseMode as ResponseWorkflowMetadata["responseMode"] }
      : {}),
    ...(optionalBoolean(state.uploadRequired) !== undefined
      ? { uploadRequired: optionalBoolean(state.uploadRequired) }
      : {}),
    ...(optionalBoolean(state.allowTypedDraft) !== undefined
      ? { allowTypedDraft: optionalBoolean(state.allowTypedDraft) }
      : {}),
    ...(optionalBoolean(state.allowAudioRecording) !== undefined
      ? { allowAudioRecording: optionalBoolean(state.allowAudioRecording) }
      : {}),
  };
}

export function withQuestionDesign(
  questionType: MockExamQuestionType,
  data: Record<string, unknown>
) {
  return {
    ...data,
    questionDesign: getMockExamQuestionDesignBridge(questionType),
  };
}
