import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import type { MockExamQuestionDataState } from "@/lib/mock-exams/question-data/codecs";
import type { MockExamQuestionType } from "@/lib/mock-exams/types";

import { readingListeningQuestionTypes } from "./mock-exam-question-type-groups";
import type { MockExamQuestionDataUpdater } from "./mock-exam-question-form-types";
import TextLinesHint from "./text-lines-hint";

type MockExamQuestionContentFieldsProps = {
  questionType: MockExamQuestionType;
  state: MockExamQuestionDataState;
  updateField: MockExamQuestionDataUpdater;
};

export default function MockExamQuestionContentFields({
  questionType,
  state,
  updateField,
}: MockExamQuestionContentFieldsProps) {
  return (
    <>
      {["multiple_choice", "multiple_response", "matching"].includes(questionType) ? (
        <FormField label="Options">
          <Textarea
            rows={5}
            value={state.optionsText}
            onChange={(event) => updateField("optionsText", event.target.value)}
          />
        </FormField>
      ) : null}

      {["multiple_choice", "multiple_response", "matching"].includes(questionType) ? (
        <FormField label="Correct answer indexes">
          <Input
            value={state.correctAnswersText}
            onChange={(event) => updateField("correctAnswersText", event.target.value)}
            placeholder="0, 2"
          />
        </FormField>
      ) : null}

      {["short_answer", "sentence_builder"].includes(questionType) ? (
        <FormField label="Accepted answers">
          <Textarea
            rows={4}
            value={state.acceptedAnswersText}
            onChange={(event) => updateField("acceptedAnswersText", event.target.value)}
          />
        </FormField>
      ) : null}

      {["matching", "extended_writing", "photo_card", "conversation"].includes(
        questionType
      ) ? (
        <FormField label={questionType === "conversation" ? "Questions" : "Prompts"}>
          <Textarea
            rows={5}
            value={state.promptsText}
            onChange={(event) => updateField("promptsText", event.target.value)}
          />
        </FormField>
      ) : null}

      {questionType === "role_play" ? (
        <>
          <FormField label="Scenario">
            <Textarea
              rows={3}
              value={state.scenario}
              onChange={(event) => updateField("scenario", event.target.value)}
            />
          </FormField>
          <FormField label="Role play prompts">
            <Textarea
              rows={5}
              value={state.promptsText}
              onChange={(event) => updateField("promptsText", event.target.value)}
            />
            <TextLinesHint>
              Use one line per prompt: text|question/request/unexpected
            </TextLinesHint>
          </FormField>
        </>
      ) : null}

      {questionType === "photo_card" ? (
        <FormField label="Image URL">
          <Input
            value={state.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
          />
        </FormField>
      ) : null}

      {questionType === "conversation" ? (
        <FormField label="Theme">
          <Input
            value={state.theme}
            onChange={(event) => updateField("theme", event.target.value)}
          />
        </FormField>
      ) : null}

      {["reading_comprehension", "listening_comprehension", "gap_fill", "other"].includes(
        questionType
      ) ? (
        <FormField
          label={questionType === "listening_comprehension" ? "Transcript" : "Text"}
        >
          <Textarea
            rows={5}
            value={state.text}
            onChange={(event) => updateField("text", event.target.value)}
          />
        </FormField>
      ) : null}

      {questionType === "listening_comprehension" ? (
        <FormField label="Audio URL">
          <Input
            value={state.audioUrl}
            onChange={(event) => updateField("audioUrl", event.target.value)}
          />
        </FormField>
      ) : null}

      {readingListeningQuestionTypes.includes(questionType) ? (
        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Child question set slug">
            <Input
              value={state.childQuestionSetSlug}
              onChange={(event) =>
                updateField("childQuestionSetSlug", event.target.value)
              }
              placeholder="optional-linked-question-set"
            />
          </FormField>
          {questionType === "listening_comprehension" ? (
            <FormField label="Replay limit">
              <Input
                type="number"
                min="1"
                value={state.replayLimit}
                onChange={(event) => updateField("replayLimit", event.target.value)}
              />
            </FormField>
          ) : null}
          <FormField label="Time limit seconds">
            <Input
              type="number"
              min="1"
              value={state.timeLimitSeconds}
              onChange={(event) => updateField("timeLimitSeconds", event.target.value)}
            />
          </FormField>
        </div>
      ) : null}

      {["translation_into_english", "translation_into_russian"].includes(questionType) ? (
        <FormField label="Source text">
          <Textarea
            rows={4}
            value={state.sourceText}
            onChange={(event) => updateField("sourceText", event.target.value)}
          />
        </FormField>
      ) : null}

      {questionType === "translation_into_russian" ? (
        <FormField label="Sentence prompts">
          <Textarea
            rows={4}
            value={state.itemsText}
            onChange={(event) => updateField("itemsText", event.target.value)}
          />
        </FormField>
      ) : null}

      {questionType === "sequencing" ? (
        <>
          <FormField label="Items">
            <Textarea
              rows={5}
              value={state.itemsText}
              onChange={(event) => updateField("itemsText", event.target.value)}
            />
          </FormField>
          <FormField label="Correct order indexes">
            <Input
              value={state.correctOrderText}
              onChange={(event) => updateField("correctOrderText", event.target.value)}
              placeholder="0, 1, 2"
            />
          </FormField>
        </>
      ) : null}

      {["opinion_recognition", "true_false_not_mentioned"].includes(questionType) ? (
        <>
          <FormField label="Statements">
            <Textarea
              rows={5}
              value={state.statementsText}
              onChange={(event) => updateField("statementsText", event.target.value)}
            />
          </FormField>
          <FormField label="Answers">
            <Textarea
              rows={5}
              value={state.answersText}
              onChange={(event) => updateField("answersText", event.target.value)}
            />
            <TextLinesHint>
              Use one answer per line. Opinions: positive/negative/neutral. Reading:
              true/false/not_mentioned.
            </TextLinesHint>
          </FormField>
        </>
      ) : null}

      {["writing_task", "simple_sentences", "short_paragraph"].includes(questionType) ? (
        <FormField label="Bullet points">
          <Textarea
            rows={5}
            value={state.bulletsText}
            onChange={(event) => updateField("bulletsText", event.target.value)}
          />
        </FormField>
      ) : null}

      {["writing_task", "short_paragraph", "extended_writing"].includes(questionType) ? (
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Minimum word count">
            <Input
              type="number"
              min="1"
              value={state.minWordCount}
              onChange={(event) => updateField("minWordCount", event.target.value)}
            />
          </FormField>
          <FormField label="Recommended word count">
            <Input
              type="number"
              min="1"
              value={state.recommendedWordCount}
              onChange={(event) =>
                updateField("recommendedWordCount", event.target.value)
              }
            />
          </FormField>
        </div>
      ) : null}

      {questionType === "simple_sentences" ? (
        <FormField label="Expected sentences">
          <Input
            type="number"
            min="1"
            value={state.expectedSentences}
            onChange={(event) => updateField("expectedSentences", event.target.value)}
          />
        </FormField>
      ) : null}

      {questionType === "sentence_builder" ? (
        <FormField label="Word bank">
          <Textarea
            rows={5}
            value={state.wordBankText}
            onChange={(event) => updateField("wordBankText", event.target.value)}
          />
        </FormField>
      ) : null}
    </>
  );
}
