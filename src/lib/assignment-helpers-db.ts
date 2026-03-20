import { createClient } from "@/lib/supabase/server";

export type DbAssignment = {
  id: string;
  group_id: string;
  title: string;
  instructions: string | null;
  due_at: string | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type DbAssignmentItem = {
  id: string;
  assignment_id: string;
  item_type: string;
  lesson_id: string | null;
  question_set_id: string | null;
  custom_prompt: string | null;
  position: number;
};

export type DbAssignmentSubmission = {
  id: string;
  assignment_id: string;
  student_user_id: string;
  status: string;
  submitted_text: string | null;
  submitted_at: string | null;
  mark: number | null;
  feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
};

export type StudentAssignmentCard = {
  assignment: DbAssignment;
  items: Array<
    DbAssignmentItem & {
      lesson:
        | {
            id: string;
            slug: string;
            title: string;
            module_slug: string;
            variant_slug: string;
            course_slug: string;
          }
        | null;
    }
  >;
  submission: DbAssignmentSubmission | null;
};

export async function getCurrentUserAssignmentsDb() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return [];

  const { data: memberships, error: membershipError } = await supabase
    .from("teaching_group_members")
    .select("group_id")
    .eq("user_id", user.id);

  if (membershipError || !memberships || memberships.length === 0) {
    return [];
  }

  const groupIds = memberships.map((m) => m.group_id);

  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .in("group_id", groupIds)
    .order("due_at", { ascending: true });

  if (error) {
    console.error("Error fetching current user assignments:", error);
    return [];
  }

  return (data ?? []) as DbAssignment[];
}

export async function getAssignmentItemsDb(assignmentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignment_items")
    .select("*")
    .eq("assignment_id", assignmentId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching assignment items:", { assignmentId, error });
    return [];
  }

  return (data ?? []) as DbAssignmentItem[];
}

export async function getCurrentUserAssignmentSubmissionDb(assignmentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data, error } = await supabase
    .from("assignment_submissions")
    .select("*")
    .eq("assignment_id", assignmentId)
    .eq("student_user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching current user assignment submission:", {
      assignmentId,
      error,
    });
    return null;
  }

  return (data as DbAssignmentSubmission | null) ?? null;
}

export async function getLessonMetaByIdDb(lessonId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(
      `
      id,
      slug,
      title,
      modules!inner (
        slug,
        title,
        course_variants!inner (
          slug,
          courses!inner (
            slug
          )
        )
      )
    `
    )
    .eq("id", lessonId)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching lesson meta by id:", { lessonId, error });
    return null;
  }

  const row = data as any;

  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    module_slug: row.modules.slug as string,
    module_title: row.modules.title as string,
    variant_slug: row.modules.course_variants.slug as string,
    course_slug: row.modules.course_variants.courses.slug as string,
  };
}

export async function getAssignmentItemsWithDetailsDb(assignmentId: string) {
  const items = await getAssignmentItemsDb(assignmentId);

  const detailedItems = await Promise.all(
    items.map(async (item) => {
      if (item.item_type === "lesson" && item.lesson_id) {
        const lesson = await getLessonMetaByIdDb(item.lesson_id);
        return {
          ...item,
          lesson,
        };
      }

      return {
        ...item,
        lesson: null,
      };
    })
  );

  return detailedItems;
}

export async function getStudentAssignmentsWithDetailsDb(): Promise<
  StudentAssignmentCard[]
> {
  const assignments = await getCurrentUserAssignmentsDb();

  const detailed = await Promise.all(
    assignments.map(async (assignment) => {
      const [items, submission] = await Promise.all([
        getAssignmentItemsDb(assignment.id),
        getCurrentUserAssignmentSubmissionDb(assignment.id),
      ]);

      const detailedItems = await Promise.all(
        items.map(async (item) => {
          if (item.item_type === "lesson" && item.lesson_id) {
            const lesson = await getLessonMetaByIdDb(item.lesson_id);
            return {
              ...item,
              lesson,
            };
          }

          return {
            ...item,
            lesson: null,
          };
        })
      );

      return {
        assignment,
        items: detailedItems,
        submission,
      };
    })
  );

  return detailed;
}

export type TeacherSubmissionReviewCard = {
  submission: DbAssignmentSubmission;
  student: {
    id: string;
    full_name: string | null;
    display_name: string | null;
    email: string | null;
  } | null;
};

export async function getAssignmentByIdDb(assignmentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("id", assignmentId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching assignment by id:", { assignmentId, error });
    return null;
  }

  return (data as DbAssignment | null) ?? null;
}

export async function getAssignmentSubmissionsForTeacherDb(assignmentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignment_submissions")
    .select("*")
    .eq("assignment_id", assignmentId)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching assignment submissions for teacher:", {
      assignmentId,
      error,
    });
    return [];
  }

  const submissions = (data ?? []) as DbAssignmentSubmission[];

  const detailed = await Promise.all(
    submissions.map(async (submission) => {
      const { data: student, error: studentError } = await supabase
        .from("profiles")
        .select("id, full_name, display_name, email")
        .eq("id", submission.student_user_id)
        .maybeSingle();

      if (studentError) {
        console.error("Error fetching student profile for submission:", {
          submissionId: submission.id,
          error: studentError,
        });
      }

      return {
        submission,
        student: student ?? null,
      };
    })
  );

  return detailed as TeacherSubmissionReviewCard[];
}

export type TeacherAssignmentListItem = {
  assignment: DbAssignment;
  group: {
    id: string;
    name: string;
  } | null;
  submissionCount: number;
};

export async function getTeacherAssignmentsDb(): Promise<TeacherAssignmentListItem[]> {
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
    console.error("Error fetching teacher memberships:", membershipError);
    return [];
  }

  const teacherGroupIds = memberships
    .filter((m) => m.member_role === "teacher" || m.member_role === "assistant")
    .map((m) => m.group_id);

  if (teacherGroupIds.length === 0) return [];

  const { data: assignments, error: assignmentError } = await supabase
    .from("assignments")
    .select("*")
    .in("group_id", teacherGroupIds)
    .order("due_at", { ascending: true });

  if (assignmentError || !assignments) {
    console.error("Error fetching teacher assignments:", assignmentError);
    return [];
  }

  const results = await Promise.all(
    assignments.map(async (assignment) => {
      const [{ data: group }, { count }] = await Promise.all([
        supabase
          .from("teaching_groups")
          .select("id, name")
          .eq("id", assignment.group_id)
          .maybeSingle(),
        supabase
          .from("assignment_submissions")
          .select("*", { count: "exact", head: true })
          .eq("assignment_id", assignment.id),
      ]);

      return {
        assignment: assignment as DbAssignment,
        group: group ?? null,
        submissionCount: count ?? 0,
      };
    })
  );

  return results;
}


export type TeacherGroupOption = {
  id: string;
  name: string;
  course_id: string | null;
  course_variant_id: string | null;
};

export type LessonOption = {
  id: string;
  title: string;
  slug: string;
  module_slug: string;
  module_title: string;
  variant_slug: string;
  course_slug: string;
};

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
    ? await supabase.from("courses").select("slug").eq("id", group.course_id).maybeSingle()
    : { data: null };

  const moduleMap = new Map(
    modules.map((m) => [m.id, { slug: m.slug, title: m.title }])
  );

  return lessons.map((lesson) => {
    const module = moduleMap.get(lesson.module_id);

    return {
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      module_slug: module?.slug ?? "",
      module_title: module?.title ?? "",
      variant_slug: variant?.slug ?? "",
      course_slug: course?.slug ?? "",
    };
  });
}

export type QuestionSetOption = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
};

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