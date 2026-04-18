import { getCurrentCourseAccess, getCurrentProfile } from "@/lib/auth/auth";
import { getLessonAccessMetaDb } from "@/lib/courses/course-helpers-db";

export type LessonAccessState = "accessible" | "locked";

export async function getLessonAccessState(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<LessonAccessState> {
  const profile = await getCurrentProfile();

  if (profile?.is_admin) {
    return "accessible";
  }

  if (profile?.is_teacher) {
    return "accessible";
  }

  const lesson = await getLessonAccessMetaDb(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

  if (!lesson) {
    return "locked";
  }

  if (lesson.is_trial_visible) {
    return "accessible";
  }

  const access = await getCurrentCourseAccess(courseSlug, variantSlug);

  if (!access) {
    return "locked";
  }

  if (access.access_mode === "full") {
    return "accessible";
  }

  if (access.access_mode === "volna" && lesson.available_in_volna) {
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
