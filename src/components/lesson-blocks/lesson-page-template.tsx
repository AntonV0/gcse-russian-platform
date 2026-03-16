import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import type { LessonBlock } from "@/types/lesson";
import {
  getAdjacentLessons,
  getCourseBySlug,
  getLessonBySlug,
  getModuleBySlug,
} from "@/lib/course-helpers";

type LessonPageTemplateProps = {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  blocks: LessonBlock[];
};

export default function LessonPageTemplate({
  courseSlug,
  moduleSlug,
  lessonSlug,
  blocks,
}: LessonPageTemplateProps) {
  const course = getCourseBySlug(courseSlug);
  const module = getModuleBySlug(courseSlug, moduleSlug);
  const lesson = getLessonBySlug(courseSlug, moduleSlug, lessonSlug);
  const { previousLesson, nextLesson } = getAdjacentLessons(
    courseSlug,
    moduleSlug,
    lessonSlug
  );

  if (!course || !module || !lesson) {
    return <main>Lesson not found.</main>;
  }

  const moduleHref = `/courses/${course.slug}/modules/${moduleSlug}`;

  return (
    <main>
      <LessonHeader
        backHref={moduleHref}
        backLabel="Back to module"
        moduleTitle={module.title}
        lessonTitle={lesson.title}
        lessonDescription={lesson.description}
      />

      <LessonRenderer blocks={blocks} />

      <LessonFooterNav
        moduleHref={moduleHref}
        previousLesson={
          previousLesson
            ? {
                href: `/courses/${course.slug}/modules/${moduleSlug}/lessons/${previousLesson.slug}`,
                label: previousLesson.title,
              }
            : undefined
        }
        nextLesson={
          nextLesson
            ? {
                href: `/courses/${course.slug}/modules/${moduleSlug}/lessons/${nextLesson.slug}`,
                label: nextLesson.title,
              }
            : undefined
        }
      />
    </main>
  );
}