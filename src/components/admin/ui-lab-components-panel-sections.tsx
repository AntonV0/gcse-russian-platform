import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import InfoRow from "@/components/ui/info-row";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import SectionHeader from "@/components/ui/section-header";
import SummaryStatCard from "@/components/ui/summary-stat-card";

function PanelExampleBlock({
  title,
  description,
  tone = "default",
}: {
  title: string;
  description: string;
  tone?: "default" | "muted";
}) {
  const isMuted = tone === "muted";

  return (
    <div
      className={[
        "rounded-2xl border border-[var(--border)] px-4 py-3",
        isMuted ? "bg-[var(--background-muted)]" : "bg-[var(--background-elevated)]",
      ].join(" ")}
    >
      <div className="text-sm font-medium text-[var(--text-primary)]">{title}</div>
      <div
        className={["mt-1 text-sm", isMuted ? "app-text-soft" : "app-text-muted"].join(
          " "
        )}
      >
        {description}
      </div>
    </div>
  );
}

function DemoHeaders() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="app-card p-5">
        <SectionHeader
          title="Modules"
          description="Manage modules, lesson counts, and ordering for this variant."
          actions={
            <InlineActions>
              <Button variant="secondary" icon="filter">
                Filter
              </Button>
              <Button variant="primary" icon="create">
                Add module
              </Button>
            </InlineActions>
          }
        />
      </div>

      <div className="app-card p-5">
        <div className="space-y-2">
          <div className="app-label">Usage guidance</div>
          <div className="space-y-2 text-sm app-text-muted">
            <p>Use SectionHeader for page tops, section blocks, and edit screens.</p>
            <p>Keep actions on the right and avoid one-off alignment rules.</p>
            <p>Use concise descriptions rather than long paragraphs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoStats() {
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-3">
        <SummaryStatCard
          title="Completed lessons"
          value="18"
          icon="completed"
          tone="brand"
          description="Across all active modules in the current course."
          badge={<Badge tone="success">+3 this week</Badge>}
        />

        <SummaryStatCard
          title="Submissions to review"
          value="12"
          icon="pending"
          tone="warning"
          description="Teacher queue for written and speaking assignments."
          badge={<Badge tone="warning">Needs attention</Badge>}
        />

        <SummaryStatCard
          title="Locked higher content"
          value="24"
          icon="locked"
          tone="danger"
          description="Visible upgrade-aware lessons and premium practice areas."
          badge={<Badge tone="muted">Trial view</Badge>}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <PanelCard
          title="Compact use"
          description="Use the compact variant for tighter admin overviews or narrower columns."
          contentClassName="space-y-4"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <SummaryStatCard
              title="Draft lessons"
              value="6"
              icon="edit"
              tone="default"
              compact
              description="Still unpublished."
            />

            <SummaryStatCard
              title="Question sets"
              value="42"
              icon="help"
              tone="success"
              compact
              description="Available to assign."
            />
          </div>
        </PanelCard>

        <PanelCard
          title="Pattern guidance"
          description="Why this should become the shared metric block."
          contentClassName="space-y-2"
        >
          <p className="text-sm app-text-muted">
            Replaces flatter dashboard-style metric cards with a clearer premium pattern.
          </p>
          <p className="text-sm app-text-muted">
            Supports admin, student, and teacher experiences without changing the design
            language.
          </p>
          <p className="text-sm app-text-muted">
            Keeps icon, value, description, and status in one predictable structure.
          </p>
        </PanelCard>
      </div>
    </>
  );
}

function DemoPanels() {
  return (
    <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      <PanelCard
        title="Admin section panel"
        description="Best default for admin editing and grouped page content."
        tone="admin"
        actions={
          <InlineActions>
            <Button variant="secondary" size="sm" icon="filter">
              Filter
            </Button>
            <Button variant="primary" size="sm" icon="create">
              Add block
            </Button>
          </InlineActions>
        }
        contentClassName="space-y-3"
      >
        <PanelExampleBlock
          title="Section settings"
          description="Use for durable admin structures where actions and description both matter."
        />

        <PanelExampleBlock
          title="Publishing controls"
          description="draft · scheduled · published"
          tone="muted"
        />
      </PanelCard>

      <PanelCard
        title="Compact inspector panel"
        description="Preferred for builder sidebars and denser metadata areas."
        tone="muted"
        density="compact"
        actions={
          <Button variant="quiet" size="sm" icon="settings">
            Options
          </Button>
        }
        contentClassName="space-y-3"
      >
        <InfoRow label="Kind" value="content" />
        <InfoRow label="Position" value="2" />
        <InfoRow label="Published" value="Yes" />
        <InfoRow label="Blocks" value="8" />

        <div className="pt-1 text-sm app-text-muted">
          Compact density should still feel structured, not cramped.
        </div>
      </PanelCard>

      <PanelCard
        title="Student support panel"
        description="A softer section card for learning support and motivation."
        tone="student"
        contentClassName="space-y-3"
      >
        <PanelExampleBlock
          title="Exam reminder"
          description="Keep your answer in full sentences and include a clear time reference."
        />

        <PanelExampleBlock
          title="Suggested next step"
          description="Review the new vocabulary before starting the translation practice."
        />
      </PanelCard>
    </div>
  );
}

export function UiLabComponentsPanelSections() {
  return (
    <>
      <UiLabSection
        id="headers"
        title="Page and section headers"
        description="Use shared header patterns so pages keep a consistent hierarchy and action placement."
      >
        <DemoHeaders />
      </UiLabSection>

      <UiLabSection
        id="stats"
        title="Summary stat cards"
        description="This is the preferred premium metric pattern for dashboards, admin overviews, review queues, and student progress."
      >
        <DemoStats />
      </UiLabSection>

      <UiLabSection
        id="panels"
        title="Premium section / inspector panels"
        description="This is the preferred container pattern for admin sections, side panels, metadata groups, and calmer student support panels."
      >
        <DemoPanels />
      </UiLabSection>
    </>
  );
}
