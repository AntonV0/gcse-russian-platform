import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import type { LessonBlock } from "@/types/lesson";
import { getAdjacentLessons, getLessonBySlug, getModuleBySlug } from "@/lib/course-helpers";

type LessonPageTemplateProps = {
  moduleSlug: string;
  lessonSlug: string;
  blocks: LessonBlock[];
};

export default function LessonPageTemplate({
  moduleSlug,
  lessonSlug,
  blocks,
}: LessonPageTemplateProps) {
  const module = getModuleBySlug(moduleSlug);
  const lesson = getLessonBySlug(moduleSlug, lessonSlug);
  const { previousLesson, nextLesson } = getAdjacentLessons(
    moduleSlug,
    lessonSlug
  );

  if (!module || !lesson) {
    return <main>Lesson not found.</main>;
  }

  const moduleHref = `/courses/gcse-russian/modules/${moduleSlug}`;

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