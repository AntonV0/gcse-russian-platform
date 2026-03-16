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

export type LessonBlock =
  | TextLessonBlock
  | NoteLessonBlock
  | VocabularyLessonBlock
  | MultipleChoiceLessonBlock;