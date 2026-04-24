export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid lesson block field: ${field}`);
  }

  return value.trim();
}

export function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

export function parseVocabularyItems(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [russian, english] = line.split("|").map((part) => part?.trim() ?? "");

      if (!russian || !english) {
        throw new Error(
          `Vocabulary line ${index + 1} must use the format: russian | english`
        );
      }

      return { russian, english };
    });
}
