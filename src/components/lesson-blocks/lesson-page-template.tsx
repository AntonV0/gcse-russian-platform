import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import LessonCompletionForm from "@/components/lesson-blocks/lesson-completion-form";
import type { LessonBlock } from "@/types/lesson";
import {
  getAdjacentLessons,
  getCourseBySlug,
  getLessonBySlug,
  getModuleBySlug,
} from "@/lib/course-helpers";
import { getLessonProgress } from "@/lib/progress";
import { getLessonPath, getModulePath } from "@/lib/routes";

type LessonPageTemplateProps = {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  blocks: LessonBlock[];
};

export default async function LessonPageTemplate({
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
  const progress = await getLessonProgress(courseSlug, moduleSlug, lessonSlug);

  if (!course || !module || !lesson) {
    return <main>Lesson not found.</main>;
  }

  const moduleHref = getModulePath(course.slug, moduleSlug);

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

      <LessonCompletionForm
        courseSlug={courseSlug}
        moduleSlug={moduleSlug}
        lessonSlug={lessonSlug}
        completed={!!progress?.completed}
      />

      <LessonFooterNav
        moduleHref={moduleHref}
        previousLesson={
          previousLesson
            ? {
                href: getLessonPath(course.slug, moduleSlug, previousLesson.slug),
                label: previousLesson.title,
              }
            : undefined
        }
        nextLesson={
          nextLesson
            ? {
                href: getLessonPath(course.slug, moduleSlug, nextLesson.slug),
                label: nextLesson.title,
              }
            : undefined
        }
      />
    </main>
  );
}