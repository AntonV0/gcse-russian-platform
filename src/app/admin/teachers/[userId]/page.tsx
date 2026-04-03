import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { requireAdminAccess } from "@/lib/admin-auth";
import {
  getAdminProfileByIdDb,
  getAdminTeachingGroupMembershipsByUserIdDb,
  getAdminTeachingGroupsDb,
  type AdminProfileRow,
} from "@/lib/admin-user-helpers-db";
import {
  addTeacherToTeachingGroupAction,
  removeTeacherFromTeachingGroupAction,
  setTeacherRoleAction,
} from "@/app/actions/admin-user-actions";

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

function getPersonLabel(profile: AdminProfileRow & { is_teacher?: boolean }) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

export default async function AdminTeacherProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { userId } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  const [teacher, teacherMemberships, teachingGroups] = await Promise.all([
    getAdminProfileByIdDb(userId),
    getAdminTeachingGroupMembershipsByUserIdDb(userId),
    getAdminTeachingGroupsDb(),
  ]);

  if (!teacher) {
    return <main>Teacher not found.</main>;
  }

  const teacherWithRole = teacher as AdminProfileRow & { is_teacher?: boolean };

  const groupMap = new Map(teachingGroups.map((group) => [group.id, group]));
  const membershipsWithGroup = teacherMemberships.map((membership) => ({
    ...membership,
    group: groupMap.get(membership.group_id) ?? null,
  }));

  const currentTeacherGroupIds = new Set(
    membershipsWithGroup
      .filter((membership) => membership.member_role === "teacher")
      .map((membership) => membership.group_id)
  );

  const availableGroups = teachingGroups.filter(
    (group) => !currentTeacherGroupIds.has(group.id)
  );

  return (
    <main>
      <div className="mb-4">
        <Link href="/admin/teachers" className="text-sm text-blue-600 hover:underline">
          ← Back to teachers
        </Link>
      </div>

      <PageHeader
        title={getPersonLabel(teacherWithRole)}
        description="Teacher/admin account overview."
      />

      {resolvedSearchParams.success ? (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {resolvedSearchParams.success}
        </div>
      ) : null}

      {resolvedSearchParams.error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {resolvedSearchParams.error}
        </div>
      ) : null}

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Profile Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Full name:</span>{" "}
              {teacherWithRole.full_name || "—"}
            </div>
            <div>
              <span className="font-medium">Display name:</span>{" "}
              {teacherWithRole.display_name || "—"}
            </div>
            <div>
              <span className="font-medium">Email:</span> {teacherWithRole.email || "—"}
            </div>
            <div>
              <span className="font-medium">Admin:</span>{" "}
              {teacherWithRole.is_admin ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Teacher role:</span>{" "}
              {teacherWithRole.is_teacher ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {formatDateTime(teacherWithRole.created_at)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Actions</div>

          <div className="space-y-3 px-4 py-4 text-sm text-gray-600">
            <form action={setTeacherRoleAction} className="space-y-2">
              <input type="hidden" name="userId" value={teacherWithRole.id} />
              <input
                type="hidden"
                name="redirectTo"
                value={`/admin/teachers/${teacherWithRole.id}`}
              />
              <input
                type="hidden"
                name="mode"
                value={teacherWithRole.is_teacher ? "disable" : "enable"}
              />
              <button
                type="submit"
                className="rounded border px-3 py-2 text-left hover:bg-gray-50"
              >
                {teacherWithRole.is_teacher
                  ? "Remove teacher role"
                  : "Enable teacher role"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Add To Teaching Group</div>

        <div className="px-4 py-4 text-sm">
          {availableGroups.length === 0 ? (
            <div className="text-gray-500">No available teaching groups to add.</div>
          ) : (
            <form
              action={addTeacherToTeachingGroupAction}
              className="flex flex-wrap gap-3"
            >
              <input type="hidden" name="userId" value={teacherWithRole.id} />
              <input
                type="hidden"
                name="redirectTo"
                value={`/admin/teachers/${teacherWithRole.id}`}
              />

              <select
                name="groupId"
                required
                className="rounded border px-3 py-2 text-sm"
              >
                <option value="">Select group</option>
                {availableGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>

              <button type="submit" className="rounded border px-4 py-2 hover:bg-gray-50">
                Add to group
              </button>
            </form>
          )}
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
                className="flex items-center justify-between gap-4 px-4 py-4 text-sm"
              >
                <div>
                  <div className="font-medium">
                    {membership.group?.name || membership.group_id}
                  </div>
                  <div className="text-gray-600">Role: {membership.member_role}</div>
                  <div className="text-gray-600">
                    Group active: {membership.group?.is_active ? "Yes" : "No"}
                  </div>
                </div>

                <div className="flex gap-2">
                  {membership.group ? (
                    <Link
                      href={`/admin/teaching-groups/${membership.group.id}`}
                      className="rounded border px-3 py-1 text-sm"
                    >
                      Open group
                    </Link>
                  ) : null}

                  {membership.member_role === "teacher" ? (
                    <form action={removeTeacherFromTeachingGroupAction}>
                      <input type="hidden" name="userId" value={teacherWithRole.id} />
                      <input type="hidden" name="groupId" value={membership.group_id} />
                      <input
                        type="hidden"
                        name="redirectTo"
                        value={`/admin/teachers/${teacherWithRole.id}`}
                      />
                      <button
                        type="submit"
                        className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
