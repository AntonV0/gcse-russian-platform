import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { setTeacherRoleAction } from "@/app/actions/admin/admin-user-actions";
import { appIcons } from "@/lib/shared/icons";

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  is_admin: boolean;
  is_teacher: boolean;
  created_at: string;
};

type TeachingGroupMemberRow = {
  user_id: string;
  member_role: string;
  group_id: string;
};

type TeachingGroupRow = {
  id: string;
  name: string;
};

type TeacherCard = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  roles: string[];
  groupNames: string[];
  isTeacher: boolean;
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

function matchesSearch(teacher: TeacherCard, search: string) {
  if (!search) return true;

  const haystack = [
    teacher.full_name ?? "",
    teacher.display_name ?? "",
    teacher.email ?? "",
    ...teacher.groupNames,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(search.toLowerCase());
}

export default async function AdminTeachersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    success?: string;
    error?: string;
  }>;
}) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const params = (await searchParams) ?? {};
  const q = (params.q ?? "").trim();
  const currentPathWithFilters = `/admin/teachers?q=${encodeURIComponent(q)}`;

  const supabase = await createClient();

  const [{ data: profiles }, { data: memberships }, { data: groups }] = await Promise.all(
    [
      supabase
        .from("profiles")
        .select("id, email, full_name, display_name, is_admin, is_teacher, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("teaching_group_members").select("user_id, member_role, group_id"),
      supabase.from("teaching_groups").select("id, name"),
    ]
  );

  const profileRows = (profiles ?? []) as ProfileRow[];
  const membershipRows = (memberships ?? []) as TeachingGroupMemberRow[];
  const groupRows = (groups ?? []) as TeachingGroupRow[];

  const groupMap = new Map(groupRows.map((group) => [group.id, group.name]));

  const teacherMemberships = membershipRows.filter(
    (member) => member.member_role === "teacher"
  );

  const groupsMap = new Map<string, Set<string>>();

  for (const membership of teacherMemberships) {
    if (!groupsMap.has(membership.user_id)) {
      groupsMap.set(membership.user_id, new Set<string>());
    }

    const groupName = groupMap.get(membership.group_id);
    if (groupName) {
      groupsMap.get(membership.user_id)?.add(groupName);
    }
  }

  const teacherCards: TeacherCard[] = [];

  for (const profile of profileRows) {
    const roles = new Set<string>();

    if (profile.is_admin) roles.add("admin");
    if (profile.is_teacher) roles.add("teacher");

    if (roles.size === 0) continue;

    teacherCards.push({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      display_name: profile.display_name,
      roles: Array.from(roles),
      groupNames: Array.from(groupsMap.get(profile.id) ?? []),
      isTeacher: profile.is_teacher,
    });
  }

  const filteredTeachers = teacherCards.filter((teacher) => matchesSearch(teacher, q));

  return (
    <main>
      <PageHeader title="Teachers" description="Admin and teaching accounts." />

      {params.success ? (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {params.success}
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {params.error}
        </div>
      ) : null}

      <form className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[2fr_auto]">
          <FormField label="Search">
            <Input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Name, email, or teaching group"
            />
          </FormField>

          <div className="flex items-end gap-2">
            <Button type="submit" variant="primary" icon={appIcons.filter}>
              Apply
            </Button>

            <Button href="/admin/teachers" variant="secondary" icon={appIcons.back}>
              Reset
            </Button>
          </div>
        </div>
      </form>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-4 py-3 font-medium">
          Teachers ({filteredTeachers.length})
        </div>

        <div className="divide-y">
          {filteredTeachers.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              No teacher accounts found.
            </div>
          ) : (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between gap-4 px-4 py-4"
              >
                <div>
                  <div className="font-medium">{getPersonLabel(teacher)}</div>

                  <div className="text-sm text-gray-500">
                    {teacher.email || "No email"}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {teacher.roles.map((role) => (
                      <Badge key={role} tone="info" icon={appIcons.users}>
                        {formatRole(role)}
                      </Badge>
                    ))}

                    {teacher.groupNames.map((groupName) => (
                      <Badge key={groupName} tone="muted" icon={appIcons.users}>
                        {groupName}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  {teacher.isTeacher ? (
                    <form action={setTeacherRoleAction}>
                      <input type="hidden" name="userId" value={teacher.id} />
                      <input
                        type="hidden"
                        name="redirectTo"
                        value={currentPathWithFilters}
                      />
                      <input type="hidden" name="mode" value="disable" />
                      <Button type="submit" variant="secondary" size="sm">
                        Remove teacher
                      </Button>
                    </form>
                  ) : null}

                  <Button
                    href={`/admin/teachers/${teacher.id}`}
                    variant="secondary"
                    size="sm"
                    icon={appIcons.preview}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
