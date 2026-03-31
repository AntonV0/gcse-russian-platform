import { createClient } from "@/lib/supabase/server";

export type DbCourse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type DbCourseVariant = {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string | null;
  position: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type DbModule = {
  id: string;
  course_variant_id: string;
  slug: string;
  title: string;
  description: string | null;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type DbLesson = {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  summary: string | null;
  lesson_type: string;
  position: number;
  estimated_minutes: number | null;
  is_published: boolean;
  is_trial_visible: boolean;
  requires_paid_access: boolean;
  available_in_volna: boolean;
  content_source: string;
  content_key: string | null;
  created_at: string;
  updated_at: string;
};

export async function getCoursesDb(): Promise<DbCourse[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
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
    .select("*")
    .eq("module_id", moduleId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching lessons by module id:", { moduleId, error });
    return [];
  }

  return (data ?? []) as DbLesson[];
}

export async function getLessonBySlugForModuleIdDb(
  moduleId: string,
  lessonSlug: string
): Promise<DbLesson | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", moduleId)
    .eq("slug", lessonSlug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching lesson:", { moduleId, lessonSlug, error });
    return null;
  }

  return (data as DbLesson | null) ?? null;
}

/**
 * Page-level loaders
 * These are the preferred way to fetch structure without repeated helper chaining.
 */

export async function loadCoursePageData(courseSlug: string) {
  const course = await getCourseBySlugDb(courseSlug);
  if (!course) {
    return { course: null, variants: [] as DbCourseVariant[] };
  }

  const variants = await getVariantsByCourseIdDb(course.id);

  return { course, variants };
}

export async function loadVariantPageData(courseSlug: string, variantSlug: string) {
  const course = await getCourseBySlugDb(courseSlug);
  if (!course) {
    return {
      course: null,
      variant: null,
      modules: [] as DbModule[],
    };
  }

  const variant = await getVariantBySlugForCourseIdDb(course.id, variantSlug);
  if (!variant) {
    return {
      course,
      variant: null,
      modules: [] as DbModule[],
    };
  }

  const modules = await getModulesByVariantIdDb(variant.id);

  return { course, variant, modules };
}

export async function loadModulePageData(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string
) {
  const course = await getCourseBySlugDb(courseSlug);
  if (!course) {
    return {
      course: null,
      variant: null,
      module: null,
      lessons: [] as DbLesson[],
    };
  }

  const variant = await getVariantBySlugForCourseIdDb(course.id, variantSlug);
  if (!variant) {
    return {
      course,
      variant: null,
      module: null,
      lessons: [] as DbLesson[],
    };
  }

  const courseModule = await getModuleBySlugForVariantIdDb(variant.id, moduleSlug);
  if (!courseModule) {
    return {
      course,
      variant,
      module: null,
      lessons: [] as DbLesson[],
    };
  }

  const lessons = await getLessonsByModuleIdDb(courseModule.id);

  return { course, variant, module: courseModule, lessons };
}

export async function loadLessonPageData(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  const course = await getCourseBySlugDb(courseSlug);
  if (!course) {
    return {
      course: null,
      variant: null,
      module: null,
      lesson: null,
      lessons: [] as DbLesson[],
      previousLesson: null as DbLesson | null,
      nextLesson: null as DbLesson | null,
    };
  }

  const variant = await getVariantBySlugForCourseIdDb(course.id, variantSlug);
  if (!variant) {
    return {
      course,
      variant: null,
      module: null,
      lesson: null,
      lessons: [] as DbLesson[],
      previousLesson: null as DbLesson | null,
      nextLesson: null as DbLesson | null,
    };
  }

  const courseModule = await getModuleBySlugForVariantIdDb(variant.id, moduleSlug);
  if (!courseModule) {
    return {
      course,
      variant,
      module: null,
      lesson: null,
      lessons: [] as DbLesson[],
      previousLesson: null as DbLesson | null,
      nextLesson: null as DbLesson | null,
    };
  }

  const lessons = await getLessonsByModuleIdDb(courseModule.id);
  const currentIndex = lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  const lesson = currentIndex >= 0 ? lessons[currentIndex] : null;
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  return {
    course,
    variant,
    module: courseModule,
    lesson,
    lessons,
    previousLesson,
    nextLesson,
  };
}

export async function getLessonAccessMetaDb(
  courseSlug: string,
  variantSlug: string,
  moduleSlug: string,
  lessonSlug: string
): Promise<{
  id: string;
  slug: string;
  is_trial_visible: boolean;
  requires_paid_access: boolean;
  available_in_volna: boolean;
} | null> {
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
