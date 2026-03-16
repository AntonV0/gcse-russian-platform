import PageHeader from "@/components/layout/page-header";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import type { LessonBlock } from "@/types/lesson";

const lessonBlocks: LessonBlock[] = [
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
];

export default function HowTheCourseWorksLessonPage() {
  return (
    <main>
      <PageHeader
        title="How the course works"
        description="This lesson now uses reusable lesson blocks."
      />

      <LessonRenderer blocks={lessonBlocks} />
    </main>
  );
}