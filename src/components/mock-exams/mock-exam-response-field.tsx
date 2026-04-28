import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import MockExamAudioRecorder from "@/components/mock-exams/mock-exam-audio-recorder";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import type { DbMockExamQuestion, DbMockExamResponse } from "@/lib/mock-exams/types";

type MockExamResponseFieldProps = {
  question: DbMockExamQuestion;
  response?: DbMockExamResponse;
  disabled?: boolean;
};

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function getRecordArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, unknown> =>
      Boolean(item) && typeof item === "object" && !Array.isArray(item)
  );
}

function getPayloadString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getPayloadStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function getPayloadNumberArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is number => Number.isInteger(item) && item >= 0);
}

function parseStoredOrder(order: unknown, orderText: unknown) {
  const storedOrder = getPayloadNumberArray(order);
  if (storedOrder.length > 0) return storedOrder;

  return getPayloadString(orderText)
    .split(",")
    .map((item) => Number(item.trim()) - 1)
    .filter((item) => Number.isInteger(item) && item >= 0);
}

function getStoredText(response?: DbMockExamResponse) {
  return response?.response_text ?? "";
}

function hasStoredFile(response?: DbMockExamResponse) {
  const file = response?.response_payload.file;
  return Boolean(file && typeof file === "object" && !Array.isArray(file));
}

function hasStoredAudio(response?: DbMockExamResponse) {
  const audio = response?.response_payload.audio;
  return Boolean(audio && typeof audio === "object" && !Array.isArray(audio));
}

const writingResponseTypes = new Set<DbMockExamQuestion["question_type"]>([
  "writing_task",
  "simple_sentences",
  "short_paragraph",
  "extended_writing",
  "translation_into_russian",
]);

const speakingResponseTypes = new Set<DbMockExamQuestion["question_type"]>([
  "role_play",
  "photo_card",
  "conversation",
]);

