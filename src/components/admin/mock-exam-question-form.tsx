"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  buildMockExamQuestionData,
  getMockExamTemplateState,
  parseMockExamQuestionData,
  type MockExamQuestionDataState,
} from "@/lib/mock-exams/question-data/codecs";
import type { MockExamQuestionType } from "@/lib/mock-exams/mock-exam-helpers-db";

type MockExamQuestionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  mockExamId: string;
  sectionId?: string;
  questionId?: string;
  mode: "create" | "edit";
  questionTypes: MockExamQuestionType[];
  questionTypeLabels: Record<MockExamQuestionType, string>;
  questionDataTemplates: Record<MockExamQuestionType, string>;
  defaultValues?: {
    questionType?: MockExamQuestionType;
    prompt?: string;
    marks?: string;
    sortOrder?: string;
    data?: string;
  };
};

function TextLinesHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-5 app-text-muted">{children}</p>;
}

export default function MockExamQuestionForm({
  action,
  mockExamId,
  sectionId,
  questionId,
  mode,
  questionTypes,
  questionTypeLabels,
  questionDataTemplates,
  defaultValues,
}: MockExamQuestionFormProps) {
  const initialQuestionType = defaultValues?.questionType ?? "multiple_choice";
  const [questionType, setQuestionType] =
    useState<MockExamQuestionType>(initialQuestionType);
  const [state, setState] = useState<MockExamQuestionDataState>(
    parseMockExamQuestionData(
      defaultValues?.data ?? questionDataTemplates[initialQuestionType]
    )
  );
  const generatedData = useMemo(
    () => {
      const data = buildMockExamQuestionData(questionType, state) as Record<
        string,
        unknown
      >;
      const markGuidance = state.markGuidance.trim();

      if (markGuidance) {
        data.markGuidance = markGuidance;
      }

      return JSON.stringify(data, null, 2);
    },
    [questionType, state]
  );

  function updateField<Key extends keyof MockExamQuestionDataState>(
    key: Key,
    value: MockExamQuestionDataState[Key]
  ) {
    setState((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="mockExamId" value={mockExamId} />
      {sectionId ? <input type="hidden" name="sectionId" value={sectionId} /> : null}
      {questionId ? <input type="hidden" name="questionId" value={questionId} /> : null}
      <input type="hidden" name="data" value={generatedData} />

      <div className="grid gap-4 lg:grid-cols-3">
        <FormField label="Question type" required>
          <Select
            name="questionType"
            required
            value={questionType}
            onChange={(event) => {
              const nextQuestionType = event.target.value as MockExamQuestionType;
              setQuestionType(nextQuestionType);
              setState(getMockExamTemplateState(nextQuestionType, questionDataTemplates));
            }}
          >
            {questionTypes.map((item) => (
              <option key={item} value={item}>
                {questionTypeLabels[item]}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Marks">
          <Input
            name="marks"
            type="number"
            min="0"
            step="0.5"
            defaultValue={defaultValues?.marks ?? "1"}
          />
        </FormField>

        <FormField label="Sort order">
          <Input
            name="sortOrder"
            type="number"
            min="0"
            defaultValue={defaultValues?.sortOrder ?? "0"}
          />
        </FormField>
      </div>

      <FormField label="Prompt" required>
        <Textarea
          name="prompt"
          rows={3}
          required
          defaultValue={defaultValues?.prompt ?? ""}
        />
      </FormField>

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
            <TextLinesHint>Use one line per prompt: text|question/request/unexpected</TextLinesHint>
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
        <FormField label={questionType === "listening_comprehension" ? "Transcript" : "Text"}>
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

      {["writing_task", "simple_sentences", "short_paragraph"].includes(
        questionType
      ) ? (
        <FormField label="Bullet points">
          <Textarea
            rows={5}
            value={state.bulletsText}
            onChange={(event) => updateField("bulletsText", event.target.value)}
          />
        </FormField>
      ) : null}

      {["writing_task", "short_paragraph", "extended_writing"].includes(
        questionType
      ) ? (
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

      {["gap_fill", "note_completion"].includes(questionType) ? (
        <FormField label={questionType === "gap_fill" ? "Gaps" : "Fields"}>
          <Textarea
            rows={5}
            value={state.fieldsText}
            onChange={(event) => updateField("fieldsText", event.target.value)}
          />
          <TextLinesHint>Use one line per item: prompt|answer1;answer2</TextLinesHint>
        </FormField>
      ) : null}

      <FormField label="Mark guidance">
        <Textarea
          rows={4}
          value={state.markGuidance}
          onChange={(event) => updateField("markGuidance", event.target.value)}
          placeholder="Original mark scheme notes or teacher rubric guidance for this platform mock question."
        />
      </FormField>

      <details className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--text-primary)]">
          Generated JSON
        </summary>
        <pre className="mt-3 overflow-x-auto text-xs text-[var(--text-secondary)]">
          {generatedData}
        </pre>
      </details>

      <Button
        type="submit"
        variant="primary"
        size="sm"
        icon={mode === "create" ? "create" : "save"}
      >
        {mode === "create" ? "Add question" : "Save question"}
      </Button>
    </form>
  );
}
