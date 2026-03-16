import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import type { LessonBlock } from "@/types/lesson";
import { getAdjacentLessons, getLessonBySlug } from "@/lib/course-helpers";

const moduleSlug = "introduction-to-the-course";
const lessonSlug = "how-the-course-works";

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
  {
    type: "multiple-choice",
    question: 'What does "урок" mean?',
    options: [
      { id: "a", text: "Word" },
      { id: "b", text: "Lesson" },
      { id: "c", text: "Task" },
    ],
    correctOptionId: "b",
    explanation:
      '"Урок" means "lesson". This is a simple example of how question blocks will work inside lessons.',
  },
  {
    type: "short-answer",
    question: 'Type the English meaning of "слово".',
    acceptedAnswers: ["word"],
    placeholder: "Enter the English meaning",
    explanation: '"Слово" means "word".',
  },
];

export default function HowTheCourseWorksLessonPage() {
  const lesson = getLessonBySlug(moduleSlug, lessonSlug);
  const { previousLesson, nextLesson } = getAdjacentLessons(
    moduleSlug,
    lessonSlug
  );

  if (!lesson) {
    return <main>Lesson not found.</main>;
  }

  return (
    <main>
      <LessonHeader
        backHref="/courses/gcse-russian/modules/introduction-to-the-course"
        backLabel="Back to module"
        moduleTitle="Introduction to the course"
        lessonTitle={lesson.title}
        lessonDescription={lesson.description}
      />

      <LessonRenderer blocks={lessonBlocks} />

      <LessonFooterNav
        moduleHref="/courses/gcse-russian/modules/introduction-to-the-course"
        previousLesson={
          previousLesson
            ? {
                href: `/courses/gcse-russian/lessons/${previousLesson.slug}`,
                label: previousLesson.title,
              }
            : undefined
        }
        nextLesson={
          nextLesson
            ? {
                href: `/courses/gcse-russian/lessons/${nextLesson.slug}`,
                label: nextLesson.title,
              }
            : undefined
        }
      />
    </main>
  );
}