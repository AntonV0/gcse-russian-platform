import {
  deactivateAccessGrantAction,
  switchStudentAccessGrantAction,
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
import type {
  AdminAccessGrantRow,
  AdminProductRow,
} from "@/lib/users/admin-user-helpers-db";
import {
  formatDateTime,
  getGrantLabel,
  getProductLabel,
} from "@/components/admin/students/student-profile-utils";

function GrantBadges({ grant, active }: { grant: AdminAccessGrantRow; active: boolean }) {
  return (
    <>
      <Badge tone={active ? "info" : "muted"} icon="user">
        {getGrantLabel(grant)}
      </Badge>
      <Badge
        tone={active ? "success" : "warning"}
        icon={active ? "completed" : "pending"}
      >
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

export function CurrentAccessPanel({
  studentId,
  activeGrant,
}: {
  studentId: string;
  activeGrant: AdminAccessGrantRow | null;
}) {
  return (
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
              <input type="hidden" name="userId" value={studentId} />
              <input type="hidden" name="grantId" value={activeGrant.id} />
              <input
                type="hidden"
                name="redirectTo"
                value={`/admin/students/${studentId}`}
              />
              <AdminConfirmButton confirmMessage="Deactivate this student's current access grant?">
                Deactivate
              </AdminConfirmButton>
            </form>
          }
        />
      )}
    </PanelCard>
  );
}

export function SwitchAccessPanel({
  studentId,
  selectableProducts,
}: {
  studentId: string;
  selectableProducts: AdminProductRow[];
}) {
  return (
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
          <input type="hidden" name="userId" value={studentId} />
          <input type="hidden" name="redirectTo" value={`/admin/students/${studentId}`} />

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
  );
}

export function AccessHistoryPanel({
  inactiveGrants,
}: {
  inactiveGrants: AdminAccessGrantRow[];
}) {
  return (
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
  );
}
