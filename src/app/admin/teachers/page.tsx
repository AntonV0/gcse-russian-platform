import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import { setTeacherRoleAction } from "@/app/actions/admin/admin-user-actions";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";

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
        <FeedbackBanner
          tone="success"
          title="Teacher account updated"
          description={params.success}
          className="mb-4"
        />
      ) : null}

      {params.error ? (
        <FeedbackBanner
          tone="danger"
          title="Teacher update failed"
          description={params.error}
          className="mb-4"
        />
      ) : null}

      <PanelCard
        title="Filter teachers"
        description="Search by name, email, or teaching group."
        tone="admin"
        className="mb-6"
      >
        <form>
          <div className="grid gap-4 md:grid-cols-[2fr_auto]">
            <FormField label="Search">
              <Input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Name, email, or teaching group"
              />
            </FormField>

            <InlineActions className="items-end md:pt-6">
              <Button type="submit" variant="primary" icon="filter">
                Apply
              </Button>

              <Button href="/admin/teachers" variant="secondary" icon="back">
                Reset
              </Button>
            </InlineActions>
          </div>
        </form>
      </PanelCard>

      <PanelCard
        title={`Teachers (${filteredTeachers.length})`}
        description="Accounts with admin or teacher permissions, including their group links."
        tone="admin"
        contentClassName="space-y-3"
      >
        {filteredTeachers.length === 0 ? (
          <EmptyState
            icon="users"
            title="No teacher accounts found"
            description="Try a broader search or clear the active filter."
            action={
              <Button href="/admin/teachers" variant="secondary" icon="back">
                Reset search
              </Button>
            }
          />
        ) : (
          filteredTeachers.map((teacher) => (
            <CardListItem
              key={teacher.id}
              title={getPersonLabel(teacher)}
              subtitle={teacher.email || "No email"}
              badges={
                <>
                  {teacher.roles.map((role) => (
                    <Badge key={role} tone="info" icon="users">
                      {formatRole(role)}
                    </Badge>
                  ))}

                  {teacher.groupNames.map((groupName) => (
                    <Badge key={groupName} tone="muted" icon="users">
                      {groupName}
                    </Badge>
                  ))}
                </>
              }
              actions={
                <InlineActions>
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
                    icon="preview"
                  >
                    View
                  </Button>
                </InlineActions>
              }
            />
          ))
        )}
      </PanelCard>
    </main>
  );
}
