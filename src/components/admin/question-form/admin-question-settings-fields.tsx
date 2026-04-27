import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

import type {
  AdminQuestionAnswerStrategy,
  AdminQuestionDefaultValues,
  AdminQuestionType,
} from "./admin-question-form-types";

type AdminQuestionSettingsFieldsProps = {
  questionType: AdminQuestionType;
  answerStrategy: AdminQuestionAnswerStrategy;
  defaultValues?: AdminQuestionDefaultValues;
};

export default function AdminQuestionSettingsFields({
  questionType,
  answerStrategy,
  defaultValues,
}: AdminQuestionSettingsFieldsProps) {
  const isTranslation = questionType === "translation";
  const isTextQuestion = questionType === "short_answer" || isTranslation;
  const showTranslationSettings = isTranslation || questionType === "short_answer";
  const showSelectionSettings = isTranslation && answerStrategy === "selection_based";
  const showSentenceBuilderSettings =
    isTranslation && answerStrategy === "sentence_builder";

  const defaultInstructionHint =
    answerStrategy === "selection_based"
      ? "Select the correct Russian forms"
      : answerStrategy === "sentence_builder"
        ? "Build the sentence in Russian"
        : isTranslation
          ? "Translate into Russian"
          : "";

  return (
    <>
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
              placeholder={
                "subject|Choose subject|I,you,he\nverb|Choose verb|live,study,like"
              }
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
    </>
  );
}