export default function MockExamResponseField({
  question,
  response,
  disabled = false,
}: MockExamResponseFieldProps) {
  const payload = response?.response_payload ?? {};

  if (question.question_type === "multiple_choice") {
    const options = getStringArray(question.data.options);
    const selected = getPayloadString(payload.selectedOption);

    return (
      <fieldset className="app-form-field">
        <legend className="app-form-label">Your answer</legend>
        <div className="grid gap-2">
          {options.map((option, index) => (
            <label
              key={`${question.id}-choice-${index}`}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-3 py-2 text-sm text-[var(--text-secondary)]"
            >
              <input
                type="radio"
                name={`response_choice_${question.id}`}
                value={String(index)}
                defaultChecked={selected === String(index)}
                disabled={disabled}
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (question.question_type === "multiple_response") {
    const options = getStringArray(question.data.options);
    const selected = new Set(getPayloadStringArray(payload.selectedOptions));

    return (
      <fieldset className="app-form-field">
        <legend className="app-form-label">Your answers</legend>
        <div className="grid gap-2">
          {options.map((option, index) => (
            <label
              key={`${question.id}-multi-${index}`}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-3 py-2 text-sm text-[var(--text-secondary)]"
            >
              <input
                type="checkbox"
                name={`response_choices_${question.id}`}
                value={String(index)}
                defaultChecked={selected.has(String(index))}
                disabled={disabled}
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (question.question_type === "matching") {
    const prompts = getStringArray(question.data.prompts);
    const options = getStringArray(question.data.options);

    return (
      <div className="grid gap-3">
        {prompts.map((prompt, index) => (
          <FormField key={`${question.id}-match-${index}`} label={prompt}>
            <Select
              name={`response_match_${question.id}_${index}`}
              defaultValue={getPayloadString(payload[`match_${index}`])}
              disabled={disabled}
            >
              <option value="">Choose match</option>
              {options.map((option, optionIndex) => (
                <option
                  key={`${question.id}-match-option-${optionIndex}`}
                  value={optionIndex}
                >
                  {option}
                </option>
              ))}
            </Select>
          </FormField>
        ))}
      </div>
    );
  }

  if (question.question_type === "sequencing") {
    const items = getStringArray(question.data.items);
    const storedOrder = parseStoredOrder(payload.order, payload.orderText);

    if (items.length > 0) {
      return (
        <FormField
          label="Put the items in order"
          hint="Choose one item for each position. The first dropdown is the first item in your answer."
        >
          <div className="grid gap-3">
            {items.map((_, positionIndex) => (
              <label
                key={`${question.id}-order-position-${positionIndex}`}
                className="grid gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center"
              >
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Position {positionIndex + 1}
                </span>
                <Select
                  name={`response_order_${question.id}_${positionIndex}`}
                  defaultValue={
                    Number.isInteger(storedOrder[positionIndex])
                      ? String(storedOrder[positionIndex])
                      : ""
                  }
                  disabled={disabled}
                >
                  <option value="">Choose item</option>
                  {items.map((item, itemIndex) => (
                    <option
                      key={`${question.id}-order-option-${positionIndex}-${itemIndex}`}
                      value={itemIndex}
                    >
                      {itemIndex + 1}. {item}
                    </option>
                  ))}
                </Select>
              </label>
            ))}
          </div>
        </FormField>
      );
    }

    return (
      <FormField
        label="Order"
        hint="Enter item numbers in order, separated by commas. Example: 2, 1, 3"
      >
        <Input
          name={`response_order_${question.id}`}
          defaultValue={getPayloadString(payload.orderText)}
          disabled={disabled}
        />
      </FormField>
    );
  }

  if (
    question.question_type === "opinion_recognition" ||
    question.question_type === "true_false_not_mentioned"
  ) {
    const statements = getStringArray(question.data.statements);
    const options =
      question.question_type === "opinion_recognition"
        ? ["positive", "negative", "neutral"]
        : ["true", "false", "not_mentioned"];

    return (
      <div className="grid gap-3">
        {statements.map((statement, index) => (
          <FormField key={`${question.id}-statement-${index}`} label={statement}>
            <Select
              name={`response_statement_${question.id}_${index}`}
              defaultValue={getPayloadString(payload[`statement_${index}`])}
              disabled={disabled}
            >
              <option value="">Choose answer</option>
              {options.map((option) => (
                <option key={`${question.id}-${index}-${option}`} value={option}>
                  {option.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
          </FormField>
        ))}
      </div>
    );
  }

  if (
    question.question_type === "gap_fill" ||
    question.question_type === "note_completion"
  ) {
    const fields =
      question.question_type === "gap_fill"
        ? getRecordArray(question.data.gaps)
        : getRecordArray(question.data.fields);

    return (
      <div className="grid gap-3">
        {fields.map((field, index) => {
          const prompt =
            typeof field.prompt === "string" && field.prompt.trim()
              ? field.prompt
              : `Answer ${index + 1}`;

          return (
            <FormField key={`${question.id}-field-${index}`} label={prompt}>
              <Input
                name={`response_field_${question.id}_${index}`}
                defaultValue={getPayloadString(payload[`field_${index}`])}
                disabled={disabled}
              />
            </FormField>
          );
        })}
      </div>
    );
  }

  if (writingResponseTypes.has(question.question_type)) {
    const typedDraft = getPayloadString(payload.typedDraft);
    const planningNotes = getPayloadString(payload.planningNotes);

    return (
      <div className="grid gap-4">
        <FormField label="Planning notes">
          <Textarea
            name={`response_planning_notes_${question.id}`}
            rows={3}
            defaultValue={planningNotes}
            disabled={disabled}
            placeholder="Optional English planning notes."
          />
        </FormField>

        <FormField label="Typed draft">
          <Textarea
            name={`response_draft_${question.id}`}
            rows={6}
            defaultValue={typedDraft || getStoredText(response)}
            disabled={disabled}
            placeholder="Optional draft. Handwritten Russian can be uploaded below."
          />
        </FormField>

        <FormField
          label="Upload handwritten work"
          hint="Accepted formats: JPG, PNG, WEBP, PDF."
        >
          <Input
            name={`response_file_${question.id}`}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf,image/*,application/pdf"
            disabled={disabled}
          />
          {hasStoredFile(response) ? (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Existing upload saved.
            </p>
          ) : null}
        </FormField>
      </div>
    );
  }

  if (speakingResponseTypes.has(question.question_type)) {
    const prepNotes = getPayloadString(payload.prepNotes);

    return (
      <div className="grid gap-4">
        <FormField label="Prep notes">
          <Textarea
            name={`response_prep_notes_${question.id}`}
            rows={4}
            defaultValue={prepNotes}
            disabled={disabled}
            placeholder="Optional English prep notes."
          />
        </FormField>

        <FormField label="Recorded response">
          <MockExamAudioRecorder questionId={question.id} disabled={disabled} />
          {hasStoredAudio(response) ? (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Existing recording saved.
            </p>
          ) : null}
        </FormField>

        <FormField
          label="Upload audio file"
          hint="Use this if recording in the browser is not available."
        >
          <Input
            name={`response_audio_file_${question.id}`}
            type="file"
            accept="audio/*"
            disabled={disabled}
          />
        </FormField>
      </div>
    );
  }

  return (
    <FormField label="Your response">
      <Textarea
        name={`response_text_${question.id}`}
        rows={5}
        defaultValue={getStoredText(response)}
        disabled={disabled}
        placeholder="Type your answer here."
      />
    </FormField>
  );
}
