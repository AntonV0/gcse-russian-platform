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

type TeachingGroupMemberRow = {
  user_id: string;
  member_role: string;
};

type TeacherCard = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  roles: string[];
};

function getPersonLabel(
  profile: Pick<ProfileRow, "full_name" | "display_name" | "email">
) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

function formatRole(role: string) {
  if (role === "admin") return "Admin";
  if (role === "teacher") return "Teacher";
  return role;
}

export default async function AdminTeachersPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const supabase = await createClient();

  const [{ data: profiles }, { data: memberships }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, display_name, is_admin, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("teaching_group_members").select("user_id, member_role"),
  ]);

  const profileRows = (profiles ?? []) as ProfileRow[];
  const membershipRows = (memberships ?? []) as TeachingGroupMemberRow[];

  const teacherMemberships = membershipRows.filter(
    (member) => member.member_role === "teacher"
  );

  const roleMap = new Map<string, Set<string>>();

  for (const membership of teacherMemberships) {
    if (!roleMap.has(membership.user_id)) {
      roleMap.set(membership.user_id, new Set<string>());
    }
    roleMap.get(membership.user_id)?.add(membership.member_role);
  }

  const teacherCards: TeacherCard[] = [];

  for (const profile of profileRows) {
    const roles = new Set<string>();

    if (profile.is_admin) {
      roles.add("admin");
    }

    const teachingRoles = roleMap.get(profile.id);
    if (teachingRoles) {
      for (const role of teachingRoles) {
        roles.add(role);
      }
    }

    if (roles.size === 0) continue;

    teacherCards.push({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      display_name: profile.display_name,
      roles: Array.from(roles),
    });
  }

  return (
    <main>
      <PageHeader title="Teachers" description="Admin and teaching accounts." />

      <div className="rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">
          Teachers ({teacherCards.length})
        </div>

        <div className="divide-y">
          {teacherCards.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              No teacher accounts found.
            </div>
          ) : (
            teacherCards.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div>
                  <div className="font-medium">{getPersonLabel(teacher)}</div>

                  <div className="text-sm text-gray-500">
                    {teacher.email || "No email"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap justify-end gap-2 text-xs">
                    {teacher.roles.map((role) => (
                      <span key={role} className="rounded border px-2 py-0.5">
                        {formatRole(role)}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/admin/teachers/${teacher.id}`}
                    className="rounded border px-2 py-1 text-sm hover:bg-gray-50"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
