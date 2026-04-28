import { StatusBadge } from "@/components/admin/ui-lab/tables/ui-lab-tables-badges";
import UiLabSection from "@/components/admin/ui-lab/shell/ui-lab-section";
import AdminRow from "@/components/ui/admin-row";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import Surface from "@/components/ui/surface";
import TableShell from "@/components/ui/table-shell";

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
      headingLevel={3}
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

          <div className="mt-4 space-y-3 sm:border-l sm:border-[var(--border)] sm:pl-4">
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

            <div className="space-y-2 sm:ml-4 sm:border-l sm:border-[var(--border)] sm:pl-4">
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

export function UiLabTablesRowHierarchySections() {
  return (
    <>
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
    </>
  );
}
