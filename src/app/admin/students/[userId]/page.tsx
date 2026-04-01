import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { requireAdminAccess } from "@/lib/admin-auth";
import {
  getAdminAccessGrantsByUserIdDb,
  getAdminProfileByIdDb,
  getAdminTeachingGroupMembershipsByUserIdDb,
  getAdminTeachingGroupsDb,
  type AdminProfileRow,
} from "@/lib/admin-user-helpers-db";
import {
  addStudentToTeachingGroupAction,
  deactivateAccessGrantAction,
  removeStudentFromTeachingGroupAction,
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

function getPersonLabel(profile: AdminProfileRow) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

export default async function AdminStudentProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const { userId } = await params;

  const [student, accessGrants, studentMemberships, teachingGroups] = await Promise.all([
    getAdminProfileByIdDb(userId),
    getAdminAccessGrantsByUserIdDb(userId),
    getAdminTeachingGroupMembershipsByUserIdDb(userId),
    getAdminTeachingGroupsDb(),
  ]);

  if (!student) {
    return <main>Student not found.</main>;
  }

  const groupMap = new Map(teachingGroups.map((group) => [group.id, group]));
  const membershipsWithGroup = studentMemberships.map((membership) => ({
    ...membership,
    group: groupMap.get(membership.group_id) ?? null,
  }));

  const currentStudentGroupIds = new Set(
    membershipsWithGroup
      .filter((membership) => membership.member_role === "student")
      .map((membership) => membership.group_id)
  );

  const availableGroups = teachingGroups.filter(
    (group) => !currentStudentGroupIds.has(group.id)
  );

  return (
    <main>
      <div className="mb-4">
        <Link href="/admin/students" className="text-sm text-blue-600 hover:underline">
          ← Back to students
        </Link>
      </div>

      <PageHeader
        title={getPersonLabel(student)}
        description="Student profile, access grants, and teaching group memberships."
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Profile Details</div>

          <div className="space-y-3 px-4 py-4 text-sm">
            <div>
              <span className="font-medium">Full name:</span> {student.full_name || "—"}
            </div>
            <div>
              <span className="font-medium">Display name:</span>{" "}
              {student.display_name || "—"}
            </div>
            <div>
              <span className="font-medium">Email:</span> {student.email || "—"}
            </div>
            <div>
              <span className="font-medium">Admin:</span>{" "}
              {student.is_admin ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Created:</span>{" "}
              {formatDateTime(student.created_at)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3 font-medium">Actions</div>

          <div className="space-y-3 px-4 py-4 text-sm text-gray-600">
            <p>This page now supports basic admin management.</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>deactivate access grants</li>
              <li>add student to teaching group</li>
              <li>remove student from teaching group</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">
          Access Grants ({accessGrants.length})
        </div>

        <div className="divide-y">
          {accessGrants.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">No access grants found.</div>
          ) : (
            accessGrants.map((grant) => {
              const product = grant.products?.[0] ?? null;

              return (
                <div
                  key={grant.id}
                  className="flex items-start justify-between gap-4 px-4 py-4 text-sm"
                >
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded border px-2 py-0.5">
                        {grant.access_mode}
                      </span>
                      <span className="rounded border px-2 py-0.5">
                        {grant.is_active ? "Active" : "Inactive"}
                      </span>
                      {product?.name ? (
                        <span className="rounded border px-2 py-0.5">{product.name}</span>
                      ) : null}
                      {product?.code ? (
                        <span className="rounded border px-2 py-0.5">{product.code}</span>
                      ) : null}
                    </div>

                    <div className="text-gray-600">
                      <div>Start: {formatDateTime(grant.starts_at)}</div>
                      <div>End: {formatDateTime(grant.ends_at)}</div>
                    </div>
                  </div>

                  {grant.is_active ? (
                    <form action={deactivateAccessGrantAction}>
                      <input type="hidden" name="userId" value={student.id} />
                      <input type="hidden" name="grantId" value={grant.id} />
                      <button
                        type="submit"
                        className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                      >
                        Deactivate
                      </button>
                    </form>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="mb-6 rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Add To Teaching Group</div>

        <div className="px-4 py-4 text-sm">
          {availableGroups.length === 0 ? (
            <div className="text-gray-500">No available teaching groups to add.</div>
          ) : (
            <form
              action={addStudentToTeachingGroupAction}
              className="flex flex-wrap gap-3"
            >
              <input type="hidden" name="userId" value={student.id} />

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

                  {membership.member_role === "student" ? (
                    <form action={removeStudentFromTeachingGroupAction}>
                      <input type="hidden" name="userId" value={student.id} />
                      <input type="hidden" name="groupId" value={membership.group_id} />
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
