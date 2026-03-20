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
    type: "vocabulary",
    title: "Starter vocabulary",
    items: [
      { russian: "урок", english: "lesson" },
      { russian: "слово", english: "word" },
      { russian: "задание", english: "task" },
    ],
  },
  {
    type: "question-set",
    title: "Starter practice",
    questionSetSlug: "foundation-intro-how-the-course-works",
  },
];