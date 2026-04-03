import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import { requireAdminAccess } from "@/lib/admin-auth";
import {
  getAdminAccessGrantsByUserIdDb,
  getAdminProductsDb,
  getAdminProfileByIdDb,
  getAdminTeachingGroupMembershipsByUserIdDb,
  getAdminTeachingGroupsDb,
  getAdminVariantProgressSummaryByUserIdDb,
  type AdminAccessGrantRow,
  type AdminProductRow,
  type AdminProfileRow,
} from "@/lib/admin-user-helpers-db";
import {
  addStudentToTeachingGroupAction,
  deactivateAccessGrantAction,
  removeStudentFromTeachingGroupAction,
  setTeacherRoleAction,
  switchStudentAccessGrantAction,
} from "@/app/actions/admin-user-actions";
import AdminFeedbackBanner from "@/components/admin/admin-feedback-banner";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";

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

function getGrantLabel(grant: AdminAccessGrantRow) {
  const product = grant.products?.[0] ?? null;
  const code = (product?.code ?? "").toLowerCase();
  const name = (product?.name ?? "").toLowerCase();
  const combined = `${code} ${name}`;

  if (grant.access_mode === "volna") return "Volna";
  if (grant.access_mode === "trial") return "Trial";
  if (grant.access_mode === "full" && combined.includes("foundation")) {
    return "Foundation Full";
  }
  if (grant.access_mode === "full" && combined.includes("higher")) {
    return "Higher Full";
  }

  return grant.access_mode;
}

function getProductLabel(product: AdminProductRow) {
  const code = (product.code ?? "").toLowerCase();
  const name = (product.name ?? "").toLowerCase();
  const combined = `${code} ${name}`;

  if (combined.includes("foundation") && combined.includes("full")) {
    return "Foundation Full";
  }

  if (combined.includes("higher") && combined.includes("full")) {
    return "Higher Full";
  }

  if (combined.includes("volna")) {
    return "Volna";
  }

  if (combined.includes("trial")) {
    return "Trial";
  }

  return product.name || product.code || product.id;
}

