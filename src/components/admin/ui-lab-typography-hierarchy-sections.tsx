import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import SectionHeader from "@/components/ui/section-header";
import Textarea from "@/components/ui/textarea";

function DemoPageHierarchy() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <PanelCard
        title="Admin page hierarchy"
        description="Dense, direct, and strongly structured."
        contentClassName="space-y-4"
      >
        <SectionHeader
          title="Lesson builder"
          description="Manage sections, blocks, publishing state, and variation by course access."
          actions={<Badge tone="info">Admin view</Badge>}
        />

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
          <div className="app-label">Subsection label</div>
          <h3 className="mt-2 app-heading-subsection">Section metadata</h3>
          <p className="mt-2 app-text-body-muted">
            Use compact supporting text to explain what the editor controls without
            overpowering the content.
          </p>
        </div>
      </PanelCard>

      <PanelCard
        title="Student page hierarchy"
        description="Calmer, more encouraging, and slightly more spacious."
        contentClassName="space-y-4"
      >
        <div>
          <div className="app-label">Continue learning</div>
          <h2 className="mt-2 app-heading-hero">
            Theme 2: Local area, holiday and travel
          </h2>
          <p className="mt-3 max-w-2xl app-text-body-muted">
            Student-facing typography should stay clear and reassuring, with a lighter
            sense of pacing than dense admin tools.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
          <div className="app-heading-card">
            Next lesson: Travel and tourist transactions
          </div>
          <p className="mt-2 app-text-body-muted">
            Card titles should feel strong enough to anchor a section without competing
            with the page title above.
          </p>
        </div>
      </PanelCard>
    </div>
  );
}

function DemoHierarchyScale() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <PanelCard
        title="Hierarchy ladder"
        description="The jump between levels should feel intentional, not accidental."
        contentClassName="space-y-4"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-5">
          <div className="app-label">Page label</div>
          <div className="mt-2 app-heading-page">GCSE Russian platform</div>
          <p className="mt-3 max-w-2xl app-subtitle">
            The page title should feel clearly more important than anything beneath it.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
            <div className="app-heading-section">Section title</div>
            <p className="mt-2 app-text-body-muted">
              This is the main layer for page sections, grouped panels, and dashboard
              blocks.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
            <div className="app-heading-card">Card title</div>
            <p className="mt-2 app-text-body-muted">
              Card titles should anchor a local area without competing with section
              titles.
            </p>
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="What should stay small"
        description="Labels, helper text, and metadata should guide structure quietly."
        contentClassName="space-y-3"
      >
        <div className="rounded-2xl border border-[var(--border)] p-4">
          <div className="app-label">Label example</div>
          <p className="mt-2 app-text-body-muted">
            Useful for framing a section or naming a control.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] p-4">
          <div className="app-heading-card">Metadata row</div>
          <p className="mt-1 app-text-meta normal-case">
            Edited 2 hours ago · Higher tier
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] p-4">
          <div className="app-form-description">Helper copy</div>
          <p className="mt-2 app-text-helper">Should explain, not dominate.</p>
        </div>
      </PanelCard>
    </div>
  );
}

function DemoTextRoles() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <div className="mb-2 font-semibold text-[var(--text-primary)]">Primary body</div>
        <p className="app-text-body">
          This is the standard reading style for body copy. It should stay readable across
          admin tools, dashboard cards, and learning pages without needing page-specific
          overrides.
        </p>
      </Card>

      <Card className="p-5">
        <div className="mb-2 font-semibold text-[var(--text-primary)]">
          Muted supporting copy
        </div>
        <p className="app-text-body-muted">
          Use muted text for guidance, context, and supporting explanation. It should stay
          readable, but not compete with action labels or section titles.
        </p>
      </Card>

      <Card className="p-5">
        <div className="mb-2 font-semibold text-[var(--text-primary)]">
          Soft metadata and labels
        </div>
        <div className="app-label">Published yesterday</div>
        <p className="mt-2 app-text-caption">
          Soft text is best for low-priority metadata, timestamps, counters, and technical
          support detail.
        </p>
      </Card>

      <Card className="p-5">
        <div className="mb-2 font-semibold text-[var(--text-primary)]">
          Compact row text
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
          <div className="min-w-0">
            <div className="font-medium text-[var(--text-primary)]">
              School and daily routine
            </div>
            <div className="mt-1 app-text-meta normal-case">
              Higher tier · 6 blocks · edited 2 hours ago
            </div>
          </div>
          <Badge tone="success">Published</Badge>
        </div>
      </Card>
    </div>
  );
}

