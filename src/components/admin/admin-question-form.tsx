"use client";

import { useMemo, useState } from "react";

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
  const showSelectionSettings =
    isTranslation && answerStrategy === "selection_based";
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

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Question type</label>
          <select
            name="questionType"
            required
            className="w-full rounded border px-3 py-2"
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
          </select>
        </div>

        {showStrategySelector ? (
          <div>
            <label className="block text-sm font-medium">Answer strategy</label>
            <select
              name="answerStrategy"
              className="w-full rounded border px-3 py-2"
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
            </select>
          </div>
        ) : (
          <input type="hidden" name="answerStrategy" value="text_input" />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Prompt</label>
        <textarea
          name="prompt"
          required
          className="w-full rounded border px-3 py-2"
          rows={3}
          defaultValue={defaultValues?.prompt ?? ""}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Explanation</label>
        <textarea
          name="explanation"
          className="w-full rounded border px-3 py-2"
          rows={3}
          defaultValue={defaultValues?.explanation ?? ""}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium">Marks</label>
          <input
            name="marks"
            type="number"
            min="1"
            defaultValue={defaultValues?.marks ?? "1"}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Position</label>
          <input
            name="position"
            type="number"
            min="1"
            defaultValue={defaultValues?.position ?? "1"}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Audio path</label>
          <input
            name="audioPath"
            className="w-full rounded border px-3 py-2"
            defaultValue={defaultValues?.audioPath ?? ""}
          />
        </div>
      </div>

      {mode === "edit" ? (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold">Question State</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked={defaultValues?.isActive ?? true}
            />
            Active
          </label>
        </div>
      ) : null}

      {showTranslationSettings ? (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold">Translation / Text Settings</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {isTranslation ? (
              <div>
                <label className="block text-sm font-medium">
                  Translation direction
                </label>
                <select
                  name="translationDirection"
                  className="w-full rounded border px-3 py-2"
                  defaultValue={defaultValues?.translationDirection ?? ""}
                >
                  <option value="">None</option>
                  <option value="to_russian">To Russian</option>
                  <option value="to_english">To English</option>
                </select>
              </div>
            ) : (
              <input type="hidden" name="translationDirection" value="" />
            )}

            <div>
              <label className="block text-sm font-medium">Placeholder</label>
              <input
                name="placeholder"
                className="w-full rounded border px-3 py-2"
                placeholder="Type your answer"
                defaultValue={defaultValues?.placeholder ?? ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Source language label
              </label>
              <input
                name="sourceLanguageLabel"
                className="w-full rounded border px-3 py-2"
                placeholder="English"
                defaultValue={defaultValues?.sourceLanguageLabel ?? ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Target language label
              </label>
              <input
                name="targetLanguageLabel"
                className="w-full rounded border px-3 py-2"
                placeholder="Russian"
                defaultValue={defaultValues?.targetLanguageLabel ?? ""}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Instruction</label>
            <input
              name="instruction"
              className="w-full rounded border px-3 py-2"
              placeholder={defaultInstructionHint}
              defaultValue={defaultValues?.instruction ?? ""}
            />
          </div>
        </div>
      ) : null}

      {showSelectionSettings ? (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold">Selection-Based Settings</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">
                Selection display mode
              </label>
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
              One token per line. Leave blank to auto-build from the primary accepted answer.
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
              defaultChecked={
                defaultValues?.requireAudioCompletionBeforeSubmit ?? false
              }
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
                <label className="block text-sm font-medium">
                  Correct option index
                </label>
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
              <label className="block text-sm font-medium">
                Accepted answers
              </label>
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

      <button
        type="submit"
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        {submitLabel}
      </button>
    </form>
  );
}