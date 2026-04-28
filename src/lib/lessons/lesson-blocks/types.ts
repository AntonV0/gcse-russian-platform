import type { LessonBlock } from "@/types/lesson";

export type DbLessonBlockLike = {
  block_type: string;
  data: Record<string, unknown> | null;
};

export type LessonBlockType = LessonBlock["type"];

export type BuilderBlockType =
  | "header"
  | "subheader"
  | "divider"
  | "text"
  | "note"
  | "callout"
  | "exam-tip"
  | "vocabulary"
  | "image"
  | "audio"
  | "grammar-set"
  | "question-set"
  | "vocabulary-set";
