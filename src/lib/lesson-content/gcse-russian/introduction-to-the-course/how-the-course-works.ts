import type { LessonBlock } from "@/types/lesson";

export const howTheCourseWorksLessonBlocks: LessonBlock[] = [
  {
    type: "text",
    content:
      "Welcome to the GCSE Russian Course Platform. Each lesson will eventually be built from reusable content blocks such as explanations, vocabulary, audio, and question sets.",
  },
  {
    type: "note",
    title: "Study tip",
    content:
      "Work through each lesson in order. Focus on understanding the vocabulary and structure before moving on to practice questions.",
  },
  {
  type: "vocabulary-set",
  title: "Starter vocabulary",
  vocabularySetSlug: "foundation-intro-starter-vocabulary",
  },
  {
    type: "question-set",
    title: "Starter practice",
    questionSetSlug: "foundation-intro-how-the-course-works",
  },
  {
  type: "question-set",
  title: "Starter practice with audio",
  questionSetSlug: "foundation-intro-how-the-course-works-audio",
  },
  {
  type: "question-set",
  title: "Russian output strategy test",
  questionSetSlug: "foundation-intro-russian-output-test",
  },
  {
  type: "question-set",
  title: "Advanced question engine test",
  questionSetSlug: "foundation-advanced-question-engine-test",
  },
];