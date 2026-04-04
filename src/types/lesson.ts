// ------------------------
// SECTION + BLOCK STRUCTURE
// ------------------------

export type LessonSectionKind =
  | "intro"
  | "content"
  | "grammar"
  | "practice"
  | "reading_practice"
  | "writing_practice"
  | "speaking_practice"
  | "listening_practice"
  | "summary";

// ------------------------
// BLOCK TYPES
// ------------------------

export type TextLessonBlock = {
  type: "text";
  content: string;
};

export type NoteLessonBlock = {
  type: "note";
  title: string;
  content: string;
};

export type VocabularyLessonBlock = {
  type: "vocabulary";
  title: string;
  items: {
    russian: string;
    english: string;
  }[];
};

export type VocabularySetLessonBlock = {
  type: "vocabulary-set";
  title?: string;
  vocabularySetSlug: string;
};

export type QuestionSetLessonBlock = {
  type: "question-set";
  title?: string;
  questionSetSlug: string;
};

export type MultipleChoiceLessonBlock = {
  type: "multiple-choice";
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation?: string;
};

export type ShortAnswerLessonBlock = {
  type: "short-answer";
  question: string;
  acceptedAnswers: string[];
  explanation?: string;
  placeholder?: string;
};

// ------------------------
// FUTURE-PROOF BASE TYPE
// ------------------------

export type LessonBlock =
  | TextLessonBlock
  | NoteLessonBlock
  | VocabularyLessonBlock
  | VocabularySetLessonBlock
  | QuestionSetLessonBlock
  | MultipleChoiceLessonBlock
  | ShortAnswerLessonBlock;

// ------------------------
// DB STRUCTURES
// ------------------------

export type LessonBlockDB = {
  id: string;
  lesson_section_id: string;
  block_type: string;
  position: number;
  data: any;
  is_published: boolean;
};

export type LessonSectionDB = {
  id: string;
  lesson_id: string;
  title: string;
  description?: string;
  section_kind: LessonSectionKind;
  position: number;
  is_published: boolean;
  settings: any;
};

// ------------------------
// FRONTEND SHAPES
// ------------------------

export type LessonSection = {
  id: string;
  title: string;
  description?: string;
  sectionKind: LessonSectionKind;
  position: number;
  blocks: LessonBlock[];
};

export type LessonAccess = "free" | "paid";

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  access: LessonAccess;
  sections: LessonSection[];
};