function formatVariantLabel(variantSlug: string) {
  return variantSlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function AdminStudentProfilePage({
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

  const [
    student,
    accessGrants,
    studentMemberships,
    teachingGroups,
    progressSummary,
    products,
  ] = await Promise.all([
    getAdminProfileByIdDb(userId),
    getAdminAccessGrantsByUserIdDb(userId),
    getAdminTeachingGroupMembershipsByUserIdDb(userId),
    getAdminTeachingGroupsDb(),
    getAdminVariantProgressSummaryByUserIdDb(userId),
    getAdminProductsDb(),
  ]);

  if (!student) {
    return <main>Student not found.</main>;
  }

  const activeGrant = accessGrants.find((grant) => grant.is_active) ?? null;
  const inactiveGrants = accessGrants.filter((grant) => !grant.is_active);

  const selectableProducts = products.filter((product) => {
    const combined = `${product.code ?? ""} ${product.name ?? ""}`.toLowerCase();

    return (
      combined.includes("trial") ||
      combined.includes("foundation") ||
      combined.includes("higher") ||
      combined.includes("volna")
    );
  });

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
        description="Student profile, access grants, teaching groups, and progress by variant."
      />

      <AdminFeedbackBanner
        success={resolvedSearchParams.success}
        error={resolvedSearchParams.error}
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
              <span className="font-medium">Teacher role:</span>{" "}
              {student.is_teacher ? "Yes" : "No"}
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
            <form action={setTeacherRoleAction} className="space-y-2">
              <input type="hidden" name="userId" value={student.id} />
              <input
                type="hidden"
                name="redirectTo"
                value={`/admin/students/${student.id}`}
              />
              <input
                type="hidden"
                name="mode"
                value={student.is_teacher ? "disable" : "enable"}
              />
              <button
                type="submit"
                className="rounded border px-3 py-2 text-left hover:bg-gray-50"
              >
                {student.is_teacher ? "Remove teacher role" : "Enable teacher role"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Current Active Access</div>

        <div className="divide-y">
          {!activeGrant ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              No active access grant found.
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4 px-4 py-4 text-sm">
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="rounded border px-2 py-0.5">
                    {getGrantLabel(activeGrant)}
                  </span>
                  <span className="rounded border px-2 py-0.5">Active</span>
                  {activeGrant.products?.[0]?.name ? (
                    <span className="rounded border px-2 py-0.5">
                      {activeGrant.products[0].name}
                    </span>
                  ) : null}
                </div>

                <div className="text-gray-600">
                  <div>Start: {formatDateTime(activeGrant.starts_at)}</div>
                  <div>End: {formatDateTime(activeGrant.ends_at)}</div>
                </div>
              </div>

              <form action={deactivateAccessGrantAction}>
                <input type="hidden" name="userId" value={student.id} />
                <input type="hidden" name="grantId" value={activeGrant.id} />
                <input
                  type="hidden"
                  name="redirectTo"
                  value={`/admin/students/${student.id}`}
                />
                <AdminConfirmButton
                  confirmMessage="Deactivate this student's current access grant?"
                  className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                >
                  Deactivate
                </AdminConfirmButton>
              </form>
            </div>
          )}
        </div>
      </section>

      <section className="mb-6 rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">Switch Access Type</div>

        <div className="px-4 py-4 text-sm">
          {selectableProducts.length === 0 ? (
            <div className="text-gray-500">No selectable products found.</div>
          ) : (
            <form
              action={switchStudentAccessGrantAction}
              className="flex flex-wrap gap-3"
            >
              <input type="hidden" name="userId" value={student.id} />
              <input
                type="hidden"
                name="redirectTo"
                value={`/admin/students/${student.id}`}
              />

              <select
                name="productId"
                required
                className="rounded border px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="">Select access type</option>
                {selectableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {getProductLabel(product)}
                  </option>
                ))}
              </select>

              <button type="submit" className="rounded border px-4 py-2 hover:bg-gray-50">
                Switch access
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="mb-6 rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">
          Access History ({inactiveGrants.length})
        </div>

        <div className="divide-y">
          {inactiveGrants.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              No inactive access grants found.
            </div>
          ) : (
            inactiveGrants.map((grant) => (
              <div key={grant.id} className="px-4 py-4 text-sm">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="rounded border px-2 py-0.5">
                    {getGrantLabel(grant)}
                  </span>
                  <span className="rounded border px-2 py-0.5">Inactive</span>
                  {grant.products?.[0]?.name ? (
                    <span className="rounded border px-2 py-0.5">
                      {grant.products[0].name}
                    </span>
                  ) : null}
                </div>

                <div className="text-gray-600">
                  <div>Start: {formatDateTime(grant.starts_at)}</div>
                  <div>End: {formatDateTime(grant.ends_at)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mb-6 rounded-lg border bg-white">
        <div className="border-b px-4 py-3 font-medium">
          Progress Summary by Variant ({progressSummary.length})
        </div>

        <div className="divide-y">
          {progressSummary.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              No completed lesson progress found yet.
            </div>
          ) : (
            progressSummary.map((row) => (
              <div
                key={`${row.course_slug}-${row.variant_slug}`}
                className="px-4 py-4 text-sm"
              >
                <div className="font-medium">
                  {row.course_slug} · {formatVariantLabel(row.variant_slug)}
                </div>
                <div className="text-gray-600">
                  Completed lessons: {row.completed_lessons}
                </div>
              </div>
            ))
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
              <input
                type="hidden"
                name="redirectTo"
                value={`/admin/students/${student.id}`}
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

                  {membership.member_role === "student" ? (
                    <form action={removeStudentFromTeachingGroupAction}>
                      <input type="hidden" name="userId" value={student.id} />
                      <input type="hidden" name="groupId" value={membership.group_id} />
                      <input
                        type="hidden"
                        name="redirectTo"
                        value={`/admin/students/${student.id}`}
                      />
                      <AdminConfirmButton
                        confirmMessage="Remove this student from the teaching group?"
                        className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </AdminConfirmButton>
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
