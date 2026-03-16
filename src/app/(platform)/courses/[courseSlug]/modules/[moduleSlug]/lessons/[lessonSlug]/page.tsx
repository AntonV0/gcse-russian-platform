import LessonPageTemplate from "@/components/lesson-blocks/lesson-page-template";
import { getCourseBySlug, getLessonBySlug, getModuleBySlug } from "@/lib/course-helpers";
import { getLessonBlocks } from "@/lib/lesson-content";

type LessonPageProps = {
  params: Promise<{
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;

  const course = getCourseBySlug(courseSlug);
  const module = getModuleBySlug(courseSlug, moduleSlug);
  const lesson = getLessonBySlug(courseSlug, moduleSlug, lessonSlug);

  if (!course || !module || !lesson) {
    return <main>Lesson not found.</main>;
  }

  const blocks = getLessonBlocks(courseSlug, moduleSlug, lessonSlug);

  if (!blocks) {
    return <main>Lesson content not found.</main>;
  }

  return (
    <LessonPageTemplate
      courseSlug={courseSlug}
      moduleSlug={moduleSlug}
      lessonSlug={lessonSlug}
      blocks={blocks}
    />
  );
}