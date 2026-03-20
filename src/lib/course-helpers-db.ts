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

export async function getModulesByVariantDb(
  courseSlug: string,
  variantSlug: string
) {
  const supabase = await createClient();

  const variant = await getVariantBySlugDb(courseSlug, variantSlug);
  if (!variant) return [];

  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("course_variant_id", variant.id)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching modules by variant:", error);
    return [];
  }

  return data ?? [];
}

export async function getVariantsByCourseDb(courseSlug: string) {
  const supabase = await createClient();

  const course = await getCourseBySlugDb(courseSlug);
  if (!course) return [];

  const { data, error } = await supabase
    .from("course_variants")
    .select("*")
    .eq("course_id", course.id)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching variants by course:", error);
    return [];
  }

  return data ?? [];
}

export async function getCoursesDb() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }

  return data ?? [];
}

export async function getAdjacentLessonsDb(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<{
  previousLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
}> {
  const lessons = await getLessonsByModuleDb(
    courseSlug,
    variantSlug,
    moduleSlug
  );

  const currentIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug);

  if (currentIndex === -1) {
    return {
      previousLesson: null,
      nextLesson: null,
    };
  }

  return {
    previousLesson: currentIndex > 0 ? lessons[currentIndex - 1] : null,
    nextLesson:
      currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
  };
}