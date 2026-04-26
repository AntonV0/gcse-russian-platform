"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import MockExamQuestionContentFields from "@/components/admin/mock-exam-question-form/mock-exam-question-content-fields";
import type {
  MockExamQuestionDataUpdater,
  MockExamQuestionFormProps,
} from "@/components/admin/mock-exam-question-form/mock-exam-question-form-types";
import MockExamQuestionMarkingFields from "@/components/admin/mock-exam-question-form/mock-exam-question-marking-fields";
import {
  buildMockExamQuestionData,
  getMockExamTemplateState,
  parseMockExamQuestionData,
  type MockExamQuestionDataState,
} from "@/lib/mock-exams/question-data/codecs";
import type { MockExamQuestionType } from "@/lib/mock-exams/mock-exam-helpers-db";

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
  const generatedData = useMemo(() => {
    const data = buildMockExamQuestionData(questionType, state) as Record<
      string,
      unknown
    >;
    const markGuidance = state.markGuidance.trim();

    if (markGuidance) {
      data.markGuidance = markGuidance;
    }

    return JSON.stringify(data, null, 2);
  }, [questionType, state]);

  const updateField: MockExamQuestionDataUpdater = (key, value) => {
    setState((current) => ({
      ...current,
      [key]: value,
    }));
  };

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

      <MockExamQuestionContentFields
        questionType={questionType}
        state={state}
        updateField={updateField}
      />

      <MockExamQuestionMarkingFields
        questionType={questionType}
        state={state}
        updateField={updateField}
      />
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


