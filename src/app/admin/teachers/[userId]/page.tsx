import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import AdminFeedbackBanner from "@/components/admin/admin-feedback-banner";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import {
  addTeacherToTeachingGroupAction,
  removeTeacherFromTeachingGroupAction,
  setTeacherRoleAction,
} from "@/app/actions/admin/admin-user-actions";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getAdminProfileByIdDb,
  getAdminTeachingGroupMembershipsByUserIdDb,
  getAdminTeachingGroupsDb,
  type AdminProfileRow,
} from "@/lib/users/admin-user-helpers-db";

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

  const teacherHref = `/admin/teachers/${teacher.id}`;

  return (
    <main>
      <div className="mb-4">
        <Button href="/admin/teachers" variant="quiet" size="sm" icon="back">
          Back to teachers
        </Button>
      </div>

      <PageHeader
        title={getPersonLabel(teacher)}
        description="Teacher/admin account overview."
      />

      <AdminFeedbackBanner
        success={resolvedSearchParams.success}
        error={resolvedSearchParams.error}
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <PanelCard
          title="Profile details"
          description="Identity and role information for this account."
          tone="admin"
        >
          <DetailList
            items={[
              { label: "Full name", value: teacher.full_name || "-" },
              { label: "Display name", value: teacher.display_name || "-" },
              { label: "Email", value: teacher.email || "-" },
              { label: "Admin", value: teacher.is_admin ? "Yes" : "No" },
              { label: "Teacher role", value: teacher.is_teacher ? "Yes" : "No" },
              { label: "Created", value: formatDateTime(teacher.created_at) },
            ]}
          />
        </PanelCard>

        <PanelCard title="Actions" description="Adjust teaching permissions." tone="muted">
          <form action={setTeacherRoleAction}>
            <input type="hidden" name="userId" value={teacher.id} />
            <input type="hidden" name="redirectTo" value={teacherHref} />
            <input
              type="hidden"
              name="mode"
              value={teacher.is_teacher ? "disable" : "enable"}
            />
            <Button type="submit" variant="secondary" icon="settings">
              {teacher.is_teacher ? "Remove teacher role" : "Enable teacher role"}
            </Button>
          </form>
        </PanelCard>
      </section>

      <section className="mb-6">
        <PanelCard
          title="Add to teaching group"
          description="Attach this teacher to a Volna group so they can manage guided work."
          tone="admin"
        >
          {availableGroups.length === 0 ? (
            <p className="text-sm app-text-muted">
              No available teaching groups to add.
            </p>
          ) : (
            <form
              action={addTeacherToTeachingGroupAction}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <input type="hidden" name="userId" value={teacher.id} />
              <input type="hidden" name="redirectTo" value={teacherHref} />

              <FormField label="Teaching group" className="min-w-0 flex-1">
                <Select name="groupId" required>
                  <option value="">Select group</option>
                  {availableGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <Button type="submit" variant="secondary" icon="create">
                Add to group
              </Button>
            </form>
          )}
        </PanelCard>
      </section>

      <PanelCard
        title={`Teaching group memberships (${membershipsWithGroup.length})`}
        description="Groups this account is currently attached to."
        tone="admin"
        contentClassName="space-y-3"
      >
        {membershipsWithGroup.length === 0 ? (
          <EmptyState
            icon="users"
            title="No teaching group memberships"
            description="Add this teacher to a group when they begin managing Volna students."
          />
        ) : (
          membershipsWithGroup.map((membership) => (
            <CardListItem
              key={`${membership.group_id}-${membership.member_role}`}
              title={membership.group?.name || membership.group_id}
              subtitle={`Role: ${membership.member_role} · Group active: ${
                membership.group?.is_active ? "Yes" : "No"
              }`}
              badges={<Badge tone="muted">{membership.member_role}</Badge>}
              actions={
                <InlineActions>
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

                  {membership.member_role === "teacher" ? (
                    <form action={removeTeacherFromTeachingGroupAction}>
                      <input type="hidden" name="userId" value={teacher.id} />
                      <input type="hidden" name="groupId" value={membership.group_id} />
                      <input type="hidden" name="redirectTo" value={teacherHref} />
                      <AdminConfirmButton
                        confirmMessage="Remove this teacher from the teaching group?"
                        className="app-btn-base app-btn-danger min-h-9 rounded-xl px-3.5 py-2 text-sm"
                      >
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
    </main>
  );
}
