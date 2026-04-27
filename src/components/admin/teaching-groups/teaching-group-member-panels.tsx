import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";

export type TeachingGroupMemberRow = {
  user_id: string;
  group_id: string;
  member_role: string;
};

export type TeachingGroupProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  is_admin: boolean;
  is_teacher: boolean;
};

function getPersonLabel(
  profile: Pick<TeachingGroupProfileRow, "full_name" | "display_name" | "email">
) {
  return profile.full_name || profile.display_name || profile.email || "Unnamed";
}

export function AddTeachingGroupMemberPanel({
  title,
  description,
  emptyText,
  action,
  groupId,
  redirectTo,
  profiles,
  selectLabel,
  buttonLabel,
}: {
  title: string;
  description: string;
  emptyText: string;
  action: (formData: FormData) => void | Promise<void>;
  groupId: string;
  redirectTo: string;
  profiles: TeachingGroupProfileRow[];
  selectLabel: string;
  buttonLabel: string;
}) {
  return (
    <PanelCard title={title} description={description} tone="admin">
      {profiles.length === 0 ? (
        <p className="text-sm app-text-muted">{emptyText}</p>
      ) : (
        <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <input type="hidden" name="groupId" value={groupId} />
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <FormField label={selectLabel} className="min-w-0 flex-1">
            <Select name="userId" required>
              <option value="">Select user</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {getPersonLabel(profile)}
                </option>
              ))}
            </Select>
          </FormField>

          <Button type="submit" variant="secondary" icon="create">
            {buttonLabel}
          </Button>
        </form>
      )}
    </PanelCard>
  );
}

export function TeachingGroupMemberSection({
  title,
  emptyTitle,
  emptyDescription,
  members,
  profileMap,
  viewHrefPrefix,
  viewLabel,
  removeAction,
  confirmMessage,
  groupId,
}: {
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  members: TeachingGroupMemberRow[];
  profileMap: Map<string, TeachingGroupProfileRow>;
  viewHrefPrefix: "/admin/teachers" | "/admin/students";
  viewLabel: string;
  removeAction: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  groupId: string;
}) {
  const redirectTo = `/admin/teaching-groups/${groupId}`;

  return (
    <PanelCard
      title={`${title} (${members.length})`}
      tone="admin"
      contentClassName="space-y-3"
    >
      {members.length === 0 ? (
        <EmptyState icon="users" title={emptyTitle} description={emptyDescription} />
      ) : (
        members.map((member) => {
          const profile = profileMap.get(member.user_id);

          return (
            <CardListItem
              key={member.user_id}
              title={profile ? getPersonLabel(profile) : member.user_id}
              subtitle={profile?.email || "No email"}
              badges={<Badge tone="muted">{member.member_role}</Badge>}
              actions={
                <InlineActions>
                  {profile ? (
                    <Button
                      href={`${viewHrefPrefix}/${profile.id}`}
                      variant="secondary"
                      size="sm"
                      icon="preview"
                    >
                      {viewLabel}
                    </Button>
                  ) : null}

                  <form action={removeAction}>
                    <input type="hidden" name="userId" value={member.user_id} />
                    <input type="hidden" name="groupId" value={groupId} />
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <AdminConfirmButton
                      confirmMessage={confirmMessage}
                      className="app-btn-base app-btn-danger min-h-9 rounded-xl px-3.5 py-2 text-sm"
                    >
                      Remove
                    </AdminConfirmButton>
                  </form>
                </InlineActions>
              }
            />
          );
        })
      )}
    </PanelCard>
  );
}
