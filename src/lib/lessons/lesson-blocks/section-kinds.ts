import type { LessonSectionKind } from "@/types/lesson";

export const allowedSectionKinds: LessonSectionKind[] = [
  "intro",
  "content",
  "grammar",
  "practice",
  "reading_practice",
  "writing_practice",
  "speaking_practice",
  "listening_practice",
  "summary",
];

export function resolveSectionKind(value: string): LessonSectionKind {
  return allowedSectionKinds.includes(value as LessonSectionKind)
    ? (value as LessonSectionKind)
    : "content";
}
