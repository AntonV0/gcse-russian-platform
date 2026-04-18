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

export type HeaderLessonBlock = {
  type: "header";
  content: string;
};

export type SubheaderLessonBlock = {
  type: "subheader";
  content: string;
};

export type DividerLessonBlock = {
  type: "divider";
};

export type TextLessonBlock = {
  type: "text";
  content: string;
};

export type NoteLessonBlock = {
  type: "note";
  title: string;
  content: string;
};

export type CalloutLessonBlock = {
  type: "callout";
  title?: string;
  content: string;
};

export type ExamTipLessonBlock = {
  type: "exam-tip";
  title?: string;
  content: string;
};

export type ImageLessonBlock = {
  type: "image";
  src: string;
  alt?: string;
  caption?: string;
};

export type AudioLessonBlock = {
  type: "audio";
  title?: string;
  src: string;
  caption?: string;
  autoPlay?: boolean;
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

export type QuestionSetLessonBlock = {
  type: "question-set";
  title?: string;
  questionSetSlug: string;
};

export type LessonBlock =
  | HeaderLessonBlock
  | SubheaderLessonBlock
  | DividerLessonBlock
  | TextLessonBlock
  | NoteLessonBlock
  | CalloutLessonBlock
  | ExamTipLessonBlock
  | ImageLessonBlock
  | AudioLessonBlock
  | VocabularyLessonBlock
  | VocabularySetLessonBlock
  | QuestionSetLessonBlock
  | MultipleChoiceLessonBlock
  | ShortAnswerLessonBlock;

export type LessonSectionTrackVisibility = "shared" | "foundation_only" | "higher_only";

export type LessonSectionDeliveryVisibility = "all" | "self_study_only" | "volna_only";

export type LessonSection = {
  id: string;
  title: string;
  description?: string;
  sectionKind: LessonSectionKind;
  position: number;
  trackVisibility: LessonSectionTrackVisibility;
  deliveryVisibility: LessonSectionDeliveryVisibility;
  canonicalSectionKey?: string | null;
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
