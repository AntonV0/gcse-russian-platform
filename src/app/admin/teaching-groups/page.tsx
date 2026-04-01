import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { requireAdminAccess } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

type TeachingGroupRow = {
  id: string;
  name: string;
  course_id: string | null;
  course_variant_id: string | null;
  is_active: boolean;
};

type TeachingGroupMemberRow = {
  group_id: string;
  member_role: string;
};

export default async function AdminTeachingGroupsPage() {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const supabase = await createClient();

  const [{ data: groups }, { data: memberships }] = await Promise.all([
    supabase
      .from("teaching_groups")
      .select("id, name, course_id, course_variant_id, is_active")
      .order("name", { ascending: true }),
    supabase.from("teaching_group_members").select("group_id, member_role"),
  ]);

  const groupRows = (groups ?? []) as TeachingGroupRow[];
  const membershipRows = (memberships ?? []) as TeachingGroupMemberRow[];

  const counts = new Map<string, { total: number; teachers: number; students: number }>();

  for (const membership of membershipRows) {
    if (!counts.has(membership.group_id)) {
      counts.set(membership.group_id, { total: 0, teachers: 0, students: 0 });
    }

    const current = counts.get(membership.group_id)!;
    current.total += 1;

    if (membership.member_role === "teacher") current.teachers += 1;
    if (membership.member_role === "student") current.students += 1;
  }

  return (
    <main>
      <PageHeader
        title="Teaching Groups"
        description="View groups, membership counts, and group structure."
      />

      <div className="rounded-lg border bg-white">
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
              };

              return (
                <div
                  key={group.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <Link
                    href={`/admin/teaching-groups/${group.id}`}
                    className="min-w-0 flex-1 hover:text-blue-600"
                  >
                    <div className="font-medium">{group.name}</div>
                    <div className="text-sm text-gray-500">
                      Teachers: {count.teachers} · Students: {count.students} · Total:{" "}
                      {count.total}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                      <span className="rounded border px-2 py-0.5">
                        {group.is_active ? "Active" : "Inactive"}
                      </span>
                      {group.course_id ? (
                        <span className="rounded border px-2 py-0.5">Course linked</span>
                      ) : null}
                      {group.course_variant_id ? (
                        <span className="rounded border px-2 py-0.5">Variant linked</span>
                      ) : null}
                    </div>
                  </Link>

                  <Link
                    href={`/admin/teaching-groups/${group.id}`}
                    className="rounded border px-3 py-1 text-sm"
                  >
                    Open
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
