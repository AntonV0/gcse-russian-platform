import { createClient } from "@/lib/supabase/server";
import type { LessonOption, QuestionSetOption, TeacherGroupOption } from "./types";

export async function getTeacherGroupsDb(): Promise<TeacherGroupOption[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return [];

  const { data: memberships, error: membershipError } = await supabase
    .from("teaching_group_members")
    .select("group_id, member_role")
    .eq("user_id", user.id);

  if (membershipError || !memberships) {
    console.error("Error fetching teacher groups:", membershipError);
    return [];
  }

  const teacherGroupIds = memberships
    .filter((m) => m.member_role === "teacher" || m.member_role === "assistant")
    .map((m) => m.group_id);

  if (teacherGroupIds.length === 0) return [];

  const { data, error } = await supabase
    .from("teaching_groups")
    .select("id, name, course_id, course_variant_id")
    .in("id", teacherGroupIds)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching teacher group options:", error);
    return [];
  }

  return data ?? [];
}

export async function getLessonOptionsForGroupDb(
  groupId: string
): Promise<LessonOption[]> {
  const supabase = await createClient();

  const { data: group, error: groupError } = await supabase
    .from("teaching_groups")
    .select("id, course_id, course_variant_id")
    .eq("id", groupId)
    .maybeSingle();

  if (groupError || !group || !group.course_variant_id) {
    console.error("Error fetching group for lesson options:", {
      groupId,
      error: groupError,
    });
    return [];
  }

  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("id, slug, title")
    .eq("course_variant_id", group.course_variant_id)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (modulesError || !modules) {
    console.error("Error fetching modules for lesson options:", {
      groupId,
      error: modulesError,
    });
    return [];
  }

  const moduleIds = modules.map((m) => m.id);
  if (moduleIds.length === 0) return [];

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, module_id, slug, title")
    .in("module_id", moduleIds)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (lessonsError || !lessons) {
    console.error("Error fetching lessons for lesson options:", {
      groupId,
      error: lessonsError,
    });
    return [];
  }

  const { data: variant } = await supabase
    .from("course_variants")
    .select("slug")
    .eq("id", group.course_variant_id)
    .maybeSingle();

  const { data: course } = group.course_id
    ? await supabase
        .from("courses")
        .select("slug")
        .eq("id", group.course_id)
        .maybeSingle()
    : { data: null };

  const moduleMap = new Map(modules.map((m) => [m.id, { slug: m.slug, title: m.title }]));

  return lessons.map((lesson) => {
    const lessonModule = moduleMap.get(lesson.module_id);

    return {
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      module_slug: lessonModule?.slug ?? "",
      module_title: lessonModule?.title ?? "",
      variant_slug: variant?.slug ?? "",
      course_slug: course?.slug ?? "",
    };
  });
}

export async function getQuestionSetOptionsDb(): Promise<QuestionSetOption[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_sets")
    .select("id, slug, title, description")
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching question set options:", error);
    return [];
  }

  return data ?? [];
}

export async function getQuestionSetMetaByIdDb(questionSetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_sets")
    .select("id, slug, title, description")
    .eq("id", questionSetId)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching question set meta by id:", {
      questionSetId,
      error,
    });
    return null;
  }

  return data as {
    id: string;
    slug: string | null;
    title: string;
    description: string | null;
  };
}

export async function getAssignmentsUsingQuestionSetDb(questionSetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignment_items")
    .select(
      `
      assignment:assignments (
        id,
        title,
        status,
        due_at
      )
    `
    )
    .eq("item_type", "question_set")
    .eq("question_set_id", questionSetId);

  if (error) {
    console.error("Error loading question set usage:", error);
    throw new Error("Failed to load question set usage");
  }

  const flattened = (data ?? []).flatMap((row) => {
    const assignment = row.assignment;

    if (!assignment) {
      return [];
    }

    return Array.isArray(assignment) ? assignment : [assignment];
  }) as {
    id: string;
    title: string;
    status: string;
    due_at?: string | null;
  }[];

  const uniqueAssignments = Array.from(
    new Map(flattened.map((assignment) => [assignment.id, assignment])).values()
  );

  return uniqueAssignments;
}
