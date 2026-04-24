"use client";

import { useMemo, useState } from "react";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
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
                event.target.value as "multiple_choice" | "short_answer" | "translation"
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
            <Input
            name="audioPath"
            defaultValue={defaultValues?.audioPath ?? ""}
            />
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
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold">Selection-Based Settings</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Selection display mode</label>
              <select
                name="selectionDisplayMode"
                className="w-full rounded border px-3 py-2"
                defaultValue={defaultValues?.selectionDisplayMode ?? "grouped"}
              >
                <option value="grouped">Grouped</option>
                <option value="inline_gaps">Inline gaps</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Selection groups</label>
            <textarea
              name="selectionGroupsText"
              className="w-full rounded border px-3 py-2 font-mono text-sm"
              rows={8}
              defaultValue={defaultValues?.selectionGroupsText ?? ""}
              placeholder={`subject|Choose subject|Я,Ты,Он\nverb|Choose verb|живу,живёшь,живёт`}
            />
            <p className="mt-1 text-sm text-gray-500">
              One group per line: <code>id|label|option1,option2,option3</code>
            </p>
          </div>
        </div>
      ) : null}

      {showSentenceBuilderSettings ? (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold">Sentence Builder Settings</h2>

          <div>
            <label className="block text-sm font-medium">Word bank</label>
            <textarea
              name="wordBankText"
              className="w-full rounded border px-3 py-2"
              rows={5}
              defaultValue={defaultValues?.wordBankText ?? ""}
              placeholder={`Я\nживу\nв\nЛондоне`}
            />
            <p className="mt-1 text-sm text-gray-500">
              One token per line. Leave blank to auto-build from the primary accepted
              answer.
            </p>
          </div>
        </div>
      ) : null}

      {isTextQuestion ? (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold">Validation Options</h2>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="ignorePunctuation"
                value="true"
                defaultChecked={defaultValues?.ignorePunctuation ?? false}
              />
              Ignore punctuation
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="ignoreArticles"
                value="true"
                defaultChecked={defaultValues?.ignoreArticles ?? false}
              />
              Ignore articles
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="collapseWhitespace"
                value="true"
                defaultChecked={defaultValues?.collapseWhitespace ?? true}
              />
              Collapse whitespace
            </label>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-2 font-semibold">Listening Mode Settings</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Max plays</label>
            <input
              name="maxPlays"
              type="number"
              min="1"
              className="w-full rounded border px-3 py-2"
              defaultValue={defaultValues?.maxPlays ?? ""}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="listeningMode"
              value="true"
              defaultChecked={defaultValues?.listeningMode ?? false}
            />
            Listening mode
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="autoPlay"
              value="true"
              defaultChecked={defaultValues?.autoPlay ?? false}
            />
            Auto play
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="hideNativeControls"
              value="true"
              defaultChecked={defaultValues?.hideNativeControls ?? false}
            />
            Hide native controls
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="requireAudioCompletionBeforeSubmit"
              value="true"
              defaultChecked={defaultValues?.requireAudioCompletionBeforeSubmit ?? false}
            />
            Require audio completion before submit
          </label>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-2 font-semibold">Answer Content</h2>

        <div className="space-y-4">
          {showMultipleChoiceFields ? (
            <>
              <div>
                <label className="block text-sm font-medium">
                  Multiple choice options
                </label>
                <textarea
                  name="optionsText"
                  className="w-full rounded border px-3 py-2"
                  rows={5}
                  defaultValue={defaultValues?.optionsText ?? ""}
                  placeholder={`Option 1\nOption 2\nOption 3`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Correct option index</label>
                <input
                  name="correctOptionIndex"
                  type="number"
                  min="1"
                  className="w-full rounded border px-3 py-2"
                  defaultValue={defaultValues?.correctOptionIndex ?? ""}
                  placeholder="1"
                />
              </div>
            </>
          ) : null}

          {showAcceptedAnswers ? (
            <div>
              <label className="block text-sm font-medium">Accepted answers</label>
              <textarea
                name="acceptedAnswersText"
                className="w-full rounded border px-3 py-2"
                rows={6}
                defaultValue={defaultValues?.acceptedAnswersText ?? ""}
                placeholder={`Answer 1\nAnswer 2`}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-2 font-semibold">Advanced Metadata Override</h2>

        <div>
          <label className="block text-sm font-medium">Extra metadata JSON</label>
          <textarea
            name="metadata"
            className="w-full rounded border px-3 py-2 font-mono text-sm"
            rows={8}
            defaultValue={defaultValues?.metadata ?? "{}"}
          />
        </div>
      </div>

      <button type="submit" className="rounded-lg bg-black px-4 py-2 text-white">
        {submitLabel}
      </button>
    </form>
  );
}
