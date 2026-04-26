import { createClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  is_admin: boolean;
  is_teacher: boolean;
};

type AccessGrantRow = {
  user_id: string;
  is_active: boolean;
};

export type AdminDashboardSummary = {
  courseCount: number;
  variantCount: number;
  moduleCount: number;
  lessonCount: number;
  teachingGroupCount: number;
  studentCount: number;
  teacherCount: number;
  activeStudents: number;
  inactiveStudents: number;
};

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const supabase = await createClient();

  const [
    { count: courseCount },
    { count: variantCount },
    { count: moduleCount },
    { count: lessonCount },
    { count: teachingGroupCount },
    { data: profiles },
    { data: accessGrants },
  ] = await Promise.all([
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("course_variants").select("*", { count: "exact", head: true }),
    supabase.from("modules").select("*", { count: "exact", head: true }),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("teaching_groups").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("id, is_admin, is_teacher"),
    supabase.from("user_access_grants").select("user_id, is_active"),
  ]);

  const profileRows = (profiles ?? []) as ProfileRow[];
  const accessGrantRows = (accessGrants ?? []) as AccessGrantRow[];

  const activeGrantUserIds = new Set(
    accessGrantRows.filter((grant) => grant.is_active).map((grant) => grant.user_id)
  );

  const studentProfiles = profileRows.filter(
    (profile) => !profile.is_admin && !profile.is_teacher
  );

  const teacherProfiles = profileRows.filter(
    (profile) => profile.is_admin || profile.is_teacher
  );

  const activeStudents = studentProfiles.filter((profile) =>
    activeGrantUserIds.has(profile.id)
  ).length;

  return {
    courseCount: courseCount ?? 0,
    variantCount: variantCount ?? 0,
    moduleCount: moduleCount ?? 0,
    lessonCount: lessonCount ?? 0,
    teachingGroupCount: teachingGroupCount ?? 0,
    studentCount: studentProfiles.length,
    teacherCount: teacherProfiles.length,
    activeStudents,
    inactiveStudents: studentProfiles.length - activeStudents,
  };
}
