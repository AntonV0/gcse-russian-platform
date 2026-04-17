import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { appIcons } from "@/lib/shared/icons";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import SectionHeader from "@/components/ui/section-header";

function DemoBlock({
  title,
  description,
  className = "",
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={`app-card p-4 ${className}`}>
      <div className="mb-2 font-semibold text-[var(--text-primary)]">{title}</div>
      <p className="text-sm app-text-muted">{description}</p>
    </div>
  );
}

function WidthDemo() {
  return (
    <div className="space-y-4">
      <div className="app-card p-4">
        <div className="mb-3 font-semibold">app-page width reference</div>
        <div className="rounded-xl border border-dashed border-[var(--border)] px-4 py-6 text-sm app-text-muted">
          This page already sits inside the standard content container. Use this as the
          baseline width for most admin and platform pages.
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DemoBlock
          title="Full-width within container"
          description="Best for headers, overviews, and major sections."
        />
        <DemoBlock
          title="Split layout"
          description="Useful when you need a main content area and supporting side content."
        />
        <DemoBlock
          title="Compact column"
          description="Useful for forms, settings, and dense edit screens."
        />
      </div>
    </div>
  );
}

function GridDemo() {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 font-semibold">2-column cards</div>
        <div className="grid gap-4 md:grid-cols-2">
          <DemoBlock
            title="Column A"
            description="A good default for paired content or moderate-density admin sections."
          />
          <DemoBlock
            title="Column B"
            description="Use when two blocks are equally important and should be scanned together."
          />
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold">3-column summaries</div>
        <div className="grid gap-4 md:grid-cols-3">
          <DemoBlock title="Summary 1" description="Compact metric or summary card." />
          <DemoBlock title="Summary 2" description="Compact metric or summary card." />
          <DemoBlock title="Summary 3" description="Compact metric or summary card." />
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold">Main + sidebar pattern</div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)]">
          <DemoBlock
            title="Main content"
            description="Use for the primary working area such as edit forms, lesson builder content, or detailed overviews."
            className="min-h-[180px]"
          />
          <DemoBlock
            title="Sidebar / secondary content"
            description="Use for settings, metadata, filters, contextual help, or inspector controls."
            className="min-h-[180px]"
          />
        </div>
      </div>
    </div>
  );
}

function StackDemo() {
  return (
    <div className="space-y-4">
      <div className="app-card p-5">
        <SectionHeader
          title="Page header layer"
          description="Top-level page section with title, context, and actions."
          actions={
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" icon={appIcons.filter}>
                Filter
              </Button>
              <Button variant="primary" icon={appIcons.create}>
                Add item
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DemoBlock
          title="Summary card"
          description="First supporting layer below the page header."
        />
        <DemoBlock
          title="Summary card"
          description="These should stay compact and easy to scan."
        />
        <DemoBlock
          title="Summary card"
          description="Use this row for metrics, status, or quick actions."
        />
      </div>

      <div className="app-card app-section-padding">
        <div className="mb-2 font-semibold">Main content section</div>
        <p className="text-sm app-text-muted">
          Larger detail sections should generally appear below summary layers, not above
          them, unless the page is a pure editor or single-purpose tool.
        </p>
      </div>

      <div className="app-card p-4">
        <div className="font-semibold">Supporting / lower-priority section</div>
        <p className="mt-2 text-sm app-text-muted">
          Use lower sections for additional notes, tables, secondary actions, or
          historical information.
        </p>
      </div>
    </div>
  );
}

function ResponsiveRules() {
  const rules = [
    "Use one-column stacking first, then expand to 2- or 3-column layouts at larger breakpoints.",
    "Avoid dense sidebars on smaller widths unless they collapse well.",
    "Summary cards should collapse cleanly before forms or editors do.",
    "Main + sidebar layouts should only appear when both columns still have enough breathing room.",
    "Headers and actions should wrap before they shrink too far.",
  ];

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {rules.map((rule) => (
        <div key={rule} className="app-card p-4">
          <div className="flex items-start gap-3">
            <AppIcon icon={appIcons.layout} size={16} className="mt-0.5 app-brand-text" />
            <div className="text-sm app-text-muted">{rule}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AdminUiLayoutPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Layout"
      description="Reference page for containers, grids, stacking rules, and responsive page structure."
      currentPath="/admin/ui/layout"
    >
      <UiLabSection
        title="Container width"
        description="Use the standard content container for most pages so the shell and page content feel aligned."
      >
        <WidthDemo />
      </UiLabSection>

      <UiLabSection
        title="Grid patterns"
        description="These are the most common layout grids worth standardizing across admin and platform pages."
      >
        <GridDemo />
      </UiLabSection>

      <UiLabSection
        title="Page stacking rhythm"
        description="The order of page sections affects readability just as much as the styling of each section."
      >
        <StackDemo />
      </UiLabSection>

      <UiLabSection
        title="Responsive rules"
        description="These are the layout rules to follow before making page-specific exceptions."
      >
        <ResponsiveRules />
      </UiLabSection>

      <UiLabSection
        title="Readiness"
        description="A quick summary of what feels stable and what still needs refinement."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="success">Strong already</Badge>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Container width direction</p>
              <p>Summary-card row layouts</p>
              <p>Main + sidebar pattern</p>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="warning">Needs refinement</Badge>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Dense admin edit pages</p>
              <p>Builder workspace layouts</p>
              <p>Some mobile breakpoints</p>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="muted">Future additions</Badge>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Table layouts</p>
              <p>Drawer / inspector overlays</p>
              <p>Comparative mobile layout gallery</p>
            </div>
          </div>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}
