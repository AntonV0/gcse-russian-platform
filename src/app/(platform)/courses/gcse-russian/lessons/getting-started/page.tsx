import LessonPageTemplate from "@/components/lesson-blocks/lesson-page-template";
import { gettingStartedLessonBlocks } from "@/lib/lesson-content/gcse-russian/introduction-to-the-course/getting-started";

export default function GettingStartedLessonPage() {
  return (
    <LessonPageTemplate
      courseSlug="gcse-russian"
      moduleSlug="introduction-to-the-course"
      lessonSlug="getting-started"
      blocks={gettingStartedLessonBlocks}
    />
  );
}