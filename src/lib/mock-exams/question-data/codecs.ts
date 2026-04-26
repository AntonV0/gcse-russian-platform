import type { MockExamQuestionType } from "@/lib/mock-exams/mock-exam-helpers-db";
import {
  createListeningTaskMetadata,
  createReadingTaskMetadata,
} from "@/lib/questions/task-metadata";
import {
  buildMarkingMetadata,
  buildResponseWorkflow,
  withQuestionDesign,
} from "./metadata";
import type { MockExamQuestionDataState } from "./state";
import {
  csvNumberList,
  fieldsFromText,
  fieldsToText,
  getNumberArray,
  getRecord,
  getRecordArray,
  getString,
  getStringArray,
  labelledRecordsToText,
  lineList,
  linesToString,
  numberToString,
  optionalPositiveNumber,
  optionalString,
  parseJsonObject,
  rolePlayPromptsFromText,
  rolePlayPromptsToText,
} from "./text-codec-utils";

export type { MockExamQuestionDataState } from "./state";

export function parseMockExamQuestionData(raw: string | undefined) {
  return stateFromData(parseJsonObject(raw));
}

export function stateFromData(data: Record<string, unknown>): MockExamQuestionDataState {
  const taskContext = getRecord(data.taskContext);
  const stimulus = getRecord(taskContext.stimulus);
  const responseWorkflow = getRecord(data.responseWorkflow);
  const markingMetadata = getRecord(data.markingMetadata);

  return {
    text: getString(data.text),
    sourceText: getString(data.sourceText),
    audioUrl: getString(data.audioUrl),
    imageUrl: getString(data.imageUrl),
    scenario: getString(data.scenario),
    theme: getString(data.theme),
    optionsText: linesToString(getStringArray(data.options)),
    correctAnswersText: getNumberArray(data.correctAnswers).join(", "),
    acceptedAnswersText: linesToString(getStringArray(data.acceptedAnswers)),
    promptsText:
      Array.isArray(data.prompts) && getRecordArray(data.prompts).length > 0
        ? rolePlayPromptsToText(getRecordArray(data.prompts))
        : linesToString(getStringArray(data.prompts)),
    statementsText: linesToString(getStringArray(data.statements)),
    answersText: linesToString(getStringArray(data.answers)),
    itemsText: linesToString(getStringArray(data.items)),
    correctOrderText: getNumberArray(data.correctOrder).join(", "),
    bulletsText: linesToString(getStringArray(data.bullets)),
    wordBankText: linesToString(getStringArray(data.wordBank)),
    fieldsText: fieldsToText(getRecordArray(data.fields)),
    markGuidance: getString(data.markGuidance),
    minWordCount: typeof data.minWordCount === "number" ? String(data.minWordCount) : "",
    recommendedWordCount:
      typeof data.recommendedWordCount === "number"
        ? String(data.recommendedWordCount)
        : "",
    expectedSentences:
      typeof data.expectedSentences === "number" ? String(data.expectedSentences) : "",
    childQuestionSetSlug: getString(stimulus.childQuestionSetSlug),
    replayLimit: numberToString(stimulus.replayLimit),
    timeLimitSeconds: numberToString(taskContext.timeLimitSeconds),
    responseMode: getString(responseWorkflow.responseMode),
    uploadRequired:
      typeof responseWorkflow.uploadRequired === "boolean"
        ? String(responseWorkflow.uploadRequired)
        : "",
    allowTypedDraft:
      typeof responseWorkflow.allowTypedDraft === "boolean"
        ? String(responseWorkflow.allowTypedDraft)
        : "",
    allowAudioRecording:
      typeof responseWorkflow.allowAudioRecording === "boolean"
        ? String(responseWorkflow.allowAudioRecording)
        : "",
    criteriaText: labelledRecordsToText(getRecordArray(markingMetadata.criteria)),
    levelDescriptorsText: labelledRecordsToText(
      getRecordArray(markingMetadata.levelDescriptors)
    ),
    markSchemeReference: getString(markingMetadata.markSchemeReference),
    wordCountGuidance: getString(markingMetadata.wordCountGuidance),
    aiMarkingNotes: getString(markingMetadata.aiMarkingNotes),
  };
}

