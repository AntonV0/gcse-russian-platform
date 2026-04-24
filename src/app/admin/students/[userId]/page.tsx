import PageHeader from "@/components/layout/page-header";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
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
} from "@/lib/users/admin-user-helpers-db";
import {
  addStudentToTeachingGroupAction,
  deactivateAccessGrantAction,
  removeStudentFromTeachingGroupAction,
  setTeacherRoleAction,
  switchStudentAccessGrantAction,
} from "@/app/actions/admin/admin-user-actions";

function formatDateTime(value: string | null) {
  if (!value) return "-";

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

  if (combined.includes("volna")) return "Volna";
  if (combined.includes("trial")) return "Trial";

  return product.name || product.code || product.id;
}

function formatVariantLabel(variantSlug: string) {
  return variantSlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function FeedbackMessages({ success, error }: { success?: string; error?: string }) {
  if (!success && !error) return null;

  return (
    <div className="mb-6 space-y-3">
      {success ? (
        <FeedbackBanner tone="success" title="Student profile updated" description={success} />
      ) : null}

      {error ? (
        <FeedbackBanner tone="danger" title="Update failed" description={error} />
      ) : null}
    </div>
  );
}

function GrantBadges({
  grant,
  active,
}: {
  grant: AdminAccessGrantRow;
  active: boolean;
}) {
  return (
    <>
      <Badge tone={active ? "info" : "muted"} icon="user">
        {getGrantLabel(grant)}
      </Badge>
      <Badge tone={active ? "success" : "warning"} icon={active ? "completed" : "pending"}>
        {active ? "Active" : "Inactive"}
      </Badge>
      {grant.products?.[0]?.name ? (
        <Badge tone="muted" icon="courses">
          {grant.products[0].name}
        </Badge>
      ) : null}
    </>
  );
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
      <InlineActions className="mb-4">
        <Button href="/admin/students" variant="quiet" size="sm" icon="back">
          Back to students
        </Button>
      </InlineActions>

      <PageHeader
        title={getPersonLabel(student)}
        description="Student profile, access grants, teaching groups, and progress by variant."
      />

      <FeedbackMessages
        success={resolvedSearchParams.success}
        error={resolvedSearchParams.error}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <PanelCard title="Profile Details" tone="admin">
          <DetailList
            items={[
              { label: "Full name", value: student.full_name || "-" },
              { label: "Display name", value: student.display_name || "-" },
              { label: "Email", value: student.email || "-" },
              { label: "Admin", value: student.is_admin ? "Yes" : "No" },
              { label: "Teacher role", value: student.is_teacher ? "Yes" : "No" },
              { label: "Created", value: formatDateTime(student.created_at) },
            ]}
          />
        </PanelCard>

        <PanelCard
          title="Actions"
          description="Manage this learner's staff role when needed."
          tone="admin"
        >
          <form action={setTeacherRoleAction}>
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
            <Button
              type="submit"
              variant={student.is_teacher ? "warning" : "secondary"}
              icon={student.is_teacher ? "warning" : "user"}
            >
              {student.is_teacher ? "Remove teacher role" : "Enable teacher role"}
            </Button>
          </form>
        </PanelCard>
      </section>

      <div className="space-y-6">
        <PanelCard title="Current Active Access" tone="admin" contentClassName="space-y-3">
          {!activeGrant ? (
            <EmptyState
              icon="lock"
              title="No active access grant found"
              description="Switch the learner onto a product to restore course access."
            />
          ) : (
            <CardListItem
              title={getGrantLabel(activeGrant)}
              subtitle={`Start: ${formatDateTime(activeGrant.starts_at)} - End: ${formatDateTime(
                activeGrant.ends_at
              )}`}
              badges={<GrantBadges grant={activeGrant} active />}
              actions={
                <form action={deactivateAccessGrantAction}>
                  <input type="hidden" name="userId" value={student.id} />
                  <input type="hidden" name="grantId" value={activeGrant.id} />
                  <input
                    type="hidden"
                    name="redirectTo"
                    value={`/admin/students/${student.id}`}
                  />
                  <AdminConfirmButton confirmMessage="Deactivate this student's current access grant?">
                    Deactivate
                  </AdminConfirmButton>
                </form>
              }
            />
          )}
        </PanelCard>

        <PanelCard
          title="Switch Access Type"
          description="Assigning a new access type will use the existing admin action flow."
          tone="admin"
        >
          {selectableProducts.length === 0 ? (
            <EmptyState
              icon="warning"
              iconTone="warning"
              title="No selectable products found"
              description="Create or enable a suitable product before switching access."
            />
          ) : (
            <form
              action={switchStudentAccessGrantAction}
              className="grid gap-3 sm:grid-cols-[minmax(0,22rem)_auto]"
            >
              <input type="hidden" name="userId" value={student.id} />
              <input
                type="hidden"
                name="redirectTo"
                value={`/admin/students/${student.id}`}
              />

              <FormField label="Access type">
                <Select name="productId" required defaultValue="">
                  <option value="">Select access type</option>
                  {selectableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {getProductLabel(product)}
                    </option>
                  ))}
                </Select>
              </FormField>

              <InlineActions className="items-end">
                <Button type="submit" variant="primary" icon="refresh">
                  Switch access
                </Button>
              </InlineActions>
            </form>
          )}
        </PanelCard>

        <PanelCard
          title={`Access History (${inactiveGrants.length})`}
          tone="admin"
          contentClassName="space-y-3"
        >
          {inactiveGrants.length === 0 ? (
            <EmptyState
              icon="pending"
              title="No inactive access grants found"
              description="Previous access changes will appear here."
            />
          ) : (
            inactiveGrants.map((grant) => (
              <CardListItem
                key={grant.id}
                title={getGrantLabel(grant)}
                subtitle={`Start: ${formatDateTime(grant.starts_at)} - End: ${formatDateTime(
                  grant.ends_at
                )}`}
                badges={<GrantBadges grant={grant} active={false} />}
              />
            ))
          )}
        </PanelCard>

        <PanelCard
          title={`Progress Summary by Variant (${progressSummary.length})`}
          description="Completed lessons grouped by course and GCSE tier variant."
          tone="admin"
          contentClassName="space-y-3"
        >
          {progressSummary.length === 0 ? (
            <EmptyState
              icon="lesson"
              title="No completed lesson progress yet"
              description="This learner has not completed a lesson variant in the tracked flow."
            />
          ) : (
            progressSummary.map((row) => (
              <CardListItem
                key={`${row.course_slug}-${row.variant_slug}`}
                title={`${row.course_slug} - ${formatVariantLabel(row.variant_slug)}`}
                subtitle={`Completed lessons: ${row.completed_lessons}`}
                badges={
                  <Badge tone="success" icon="completed">
                    {row.completed_lessons} complete
                  </Badge>
                }
              />
            ))
          )}
        </PanelCard>

        <PanelCard title="Add To Teaching Group" tone="admin">
          {availableGroups.length === 0 ? (
            <EmptyState
              icon="users"
              title="No available teaching groups to add"
              description="The learner is already in all available groups."
            />
          ) : (
            <form
              action={addStudentToTeachingGroupAction}
              className="grid gap-3 sm:grid-cols-[minmax(0,22rem)_auto]"
            >
              <input type="hidden" name="userId" value={student.id} />
              <input
                type="hidden"
                name="redirectTo"
                value={`/admin/students/${student.id}`}
              />

              <FormField label="Teaching group">
                <Select name="groupId" required defaultValue="">
                  <option value="">Select group</option>
                  {availableGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <InlineActions className="items-end">
                <Button type="submit" variant="primary" icon="create">
                  Add to group
                </Button>
              </InlineActions>
            </form>
          )}
        </PanelCard>

        <PanelCard
          title={`Teaching Group Memberships (${membershipsWithGroup.length})`}
          tone="admin"
          contentClassName="space-y-3"
        >
          {membershipsWithGroup.length === 0 ? (
            <EmptyState
              icon="users"
              title="No teaching group memberships found"
              description="Add this learner to a teaching group to support class tracking."
            />
          ) : (
            membershipsWithGroup.map((membership) => (
              <CardListItem
                key={`${membership.group_id}-${membership.member_role}`}
                title={membership.group?.name || membership.group_id}
                subtitle={`Role: ${membership.member_role} - Group active: ${
                  membership.group?.is_active ? "Yes" : "No"
                }`}
                badges={
                  <>
                    <Badge tone="muted" icon="users">
                      {membership.member_role}
                    </Badge>
                    <Badge
                      tone={membership.group?.is_active ? "success" : "warning"}
                      icon={membership.group?.is_active ? "completed" : "pending"}
                    >
                      {membership.group?.is_active ? "Active group" : "Inactive group"}
                    </Badge>
                  </>
                }
                actions={
                  <InlineActions align="end">
                    {membership.group ? (
                      <Button
                        href={`/admin/teaching-groups/${membership.group.id}`}
                        variant="secondary"
                        size="sm"
                        icon="preview"
                      >
                        Open group
                      </Button>
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
                        <AdminConfirmButton confirmMessage="Remove this student from the teaching group?">
                          Remove
                        </AdminConfirmButton>
                      </form>
                    ) : null}
                  </InlineActions>
                }
              />
            ))
          )}
        </PanelCard>
      </div>
    </main>
  );
}
