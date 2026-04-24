"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
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
  const [data, setData] = useState(
    defaultValues?.data ?? questionDataTemplates[initialQuestionType]
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="mockExamId" value={mockExamId} />
      {sectionId ? <input type="hidden" name="sectionId" value={sectionId} /> : null}
      {questionId ? <input type="hidden" name="questionId" value={questionId} /> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <FormField label="Question type" required>
          <Select
            name="questionType"
            required
            value={questionType}
            onChange={(event) => {
              const nextQuestionType = event.target.value as MockExamQuestionType;
              setQuestionType(nextQuestionType);
              setData(questionDataTemplates[nextQuestionType]);
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

      <FormField
        label="Question data JSON"
        hint="Changing question type loads a starter JSON template. Edit it for this original task."
      >
        <Textarea
          name="data"
          className="font-mono"
          rows={mode === "create" ? 8 : 10}
          value={data}
          onChange={(event) => setData(event.target.value)}
        />
      </FormField>

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
