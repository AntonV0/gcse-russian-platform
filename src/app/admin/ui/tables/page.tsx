import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Surface from "@/components/ui/surface";
import TableShell from "@/components/ui/table-shell";
import TableToolbar from "@/components/ui/table-toolbar";
import AdminRow from "@/components/ui/admin-row";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableCompactCell,
  DataTableCompactHeaderCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableHeaderRow,
  DataTableRow,
} from "@/components/ui/data-table";

const pageNavItems = [
  { id: "standard-table", label: "Standard" },
  { id: "dense-table", label: "Dense" },
  { id: "row-states", label: "Row states" },
  { id: "hierarchy", label: "Hierarchy" },
  { id: "empty-states", label: "Empty states" },
  { id: "future-components", label: "Future" },
];

type DemoRow = {
  name: string;
  type: string;
  status: "published" | "draft" | "in_progress";
  lessons: string;
  updated: string;
  variant?: "foundation" | "higher" | "volna";
};

const demoRows: DemoRow[] = [
  {
    name: "GCSE Russian Foundation",
    type: "Course variant",
    status: "published",
    lessons: "24",
    updated: "2 hours ago",
    variant: "foundation",
  },
  {
    name: "Theme 1: Identity and culture",
    type: "Module",
    status: "in_progress",
    lessons: "8",
    updated: "Yesterday",
    variant: "higher",
  },
  {
    name: "School and daily routine",
    type: "Lesson",
    status: "draft",
    lessons: "—",
    updated: "3 days ago",
    variant: "higher",
  },
];

function StatusBadge({ status }: { status: DemoRow["status"] }) {
  if (status === "published") {
    return (
      <Badge tone="info" icon="preview">
        Published
      </Badge>
    );
  }

  if (status === "in_progress") {
    return (
      <Badge tone="warning" icon="pending">
        In progress
      </Badge>
    );
  }

  return (
    <Badge tone="muted" icon="file">
      Draft
    </Badge>
  );
}

function VariantBadge({ variant }: { variant?: DemoRow["variant"] }) {
  if (!variant) return null;

  if (variant === "foundation") {
    return <Badge tone="muted">Foundation</Badge>;
  }

  if (variant === "volna") {
    return <Badge tone="success">Volna</Badge>;
  }

  return <Badge tone="default">Higher</Badge>;
}

function DemoToolbar() {
  return (
    <TableToolbar>
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
        <div className="w-full md:max-w-xs">
          <Input placeholder="Search rows..." />
        </div>

        <div className="w-full md:max-w-[180px]">
          <Select defaultValue="all">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="progress">In progress</option>
          </Select>
        </div>

        <div className="w-full md:max-w-[180px]">
          <Select defaultValue="all-variants">
            <option value="all-variants">All variants</option>
            <option value="foundation">Foundation</option>
            <option value="higher">Higher</option>
            <option value="volna">Volna</option>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" icon="filter">
          Filters
        </Button>
        <Button variant="primary" icon="create">
          Add new
        </Button>
      </div>
    </TableToolbar>
  );
}

