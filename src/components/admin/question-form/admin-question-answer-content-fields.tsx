import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Textarea from "@/components/ui/textarea";

import type {
  AdminQuestionDefaultValues,
  AdminQuestionType,
} from "./admin-question-form-types";

type AdminQuestionAnswerContentFieldsProps = {
  questionType: AdminQuestionType;
  defaultValues?: AdminQuestionDefaultValues;
};

export default function AdminQuestionAnswerContentFields({
  questionType,
  defaultValues,
}: AdminQuestionAnswerContentFieldsProps) {
  const showMultipleChoiceFields =
    questionType === "multiple_choice" || questionType === "multiple_response";
  const showAcceptedAnswers =
    questionType === "short_answer" || questionType === "translation";
  const showMatchingFields = questionType === "matching";
  const showOrderingFields = questionType === "ordering";
  const showWordBankGapFillFields = questionType === "word_bank_gap_fill";
  const showCategorisationFields = questionType === "categorisation";

  return (
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
          <FormField
            label={
              questionType === "multiple_response"
                ? "Correct option indexes"
                : "Correct option index"
            }
            hint={
              questionType === "multiple_response"
                ? "Use comma-separated 1-based indexes, for example: 1, 3"
                : undefined
            }
          >
            <Input
              name={
                questionType === "multiple_response"
                  ? "correctOptionIndexes"
                  : "correctOptionIndex"
              }
              type="text"
              defaultValue={
                questionType === "multiple_response"
                  ? (defaultValues?.correctOptionIndexes ?? "")
                  : (defaultValues?.correctOptionIndex ?? "")
              }
              placeholder={questionType === "multiple_response" ? "1, 3" : "1"}
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

      {showMatchingFields ? (
        <>
          <FormField label="Prompts" hint="One prompt per line.">
            <Textarea
              name="matchingPromptsText"
              rows={5}
              defaultValue={defaultValues?.matchingPromptsText ?? ""}
              placeholder={"Speaker 1\nSpeaker 2"}
            />
          </FormField>
          <FormField label="Options" hint="One option per line.">
            <Textarea
              name="matchingOptionsText"
              rows={5}
              defaultValue={defaultValues?.matchingOptionsText ?? ""}
              placeholder={"likes school\nprefers sport"}
            />
          </FormField>
          <FormField
            label="Correct match indexes"
            hint="One 1-based option index per prompt, comma-separated. Example: 2, 1"
          >
            <Input
              name="correctMatchesText"
              defaultValue={defaultValues?.correctMatchesText ?? ""}
              placeholder="2, 1"
            />
          </FormField>
        </>
      ) : null}

      {showOrderingFields ? (
        <>
          <FormField label="Items" hint="One item per line.">
            <Textarea
              name="orderingItemsText"
              rows={5}
              defaultValue={defaultValues?.orderingItemsText ?? ""}
              placeholder={"First item\nSecond item\nThird item"}
            />
          </FormField>
          <FormField
            label="Correct order indexes"
            hint="Use 1-based indexes in the correct order. Example: 2, 1, 3"
          >
            <Input
              name="correctOrderText"
              defaultValue={defaultValues?.correctOrderText ?? ""}
              placeholder="2, 1, 3"
            />
          </FormField>
        </>
      ) : null}

      {showWordBankGapFillFields ? (
        <>
          <FormField label="Gap-fill text">
            <Textarea
              name="gapFillText"
              rows={4}
              defaultValue={defaultValues?.gapFillText ?? ""}
              placeholder="Read the sentence and choose the missing words."
            />
          </FormField>
          <FormField label="Gaps" hint="One gap per line: label|answer1;answer2">
            <Textarea
              name="gapsText"
              rows={5}
              defaultValue={defaultValues?.gapsText ?? ""}
              placeholder={"Gap 1|answer\nGap 2|another answer"}
            />
          </FormField>
          <FormField label="Word bank" hint="One selectable word or phrase per line.">
            <Textarea
              name="wordBankText"
              rows={5}
              defaultValue={defaultValues?.wordBankText ?? ""}
              placeholder={"answer\nanother answer\ndistractor"}
            />
          </FormField>
        </>
      ) : null}

      {showCategorisationFields ? (
        <>
          <FormField label="Categories" hint="One category per line: id|label">
            <Textarea
              name="categoriesText"
              rows={4}
              defaultValue={defaultValues?.categoriesText ?? ""}
              placeholder={"positive|Positive\nnegative|Negative"}
            />
          </FormField>
          <FormField label="Items" hint="One item per line: text|categoryId">
            <Textarea
              name="categorisationItemsText"
              rows={6}
              defaultValue={defaultValues?.categorisationItemsText ?? ""}
              placeholder={"I love it|positive\nIt is boring|negative"}
            />
          </FormField>
        </>
      ) : null}
    </PanelCard>
  );
}
