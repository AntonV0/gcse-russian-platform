import { LAYOUT_FUTURE_ITEMS } from "@/components/admin/ui-lab-layout-data";
import { UiLabLayoutDemoBlock } from "@/components/admin/ui-lab-layout-demo-block";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import ResponsivePreviewFrame, {
  ResponsivePreviewSet,
} from "@/components/admin/ui-lab-responsive-preview";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import SectionHeader from "@/components/ui/section-header";
import StatusSummaryCard from "@/components/ui/status-summary-card";
import Surface from "@/components/ui/surface";

function DemoGridPatterns() {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 font-semibold text-[var(--text-primary)]">
          Two-column pairs
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <UiLabLayoutDemoBlock
            title="Balanced split"
            description="Best for paired content or moderate-density admin sections."
          />
          <UiLabLayoutDemoBlock
            title="Balanced split"
            description="Works when both blocks have similar importance and depth."
          />
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-[var(--text-primary)]">
          Three-column summaries
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <UiLabLayoutDemoBlock title="Metric" description="Compact overview or KPI card." />
          <UiLabLayoutDemoBlock title="Metric" description="Compact overview or KPI card." />
          <UiLabLayoutDemoBlock title="Metric" description="Compact overview or KPI card." />
        </div>
      </div>

      <div>
        <div className="mb-2 font-semibold text-[var(--text-primary)]">
          Main + sidebar
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)]">
          <UiLabLayoutDemoBlock
            title="Main content"
            description="Use for detailed editing, learning content, review queues, or tables."
            className="min-h-[180px]"
          />
          <UiLabLayoutDemoBlock
            title="Sidebar"
            description="Use for metadata, filters, supporting context, or actions."
            className="min-h-[180px]"
          />
        </div>
      </div>
    </div>
  );
}

