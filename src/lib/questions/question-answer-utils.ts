import type { TextValidationOptions } from "@/lib/questions/runtime-types";

export function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function stripPunctuation(value: string) {
  return value.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»“”[\]\\|<>…]/g, " ");
}

function stripEnglishArticles(value: string) {
  return value.replace(/\b(a|an|the)\b/gi, " ");
}

export function normalizeFreeTextAnswer(value: string, options?: TextValidationOptions) {
  let result = value.toLowerCase();

  if (options?.ignorePunctuation) {
    result = stripPunctuation(result);
  }

  if (options?.ignoreArticles) {
    result = stripEnglishArticles(result);
  }

  if (options?.collapseWhitespace !== false) {
    result = collapseWhitespace(result);
  } else {
    result = result.trim();
  }

  return result;
}

export function dedupeTexts(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = normalizeFreeTextAnswer(value);

    if (normalized.length === 0 || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(value);
  }

  return result;
}

export function tokenizeSentenceBuilderText(value: string) {
  return collapseWhitespace(value)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
}

export function getNumberArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is number => Number.isInteger(item) && item >= 0);
}

export function getRecordArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(isRecord);
}
