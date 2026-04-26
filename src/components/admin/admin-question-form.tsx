"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

import AdminQuestionAnswerContentFields from "./question-form/admin-question-answer-content-fields";
import type {
  AdminQuestionAnswerStrategy,
  AdminQuestionFormProps,
  AdminQuestionType,
} from "./question-form/admin-question-form-types";
import AdminQuestionSettingsFields from "./question-form/admin-question-settings-fields";

export default function AdminQuestionForm({
  mode,
  action,
  questionSetId,
  questionId,
  defaultValues,
  submitLabel = "Save question",
}: AdminQuestionFormProps) {
  const [questionType, setQuestionType] = useState<
    AdminQuestionType
  >(defaultValues?.questionType ?? "translation");

  const [answerStrategy, setAnswerStrategy] = useState<
    AdminQuestionAnswerStrategy
  >(defaultValues?.answerStrategy ?? "text_input");

  const isTextQuestion =
    questionType === "short_answer" || questionType === "translation";
  const showStrategySelector = isTextQuestion;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="questionSetId" value={questionSetId} />
      {questionId ? <input type="hidden" name="questionId" value={questionId} /> : null}

      <PanelCard
        title="Core question"
        description="Define the question type, prompt, marking, and optional audio source."
        tone="admin"
        contentClassName="space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Question type" required>
            <Select
              name="questionType"
              required
              value={questionType}
              onChange={(event) =>
                setQuestionType(event.target.value as AdminQuestionType)
              }
            >
              <option value="multiple_choice">Multiple choice</option>
              <option value="multiple_response">Multiple response</option>
              <option value="short_answer">Short answer</option>
              <option value="translation">Translation</option>
              <option value="matching">Matching</option>
              <option value="ordering">Ordering</option>
              <option value="word_bank_gap_fill">Word-bank gap fill</option>
              <option value="categorisation">Categorisation</option>
            </Select>
          </FormField>

          {showStrategySelector ? (
            <FormField label="Answer strategy">
              <Select
                name="answerStrategy"
                value={answerStrategy}
                onChange={(event) =>
                  setAnswerStrategy(event.target.value as AdminQuestionAnswerStrategy)
                }
              >
                <option value="text_input">Text input</option>
                <option value="selection_based">Selection based</option>
                <option value="sentence_builder">Sentence builder</option>
                <option value="upload_required">Upload required</option>
              </Select>
            </FormField>
          ) : (
            <input type="hidden" name="answerStrategy" value="text_input" />
          )}
        </div>

        <FormField label="Prompt" required>
          <Textarea
            name="prompt"
            required
            rows={3}
            defaultValue={defaultValues?.prompt ?? ""}
          />
        </FormField>

        <FormField label="Explanation">
          <Textarea
            name="explanation"
            rows={3}
            defaultValue={defaultValues?.explanation ?? ""}
          />
        </FormField>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField label="Marks">
            <Input
              name="marks"
              type="number"
              min="1"
              defaultValue={defaultValues?.marks ?? "1"}
            />
          </FormField>
          <FormField label="Position">
            <Input
              name="position"
              type="number"
              min="1"
              defaultValue={defaultValues?.position ?? "1"}
            />
          </FormField>
          <FormField label="Audio path">
            <Input name="audioPath" defaultValue={defaultValues?.audioPath ?? ""} />
          </FormField>
        </div>
      </PanelCard>

      {mode === "edit" ? (
        <PanelCard title="Question state" tone="muted" density="compact">
          <CheckboxField
            name="isActive"
            label="Active"
            defaultChecked={defaultValues?.isActive ?? true}
          />
        </PanelCard>
      ) : null}

      <AdminQuestionSettingsFields
        questionType={questionType}
        answerStrategy={answerStrategy}
        defaultValues={defaultValues}
      />

      <AdminQuestionAnswerContentFields
        questionType={questionType}
        defaultValues={defaultValues}
      />

      <PanelCard
        title="Advanced metadata override"
        description="Add extra metadata JSON only when a question needs behaviour not covered above."
        tone="muted"
      >
        <FormField label="Extra metadata JSON">
          <Textarea
            name="metadata"
            className="font-mono"
            rows={8}
            defaultValue={defaultValues?.metadata ?? "{}"}
          />
        </FormField>
      </PanelCard>

      <InlineActions>
        <Button type="submit" variant="primary" icon="save">
          {submitLabel}
        </Button>
      </InlineActions>
    </form>
  );
}

