import { getCurrentCourseAccess } from "@/lib/auth";
import { getLessonBySlug } from "@/lib/course-helpers";

export type LessonAccessState = "accessible" | "locked";

export async function getLessonAccessState(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<LessonAccessState> {
  const lesson = getLessonBySlug(courseSlug, moduleSlug, lessonSlug);

  if (!lesson) {
    return "locked";
  }

  if (lesson.access === "free") {
    return "accessible";
  }

  const access = await getCurrentCourseAccess(courseSlug);

  if (!access) {
    return "locked";
  }

  if (access.access_type === "full") {
    return "accessible";
  }

  if (access.access_type === "volna") {
    return "accessible";
  }

  return "locked";
}

export async function canUserAccessLesson(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<boolean> {
  const accessState = await getLessonAccessState(
    courseSlug,
    moduleSlug,
    lessonSlug
  );

  return accessState === "accessible";
}