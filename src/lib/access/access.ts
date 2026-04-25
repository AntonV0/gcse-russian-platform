import { getCurrentCourseAccess, getCurrentProfile } from "@/lib/auth/auth";
import { getLessonAccessMetaDb } from "@/lib/courses/course-helpers-db";

export type LessonAccessState = "accessible" | "locked";

type LessonAccessProfile = {
  is_admin?: boolean | null;
  is_teacher?: boolean | null;
} | null;

type LessonAccessGrant = {
  access_mode?: string | null;
} | null;

type LessonAccessMeta = {
  is_trial_visible: boolean;
  available_in_volna: boolean;
} | null;

export function getLessonAccessStateFromMeta(
  lesson: LessonAccessMeta,
  profile: LessonAccessProfile,
  access: LessonAccessGrant
): LessonAccessState {
  if (profile?.is_admin) {
    return "accessible";
  }

  if (profile?.is_teacher) {
    return "accessible";
  }

  if (!lesson) {
    return "locked";
  }

  if (lesson.is_trial_visible) {
    return "accessible";
  }

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

export async function getLessonAccessState(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<LessonAccessState> {
  const profile = await getCurrentProfile();

  const lesson = await getLessonAccessMetaDb(
    courseSlug,
    variantSlug,
    moduleSlug,
    lessonSlug
  );

  const needsAccessGrant = !profile?.is_admin && !profile?.is_teacher && !lesson?.is_trial_visible;
  const access = needsAccessGrant
    ? await getCurrentCourseAccess(courseSlug, variantSlug)
    : null;

  return getLessonAccessStateFromMeta(lesson, profile, access);
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
