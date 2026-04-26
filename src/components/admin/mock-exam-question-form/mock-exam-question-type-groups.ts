import type { MockExamQuestionType } from "@/lib/mock-exams/mock-exam-helpers-db";

export const readingListeningQuestionTypes: MockExamQuestionType[] = [
  "reading_comprehension",
  "listening_comprehension",
];

export const writingQuestionTypes: MockExamQuestionType[] = [
  "writing_task",
  "simple_sentences",
  "short_paragraph",
  "extended_writing",
];

export const speakingQuestionTypes: MockExamQuestionType[] = [
  "role_play",
  "photo_card",
  "conversation",
];
