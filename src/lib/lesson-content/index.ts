import type { LessonBlock } from "@/types/lesson";
import { introductionToTheCourseLessonContent } from "@/lib/lesson-content/gcse-russian/introduction-to-the-course";

const lessonContentMap: Record<
  string,
  Record<string, Record<string, Record<string, LessonBlock[]>>>
> = {
  "gcse-russian": {
    foundation: {
      "introduction-to-the-course": introductionToTheCourseLessonContent,
    },
    higher: {
      "introduction-to-the-course": introductionToTheCourseLessonContent,
    },
  },
};

export function getLessonBlocks(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
): LessonBlock[] | null {
  return lessonContentMap[courseSlug]?.[variantSlug]?.[moduleSlug]?.[lessonSlug] ?? null;
}