import type { MockExamQuestionType } from "@/lib/mock-exams/mock-exam-helpers-db";

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

export function parseMockExamQuestionData(raw: string | undefined) {
  return stateFromData(parseJsonObject(raw));
}

export function stateFromData(data: Record<string, unknown>): MockExamQuestionDataState {
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
    minWordCount:
      typeof data.minWordCount === "number" ? String(data.minWordCount) : "",
    recommendedWordCount:
      typeof data.recommendedWordCount === "number"
        ? String(data.recommendedWordCount)
        : "",
    expectedSentences:
      typeof data.expectedSentences === "number" ? String(data.expectedSentences) : "",
  };
}

export function buildMockExamQuestionData(
  questionType: MockExamQuestionType,
  state: MockExamQuestionDataState
) {
  switch (questionType) {
    case "multiple_choice":
    case "multiple_response":
      return {
        options: lineList(state.optionsText),
        correctAnswers: csvNumberList(state.correctAnswersText),
      };

    case "short_answer":
      return {
        acceptedAnswers: lineList(state.acceptedAnswersText),
      };

    case "gap_fill":
      return {
        text: state.text,
        gaps: fieldsFromText(state.fieldsText),
      };

    case "matching":
      return {
        prompts: lineList(state.promptsText),
        options: lineList(state.optionsText),
        correctMatches: csvNumberList(state.correctAnswersText),
      };

    case "sequencing":
      return {
        items: lineList(state.itemsText),
        correctOrder: csvNumberList(state.correctOrderText),
      };

    case "opinion_recognition":
    case "true_false_not_mentioned":
      return {
        statements: lineList(state.statementsText),
        answers: lineList(state.answersText),
      };

    case "translation_into_english":
      return {
        sourceText: state.sourceText,
      };

    case "translation_into_russian":
      return {
        sourceText: state.sourceText,
        sentences: lineList(state.itemsText),
      };

    case "writing_task":
    case "short_paragraph":
      return {
        bullets: lineList(state.bulletsText),
        minWordCount: optionalPositiveNumber(state.minWordCount),
        recommendedWordCount: optionalPositiveNumber(state.recommendedWordCount),
      };

    case "simple_sentences":
      return {
        bullets: lineList(state.bulletsText),
        expectedSentences: optionalPositiveNumber(state.expectedSentences),
      };

    case "extended_writing":
      return {
        prompts: lineList(state.promptsText),
        minWordCount: optionalPositiveNumber(state.minWordCount),
      };

    case "role_play":
      return {
        scenario: state.scenario,
        prompts: rolePlayPromptsFromText(state.promptsText),
      };

    case "photo_card":
      return {
        imageUrl: state.imageUrl,
        prompts: lineList(state.promptsText),
      };

    case "conversation":
      return {
        theme: state.theme,
        questions: lineList(state.promptsText),
      };

    case "sentence_builder":
      return {
        wordBank: lineList(state.wordBankText),
        acceptedAnswers: lineList(state.acceptedAnswersText),
      };

    case "note_completion":
      return {
        fields: fieldsFromText(state.fieldsText),
      };

    case "listening_comprehension":
      return {
        audioUrl: state.audioUrl,
        transcript: state.text,
        questions: [],
      };

    case "reading_comprehension":
      return {
        text: state.text,
        questions: [],
      };

    case "other":
    default:
      return {
        text: state.text,
      };
  }
}

export function getMockExamTemplateState(
  questionType: MockExamQuestionType,
  templates: Record<MockExamQuestionType, string>
) {
  return parseMockExamQuestionData(templates[questionType]);
}
