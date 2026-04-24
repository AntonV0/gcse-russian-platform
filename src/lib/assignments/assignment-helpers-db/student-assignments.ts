import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { isCurrentUserAdminDb } from "./auth";
import { getQuestionSetMetaByIdDb } from "./options";
import type {
  DbAssignment,
  DbAssignmentItem,
  DbAssignmentSubmission,
  StudentAssignmentCard,
} from "./types";

export async function getCurrentUserAssignmentsDb() {
  const supabase = await createClient();

  const user = await getCurrentUser();

  if (!user) return [];

  const isAdmin = await isCurrentUserAdminDb();

  if (isAdmin) {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .order("due_at", { ascending: true });

    if (error) {
      console.error("Error fetching assignments for admin:", error);
      return [];
    }

    return (data ?? []) as DbAssignment[];
  }

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

  const user = await getCurrentUser();

  if (!user) return null;

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

  type LessonMetaRow = {
    id: string;
    slug: string;
    title: string;
    modules: {
      slug: string;
      title: string;
      course_variants: {
        slug: string;
        courses: {
          slug: string;
        };
      };
    };
  };

  const row = data as unknown as LessonMetaRow;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    module_slug: row.modules.slug,
    module_title: row.modules.title,
    variant_slug: row.modules.course_variants.slug,
    course_slug: row.modules.course_variants.courses.slug,
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
          questionSet: null,
        };
      }

      if (item.item_type === "question_set" && item.question_set_id) {
        const questionSet = await getQuestionSetMetaByIdDb(item.question_set_id);
        return {
          ...item,
          lesson: null,
          questionSet,
        };
      }

      return {
        ...item,
        lesson: null,
        questionSet: null,
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

export async function getStudentAssignmentByIdDb(assignmentId: string) {
  const assignments = await getCurrentUserAssignmentsDb();
  return assignments.find((assignment) => assignment.id === assignmentId) ?? null;
}