function DemoDensityComparison() {
  const patterns = [
    {
      title: "Dense admin layer",
      description:
        "Tighter spacing is acceptable when users are scanning rows, settings, or content structures repeatedly.",
      icon: "layout" as const,
    },
    {
      title: "Calmer student layer",
      description:
        "Use more breathing room and softer pacing when the user is reading, revising, or choosing the next lesson.",
      icon: "courses" as const,
    },
    {
      title: "Focused utility rail",
      description:
        "Side rails should stay compact and supporting, not compete with the main task flow.",
      icon: "info" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {patterns.map((item) => (
        <Card key={item.title} className="h-full p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl [background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
            <AppIcon icon={item.icon} size={18} />
          </div>
          <div className="mb-2 font-semibold text-[var(--text-primary)]">
            {item.title}
          </div>
          <p className="text-sm app-text-muted">{item.description}</p>
        </Card>
      ))}
    </div>
  );
}

function DemoStackingRhythm() {
  return (
    <div className="space-y-4">
      <Surface variant="default" padding="md">
        <SectionHeader
          title="Page header layer"
          description="Page title, description, and key actions should be the first clear layer."
          actions={
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" icon="filter">
                Filter
              </Button>
              <Button variant="primary" icon="create">
                Create
              </Button>
            </div>
          }
        />
      </Surface>

      <div className="grid gap-4 md:grid-cols-3">
        <UiLabLayoutDemoBlock
          title="Summary layer"
          description="Metrics, status, or quick summary."
        />
        <UiLabLayoutDemoBlock
          title="Summary layer"
          description="Keep this row compact and scannable."
        />
        <UiLabLayoutDemoBlock
          title="Summary layer"
          description="Do not bury the main task above it."
        />
      </div>

      <UiLabLayoutDemoBlock
        title="Primary content layer"
        description="Large sections, tables, editors, or the main lesson content belong here."
      />
      <UiLabLayoutDemoBlock
        title="Secondary/supporting layer"
        description="Use this for notes, history, related items, help, or lower-priority details."
      />
    </div>
  );
}

function DemoResponsiveRules() {
  const rules = [
    "Default to one-column stacking, then open into two or three columns only when the content still breathes.",
    "Summary rows should collapse before editors and form controls start feeling cramped.",
    "Main + sidebar layouts should only appear when both columns remain readable and usable.",
    "Headers and action groups should wrap cleanly before their spacing becomes strained.",
    "Student pages should preserve readable line length even when lots of card content exists.",
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {rules.map((rule) => (
        <Card key={rule} className="p-4">
          <div className="flex items-start gap-3">
            <AppIcon icon="layout" size={16} className="mt-0.5 app-brand-text" />
            <p className="text-sm app-text-muted">{rule}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PreviewPanel({
  title,
  description,
  tone = "default",
}: {
  title: string;
  description: string;
  tone?: "default" | "muted" | "brand";
}) {
  const toneClass =
    tone === "brand"
      ? "app-surface-brand"
      : tone === "muted"
        ? "app-surface-muted"
        : "app-card";

  return (
    <div className={`${toneClass} p-3`}>
      <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
      <p className="mt-1 text-xs leading-5 app-text-muted">{description}</p>
    </div>
  );
}

function DemoResponsivePreviewFrames() {
  return (
    <ResponsivePreviewSet>
      <ResponsivePreviewFrame
        title="Mobile stack"
        viewport="390px"
        description="Primary action first, secondary actions stacked, and no side rails."
      >
        <div className="space-y-3">
          <PreviewPanel
            title="Continue lesson"
            description="Short, readable copy with a clear next action."
            tone="brand"
          />
          <div className="grid gap-2">
            <Button variant="primary" size="sm" icon="next">
              Continue
            </Button>
            <Button variant="secondary" size="sm" icon="vocabulary">
              Revise vocabulary
            </Button>
          </div>
          <PreviewPanel
            title="Progress"
            description="Small supporting panels sit below the main flow."
            tone="muted"
          />
        </div>
      </ResponsivePreviewFrame>

      <ResponsivePreviewFrame
        title="Tablet workspace"
        viewport="768px"
        description="Use two-column layouts only when both columns remain comfortable."
      >
        <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-2">
            <PreviewPanel title="Navigation" description="Compact section list." />
            <PreviewPanel title="Filters" description="Stacked controls." tone="muted" />
          </div>
          <div className="space-y-2">
            <PreviewPanel
              title="Primary editor"
              description="Main work area gets the wider column."
              tone="brand"
            />
            <PreviewPanel title="Action row" description="Buttons wrap before overflow." />
          </div>
        </div>
      </ResponsivePreviewFrame>

      <ResponsivePreviewFrame
        title="Desktop layout"
        viewport="1280px+"
        description="Desktop can support a sidebar, main editor, and inspector."
      >
        <div className="grid gap-3 sm:grid-cols-[0.8fr_1.4fr_0.8fr]">
          <PreviewPanel title="Sidebar" description="Structure and filters." />
          <PreviewPanel
            title="Main content"
            description="Primary task surface."
            tone="brand"
          />
          <PreviewPanel title="Inspector" description="Contextual settings." />
        </div>
      </ResponsivePreviewFrame>
    </ResponsivePreviewSet>
  );
}

export function UiLabLayoutGridResponsiveSections() {
  return (
    <>
      <UiLabSection
        id="grids"
        title="Grid patterns"
        description="These are the most reusable grid structures worth standardising across the product."
      >
        <DemoGridPatterns />
      </UiLabSection>

      <UiLabSection
        id="density"
        title="Density and hierarchy"
        description="The same design system can serve different page moods by changing density, emphasis, and pacing."
      >
        <DemoDensityComparison />
      </UiLabSection>

      <UiLabSection
        title="Page stacking rhythm"
        description="Section order matters as much as spacing — especially when pages mix summaries, actions, and detailed work."
      >
        <DemoStackingRhythm />
      </UiLabSection>

      <UiLabSection
        id="responsive"
        title="Responsive rules"
        description="Use these rules before creating page-specific exceptions."
      >
        <div className="space-y-4">
          <DemoResponsiveRules />
          <DemoResponsivePreviewFrames />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Readiness"
        description="The layout language is now strong enough to guide real implementation across the platform."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatusSummaryCard
            title="Stable now"
            description="Shell structure, summary rows, main + sidebar composition, and reading-focused lesson layouts."
            badgeTone="success"
            badgeLabel="Ready"
          />
          <StatusSummaryCard
            title="Refine carefully"
            description="Builder workspace density, very compact admin tools, and a few smaller breakpoint decisions."
            badgeTone="warning"
            badgeLabel="Refine"
          />
          <StatusSummaryCard
            title="Future add-ons"
            description="Drawer patterns, overlay inspectors, and a wider mobile layout comparison set."
            badgeTone="muted"
            badgeLabel="Later"
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Empty-shell fallback"
        description="Even when a page has no content yet, the layout should still feel intentional."
      >
        <EmptyState
          icon="layout"
          iconTone="brand"
          title="No page sections configured yet"
          description="Start with a page header, add one summary layer only if it helps, then build the primary content area before adding extra supporting rails."
          action={
            <Button variant="secondary" icon="create">
              Add first section
            </Button>
          }
        />
      </UiLabSection>

      <UiLabFutureSection items={LAYOUT_FUTURE_ITEMS} />
    </>
  );
}
