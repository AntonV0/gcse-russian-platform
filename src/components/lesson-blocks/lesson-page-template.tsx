import LessonHeader from "@/components/layout/lesson-header";
import LessonFooterNav from "@/components/layout/lesson-footer-nav";
import LessonRenderer from "@/components/lesson-blocks/lesson-renderer";
import LessonCompletionForm from "@/components/lesson-blocks/lesson-completion-form";
import type { LessonBlock } from "@/types/lesson";
import {
  getAdjacentLessonsDb,
  getCourseBySlugDb,
  getLessonBySlugDb,
  getModuleBySlugDb,
} from "@/lib/course-helpers-db";
import { getLessonProgress } from "@/lib/progress";
import { getLessonPath, getModulePath } from "@/lib/routes";

type LessonPageTemplateProps = {
  courseSlug: string;
  variantSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  blocks: LessonBlock[];
};

export default async function LessonPageTemplate({
  courseSlug,
  variantSlug,
  moduleSlug,
  lessonSlug,
  blocks,
}: LessonPageTemplateProps) {
  const course = await getCourseBySlugDb(courseSlug);
  const module = await getModuleBySlugDb(courseSlug, variantSlug, moduleSlug);
  const lesson = await getLessonBySlugDb(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );
  const { previousLesson, nextLesson } = await getAdjacentLessonsDb(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );
  const progress = await getLessonProgress(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

  if (!course || !module || !lesson) {
    return <main>Lesson not found.</main>;
  }

  const moduleHref = getModulePath(course.slug, variantSlug, moduleSlug);

  return (
    <main>
      <LessonHeader
        backHref={moduleHref}
        backLabel="Back to module"
        moduleTitle={module.title}
        lessonTitle={lesson.title}
        lessonDescription={lesson.summary ?? ""}
      />

      <LessonRenderer blocks={blocks} />

      <LessonCompletionForm
        courseSlug={courseSlug}
        variantSlug={variantSlug}
        moduleSlug={moduleSlug}
        lessonSlug={lessonSlug}
        completed={!!progress?.completed}
      />

      <LessonFooterNav
        moduleHref={moduleHref}
        previousLesson={
          previousLesson
            ? {
                href: getLessonPath(
                  course.slug,
                  variantSlug,
                  moduleSlug,
                  previousLesson.slug
                ),
                label: previousLesson.title,
              }
            : undefined
        }
        nextLesson={
          nextLesson
            ? {
                href: getLessonPath(
                  course.slug,
                  variantSlug,
                  moduleSlug,
                  nextLesson.slug
                ),
                label: nextLesson.title,
              }
            : undefined
        }
      />
    </main>
  );
}