import LessonPageTemplate from "@/components/lesson-blocks/lesson-page-template";
import { getLessonBlocks } from "@/lib/lesson-content";

type LessonPageProps = {
  params: Promise<{
    lessonSlug: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonSlug } = await params;

  const blocks = getLessonBlocks(
    "gcse-russian",
    "introduction-to-the-course",
    lessonSlug
  );

  if (!blocks) {
    return <main>Lesson not found.</main>;
  }

  return (
    <LessonPageTemplate
      courseSlug="gcse-russian"
      moduleSlug="introduction-to-the-course"
      lessonSlug={lessonSlug}
      blocks={blocks}
    />
  );
}