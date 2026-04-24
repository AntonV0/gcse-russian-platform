"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

type AdminQuestionFormProps = {
  mode: "create" | "edit";
  action: (formData: FormData) => void | Promise<void>;
  questionSetId: string;
  questionId?: string;
  defaultValues?: {
    questionType?: "multiple_choice" | "short_answer" | "translation";
    answerStrategy?:
      | "text_input"
      | "selection_based"
      | "sentence_builder"
      | "upload_required";
    prompt?: string;
    explanation?: string;
    marks?: string;
    position?: string;
    audioPath?: string;
    isActive?: boolean;
    translationDirection?: "" | "to_russian" | "to_english";
    placeholder?: string;
    sourceLanguageLabel?: string;
    targetLanguageLabel?: string;
    instruction?: string;
    selectionDisplayMode?: "grouped" | "inline_gaps";
    selectionGroupsText?: string;
    wordBankText?: string;
    ignorePunctuation?: boolean;
    ignoreArticles?: boolean;
    collapseWhitespace?: boolean;
    maxPlays?: string;
    listeningMode?: boolean;
    autoPlay?: boolean;
    hideNativeControls?: boolean;
    requireAudioCompletionBeforeSubmit?: boolean;
    optionsText?: string;
    correctOptionIndex?: string;
    acceptedAnswersText?: string;
    metadata?: string;
  };
  submitLabel?: string;
};

