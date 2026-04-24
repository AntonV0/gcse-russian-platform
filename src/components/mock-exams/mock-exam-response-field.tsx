import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import type {
  DbMockExamQuestion,
  DbMockExamResponse,
} from "@/lib/mock-exams/mock-exam-helpers-db";

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

function getStoredText(response?: DbMockExamResponse) {
  return response?.response_text ?? "";
}

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
      <FormField label="Your answer">
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
      </FormField>
    );
  }

  if (question.question_type === "multiple_response") {
    const options = getStringArray(question.data.options);
    const selected = new Set(getPayloadStringArray(payload.selectedOptions));

    return (
      <FormField label="Your answers">
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
      </FormField>
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
                <option key={`${question.id}-match-option-${optionIndex}`} value={optionIndex}>
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
