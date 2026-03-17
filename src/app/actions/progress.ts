"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getLessonPath } from "@/lib/routes";

export async function markLessonComplete(formData: FormData): Promise<void> {
  const courseSlug = String(formData.get("courseSlug") || "");
  const moduleSlug = String(formData.get("moduleSlug") || "");
  const lessonSlug = String(formData.get("lessonSlug") || "");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      course_slug: courseSlug,
      module_slug: moduleSlug,
      lesson_slug: lessonSlug,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,course_slug,module_slug,lesson_slug",
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath(getLessonPath(courseSlug, moduleSlug, lessonSlug));
}

export async function markLessonIncomplete(formData: FormData): Promise<void> {
  const courseSlug = String(formData.get("courseSlug") || "");
  const moduleSlug = String(formData.get("moduleSlug") || "");
  const lessonSlug = String(formData.get("lessonSlug") || "");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      course_slug: courseSlug,
      module_slug: moduleSlug,
      lesson_slug: lessonSlug,
      completed: false,
      completed_at: null,
    },
    {
      onConflict: "user_id,course_slug,module_slug,lesson_slug",
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath(getLessonPath(courseSlug, moduleSlug, lessonSlug));
}