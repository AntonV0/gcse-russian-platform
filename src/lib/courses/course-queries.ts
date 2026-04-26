import { createClient } from "@/lib/supabase/server";

import {
  COURSE_SELECT,
  LESSON_SELECT,
  MODULE_SELECT,
  VARIANT_SELECT,
} from "./selects";
import type {
  DbCourse,
  DbCourseVariant,
  DbLesson,
  DbModule,
  LessonAccessMeta,
} from "./types";

export async function getCoursesDb(): Promise<DbCourse[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(COURSE_SELECT)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }

  return (data ?? []) as DbCourse[];
}

export async function getCourseBySlugDb(courseSlug: string): Promise<DbCourse | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(COURSE_SELECT)
    .eq("slug", courseSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching course:", { courseSlug, error });
    return null;
  }

  return (data as DbCourse | null) ?? null;
}

export async function getCourseByIdDb(courseId: string): Promise<DbCourse | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(COURSE_SELECT)
    .eq("id", courseId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching course by id:", { courseId, error });
    return null;
  }

  return (data as DbCourse | null) ?? null;
}

export async function getVariantsByCourseIdDb(
  courseId: string
): Promise<DbCourseVariant[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("course_variants")
    .select(VARIANT_SELECT)
    .eq("course_id", courseId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching variants by course id:", { courseId, error });
    return [];
  }

  return (data ?? []) as DbCourseVariant[];
}

export async function getVariantBySlugForCourseIdDb(
  courseId: string,
  variantSlug: string
): Promise<DbCourseVariant | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("course_variants")
    .select(VARIANT_SELECT)
    .eq("course_id", courseId)
    .eq("slug", variantSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching variant:", { courseId, variantSlug, error });
    return null;
  }

  return (data as DbCourseVariant | null) ?? null;
}

export async function getVariantByIdDb(
  variantId: string
): Promise<DbCourseVariant | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("course_variants")
    .select(VARIANT_SELECT)
    .eq("id", variantId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching variant by id:", { variantId, error });
    return null;
  }

  return (data as DbCourseVariant | null) ?? null;
}

export async function getModulesByVariantIdDb(
  courseVariantId: string
): Promise<DbModule[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("modules")
    .select(MODULE_SELECT)
    .eq("course_variant_id", courseVariantId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching modules by variant id:", {
      courseVariantId,
      error,
    });
    return [];
  }

  return (data ?? []) as DbModule[];
}

export async function getModuleBySlugForVariantIdDb(
  courseVariantId: string,
  moduleSlug: string
): Promise<DbModule | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("modules")
    .select(MODULE_SELECT)
    .eq("course_variant_id", courseVariantId)
    .eq("slug", moduleSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching module:", {
      courseVariantId,
      moduleSlug,
      error,
    });
    return null;
  }

  return (data as DbModule | null) ?? null;
}

export async function getModuleByIdDb(moduleId: string): Promise<DbModule | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("modules")
    .select(MODULE_SELECT)
    .eq("id", moduleId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching module by id:", { moduleId, error });
    return null;
  }

  return (data as DbModule | null) ?? null;
}

export async function getLessonsByModuleIdDb(moduleId: string): Promise<DbLesson[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(LESSON_SELECT)
    .eq("module_id", moduleId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lessons by module id:", { moduleId, error });
    return [];
  }

  return (data ?? []) as DbLesson[];
}

export async function getLessonsByModuleIdsDb(moduleIds: string[]): Promise<DbLesson[]> {
  if (moduleIds.length === 0) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(LESSON_SELECT)
    .in("module_id", moduleIds)
    .order("module_id", { ascending: true })
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lessons by module ids:", { moduleIds, error });
    return [];
  }

  return (data ?? []) as DbLesson[];
}

export async function getLessonByIdDb(lessonId: string): Promise<DbLesson | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(LESSON_SELECT)
    .eq("id", lessonId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching lesson by id:", { lessonId, error });
    return null;
  }

  return (data as DbLesson | null) ?? null;
}

export async function getLessonBySlugForModuleIdDb(
  moduleId: string,
  lessonSlug: string
): Promise<DbLesson | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(LESSON_SELECT)
    .eq("module_id", moduleId)
    .eq("slug", lessonSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching lesson:", { moduleId, lessonSlug, error });
    return null;
  }

  return (data as DbLesson | null) ?? null;
}

export async function getLessonAccessMetaDb(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<LessonAccessMeta | null> {
  const supabase = await createClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (courseError) {
    console.error("Error fetching course for lesson access:", {
      courseSlug,
      error: courseError,
    });
    return null;
  }

  if (!course) return null;

  const { data: variant, error: variantError } = await supabase
    .from("course_variants")
    .select("id")
    .eq("course_id", course.id)
    .eq("slug", variantSlug)
    .maybeSingle();

  if (variantError) {
    console.error("Error fetching variant for lesson access:", {
      courseSlug,
      variantSlug,
      error: variantError,
    });
    return null;
  }

  if (!variant) return null;

  const { data: courseModule, error: moduleError } = await supabase
    .from("modules")
    .select("id")
    .eq("course_variant_id", variant.id)
    .eq("slug", moduleSlug)
    .maybeSingle();

  if (moduleError) {
    console.error("Error fetching module for lesson access:", {
      courseSlug,
      variantSlug,
      moduleSlug,
      error: moduleError,
    });
    return null;
  }

  if (!courseModule) return null;

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id, slug, is_trial_visible, requires_paid_access, available_in_volna")
    .eq("module_id", courseModule.id)
    .eq("slug", lessonSlug)
    .maybeSingle();

  if (lessonError) {
    console.error("Error fetching lesson access metadata:", {
      courseSlug,
      variantSlug,
      moduleSlug,
      lessonSlug,
      error: lessonError,
    });
    return null;
  }

  return lesson ?? null;
}
