import type { MockExamQuestionType } from "@/lib/mock-exams/mock-exam-helpers-db";
import { getMockExamQuestionDesignBridge } from "@/lib/questions/question-system-bridge";
import {
  createListeningTaskMetadata,
  createReadingTaskMetadata,
  type LongResponseMarkingMetadata,
  type ResponseWorkflowMetadata,
} from "@/lib/questions/task-metadata";

export type MockExamQuestionDataState = {
  text: string;
  sourceText: string;
  audioUrl: string;
  imageUrl: string;
  scenario: string;
  theme: string;
  optionsText: string;
  correctAnswersText: string;
  acceptedAnswersText: string;
  promptsText: string;
  statementsText: string;
  answersText: string;
  itemsText: string;
  correctOrderText: string;
  bulletsText: string;
  wordBankText: string;
  fieldsText: string;
  markGuidance: string;
  minWordCount: string;
  recommendedWordCount: string;
  expectedSentences: string;
  childQuestionSetSlug: string;
  replayLimit: string;
  timeLimitSeconds: string;
  responseMode: string;
  uploadRequired: string;
  allowTypedDraft: string;
  allowAudioRecording: string;
  criteriaText: string;
  levelDescriptorsText: string;
  markSchemeReference: string;
  wordCountGuidance: string;
  aiMarkingNotes: string;
};

function parseJsonObject(raw: string | undefined) {
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
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

function getRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function linesToString(values: string[]) {
  return values.join("\n");
}

function lineList(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function csvNumberList(value: string) {
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item >= 0);
}

function optionalPositiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function optionalBoolean(value: string) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function numberToString(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "";
}

function fieldsToText(fields: Record<string, unknown>[]) {
  return fields
    .map((field) => {
      const prompt = getString(field.prompt);
      const acceptedAnswers = getStringArray(field.acceptedAnswers).join(";");
      return [prompt, acceptedAnswers].filter(Boolean).join("|");
    })
    .join("\n");
}

function fieldsFromText(value: string) {
  return lineList(value).map((line) => {
    const [prompt, acceptedAnswersRaw] = line.split("|");
    return {
      prompt: prompt?.trim() ?? "",
      acceptedAnswers: (acceptedAnswersRaw ?? "")
        .split(";")
        .map((answer) => answer.trim())
        .filter(Boolean),
    };
  });
}

function rolePlayPromptsToText(prompts: Record<string, unknown>[]) {
  return prompts
    .map((prompt) => {
      const text = getString(prompt.text);
      const type = getString(prompt.type) || "question";
      return [text, type].filter(Boolean).join("|");
    })
    .join("\n");
}

function rolePlayPromptsFromText(value: string) {
  return lineList(value).map((line) => {
    const [text, type] = line.split("|");
    const normalizedType = type?.trim() || "question";
    return {
      text: text?.trim() ?? "",
      type: ["question", "request", "unexpected"].includes(normalizedType)
        ? normalizedType
        : "question",
    };
  });
}

function labelledRecordsToText(records: Record<string, unknown>[]) {
  return records
    .map((record) => {
      const label = getString(record.label);
      const description = getString(record.description);
      const marks = typeof record.marks === "number" ? String(record.marks) : "";
      return [label, description, marks].filter(Boolean).join("|");
    })
    .join("\n");
}

function labelledRecordsFromText(value: string) {
  return lineList(value).map((line) => {
    const [label, description, marksRaw] = line.split("|");
    const marks = optionalPositiveNumber(marksRaw ?? "");

    return {
      label: label?.trim() ?? "",
      description: description?.trim() ?? "",
      ...(marks ? { marks } : {}),
    };
  });
}

function buildMarkingMetadata(state: MockExamQuestionDataState) {
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

function buildResponseWorkflow(
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

function withQuestionDesign(
  questionType: MockExamQuestionType,
  data: Record<string, unknown>
) {
  return {
    ...data,
    questionDesign: getMockExamQuestionDesignBridge(questionType),
  };
}

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
