import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { requireAdminAccess } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { appIcons } from "@/lib/icons";

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

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
};

type CourseRow = {
  id: string;
  title: string;
  slug: string;
};

type VariantRow = {
  id: string;
  course_id: string;
  title: string;
  slug: string;
};

function getPersonLabel(
  profile: Pick<ProfileRow, "full_name" | "display_name" | "email">
) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

export default async function AdminTeachingGroupsPage() {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const supabase = await createClient();

  const [
    { data: groups },
    { data: memberships },
    { data: profiles },
    { data: courses },
    { data: variants },
  ] = await Promise.all([
    supabase
      .from("teaching_groups")
      .select("id, name, course_id, course_variant_id, is_active")
      .order("name", { ascending: true }),
    supabase.from("teaching_group_members").select("group_id, user_id, member_role"),
    supabase.from("profiles").select("id, email, full_name, display_name"),
    supabase
      .from("courses")
      .select("id, title, slug")
      .order("title", { ascending: true }),
    supabase
      .from("course_variants")
      .select("id, course_id, title, slug")
      .order("title", { ascending: true }),
  ]);

  const groupRows = (groups ?? []) as TeachingGroupRow[];
  const membershipRows = (memberships ?? []) as TeachingGroupMemberRow[];
  const profileRows = (profiles ?? []) as ProfileRow[];
  const courseRows = (courses ?? []) as CourseRow[];
  const variantRows = (variants ?? []) as VariantRow[];

  const profileMap = new Map(profileRows.map((profile) => [profile.id, profile]));
  const courseMap = new Map(courseRows.map((course) => [course.id, course]));
  const variantMap = new Map(variantRows.map((variant) => [variant.id, variant]));

  const counts = new Map<
    string,
    { total: number; teachers: number; students: number; teacherNames: string[] }
  >();

  for (const membership of membershipRows) {
    if (!counts.has(membership.group_id)) {
      counts.set(membership.group_id, {
        total: 0,
        teachers: 0,
        students: 0,
        teacherNames: [],
      });
    }

    const current = counts.get(membership.group_id)!;
    current.total += 1;

    if (membership.member_role === "teacher") {
      current.teachers += 1;
      const profile = profileMap.get(membership.user_id);
      if (profile) {
        current.teacherNames.push(getPersonLabel(profile));
      }
    }

    if (membership.member_role === "student") {
      current.students += 1;
    }
  }

  return (
    <main>
      <div className="mb-6 flex items-start justify-between gap-4">
        <PageHeader
          title="Teaching Groups"
          description="View groups, teacher assignment, and membership structure."
        />

        <Button href="/admin/teaching-groups/new" variant="primary" icon={appIcons.write}>
          New teaching group
        </Button>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-4 py-3 font-medium">
          Teaching Groups ({groupRows.length})
        </div>

        <div className="divide-y">
          {groupRows.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              No teaching groups found.
            </div>
          ) : (
            groupRows.map((group) => {
              const count = counts.get(group.id) ?? {
                total: 0,
                teachers: 0,
                students: 0,
                teacherNames: [],
              };

              const linkedCourse = group.course_id
                ? (courseMap.get(group.course_id) ?? null)
                : null;
              const linkedVariant = group.course_variant_id
                ? (variantMap.get(group.course_variant_id) ?? null)
                : null;

              return (
                <div
                  key={group.id}
                  className="flex items-center justify-between gap-4 px-4 py-4"
                >
                  <Link
                    href={`/admin/teaching-groups/${group.id}`}
                    className="min-w-0 flex-1 hover:text-blue-600"
                  >
                    <div className="font-medium">{group.name}</div>

                    <div className="mt-1 text-sm text-gray-500">
                      Teachers: {count.teachers} · Students: {count.students} · Total:{" "}
                      {count.total}
                    </div>

                    {count.teacherNames.length > 0 ? (
                      <div className="mt-1 text-xs text-gray-500">
                        Teachers: {count.teacherNames.join(", ")}
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <Badge
                        tone={group.is_active ? "success" : "warning"}
                        icon={group.is_active ? appIcons.completed : appIcons.pending}
                      >
                        {group.is_active ? "Active" : "Inactive"}
                      </Badge>

                      {linkedCourse ? (
                        <Badge tone="muted" icon={appIcons.courses}>
                          {linkedCourse.title}
                        </Badge>
                      ) : null}

                      {linkedVariant ? (
                        <Badge tone="muted" icon={appIcons.file}>
                          {linkedVariant.title}
                        </Badge>
                      ) : null}
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <Button
                      href={`/admin/teaching-groups/${group.id}/edit`}
                      variant="secondary"
                      size="sm"
                      icon={appIcons.edit}
                    >
                      Edit
                    </Button>

                    <Button
                      href={`/admin/teaching-groups/${group.id}`}
                      variant="secondary"
                      size="sm"
                      icon={appIcons.preview}
                    >
                      Open
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
