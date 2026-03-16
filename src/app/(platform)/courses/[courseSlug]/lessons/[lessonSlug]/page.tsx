import LessonPageTemplate from "@/components/lesson-blocks/lesson-page-template";
import { getCourseBySlug } from "@/lib/course-helpers";
import { getLessonBlocks } from "@/lib/lesson-content";

type LessonPageProps = {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseSlug, lessonSlug } = await params;

  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return <main>Course not found.</main>;
  }

  const module = course.modules.find((module) =>
    module.lessons.some((lesson) => lesson.slug === lessonSlug)
  );

  if (!module) {
    return <main>Lesson not found.</main>;
  }

  const blocks = getLessonBlocks(courseSlug, module.slug, lessonSlug);

  if (!blocks) {
    return <main>Lesson content not found.</main>;
  }

  return (
    <LessonPageTemplate
      courseSlug={courseSlug}
      moduleSlug={module.slug}
      lessonSlug={lessonSlug}
      blocks={blocks}
    />
  );
}