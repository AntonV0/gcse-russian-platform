import { DEMO_TABLE_ROWS } from "@/components/admin/ui-lab-tables-data";
import { StatusBadge, VariantBadge } from "@/components/admin/ui-lab-tables-badges";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import TableShell from "@/components/ui/table-shell";
import TableToolbar from "@/components/ui/table-toolbar";
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

function DemoMobileRows({ dense = false }: { dense?: boolean }) {
  return (
    <div className={["grid gap-3 p-4 md:hidden", dense ? "text-sm" : ""].join(" ")}>
      {DEMO_TABLE_ROWS.map((row) => (
        <div
          key={row.name}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-4 py-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-[var(--text-primary)]">{row.name}</div>
              <div className="mt-1 text-sm app-text-muted">{row.type}</div>
            </div>

            <StatusBadge status={row.status} />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm app-text-muted">
            <span>{row.lessons} lessons</span>
            <span>{row.updated}</span>
          </div>

          {!dense ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <VariantBadge variant={row.variant} />
              <Button variant="secondary" size="sm" icon="edit">
                Edit
              </Button>
              <Button variant="quiet" size="sm" icon="next">
                Open
              </Button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function StandardTable() {
  return (
    <TableShell
      title="Standard admin table"
      description="Best for content management views where filtering, row scanning, and actions matter."
      headingLevel={3}
      actions={
        <>
          <Badge tone="info">Default pattern</Badge>
          <Badge tone="muted">Comfortable density</Badge>
        </>
      }
    >
      <DemoToolbar />
      <DemoMobileRows />

      <div className="hidden md:block">
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
            {DEMO_TABLE_ROWS.map((row) => (
              <DataTableRow key={row.name}>
                <DataTableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-[var(--text-primary)]">
                      {row.name}
                    </div>
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
      </div>
    </TableShell>
  );
}

function DenseTable() {
  return (
    <TableShell
      title="Dense table"
      description="Useful when rows are numerous, but should be used carefully to avoid making scanning harder."
      headingLevel={3}
      actions={<Badge tone="warning">Compact pattern</Badge>}
    >
      <DemoMobileRows dense />

      <div className="hidden md:block">
        <DataTable>
          <DataTableHead>
            <DataTableHeaderRow>
              <DataTableCompactHeaderCell>Item</DataTableCompactHeaderCell>
              <DataTableCompactHeaderCell>Status</DataTableCompactHeaderCell>
              <DataTableCompactHeaderCell>Updated</DataTableCompactHeaderCell>
            </DataTableHeaderRow>
          </DataTableHead>

          <DataTableBody>
            {DEMO_TABLE_ROWS.map((row) => (
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
      </div>
    </TableShell>
  );
}

export function UiLabTablesStandardSections() {
  return (
    <>
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
    </>
  );
}
