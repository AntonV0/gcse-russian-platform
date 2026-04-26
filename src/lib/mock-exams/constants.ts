import type {
  MockExamPaperName,
  MockExamQuestionType,
  MockExamSectionType,
  MockExamTier,
} from "@/lib/mock-exams/types";

export const mockExamPaperNames: MockExamPaperName[] = [
  "Paper 1 Listening",
  "Paper 2 Speaking",
  "Paper 3 Reading",
  "Paper 4 Writing",
];

export const mockExamTiers: MockExamTier[] = ["foundation", "higher", "both"];

export const mockExamSectionTypes: MockExamSectionType[] = [
  "listening",
  "speaking",
  "reading",
  "writing",
  "translation",
  "mixed",
  "other",
];

export const mockExamQuestionTypes: MockExamQuestionType[] = [
  "multiple_choice",
  "multiple_response",
  "short_answer",
  "gap_fill",
  "matching",
  "sequencing",
  "opinion_recognition",
  "true_false_not_mentioned",
  "translation_into_english",
  "translation_into_russian",
  "writing_task",
  "simple_sentences",
  "short_paragraph",
  "extended_writing",
  "role_play",
  "photo_card",
  "conversation",
  "sentence_builder",
  "note_completion",
  "listening_comprehension",
  "reading_comprehension",
  "other",
];
