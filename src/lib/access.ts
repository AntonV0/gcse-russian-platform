import { getCurrentCourseAccess } from "@/lib/auth";
import { getLessonBySlug } from "@/lib/course-helpers";

export async function canUserAccessLesson(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<boolean> {
  const lesson = getLessonBySlug(courseSlug, moduleSlug, lessonSlug);

  if (!lesson) return false;

  // Free lessons are always accessible
  if (lesson.access === "free") {
    return true;
  }

  const access = await getCurrentCourseAccess(courseSlug);

  if (!access) return false;

  // Trial users can only access free lessons
  if (access.access_type === "trial") {
    return false;
  }

  // Full access
  if (access.access_type === "full") {
    return true;
  }

  // Future: Volna / teacher mode
  if (access.access_type === "volna") {
    return true;
  }

  return false;
}