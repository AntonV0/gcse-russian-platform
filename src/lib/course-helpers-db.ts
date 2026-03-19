import { createClient } from "@/lib/supabase/server";

export async function getCourseBySlugDb(courseSlug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching course:", error);
    return null;
  }

  return data;
}

export async function getVariantBySlugDb(
  courseSlug: string,
  variantSlug: string
) {
  const supabase = await createClient();

  const course = await getCourseBySlugDb(courseSlug);
  if (!course) return null;

  const { data, error } = await supabase
    .from("course_variants")
    .select("*")
    .eq("course_id", course.id)
    .eq("slug", variantSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching variant:", error);
    return null;
  }

  return data;
}

export async function getModuleBySlugDb(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string
) {
  const supabase = await createClient();

  const variant = await getVariantBySlugDb(courseSlug, variantSlug);
  if (!variant) return null;

  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("course_variant_id", variant.id)
    .eq("slug", moduleSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching module:", error);
    return null;
  }

  return data;
}

export async function getLessonBySlugDb(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  const supabase = await createClient();

  const module = await getModuleBySlugDb(courseSlug, variantSlug, moduleSlug);
  if (!module) return null;

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", module.id)
    .eq("slug", lessonSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }

  return data;
}

export async function getLessonsByModuleDb(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string
) {
  const supabase = await createClient();

  const module = await getModuleBySlugDb(courseSlug, variantSlug, moduleSlug);
  if (!module) return [];

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", module.id)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lessons by module:", error);
    return [];
  }

  return data ?? [];
}