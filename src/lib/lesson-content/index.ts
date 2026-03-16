import type { LessonBlock } from "@/types/lesson";
import { introductionToTheCourseLessonContent } from "@/lib/lesson-content/gcse-russian/introduction-to-the-course";

export function getLessonBlocks(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): LessonBlock[] | null {
  if (courseSlug === "gcse-russian") {
    if (moduleSlug === "introduction-to-the-course") {
      return introductionToTheCourseLessonContent[lessonSlug] ?? null;
    }
  }

  return null;
}