import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import Button from "@/components/ui/button";
import AppIcon from "@/components/ui/app-icon";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { appIcons } from "@/lib/shared/icons";

type ProfileRow = {
  id: string;
  is_admin: boolean;
  is_teacher: boolean;
};

type AccessGrantRow = {
  user_id: string;
  is_active: boolean;
};

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: keyof typeof appIcons;
}) {
  return (
    <div className="rounded-xl border bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <AppIcon icon={appIcons[icon]} size={16} />
        <span>{label}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

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
      <div className="mb-8 flex items-start justify-between gap-4">
        <PageHeader
          title="Admin Panel"
          description="Internal content, users, and teaching management tools."
        />

        <Button href="/admin/ui" variant="secondary" icon="uiLab">
          Open UI Lab
        </Button>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Courses" value={courseCount ?? 0} icon="courses" />
        <StatCard label="Variants" value={variantCount ?? 0} icon="file" />
        <StatCard label="Modules" value={moduleCount ?? 0} icon="lessonContent" />
        <StatCard label="Lessons" value={lessonCount ?? 0} icon="lessons" />
        <StatCard label="Students" value={studentProfiles.length} icon="user" />
        <StatCard label="Active Students" value={activeStudents} icon="completed" />
        <StatCard label="Inactive Students" value={inactiveStudents} icon="pending" />
        <StatCard label="Teachers / Admins" value={teacherProfiles.length} icon="users" />
        <StatCard label="Teaching Groups" value={teachingGroupCount ?? 0} icon="users" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/ui" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="UI Lab">
              <div className="flex items-start gap-3">
                <AppIcon icon="uiLab" className="mt-0.5 text-gray-700" />
                <div>
                  Preview buttons, cards, badges, and Lucide icons before using them in
                  the platform.
                </div>
              </div>
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/content" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Content">
              <div className="flex items-start gap-3">
                <AppIcon icon="courses" className="mt-0.5 text-gray-700" />
                <div>Manage courses, variants, modules, and lessons.</div>
              </div>
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/question-sets" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Question Sets">
              <div className="flex items-start gap-3">
                <AppIcon icon="help" className="mt-0.5 text-gray-700" />
                <div>Create and manage reusable question sets.</div>
              </div>
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/question-sets/templates" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Templates">
              <div className="flex items-start gap-3">
                <AppIcon icon="file" className="mt-0.5 text-gray-700" />
                <div>Manage reusable question set templates.</div>
              </div>
            </DashboardCard>
          </div>
        </Link>

        <Link href="/teacher/assignments" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Assignments">
              <div className="flex items-start gap-3">
                <AppIcon icon="assignments" className="mt-0.5 text-gray-700" />
                <div>Review and manage teacher assignments.</div>
              </div>
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/teaching-groups" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Teaching Groups">
              <div className="flex items-start gap-3">
                <AppIcon icon="users" className="mt-0.5 text-gray-700" />
                <div>View teaching groups, membership, and structure.</div>
              </div>
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/students" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Students">
              <div className="flex items-start gap-3">
                <AppIcon icon="user" className="mt-0.5 text-gray-700" />
                <div>View student accounts and access groupings.</div>
              </div>
            </DashboardCard>
          </div>
        </Link>

        <Link href="/admin/teachers" className="block">
          <div className="transition hover:-translate-y-0.5">
            <DashboardCard title="Teachers">
              <div className="flex items-start gap-3">
                <AppIcon icon="users" className="mt-0.5 text-gray-700" />
                <div>View admin and teaching accounts.</div>
              </div>
            </DashboardCard>
          </div>
        </Link>
      </section>
    </main>
  );
}
