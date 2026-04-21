import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
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
          <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
            Section metadata
          </h3>
          <p className="mt-2 text-sm app-text-muted">
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
          <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Theme 2: Local area, holiday and travel
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 app-text-muted">
            Student-facing typography should stay clear and reassuring, with a lighter
            sense of pacing than dense admin tools.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
          <div className="text-base font-semibold text-[var(--text-primary)]">
            Next lesson: Travel and tourist transactions
          </div>
          <p className="mt-2 text-sm app-text-muted">
            Card titles should feel strong enough to anchor a section without competing
            with the page title above.
          </p>
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
        <p>
          This is the standard reading style for body copy. It should stay readable across
          admin tools, dashboard cards, and learning pages without needing page-specific
          overrides.
        </p>
      </Card>

      <Card className="p-5">
        <div className="mb-2 font-semibold text-[var(--text-primary)]">
          Muted supporting copy
        </div>
        <p className="app-text-muted">
          Use muted text for guidance, context, and supporting explanation. It should stay
          readable, but not compete with action labels or section titles.
        </p>
      </Card>

      <Card className="p-5">
        <div className="mb-2 font-semibold text-[var(--text-primary)]">
          Soft metadata and labels
        </div>
        <div className="app-label">Published yesterday</div>
        <p className="mt-2 app-text-soft">
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
            <div className="mt-1 text-sm app-text-muted">
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
          <p className="mt-2 text-sm app-text-muted">Tells the user what the field is.</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] p-4">
          <div className="app-form-description">Description</div>
          <p className="mt-2 text-sm app-text-muted">
            Explains where the value appears or why it matters.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] p-4">
          <div className="app-form-message">Hint / status</div>
          <p className="mt-2 text-sm app-text-muted">
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
          <div className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
            Section visibility
          </div>
          <p className="mt-2 text-sm app-text-muted">
            Short, factual explanation for a repeat-use control.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
          <div className="text-sm font-medium text-[var(--text-primary)]">
            Variant visibility
          </div>
          <div className="mt-1 text-sm app-text-soft">
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
          <div className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
            You are building strong exam vocabulary
          </div>
          <p className="mt-2 text-sm leading-6 app-text-muted">
            A student message can feel more human and motivating without changing the core
            typography system.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
          <div className="text-sm font-medium text-[var(--text-primary)]">
            Suggested next step
          </div>
          <div className="mt-1 text-sm app-text-muted">
            Review Theme 1 vocabulary before starting the next listening task.
          </div>
        </div>
      </PanelCard>
    </div>
  );
}

function DemoTypographyRules() {
  const rules = [
    "Page titles should be noticeably stronger than section titles, not just slightly larger.",
    "Use muted text for support, not for primary decisions or actions.",
    "Labels should guide structure, not compete with headings.",
    "Compact admin text can be denser, but should still preserve readable hierarchy.",
    "Student-facing copy can be warmer and more encouraging while staying within the same system.",
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {rules.map((rule) => (
        <Card key={rule} className="p-4">
          <p className="text-sm app-text-muted">{rule}</p>
        </Card>
      ))}
    </div>
  );
}

export default async function AdminUiTypographyPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Typography"
      description="Reference page for hierarchy, body copy, labels, metadata, and readable text patterns across the platform."
      currentPath="/admin/ui/typography"
    >
      <UiLabSection
        title="Page hierarchy in context"
        description="Typography should be tested in real page structures, not isolated specimens."
      >
        <DemoPageHierarchy />
      </UiLabSection>

      <UiLabSection
        title="Text roles"
        description="These are the core text layers reused across cards, rows, tables, and support copy."
      >
        <DemoTextRoles />
      </UiLabSection>

      <UiLabSection
        title="Form and tool typography"
        description="Forms and compact admin tools need clear labels, support text, and status hierarchy."
      >
        <DemoFormTypography />
      </UiLabSection>

      <UiLabSection
        title="Density and tone comparison"
        description="The same system should support dense admin tools and calmer student messaging."
      >
        <DemoToneComparison />
      </UiLabSection>

      <UiLabSection
        title="Typography rules"
        description="Keep these principles stable as more product areas are built."
      >
        <DemoTypographyRules />
      </UiLabSection>
    </UiLabShell>
  );
}
