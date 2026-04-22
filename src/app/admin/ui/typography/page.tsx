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
          <div className="mt-2 app-title">GCSE Russian platform</div>
          <p className="mt-3 max-w-2xl app-subtitle">
            The page title should feel clearly more important than anything beneath it.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
            <div className="app-section-title">Section title</div>
            <p className="mt-2 text-sm app-text-muted">
              This is the main layer for page sections, grouped panels, and dashboard
              blocks.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
            <div className="app-card-title">Card title</div>
            <p className="mt-2 text-sm app-text-muted">
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
          <p className="mt-2 text-sm app-text-muted">
            Useful for framing a section or naming a control.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] p-4">
          <div className="text-sm font-medium text-[var(--text-primary)]">
            Metadata row
          </div>
          <p className="mt-1 text-sm app-text-soft">Edited 2 hours ago · Higher tier</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] p-4">
          <div className="app-form-description">Helper copy</div>
          <p className="mt-2 text-sm app-text-muted">Should explain, not dominate.</p>
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

function DemoFontSystemPreview() {
  const examples = [
    {
      title: "Page title / English",
      english: "Build confidence before the exam",
      russian: "Уверенность перед экзаменом",
      note: "Main headings should feel premium and reassuring, not stiff.",
      kind: "title",
    },
    {
      title: "Section title / English + Russian",
      english: "Travel and tourist transactions",
      russian: "Путешествия и туристические ситуации",
      note: "Section titles should scan quickly in both languages.",
      kind: "section",
    },
    {
      title: "Body copy / lesson explanation",
      english:
        "Use the target language to describe where you are going, how you will travel, and what you plan to do when you arrive.",
      russian:
        "Используй язык, чтобы описать, куда ты едешь, как ты будешь путешествовать и что ты планируешь делать по прибытии.",
      note: "Body text must stay calm and readable in longer lesson blocks.",
      kind: "body",
    },
    {
      title: "Input and form language",
      english: "Lesson title",
      russian: "Название урока",
      note: "Forms should feel clean and modern without looking too corporate.",
      kind: "form",
    },
  ] as const;

  return (
    <div className="space-y-4">
      <PanelCard
        title="Live direction now applied"
        description="The base UI direction is now a warmer humanist sans stack with a neutral sans fallback."
        contentClassName="space-y-4"
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="success">Current direction</Badge>
          <Badge tone="muted">Humanist sans</Badge>
          <Badge tone="muted">English + Russian safe stack</Badge>
        </div>

        <p className="text-sm app-text-muted">
          This is still a system-stack direction, not a final hosted font decision. It
          lets the product feel warmer right now while keeping performance and
          implementation simple.
        </p>
      </PanelCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {examples.map((example) => (
          <PanelCard
            key={example.title}
            title={example.title}
            description={example.note}
            contentClassName="space-y-4"
          >
            {example.kind === "title" ? (
              <div className="space-y-3">
                <div className="app-label">English</div>
                <div className="app-title">{example.english}</div>

                <div className="app-label pt-2">Russian</div>
                <div className="app-title">{example.russian}</div>
              </div>
            ) : null}

            {example.kind === "section" ? (
              <div className="space-y-3">
                <div>
                  <div className="app-label">English</div>
                  <div className="mt-2 app-section-title text-[1.2rem]">
                    {example.english}
                  </div>
                </div>

                <div>
                  <div className="app-label">Russian</div>
                  <div className="mt-2 app-section-title text-[1.2rem]">
                    {example.russian}
                  </div>
                </div>
              </div>
            ) : null}

            {example.kind === "body" ? (
              <div className="space-y-4">
                <div>
                  <div className="app-label">English</div>
                  <p className="mt-2 text-base leading-7 text-[var(--text-primary)]">
                    {example.english}
                  </p>
                </div>

                <div>
                  <div className="app-label">Russian</div>
                  <p className="mt-2 text-base leading-7 text-[var(--text-primary)]">
                    {example.russian}
                  </p>
                </div>
              </div>
            ) : null}

            {example.kind === "form" ? (
              <div className="space-y-4">
                <FormField
                  label={example.english}
                  description="Shown in admin tools, CMS forms, and settings screens."
                >
                  <Input placeholder="School and daily routine" />
                </FormField>

                <FormField
                  label={example.russian}
                  description="Показывается в формах, настройках и редакторе контента."
                >
                  <Input placeholder="Школа и распорядок дня" />
                </FormField>
              </div>
            ) : null}
          </PanelCard>
        ))}
      </div>
    </div>
  );
}

function DemoLessonContentTypography() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <PanelCard
        title="Vocabulary block"
        description="Lesson content should stay readable in both languages at a glance."
        contentClassName="space-y-3"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
          <div className="app-label">New word</div>
          <div className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
            путешествовать
          </div>
          <div className="mt-2 text-sm app-text-muted">to travel</div>
          <p className="mt-3 text-sm leading-6 text-[var(--text-primary)]">
            Use it when talking about holidays, transport, and future plans.
          </p>
        </div>
      </PanelCard>

      <PanelCard
        title="Exam tip"
        description="Short guidance blocks need strong hierarchy and quick scanning."
        contentClassName="space-y-3"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
          <div className="app-label">Exam tip</div>
          <div className="mt-2 text-base font-semibold text-[var(--text-primary)]">
            Include a future time marker
          </div>
          <p className="mt-2 text-sm leading-6 app-text-muted">
            Add words like{" "}
            <span className="font-medium text-[var(--text-primary)]">завтра</span>,{" "}
            <span className="font-medium text-[var(--text-primary)]">
              на следующей неделе
            </span>
            , or <span className="font-medium text-[var(--text-primary)]">я буду</span> to
            make your timeframe clear.
          </p>
        </div>
      </PanelCard>

      <PanelCard
        title="Translation prompt"
        description="Prompt and answer areas need calm typography, not visual noise."
        contentClassName="space-y-3"
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4">
          <div className="app-label">Translate into Russian</div>
          <p className="mt-2 text-base leading-7 text-[var(--text-primary)]">
            Next summer I am going to travel to Russia with my family.
          </p>
          <div className="mt-4 rounded-xl border border-dashed border-[var(--border)] px-3 py-4 text-sm app-text-soft">
            Student answer area
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
    "Keep one global body font for the product unless there is a very strong reason to split experiences.",
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
        title="Hierarchy scale"
        description="The spacing and contrast between title levels should feel deliberate across the whole product."
      >
        <DemoHierarchyScale />
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
        title="Applied font direction"
        description="The current base direction is now tested against real English and Russian product content."
      >
        <DemoFontSystemPreview />
      </UiLabSection>

      <UiLabSection
        title="Lesson-content typography"
        description="Typography should also hold up inside actual study patterns, not just admin UI."
      >
        <DemoLessonContentTypography />
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
