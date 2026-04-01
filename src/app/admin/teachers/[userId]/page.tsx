import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { requireAdminAccess } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  is_admin: boolean;
  created_at: string;
};

type TeachingGroupRow = {
  id: string;
  name: string;
  course_id: string | null;
  course_variant_id: string | null;
  is_active: boolean;
};

type TeachingGroupMemberRow = {
  user_id: string;
  group_id: string;
  member_role: string;
};

function formatDateTime(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPersonLabel(profile: ProfileRow) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

export default async function AdminTeacherProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { userId } = await params;
  const supabase = await createClient();

  const [{ data: profile }, { data: memberships }, { data: groups }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, display_name, is_admin, created_at")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("teaching_group_members")
      .select("user_id, group_id, member_role")
      .eq("user_id", userId),
    supabase
      .from("teaching_groups")
      .select("id, name, course_id, course_variant_id, is_active"),
  ]);

  const teacher = profile as ProfileRow | null;
  const teacherMemberships = (memberships ?? []) as TeachingGroupMemberRow[];
  const teachingGroups = (groups ?? []) as TeachingGroupRow[];

  if (!teacher) {
    return <main>Teacher not found.</main>;
  }

  const groupMap = new Map(teachingGroups.map((group) => [group.id, group]));
  const membershipsWithGroup = teacherMemberships.map((membership) => ({
    ...membership,
    group: groupMap.get(membership.group_id) ?? null,
  }));

  return (
    <main>
      <div className="mb-4">
        <Link href="/admin/teachers" className="text-sm text-blue-600 hover:underline">
          ← Back to teachers
        </Link>
      </div>

      <PageHeader
        title={getPersonLabel(teacher)}
        description="Teacher/admin account overview."
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Profile Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Full name:</span> {teacher.full_name || "—"}
            </div>
            <div>
              <span className="font-medium">Display name:</span>{" "}
              {teacher.display_name || "—"}
            </div>
            <div>
              <span className="font-medium">Email:</span> {teacher.email || "—"}
            </div>
            <div>
              <span className="font-medium">Admin:</span>{" "}
              {teacher.is_admin ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {formatDateTime(teacher.created_at)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Actions</div>

          <div className="space-y-3 px-4 py-4 text-sm text-gray-600">
            <p>Teacher management can be expanded here later.</p>
            <p>Good future actions:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>assign to teaching group</li>
              <li>remove from teaching group</li>
              <li>view assignment workload</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">
          Teaching Group Memberships ({membershipsWithGroup.length})
        </div>

        <div className="divide-y">
          {membershipsWithGroup.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              No teaching group memberships found.
            </div>
          ) : (
            membershipsWithGroup.map((membership) => (
              <div
                key={`${membership.group_id}-${membership.member_role}`}
                className="px-4 py-4 text-sm"
              >
                <div className="font-medium">
                  {membership.group?.name || membership.group_id}
                </div>
                <div className="text-gray-600">Role: {membership.member_role}</div>
                <div className="text-gray-600">
                  Group active: {membership.group?.is_active ? "Yes" : "No"}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