function StandardTable() {
  return (
    <TableShell
      title="Standard admin table"
      description="Best for content management views where filtering, row scanning, and actions matter."
      actions={
        <>
          <Badge tone="info">Default pattern</Badge>
          <Badge tone="muted">Comfortable density</Badge>
        </>
      }
    >
      <DemoToolbar />

      <DataTable>
        <DataTableHead>
          <DataTableHeaderRow>
            <DataTableHeaderCell>Name</DataTableHeaderCell>
            <DataTableHeaderCell>Type</DataTableHeaderCell>
            <DataTableHeaderCell>Status</DataTableHeaderCell>
            <DataTableHeaderCell>Lessons</DataTableHeaderCell>
            <DataTableHeaderCell>Updated</DataTableHeaderCell>
            <DataTableHeaderCell>Actions</DataTableHeaderCell>
          </DataTableHeaderRow>
        </DataTableHead>

        <DataTableBody>
          {demoRows.map((row) => (
            <DataTableRow key={row.name}>
              <DataTableCell>
                <div className="space-y-1">
                  <div className="font-medium text-[var(--text-primary)]">{row.name}</div>
                  <div className="flex flex-wrap gap-2">
                    <VariantBadge variant={row.variant} />
                  </div>
                </div>
              </DataTableCell>

              <DataTableCell className="app-text-muted">{row.type}</DataTableCell>

              <DataTableCell>
                <StatusBadge status={row.status} />
              </DataTableCell>

              <DataTableCell className="app-text-muted">{row.lessons}</DataTableCell>

              <DataTableCell className="app-text-muted">{row.updated}</DataTableCell>

              <DataTableCell>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" icon="edit">
                    Edit
                  </Button>
                  <Button variant="quiet" size="sm" icon="next">
                    Open
                  </Button>
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </TableShell>
  );
}

function DenseTable() {
  return (
    <TableShell
      title="Dense table"
      description="Useful when rows are numerous, but should be used carefully to avoid making scanning harder."
      actions={<Badge tone="warning">Compact pattern</Badge>}
    >
      <DataTable>
        <DataTableHead>
          <DataTableHeaderRow>
            <DataTableCompactHeaderCell>Item</DataTableCompactHeaderCell>
            <DataTableCompactHeaderCell>Status</DataTableCompactHeaderCell>
            <DataTableCompactHeaderCell>Updated</DataTableCompactHeaderCell>
          </DataTableHeaderRow>
        </DataTableHead>

        <DataTableBody>
          {demoRows.map((row) => (
            <DataTableRow key={row.name} className="hover:bg-transparent">
              <DataTableCompactCell>
                <div className="font-medium text-[var(--text-primary)]">{row.name}</div>
                <div className="mt-0.5 text-xs app-text-soft">{row.type}</div>
              </DataTableCompactCell>

              <DataTableCompactCell>
                <StatusBadge status={row.status} />
              </DataTableCompactCell>

              <DataTableCompactCell className="app-text-muted">
                {row.updated}
              </DataTableCompactCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </TableShell>
  );
}

function RowStatePatterns() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardBody className="space-y-4 p-4">
          <div>
            <div className="font-semibold text-[var(--text-primary)]">Row states</div>
            <p className="mt-1 text-sm app-text-muted">
              Test how rows feel before applying them to lesson, module, and block lists.
            </p>
          </div>

          <div className="space-y-3">
            <AdminRow
              title="Default row"
              description="Calm baseline state for normal scanning."
              state="default"
              badges={<StatusBadge status="draft" />}
            />

            <AdminRow
              title="Hover row"
              description="Slightly elevated to show interactive intent."
              state="hover"
              badges={<StatusBadge status="in_progress" />}
            />

            <AdminRow
              title="Selected row"
              description="Use sparingly for bulk actions or active selection."
              state="selected"
              badges={<StatusBadge status="published" />}
            />

            <AdminRow
              title="Disabled row"
              description="Present but unavailable for interaction."
              state="disabled"
              badges={<StatusBadge status="draft" />}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4 p-4">
          <div>
            <div className="font-semibold text-[var(--text-primary)]">
              Inline action visibility
            </div>
            <p className="mt-1 text-sm app-text-muted">
              Not every table needs the same action density.
            </p>
          </div>

          <div className="space-y-3">
            <Surface variant="muted" className="p-4">
              <div className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
                Always-visible actions
              </div>

              <AdminRow
                title="Theme 1 module"
                description="Safer when actions are core to the workflow."
                badges={null}
                actions={
                  <>
                    <Button variant="secondary" size="sm" icon="edit">
                      Edit
                    </Button>
                    <Button variant="quiet" size="sm" icon="next">
                      Open
                    </Button>
                  </>
                }
              />
            </Surface>

            <Surface variant="muted" className="p-4">
              <div className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
                Compact action group
              </div>

              <AdminRow
                title="Speaking practice block"
                description="Better when rows are more numerous or visually dense."
                compact
                badges={null}
                actions={
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon="settings"
                      iconOnly
                      ariaLabel="Settings"
                    />
                    <Button
                      variant="quiet"
                      size="sm"
                      icon="delete"
                      iconOnly
                      ariaLabel="Delete"
                    />
                  </>
                }
              />
            </Surface>

            <Surface variant="muted" className="p-4">
              <div className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
                Hover-reveal direction
              </div>

              <AdminRow
                title="Builder lesson row"
                description="Use when scanning matters more than immediate action visibility."
                badges={null}
                actions={
                  <>
                    <Button variant="quiet" size="sm" icon="edit">
                      Edit
                    </Button>
                    <Button variant="quiet" size="sm" icon="next">
                      Open
                    </Button>
                  </>
                }
              />
            </Surface>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function HierarchyListPattern() {
  return (
    <TableShell
      title="Hierarchy and nested list pattern"
      description="Useful for module → lesson → block structures where content relationships matter more than strict table columns."
      actions={<Badge tone="info">Core LMS pattern</Badge>}
    >
      <div className="space-y-3 p-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-[var(--text-primary)]">
                Theme 1: Identity and culture
              </div>
              <div className="mt-1 text-sm app-text-muted">Module • 8 lessons</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone="default">Higher</Badge>
              <Badge tone="warning">In progress</Badge>
              <Button variant="secondary" size="sm" icon="edit">
                Edit
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-3 border-l border-[var(--border)] pl-4">
            <AdminRow
              title="School and daily routine"
              description="Lesson • 6 blocks"
              nested
              badges={<Badge tone="muted">Draft</Badge>}
              actions={
                <Button variant="quiet" size="sm" icon="next">
                  Open
                </Button>
              }
              className="bg-[var(--background-muted)]/35"
            />

            <div className="ml-4 space-y-2 border-l border-[var(--border)] pl-4">
              <AdminRow
                title="Starter vocabulary"
                description="Block • content"
                nested
                compact
                badges={<Badge tone="muted">Text</Badge>}
                className="bg-[var(--background-elevated)]"
              />

              <AdminRow
                title="Reading practice"
                description="Block • practice"
                nested
                compact
                badges={<Badge tone="warning">Review</Badge>}
                className="bg-[var(--background-elevated)]"
              />
            </div>

            <AdminRow
              title="Family and relationships"
              description="Lesson • 4 blocks"
              nested
              badges={<Badge tone="info">Published</Badge>}
              actions={
                <Button variant="quiet" size="sm" icon="next">
                  Open
                </Button>
              }
              className="bg-[var(--background-muted)]/35"
            />
          </div>
        </div>
      </div>
    </TableShell>
  );
}

function TableEmptyState() {
  return (
    <TableShell
      title="Empty table state"
      description="Tables should not collapse into blank space when there is no data."
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
      className="rounded-[1.75rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,#0b1a30_0%,#142742_100%)] p-5 shadow-[0_16px_34px_rgba(16,32,51,0.24)]"
    >
      <div className="mb-4">
        <div className="text-sm font-semibold text-white">Dark-surface table check</div>
        <p className="mt-1 text-sm text-[rgba(255,255,255,0.72)]">
          Validate contrast and row clarity when tables sit inside stronger emphasis
          surfaces.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
        <div className="grid grid-cols-[minmax(0,1.4fr)_180px_160px_auto] gap-3 border-b border-[rgba(255,255,255,0.08)] px-5 py-3 text-sm font-semibold text-white">
          <div>Name</div>
          <div>Status</div>
          <div>Updated</div>
          <div>Actions</div>
        </div>

        {demoRows.slice(0, 2).map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-[minmax(0,1.4fr)_180px_160px_auto] gap-3 border-b border-[rgba(255,255,255,0.06)] px-5 py-4 last:border-b-0"
          >
            <div>
              <div className="font-medium text-white">{row.name}</div>
              <div className="mt-1 text-sm text-[rgba(255,255,255,0.68)]">{row.type}</div>
            </div>

            <div>
              <StatusBadge status={row.status} />
            </div>

            <div className="text-sm text-[rgba(255,255,255,0.72)]">{row.updated}</div>

            <div className="flex flex-wrap gap-2">
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
  );
}

function TableGuidance() {
  const rules = [
    {
      icon: "list" as const,
      title: "Use tables when comparison matters",
      description:
        "Tables work best when users need to scan across repeated columns like status, updated time, variant, or action availability.",
    },
    {
      icon: "layers" as const,
      title: "Use hierarchy lists for structure",
      description:
        "Module → lesson → block structures are often clearer as nested rows than as rigid tables.",
    },
    {
      icon: "filter" as const,
      title: "Pair tables with toolbars",
      description:
        "If search, filtering, or creation is expected, put those controls above the table rather than scattering them around the page.",
    },
    {
      icon: "warning" as const,
      title: "Do not default to dense mode",
      description:
        "Compact layouts are useful, but standard density is usually easier to scan and safer for long-term admin use.",
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {rules.map((rule) => (
        <Card key={rule.title}>
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-blue-soft)] text-[var(--brand-blue)]">
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

export default async function AdminUiTablesPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Tables"
      description="Compare table structures, row actions, toolbars, statuses, and empty-state patterns before applying them to real admin pages."
      currentPath="/admin/ui/tables"
    >
      <UiLabPageNav items={pageNavItems} />

      <UiLabSection
        id="standard-table"
        title="Standard table pattern"
        description="This should be the default direction for admin index pages where scanning, filtering, and row actions matter."
      >
        <StandardTable />
      </UiLabSection>

      <UiLabSection
        id="dense-table"
        title="Dense variation"
        description="A denser table can work for compact admin areas, but it should not become the default everywhere."
      >
        <DenseTable />
      </UiLabSection>

      <UiLabSection
        id="row-states"
        title="Row states and action density"
        description="Before building real admin pages, validate how rows feel when hovered, selected, disabled, or paired with different action strategies."
      >
        <RowStatePatterns />
      </UiLabSection>

      <UiLabSection
        id="hierarchy"
        title="Hierarchy and nested structures"
        description="Not every data display should become a strict table. This pattern is important for modules, lessons, and block relationships."
      >
        <HierarchyListPattern />
      </UiLabSection>

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

      <UiLabFutureSection
        items={[
          "Pagination controls for long admin datasets.",
          "SortableHeaderCell for comparison-heavy list screens.",
          "BulkActionBar for selected users, lessons, and vocabulary items.",
          "RowActionMenu for compact edit, duplicate, archive, and delete actions.",
          "ColumnVisibilityControl for dense admin tables.",
          "TableLoadingState for server-rendered and filtered data refreshes.",
        ]}
      />
    </UiLabShell>
  );
}
