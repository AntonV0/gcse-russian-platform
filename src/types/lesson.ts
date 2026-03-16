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

export type LessonBlock =
  | TextLessonBlock
  | NoteLessonBlock
  | VocabularyLessonBlock;