export function buildMockExamQuestionData(
  questionType: MockExamQuestionType,
  state: MockExamQuestionDataState
) {
  const markingMetadata = buildMarkingMetadata(state);

  switch (questionType) {
    case "multiple_choice":
    case "multiple_response":
      return withQuestionDesign(questionType, {
        options: lineList(state.optionsText),
        correctAnswers: csvNumberList(state.correctAnswersText),
      });

    case "short_answer":
      return withQuestionDesign(questionType, {
        acceptedAnswers: lineList(state.acceptedAnswersText),
      });

    case "gap_fill":
      return withQuestionDesign(questionType, {
        text: state.text,
        gaps: fieldsFromText(state.fieldsText),
      });

    case "matching":
      return withQuestionDesign(questionType, {
        prompts: lineList(state.promptsText),
        options: lineList(state.optionsText),
        correctMatches: csvNumberList(state.correctAnswersText),
      });

    case "sequencing":
      return withQuestionDesign(questionType, {
        items: lineList(state.itemsText),
        correctOrder: csvNumberList(state.correctOrderText),
      });

    case "opinion_recognition":
    case "true_false_not_mentioned":
      return withQuestionDesign(questionType, {
        statements: lineList(state.statementsText),
        answers: lineList(state.answersText),
      });

    case "translation_into_english":
      return withQuestionDesign(questionType, {
        sourceText: state.sourceText,
      });

    case "translation_into_russian":
      return withQuestionDesign(questionType, {
        sourceText: state.sourceText,
        sentences: lineList(state.itemsText),
      });

    case "writing_task":
    case "short_paragraph":
      return withQuestionDesign(questionType, {
        bullets: lineList(state.bulletsText),
        minWordCount: optionalPositiveNumber(state.minWordCount),
        recommendedWordCount: optionalPositiveNumber(state.recommendedWordCount),
        responseWorkflow: buildResponseWorkflow(state, {
          responseMode: "handwriting_upload",
          uploadRequired: true,
          allowTypedDraft: true,
        }),
        ...(markingMetadata ? { markingMetadata } : {}),
      });

    case "simple_sentences":
      return withQuestionDesign(questionType, {
        bullets: lineList(state.bulletsText),
        expectedSentences: optionalPositiveNumber(state.expectedSentences),
        responseWorkflow: buildResponseWorkflow(state, {
          responseMode: "tile_builder",
          allowTypedDraft: true,
        }),
        ...(markingMetadata ? { markingMetadata } : {}),
      });

    case "extended_writing":
      return withQuestionDesign(questionType, {
        prompts: lineList(state.promptsText),
        minWordCount: optionalPositiveNumber(state.minWordCount),
        responseWorkflow: buildResponseWorkflow(state, {
          responseMode: "handwriting_upload",
          uploadRequired: true,
          allowTypedDraft: true,
        }),
        ...(markingMetadata ? { markingMetadata } : {}),
      });

    case "role_play":
      return withQuestionDesign(questionType, {
        scenario: state.scenario,
        prompts: rolePlayPromptsFromText(state.promptsText),
        responseWorkflow: buildResponseWorkflow(state, {
          responseMode: "audio_recording",
          allowAudioRecording: true,
        }),
        ...(markingMetadata ? { markingMetadata } : {}),
      });

    case "photo_card":
      return withQuestionDesign(questionType, {
        imageUrl: state.imageUrl,
        prompts: lineList(state.promptsText),
        responseWorkflow: buildResponseWorkflow(state, {
          responseMode: "audio_recording",
          allowAudioRecording: true,
          allowTypedDraft: true,
        }),
        ...(markingMetadata ? { markingMetadata } : {}),
      });

    case "conversation":
      return withQuestionDesign(questionType, {
        theme: state.theme,
        questions: lineList(state.promptsText),
        responseWorkflow: buildResponseWorkflow(state, {
          responseMode: "audio_recording",
          allowAudioRecording: true,
        }),
        ...(markingMetadata ? { markingMetadata } : {}),
      });

    case "sentence_builder":
      return withQuestionDesign(questionType, {
        wordBank: lineList(state.wordBankText),
        acceptedAnswers: lineList(state.acceptedAnswersText),
      });

    case "note_completion":
      return withQuestionDesign(questionType, {
        fields: fieldsFromText(state.fieldsText),
      });

    case "listening_comprehension":
      return withQuestionDesign(questionType, {
        audioUrl: state.audioUrl,
        transcript: state.text,
        questions: [],
        taskContext: createListeningTaskMetadata({
          audioUrl: state.audioUrl,
          transcript: state.text,
          childQuestionSetSlug: optionalString(state.childQuestionSetSlug),
          replayLimit: optionalPositiveNumber(state.replayLimit),
          timeLimitSeconds: optionalPositiveNumber(state.timeLimitSeconds),
        }),
      });

    case "reading_comprehension":
      return withQuestionDesign(questionType, {
        text: state.text,
        questions: [],
        taskContext: createReadingTaskMetadata({
          text: state.text,
          childQuestionSetSlug: optionalString(state.childQuestionSetSlug),
          timeLimitSeconds: optionalPositiveNumber(state.timeLimitSeconds),
        }),
      });

    case "other":
    default:
      return withQuestionDesign(questionType, {
        text: state.text,
      });
  }
}

export function getMockExamTemplateState(
  questionType: MockExamQuestionType,
  templates: Record<MockExamQuestionType, string>
) {
  return parseMockExamQuestionData(templates[questionType]);
}
