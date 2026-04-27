import type { DbMockExamQuestion } from "@/lib/mock-exams/mock-exam-helpers-db";

export function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function getNumberArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is number => typeof item === "number");
}

export function getNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
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

export function getTaskStimulus(question: DbMockExamQuestion) {
  return getRecord(getRecord(question.data.taskContext).stimulus);
}
