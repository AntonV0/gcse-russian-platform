import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import type { LessonBlock } from "@/types/lesson";

const lessonBlocks: LessonBlock[] = [
  {
    type: "text",
    content:
      "This lesson is a placeholder for the next step in the module. Later, this page can introduce student expectations, course navigation, and revision habits.",
  },
  {
    type: "note",
    title: "Getting started",
    content:
      "A strong course flow depends on clear lesson order, reusable content blocks, and consistent page structure.",
  },
];

export default function GettingStartedLessonPage() {
  return (
    <main>
      <LessonHeader
        backHref="/courses/gcse-russian/modules/introduction-to-the-course"
        backLabel="Back to module"
        moduleTitle="Introduction to the course"
        lessonTitle="Getting started"
        lessonDescription="A placeholder second lesson for navigation flow."
      />

      <LessonRenderer blocks={lessonBlocks} />

      <LessonFooterNav
        moduleHref="/courses/gcse-russian/modules/introduction-to-the-course"
        previousLesson={{
          href: "/courses/gcse-russian/lessons/how-the-course-works",
          label: "How the course works",
        }}
      />
    </main>
  );
}