export default function AdminQuestionForm({
  mode,
  action,
  questionSetId,
  questionId,
  defaultValues,
  submitLabel = "Save question",
}: AdminQuestionFormProps) {
  const [questionType, setQuestionType] = useState<
    "multiple_choice" | "short_answer" | "translation"
  >(defaultValues?.questionType ?? "translation");

  const [answerStrategy, setAnswerStrategy] = useState<
    "text_input" | "selection_based" | "sentence_builder" | "upload_required"
  >(defaultValues?.answerStrategy ?? "text_input");

  const isMultipleChoice = questionType === "multiple_choice";
  const isTextQuestion =
    questionType === "short_answer" || questionType === "translation";
  const isTranslation = questionType === "translation";
  const showStrategySelector = isTextQuestion;
  const showTranslationSettings = isTranslation || questionType === "short_answer";
  const showSelectionSettings = isTranslation && answerStrategy === "selection_based";
  const showSentenceBuilderSettings =
    isTranslation && answerStrategy === "sentence_builder";
  const showAcceptedAnswers = isTextQuestion;
  const showMultipleChoiceFields = isMultipleChoice;

  const defaultInstructionHint = useMemo(() => {
    if (answerStrategy === "selection_based") return "Select the correct Russian forms";
    if (answerStrategy === "sentence_builder") return "Build the sentence in Russian";
    if (isTranslation) return "Translate into Russian";
    return "";
  }, [answerStrategy, isTranslation]);

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
                setQuestionType(
                  event.target.value as
                    | "multiple_choice"
                    | "short_answer"
                    | "translation"
                )
              }
            >
              <option value="multiple_choice">Multiple choice</option>
              <option value="short_answer">Short answer</option>
              <option value="translation">Translation</option>
            </Select>
          </FormField>

          {showStrategySelector ? (
            <FormField label="Answer strategy">
              <Select
                name="answerStrategy"
                value={answerStrategy}
                onChange={(event) =>
                  setAnswerStrategy(
                    event.target.value as
                      | "text_input"
                      | "selection_based"
                      | "sentence_builder"
                      | "upload_required"
                  )
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

      {showTranslationSettings ? (
        <PanelCard
          title="Translation / text settings"
          description="Configure labels and instructions for student-facing text answers."
          tone="admin"
          contentClassName="space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {isTranslation ? (
              <FormField label="Translation direction">
                <Select
                  name="translationDirection"
                  defaultValue={defaultValues?.translationDirection ?? ""}
                >
                  <option value="">None</option>
                  <option value="to_russian">To Russian</option>
                  <option value="to_english">To English</option>
                </Select>
              </FormField>
            ) : (
              <input type="hidden" name="translationDirection" value="" />
            )}

            <FormField label="Placeholder">
              <Input
                name="placeholder"
                placeholder="Type your answer"
                defaultValue={defaultValues?.placeholder ?? ""}
              />
            </FormField>
            <FormField label="Source language label">
              <Input
                name="sourceLanguageLabel"
                placeholder="English"
                defaultValue={defaultValues?.sourceLanguageLabel ?? ""}
              />
            </FormField>
            <FormField label="Target language label">
              <Input
                name="targetLanguageLabel"
                placeholder="Russian"
                defaultValue={defaultValues?.targetLanguageLabel ?? ""}
              />
            </FormField>
          </div>

          <FormField label="Instruction">
            <Input
              name="instruction"
              placeholder={defaultInstructionHint}
              defaultValue={defaultValues?.instruction ?? ""}
            />
          </FormField>
        </PanelCard>
      ) : null}

      {showSelectionSettings ? (
        <PanelCard
          title="Selection-based settings"
          description="Configure grouped or inline selection options for scaffolded translation answers."
          tone="admin"
          contentClassName="space-y-4"
        >
          <FormField label="Selection display mode">
            <Select
              name="selectionDisplayMode"
              defaultValue={defaultValues?.selectionDisplayMode ?? "grouped"}
            >
              <option value="grouped">Grouped</option>
              <option value="inline_gaps">Inline gaps</option>
            </Select>
          </FormField>

          <FormField
            label="Selection groups"
            hint="One group per line: id|label|option1,option2,option3"
          >
            <Textarea
              name="selectionGroupsText"
              className="font-mono"
              rows={8}
              defaultValue={defaultValues?.selectionGroupsText ?? ""}
              placeholder={"subject|Choose subject|I,you,he\nverb|Choose verb|live,study,like"}
            />
          </FormField>
        </PanelCard>
      ) : null}

      {showSentenceBuilderSettings ? (
        <PanelCard
          title="Sentence builder settings"
          description="Provide optional word-bank tokens for sentence construction tasks."
          tone="admin"
        >
          <FormField
            label="Word bank"
            hint="One token per line. Leave blank to auto-build from the primary accepted answer."
          >
            <Textarea
              name="wordBankText"
              rows={5}
              defaultValue={defaultValues?.wordBankText ?? ""}
              placeholder={"I\nlive\nin\nLondon"}
            />
          </FormField>
        </PanelCard>
      ) : null}

      {isTextQuestion ? (
        <PanelCard title="Validation options" tone="admin">
          <div className="grid gap-3 md:grid-cols-3">
            <CheckboxField
              name="ignorePunctuation"
              label="Ignore punctuation"
              defaultChecked={defaultValues?.ignorePunctuation ?? false}
            />
            <CheckboxField
              name="ignoreArticles"
              label="Ignore articles"
              defaultChecked={defaultValues?.ignoreArticles ?? false}
            />
            <CheckboxField
              name="collapseWhitespace"
              label="Collapse whitespace"
              defaultChecked={defaultValues?.collapseWhitespace ?? true}
            />
          </div>
        </PanelCard>
      ) : null}

      <PanelCard
        title="Listening mode settings"
        description="Configure audio playback behaviour for listening-style questions."
        tone="admin"
        contentClassName="space-y-4"
      >
        <FormField label="Max plays">
          <Input
            name="maxPlays"
            type="number"
            min="1"
            defaultValue={defaultValues?.maxPlays ?? ""}
          />
        </FormField>

        <div className="grid gap-3 md:grid-cols-2">
          <CheckboxField
            name="listeningMode"
            label="Listening mode"
            defaultChecked={defaultValues?.listeningMode ?? false}
          />
          <CheckboxField
            name="autoPlay"
            label="Auto play"
            defaultChecked={defaultValues?.autoPlay ?? false}
          />
          <CheckboxField
            name="hideNativeControls"
            label="Hide native controls"
            defaultChecked={defaultValues?.hideNativeControls ?? false}
          />
          <CheckboxField
            name="requireAudioCompletionBeforeSubmit"
            label="Require audio completion before submit"
            defaultChecked={defaultValues?.requireAudioCompletionBeforeSubmit ?? false}
          />
        </div>
      </PanelCard>

      <PanelCard
        title="Answer content"
        description="Define answer options or accepted text answers."
        tone="admin"
        contentClassName="space-y-4"
      >
        {showMultipleChoiceFields ? (
          <>
            <FormField label="Multiple choice options">
              <Textarea
                name="optionsText"
                rows={5}
                defaultValue={defaultValues?.optionsText ?? ""}
                placeholder={"Option 1\nOption 2\nOption 3"}
              />
            </FormField>
            <FormField label="Correct option index">
              <Input
                name="correctOptionIndex"
                type="number"
                min="1"
                defaultValue={defaultValues?.correctOptionIndex ?? ""}
                placeholder="1"
              />
            </FormField>
          </>
        ) : null}

        {showAcceptedAnswers ? (
          <FormField label="Accepted answers">
            <Textarea
              name="acceptedAnswersText"
              rows={6}
              defaultValue={defaultValues?.acceptedAnswersText ?? ""}
              placeholder={"Answer 1\nAnswer 2"}
            />
          </FormField>
        ) : null}
      </PanelCard>

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
