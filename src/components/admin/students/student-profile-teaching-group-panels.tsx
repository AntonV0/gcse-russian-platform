import {
  addStudentToTeachingGroupAction,
  removeStudentFromTeachingGroupAction,
} from "@/app/actions/admin/admin-user-actions";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import type { AdminTeachingGroupRow } from "@/lib/users/admin-user-helpers-db";
import type { StudentMembershipWithGroup } from "@/components/admin/students/student-profile-utils";

export function AddStudentToTeachingGroupPanel({
  studentId,
  availableGroups,
}: {
  studentId: string;
  availableGroups: AdminTeachingGroupRow[];
}) {
  return (
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
          <input type="hidden" name="userId" value={studentId} />
          <input type="hidden" name="redirectTo" value={`/admin/students/${studentId}`} />

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
  );
}

export function TeachingGroupMembershipsPanel({
  studentId,
  membershipsWithGroup,
}: {
  studentId: string;
  membershipsWithGroup: StudentMembershipWithGroup[];
}) {
  return (
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
                    <input type="hidden" name="userId" value={studentId} />
                    <input type="hidden" name="groupId" value={membership.group_id} />
                    <input
                      type="hidden"
                      name="redirectTo"
                      value={`/admin/students/${studentId}`}
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
  );
}
