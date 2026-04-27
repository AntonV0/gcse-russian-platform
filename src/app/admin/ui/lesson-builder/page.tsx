import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabFutureSection from "@/components/admin/ui-lab-future-section";
import UiLabLessonBuilderPrimitivesDemo from "@/components/admin/ui-lab-lesson-builder-primitives-demo";
import UiLabPageNav from "@/components/admin/ui-lab-page-nav";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Surface from "@/components/ui/surface";
import Textarea from "@/components/ui/textarea";

const pageNavItems = [
  { id: "workspace-shell", label: "Workspace shell" },
  { id: "production-primitives", label: "Primitives" },
  { id: "section-sidebar", label: "Section sidebar" },
  { id: "block-composer", label: "Block composer" },
  { id: "block-list", label: "Block list" },
  { id: "inspector", label: "Inspector" },
  { id: "empty-pending", label: "Empty + pending" },
  { id: "future-components", label: "Future" },
];

const blockTypes = [
  ["Structure", ["Header", "Subheader", "Divider"]],
  ["Teaching", ["Text", "Note", "Callout", "Exam tip", "Vocabulary"]],
  ["Media", ["Image", "Audio"]],
  ["Practice", ["Question set", "Vocabulary set"]],
] as const;

function BuilderPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background-muted)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
      {children}
    </span>
  );
}

function BuilderIconButton({ label }: { label: string }) {
  return (
    <Button variant="secondary" size="sm" icon="settings" iconOnly ariaLabel={label} />
  );
}

function SectionSidebarRow({
  title,
  active = false,
  dropTarget = false,
}: {
  title: string;
  active?: boolean;
  dropTarget?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border px-3 py-3 transition",
        active
          ? "app-selected-surface"
          : "border-[var(--border)] bg-[var(--background-elevated)]",
        dropTarget
          ? "ring-2 ring-[color-mix(in_srgb,var(--success)_40%,transparent)]"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <Badge tone={active ? "default" : "muted"}>{active ? "Selected" : "Draft"}</Badge>
        <Badge tone="info">H</Badge>
      </div>
      <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <BuilderPill>4 blocks</BuilderPill>
        <BuilderPill>content</BuilderPill>
      </div>
      {dropTarget ? (
        <div className="mt-2 text-xs font-semibold text-[var(--success)]">
          Drop block here
        </div>
      ) : null}
    </div>
  );
}

function BlockRow({
  title,
  type,
  selected = false,
  dropTarget = false,
}: {
  title: string;
  type: string;
  selected?: boolean;
  dropTarget?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border px-3 py-3 transition",
        selected
          ? "app-selected-surface"
          : "border-[var(--border)] bg-[var(--background-elevated)]",
        dropTarget ? "ring-2 ring-[var(--accent-ring)]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <BuilderPill>drag</BuilderPill>
            <Badge tone="info">{type}</Badge>
            <Badge tone="success">Published</Badge>
            {selected ? <Badge tone="default">Selected</Badge> : null}
          </div>
          <div className="font-semibold text-[var(--text-primary)]">{title}</div>
          <p className="mt-1 line-clamp-2 text-sm app-text-muted">
            Preview text from the block should help editors recognise the content without
            opening the inspector.
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-1.5">
          <BuilderIconButton label="Duplicate block" />
          <BuilderIconButton label="Move block up" />
          <BuilderIconButton label="Publish block" />
          <BuilderIconButton label="Move block down" />
        </div>
      </div>
    </div>
  );
}

export default async function AdminUiLessonBuilderPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Lesson Builder"
      description="Reference patterns for the CMS authoring workspace: sections, block creation, draggable lists, inspectors, metadata, and save states."
      currentPath="/admin/ui/lesson-builder"
    >
      <UiLabPageNav items={pageNavItems} />

      <UiLabSection
        id="workspace-shell"
        title="Workspace shell"
        description="The lesson builder should feel like an authoring tool: sidebar, creation-first editor, and inspector."
      >
        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <PanelCard title="Sections" density="compact" tone="muted">
            <div className="space-y-2">
              <SectionSidebarRow title="Starter vocabulary" active />
              <SectionSidebarRow title="Exam tip: opinions" />
              <SectionSidebarRow title="Reading practice" />
            </div>
          </PanelCard>

          <PanelCard
            title="Create and arrange blocks"
            description="Creation stays above the block list so the first-block workflow is obvious."
            density="compact"
            tone="admin"
          >
            <div className="space-y-4">
              <Surface variant="muted" padding="md">
                <div className="font-semibold text-[var(--text-primary)]">
                  Create a new block
                </div>
                <p className="mt-1 text-sm app-text-muted">
                  Pick a type, use a preset if useful, then edit the result in context.
                </p>
              </Surface>
              <BlockRow title="School subjects vocabulary" type="Teaching" selected />
              <BlockRow title="Listen and choose the correct subject" type="Practice" />
            </div>
          </PanelCard>

          <PanelCard title="Inspector" density="compact" tone="student">
            <div className="space-y-3">
              <Badge tone="default">Selected block</Badge>
              <FormField label="Title">
                <Input defaultValue="School subjects vocabulary" />
              </FormField>
              <FormField label="Content">
                <Textarea
                  rows={5}
                  defaultValue="Introduce core nouns and opinion phrases."
                />
              </FormField>
            </div>
          </PanelCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="production-primitives"
        title="Production builder primitives"
        description="These are real reusable components from the lesson-builder package, shown separately from static future extraction ideas."
      >
        <UiLabLessonBuilderPrimitivesDemo />
      </UiLabSection>

      <UiLabSection
        id="section-sidebar"
        title="Section sidebar states"
        description="Section rows need selected, draft, variant visibility, and block-drop states."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <SectionSidebarRow title="Selected shared intro" active />
          <SectionSidebarRow title="Higher-only grammar note" />
          <SectionSidebarRow title="Drop target section" dropTarget />
        </div>
      </UiLabSection>

      <UiLabSection
        id="block-composer"
        title="Block composer"
        description="Block creation should show categories, selected state, preset entry points, and the selected form."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <SectionCard title="Choose a block type" tone="admin" density="compact">
            <div className="space-y-5">
              {blockTypes.map(([group, items]) => (
                <div key={group}>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] app-text-soft">
                    {group}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                      <button
                        key={item}
                        type="button"
                        className={[
                          "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                          index === 0 && group === "Teaching"
                            ? "app-selected-surface-strong"
                            : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)]",
                        ].join(" ")}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Selected block form"
            description="The form should appear directly below the selected choice in the real builder."
            tone="muted"
            density="compact"
          >
            <div className="space-y-4">
              <FormField label="Block title">
                <Input defaultValue="Opinion starter" />
              </FormField>
              <FormField label="Content">
                <Textarea
                  rows={5}
                  defaultValue="Model how to say I like, I dislike, because it is..."
                />
              </FormField>
              <InlineActions>
                <Button variant="primary" icon="create">
                  Add block
                </Button>
                <Button variant="secondary" icon="cancel">
                  Clear selection
                </Button>
              </InlineActions>
            </div>
          </SectionCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="block-list"
        title="Draggable block list"
        description="Rows must support selection, dragging, publishing, duplication, and compact icon actions."
      >
        <div className="space-y-3">
          <BlockRow title="Header: School and routine" type="Structure" />
          <BlockRow title="Vocabulary table: subjects" type="Teaching" selected />
          <BlockRow title="Audio recognition practice" type="Media" dropTarget />
          <BlockRow title="Question set: opinion phrases" type="Practice" />
        </div>
      </UiLabSection>

      <UiLabSection
        id="inspector"
        title="Inspector and metadata"
        description="Variant visibility and canonical section keys are core CMS metadata and deserve first-class examples."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <PanelCard title="Section metadata" tone="admin" density="compact">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Section kind">
                <Select defaultValue="content">
                  <option value="intro">intro</option>
                  <option value="content">content</option>
                  <option value="practice">practice</option>
                  <option value="summary">summary</option>
                </Select>
              </FormField>
              <FormField label="Variant visibility">
                <Select defaultValue="higher_only">
                  <option value="shared">Shared</option>
                  <option value="foundation_only">Foundation only</option>
                  <option value="higher_only">Higher only</option>
                  <option value="volna_only">Volna only</option>
                </Select>
              </FormField>
              <div className="md:col-span-2">
                <FormField
                  label="Canonical section key"
                  description="Used later for equivalent sections across variants."
                >
                  <Input defaultValue="school-opinions-core" />
                </FormField>
              </div>
            </div>
          </PanelCard>

          <PanelCard title="Block editor" tone="muted" density="compact">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone="info">Teaching</Badge>
                <Badge tone="success">Published</Badge>
                <Badge tone="default">Selected</Badge>
              </div>
              <FormField label="Preview">
                <Textarea
                  rows={5}
                  defaultValue="Students practise giving opinions about school subjects with because clauses."
                />
              </FormField>
              <InlineActions align="end">
                <Button variant="primary" icon="save">
                  Save block
                </Button>
                <Button variant="danger" icon="delete">
                  Delete block
                </Button>
              </InlineActions>
            </div>
          </PanelCard>
        </div>
      </UiLabSection>

      <UiLabSection
        id="empty-pending"
        title="Empty and pending states"
        description="Authoring states should explain what is happening and keep the editor oriented."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <EmptyState
            icon="blocks"
            iconTone="brand"
            title="No blocks in this section yet"
            description="Create the first block above to start building this lesson section."
            action={
              <Button variant="primary" icon="create">
                Create first block
              </Button>
            }
          />
          <EmptyState
            icon="search"
            iconTone="warning"
            title="No blocks match your search"
            description="Try a broader keyword or clear the current search."
            action={
              <Button variant="secondary" icon="refresh">
                Clear search
              </Button>
            }
          />
          <Card>
            <CardBody className="space-y-3 p-5">
              <Badge tone="warning" icon="pending">
                Saving
              </Badge>
              <div className="font-semibold text-[var(--text-primary)]">
                Saving block order...
              </div>
              <p className="text-sm app-text-muted">
                Pending states should be visible near the affected list, not only at the
                top of the page.
              </p>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabFutureSection
        items={[
          "BlockTypePicker extracted from the current composer categories.",
          "DraggableListItem shared across sections, blocks, modules, and lessons.",
          "InspectorPanel for selected section/block metadata and save controls.",
          "VariantVisibilityBadge for shared, foundation, higher, and Volna visibility.",
          "CanonicalKeyDisplay for reusable section relationships.",
          "AutosaveStatus for future editor save and sync behaviour.",
        ]}
      />
    </UiLabShell>
  );
}
