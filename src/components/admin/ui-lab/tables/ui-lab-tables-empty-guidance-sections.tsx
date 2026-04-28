import {
  DEMO_TABLE_ROWS,
  TABLE_GUIDANCE_RULES,
  TABLES_FUTURE_ITEMS,
} from "@/components/admin/ui-lab/tables/ui-lab-tables-data";
import { StatusBadge } from "@/components/admin/ui-lab/tables/ui-lab-tables-badges";
import UiLabFutureSection from "@/components/admin/ui-lab/shell/ui-lab-future-section";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import TableShell from "@/components/ui/table-shell";

function TableEmptyState() {
  return (
    <TableShell
      title="Empty table state"
      description="Tables should not collapse into blank space when there is no data."
      headingLevel={3}
    >
      <div className="p-5">
        <EmptyState
          title="No rows yet"
          description="Create your first item to populate this table and begin managing data here."
          icon="list"
          iconTone="brand"
          action={
            <Button variant="primary" icon="create">
              Add first item
            </Button>
          }
        />
      </div>
    </TableShell>
  );
}

function FilteredEmptyState() {
  return (
    <TableShell
      title="Filtered-empty state"
      description="Use a different empty state when the table has data in general, but the current filters return nothing."
      headingLevel={3}
    >
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="default">Higher</Badge>
          <Badge tone="warning">Needs review</Badge>
          <Button variant="quiet" size="sm" icon="refresh">
            Clear filters
          </Button>
        </div>
      </div>

      <div className="p-5">
        <EmptyState
          title="No matching rows"
          description="Try widening your filters, changing variant, or clearing the current status selection."
          icon="search"
          iconTone="warning"
          action={
            <Button variant="secondary" icon="refresh">
              Reset filters
            </Button>
          }
        />
      </div>
    </TableShell>
  );
}

function DarkSurfaceTableTest() {
  return (
    <div
      data-theme="dark"
      className="rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--dark-surface-elevated)_0%,var(--dark-surface-muted)_100%)] p-5 shadow-[0_16px_34px_rgba(16,32,51,0.24)]"
    >
      <div className="mb-4">
        <div className="text-sm font-semibold text-white">Dark-surface table check</div>
        <p className="mt-1 text-sm text-[rgba(255,255,255,0.72)]">
          Validate contrast and row clarity when tables sit inside stronger emphasis
          surfaces.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
        <div className="grid gap-3 p-4 md:hidden">
          {DEMO_TABLE_ROWS.slice(0, 2).map((row) => (
            <div
              key={row.name}
              className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4"
            >
              <div className="font-medium text-white">{row.name}</div>
              <div className="mt-1 text-sm text-[rgba(255,255,255,0.68)]">{row.type}</div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={row.status} />
                <span className="text-sm text-[rgba(255,255,255,0.72)]">
                  {row.updated}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto overscroll-x-contain [scrollbar-width:thin] md:block">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[minmax(0,1.4fr)_180px_160px_auto] gap-3 border-b border-[rgba(255,255,255,0.08)] px-5 py-3 text-sm font-semibold text-white">
              <div>Name</div>
              <div>Status</div>
              <div>Updated</div>
              <div>Actions</div>
            </div>

            {DEMO_TABLE_ROWS.slice(0, 2).map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-[minmax(0,1.4fr)_180px_160px_auto] gap-3 border-b border-[rgba(255,255,255,0.06)] px-5 py-4 last:border-b-0"
              >
                <div>
                  <div className="font-medium text-white">{row.name}</div>
                  <div className="mt-1 text-sm text-[rgba(255,255,255,0.68)]">
                    {row.type}
                  </div>
                </div>
                <div>
                  <StatusBadge status={row.status} />
                </div>
                <div className="text-sm text-[rgba(255,255,255,0.72)]">{row.updated}</div>
                <div className="app-mobile-action-stack flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" icon="edit">
                    Edit
                  </Button>
                  <Button variant="quiet" size="sm" icon="next">
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TableGuidance() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {TABLE_GUIDANCE_RULES.map((rule) => (
        <Card key={rule.title}>
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
                <AppIcon icon={rule.icon} size={16} />
              </span>

              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  {rule.title}
                </div>
                <p className="mt-1 text-sm app-text-muted">{rule.description}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export function UiLabTablesEmptyGuidanceSections() {
  return (
    <>
      <UiLabSection
        id="empty-states"
        title="Empty and filtered-empty states"
        description="Tables should remain useful when there is no data or when active filters remove all visible rows."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <TableEmptyState />
          <FilteredEmptyState />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Dark-surface contrast check"
        description="This section helps validate that table structure, badges, and actions still feel readable on stronger emphasis surfaces."
      >
        <DarkSurfaceTableTest />
      </UiLabSection>

      <UiLabSection
        title="Usage guidance"
        description="Use these rules to keep real data-display implementations consistent across admin screens."
      >
        <TableGuidance />
      </UiLabSection>

      <UiLabFutureSection items={TABLES_FUTURE_ITEMS} />
    </>
  );
}
