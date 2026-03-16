import LessonPageTemplate from "@/components/lesson-blocks/lesson-page-template";
import { howTheCourseWorksLessonBlocks } from "@/lib/lesson-content/gcse-russian/introduction-to-the-course/how-the-course-works";

export default function HowTheCourseWorksLessonPage() {
  return (
    <LessonPageTemplate
      moduleSlug="introduction-to-the-course"
      lessonSlug="how-the-course-works"
      blocks={howTheCourseWorksLessonBlocks}
    />
  );
}