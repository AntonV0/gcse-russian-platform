import LessonPageTemplate from "@/components/lesson-blocks/lesson-page-template";
import { getLessonBlocks } from "@/lib/lesson-content";
import { loadLessonPageData } from "@/lib/course-helpers-db";
import { canUserAccessLesson } from "@/lib/access";
import Link from "next/link";

type LessonPageProps = {
  params: Promise<{
    courseSlug: string;
    variantSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseSlug, variantSlug, moduleSlug, lessonSlug } = await params;

  const { course, module, lesson } = await loadLessonPageData(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

  if (!course || !module || !lesson) {
    return <main>Lesson not found.</main>;
  }

  const canAccess = await canUserAccessLesson(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

  if (!canAccess) {
    return (
      <main className="max-w-xl">
        <h1 className="mb-4 text-2xl font-bold">Locked lesson</h1>
        <p className="mb-4 text-gray-600">
          This lesson is part of the full course.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-black px-4 py-2 text-white"
        >
          View course options
        </Link>
      </main>
    );
  }

  const blocks = getLessonBlocks(courseSlug, variantSlug, moduleSlug, lessonSlug);

  if (!blocks) {
    return <main>Lesson content not found.</main>;
  }

  return (
    <LessonPageTemplate
      courseSlug={courseSlug}
      variantSlug={variantSlug}
      moduleSlug={moduleSlug}
      lessonSlug={lessonSlug}
      blocks={blocks}
    />
  );
}