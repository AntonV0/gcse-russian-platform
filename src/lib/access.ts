import { getCurrentCourseAccess } from "@/lib/auth";
import { getLessonBySlug } from "@/lib/course-helpers";

export type LessonAccessState = "accessible" | "locked";

export async function getLessonAccessState(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<LessonAccessState> {
  const lesson = getLessonBySlug(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

  if (!lesson) {
    return "locked";
  }

  if (lesson.access === "free") {
    return "accessible";
  }

  const access = await getCurrentCourseAccess(courseSlug, variantSlug);

  if (!access) {
    return "locked";
  }

  if (access.access_mode === "full") {
    return "accessible";
  }

  if (access.access_mode === "volna") {
    return "accessible";
  }

  return "locked";
}

export async function canUserAccessLesson(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<boolean> {
  const accessState = await getLessonAccessState(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

  return accessState === "accessible";
}