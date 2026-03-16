import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import { getAdjacentLessons, getLessonBySlug } from "@/lib/course-helpers";
import { gettingStartedLessonBlocks } from "@/lib/lesson-content/gcse-russian/introduction-to-the-course/getting-started";

const moduleSlug = "introduction-to-the-course";
const lessonSlug = "getting-started";

export default function GettingStartedLessonPage() {
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

      <LessonRenderer blocks={gettingStartedLessonBlocks} />

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