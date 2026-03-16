import type { LessonBlock } from "@/types/lesson";
import { howTheCourseWorksLessonBlocks } from "./how-the-course-works";
import { gettingStartedLessonBlocks } from "./getting-started";

export const introductionToTheCourseLessonContent: Record<string, LessonBlock[]> = {
  "how-the-course-works": howTheCourseWorksLessonBlocks,
  "getting-started": gettingStartedLessonBlocks,
};