import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody, CardHeader } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";

type DemoRow = {
  name: string;
  type: string;
  status: "published" | "draft" | "in_progress";
  lessons: string;
  updated: string;
};

const demoRows: DemoRow[] = [
  {
    name: "GCSE Russian Foundation",
    type: "Course variant",
    status: "published",
    lessons: "24",
    updated: "2 hours ago",
  },
  {
    name: "Theme 1: Identity and culture",
    type: "Module",
    status: "in_progress",
    lessons: "8",
    updated: "Yesterday",
  },
  {
    name: "School and daily routine",
    type: "Lesson",
    status: "draft",
    lessons: "—",
    updated: "3 days ago",
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

function TableShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        <p className="mt-1 text-sm app-text-muted">{description}</p>
      </CardHeader>
      <div>{children}</div>
    </Card>
  );
}

function DemoToolbar() {
  return (
    <div className="flex flex-col gap-3 border-b border-[var(--border)] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
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
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" icon="filter">
          Filters
        </Button>
        <Button variant="primary" icon="create">
          Add new
        </Button>
      </div>
    </div>
  );
}

function StandardTable() {
  return (
    <TableShell
      title="Standard admin table"
      description="Best for content management views where filtering, row scanning, and actions matter."
    >
      <DemoToolbar />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-muted)] text-left">
              <th className="px-5 py-3 font-semibold text-[var(--text-primary)]">Name</th>
              <th className="px-5 py-3 font-semibold text-[var(--text-primary)]">Type</th>
              <th className="px-5 py-3 font-semibold text-[var(--text-primary)]">
                Status
              </th>
              <th className="px-5 py-3 font-semibold text-[var(--text-primary)]">
                Lessons
              </th>
              <th className="px-5 py-3 font-semibold text-[var(--text-primary)]">
                Updated
              </th>
              <th className="px-5 py-3 font-semibold text-[var(--text-primary)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {demoRows.map((row) => (
              <tr
                key={row.name}
                className="border-b border-[var(--border)] transition hover:bg-[var(--background-muted)]"
              >
                <td className="px-5 py-4">
                  <div className="font-medium text-[var(--text-primary)]">{row.name}</div>
                </td>
                <td className="px-5 py-4 app-text-muted">{row.type}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-5 py-4 app-text-muted">{row.lessons}</td>
                <td className="px-5 py-4 app-text-muted">{row.updated}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" icon="edit">
                      Edit
                    </Button>
                    <Button variant="quiet" size="sm" icon="next">
                      Open
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableShell>
  );
}

function DenseTable() {
  return (
    <TableShell
      title="Dense table"
      description="Useful when rows are numerous, but should be used carefully to avoid making scanning harder."
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-muted)] text-left">
              <th className="px-4 py-2.5 font-semibold text-[var(--text-primary)]">
                Item
              </th>
              <th className="px-4 py-2.5 font-semibold text-[var(--text-primary)]">
                Status
              </th>
              <th className="px-4 py-2.5 font-semibold text-[var(--text-primary)]">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {demoRows.map((row) => (
              <tr key={row.name} className="border-b border-[var(--border)]">
                <td className="px-4 py-3">
                  <div className="font-medium text-[var(--text-primary)]">{row.name}</div>
                  <div className="text-xs app-text-soft">{row.type}</div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3 app-text-muted">{row.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

function TableRules() {
  const rules = [
    "Use a toolbar above the table when filtering or search is expected.",
    "Keep row actions compact and predictable.",
    "Use badges for statuses rather than raw colored text.",
    "Dense tables should be a deliberate choice, not the default.",
    "Always provide a useful empty state instead of blank space.",
    "Tables should be horizontally scrollable on narrow widths rather than crushed.",
  ];

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {rules.map((rule) => (
        <Card key={rule}>
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <AppIcon icon="list" size={16} className="mt-0.5 app-brand-text" />
              <div className="text-sm app-text-muted">{rule}</div>
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
      <UiLabSection
        title="Standard table pattern"
        description="This should be the default direction for admin index pages where scanning, filtering, and row actions matter."
      >
        <StandardTable />
      </UiLabSection>

      <UiLabSection
        title="Dense variation"
        description="A denser table can work for compact admin areas, but it should not become the default everywhere."
      >
        <DenseTable />
      </UiLabSection>

      <UiLabSection
        title="Empty-state pattern"
        description="Tables should remain useful even when there is no data to show."
      >
        <TableEmptyState />
      </UiLabSection>

      <UiLabSection
        title="Table usage rules"
        description="Use these rules to keep real table implementations consistent across admin screens."
      >
        <TableRules />
      </UiLabSection>

      <UiLabSection
        title="Readiness"
        description="A quick summary of which table patterns already feel stable and which still need refinement."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardBody className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge tone="success">Strong already</Badge>
              </div>
              <div className="space-y-1 text-sm app-text-muted">
                <p>Standard admin table direction</p>
                <p>Toolbar + action layout</p>
                <p>Status badge usage</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge tone="warning">Needs refinement</Badge>
              </div>
              <div className="space-y-1 text-sm app-text-muted">
                <p>Sorting interactions</p>
                <p>Bulk row actions</p>
                <p>Mobile-friendly row density</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge tone="muted">Future additions</Badge>
              </div>
              <div className="space-y-1 text-sm app-text-muted">
                <p>Sticky headers</p>
                <p>Selectable rows</p>
                <p>Pagination and result counts</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}
