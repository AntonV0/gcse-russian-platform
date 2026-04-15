import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { requireAdminAccess } from "@/lib/admin-auth";
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

export default async function AdminPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

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

  const inactiveStudents = studentProfiles.filter(
    (profile) => !activeGrantUserIds.has(profile.id)
  ).length;

  return (
    <main>
      <PageHeader
        title="Admin Panel"
        description="Internal content, users, and teaching management tools."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border bg-white px-4 py-4">
          <div className="text-sm text-gray-500">Courses</div>
          <div className="mt-1 text-2xl font-semibold">{courseCount ?? 0}</div>
        </div>

        <div className="rounded-lg border bg-white px-4 py-4">
          <div className="text-sm text-gray-500">Variants</div>
          <div className="mt-1 text-2xl font-semibold">{variantCount ?? 0}</div>
        </div>

        <div className="rounded-lg border bg-white px-4 py-4">
          <div className="text-sm text-gray-500">Modules</div>
          <div className="mt-1 text-2xl font-semibold">{moduleCount ?? 0}</div>
        </div>

        <div className="rounded-lg border bg-white px-4 py-4">
          <div className="text-sm text-gray-500">Lessons</div>
          <div className="mt-1 text-2xl font-semibold">{lessonCount ?? 0}</div>
        </div>

        <div className="rounded-lg border bg-white px-4 py-4">
          <div className="text-sm text-gray-500">Students</div>
          <div className="mt-1 text-2xl font-semibold">{studentProfiles.length}</div>
        </div>

        <div className="rounded-lg border bg-white px-4 py-4">
          <div className="text-sm text-gray-500">Active Students</div>
          <div className="mt-1 text-2xl font-semibold">{activeStudents}</div>
        </div>

        <div className="rounded-lg border bg-white px-4 py-4">
          <div className="text-sm text-gray-500">Inactive Students</div>
          <div className="mt-1 text-2xl font-semibold">{inactiveStudents}</div>
        </div>

        <div className="rounded-lg border bg-white px-4 py-4">
          <div className="text-sm text-gray-500">Teachers / Admins</div>
          <div className="mt-1 text-2xl font-semibold">{teacherProfiles.length}</div>
        </div>

        <div className="rounded-lg border bg-white px-4 py-4 md:col-span-2 xl:col-span-1">
          <div className="text-sm text-gray-500">Teaching Groups</div>
          <div className="mt-1 text-2xl font-semibold">{teachingGroupCount ?? 0}</div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/ui" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="UI Lab">
              Preview buttons, cards, badges, and Lucide icons before using them in the
              platform.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/content" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Content">
              Manage courses, variants, modules, and lessons.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/question-sets" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Question Sets">
              Create and manage reusable question sets.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/question-sets/templates" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Templates">
              Manage reusable question set templates.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/teacher/assignments" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Assignments">
              Review and manage teacher assignments.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/teaching-groups" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Teaching Groups">
              View teaching groups, membership, and structure.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/students" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Students">
              View student accounts and access groupings.
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/teachers" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Teachers">
              View admin and teaching accounts.
            </DashboardCard>
          </div>
        </Link>
      </section>
    </main>
  );
}