function DemoFormTypography() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <PanelCard
        title="Forms in context"
        description="Typography inside forms should guide the user without becoming noisy."
        contentClassName="space-y-4"
      >
        <FormField
          label="Lesson title"
          description="Used in cards, builder navigation, and page headers."
          required
        >
          <Input placeholder="School and daily routine" />
        </FormField>

        <FormField label="Summary" hint="Keep it short and suitable for previews.">
          <Textarea
            rows={4}
            placeholder="A practical introduction to school subjects, routines, and everyday classroom language."
          />
        </FormField>

        <FormField label="Slug" success="Looks valid and readable.">
          <Input placeholder="school-and-daily-routine" />
        </FormField>
      </PanelCard>

      <PanelCard
        title="Microcopy rules"
        description="These layers should stay distinct."
        contentClassName="space-y-3"
      >
        <div className="rounded-2xl border border-[var(--border)] p-4">
          <div className="app-form-label">Label</div>
          <p className="mt-2 app-text-helper">Tells the user what the field is.</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] p-4">
          <div className="app-form-description">Description</div>
          <p className="mt-2 app-text-helper">
            Explains where the value appears or why it matters.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] p-4">
          <div className="app-form-message">Hint / status</div>
          <p className="mt-2 app-text-helper">
            Confirms, warns, or nudges without replacing the label.
          </p>
        </div>
      </PanelCard>
    </div>
  );
}

function DemoToneComparison() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <PanelCard
        title="Dense admin hierarchy"
        description="Direct labels, shorter descriptions, and compact metadata."
        contentClassName="space-y-4"
      >
        <div>
          <div className="app-label">Inspector</div>
          <div className="mt-2 app-heading-subsection">Section visibility</div>
          <p className="mt-2 app-text-body-muted">
            Short, factual explanation for a repeat-use control.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
          <div className="app-heading-card">Variant visibility</div>
          <div className="mt-1 app-text-meta normal-case">
            shared · higher_only · volna_only
          </div>
        </div>
      </PanelCard>

      <PanelCard
        title="Student-facing hierarchy"
        description="A more reassuring tone while preserving the same design language."
        contentClassName="space-y-4"
      >
        <div>
          <div className="app-label">Progress update</div>
          <div className="mt-2 app-heading-subsection">
            You are building strong exam vocabulary
          </div>
          <p className="mt-2 app-text-body-muted">
            A student message can feel more human and motivating without changing the core
            typography system.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
          <div className="app-heading-card">Suggested next step</div>
          <div className="mt-1 app-text-body-muted">
            Review Theme 1 vocabulary before starting the next listening task.
          </div>
        </div>
      </PanelCard>
    </div>
  );
}

export function UiLabTypographyHierarchySections() {
  return (
    <>
      <UiLabSection
        id="hierarchy"
        title="Page hierarchy in context"
        description="Typography should be tested in real page structures, not isolated specimens."
      >
        <DemoPageHierarchy />
      </UiLabSection>

      <UiLabSection
        title="Hierarchy scale"
        description="The spacing and contrast between title levels should feel deliberate across the whole product."
      >
        <DemoHierarchyScale />
      </UiLabSection>

      <UiLabSection
        id="text-roles"
        title="Text roles"
        description="These are the core text layers reused across cards, rows, tables, and support copy."
      >
        <DemoTextRoles />
      </UiLabSection>

      <UiLabSection
        id="forms"
        title="Form and tool typography"
        description="Forms and compact admin tools need clear labels, support text, and status hierarchy."
      >
        <DemoFormTypography />
      </UiLabSection>

      <UiLabSection
        id="tone"
        title="Density and tone comparison"
        description="The same system should support dense admin tools and calmer student messaging."
      >
        <DemoToneComparison />
      </UiLabSection>
    </>
  );
}
