export function parseJsonObject(raw: string | undefined) {
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function getNumberArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is number => typeof item === "number");
}

export function getRecordArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, unknown> =>
      Boolean(item) && typeof item === "object" && !Array.isArray(item)
  );
}

export function getRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function linesToString(values: string[]) {
  return values.join("\n");
}

export function lineList(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function csvNumberList(value: string) {
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item >= 0);
}

export function optionalPositiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function optionalString(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function optionalBoolean(value: string) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export function numberToString(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "";
}

export function fieldsToText(fields: Record<string, unknown>[]) {
  return fields
    .map((field) => {
      const prompt = getString(field.prompt);
      const acceptedAnswers = getStringArray(field.acceptedAnswers).join(";");
      return [prompt, acceptedAnswers].filter(Boolean).join("|");
    })
    .join("\n");
}

export function fieldsFromText(value: string) {
  return lineList(value).map((line) => {
    const [prompt, acceptedAnswersRaw] = line.split("|");
    return {
      prompt: prompt?.trim() ?? "",
      acceptedAnswers: (acceptedAnswersRaw ?? "")
        .split(";")
        .map((answer) => answer.trim())
        .filter(Boolean),
    };
  });
}

export function rolePlayPromptsToText(prompts: Record<string, unknown>[]) {
  return prompts
    .map((prompt) => {
      const text = getString(prompt.text);
      const type = getString(prompt.type) || "question";
      return [text, type].filter(Boolean).join("|");
    })
    .join("\n");
}

export function rolePlayPromptsFromText(value: string) {
  return lineList(value).map((line) => {
    const [text, type] = line.split("|");
    const normalizedType = type?.trim() || "question";
    return {
      text: text?.trim() ?? "",
      type: ["question", "request", "unexpected"].includes(normalizedType)
        ? normalizedType
        : "question",
    };
  });
}

export function labelledRecordsToText(records: Record<string, unknown>[]) {
  return records
    .map((record) => {
      const label = getString(record.label);
      const description = getString(record.description);
      const marks = typeof record.marks === "number" ? String(record.marks) : "";
      return [label, description, marks].filter(Boolean).join("|");
    })
    .join("\n");
}

export function labelledRecordsFromText(value: string) {
  return lineList(value).map((line) => {
    const [label, description, marksRaw] = line.split("|");
    const marks = optionalPositiveNumber(marksRaw ?? "");

    return {
      label: label?.trim() ?? "",
      description: description?.trim() ?? "",
      ...(marks ? { marks } : {}),
    };
  });
}
