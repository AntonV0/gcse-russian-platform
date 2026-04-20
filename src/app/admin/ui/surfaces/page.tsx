import { requireAdminAccess } from "@/lib/auth/admin-auth";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import LessonSurfaceCard from "@/components/ui/lesson-surface-card";
import PracticeSurfaceCard from "@/components/ui/practice-surface-card";
import LockedContentCard from "@/components/ui/locked-content-card";
import AssessmentSurfaceCard from "@/components/ui/assessment-surface-card";

function SurfaceExample({
  title,
  description,
  className,
  label,
}: {
  title: string;
  description: string;
  className: string;
  label: string;
}) {
  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        <Badge tone="muted">{label}</Badge>
      </div>

      <p className="text-sm app-text-muted">{description}</p>
    </div>
  );
}

function SpacingBlock({ title, className }: { title: string; className: string }) {
  return (
    <Card className={className}>
      <CardBody>
        <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        <p className="mt-2 text-sm app-text-muted">
          Use this to compare how dense or spacious a layout feels.
        </p>
      </CardBody>
    </Card>
  );
}

function SemanticSurfaceExample({
  eyebrow,
  title,
  description,
  badges,
  className,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badges?: React.ReactNode;
  className: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] app-text-soft">
            {eyebrow}
          </div>
          <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        </div>

        {badges ? <div className="flex shrink-0 flex-wrap gap-2">{badges}</div> : null}
      </div>

      <p className="text-sm app-text-muted">{description}</p>

      {actions ? <div className="mt-4 flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export default async function AdminUiSurfacesPage() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  return (
    <UiLabShell
      title="UI Lab / Surfaces"
      description="Compare cards, panels, branded containers, and spacing patterns so pages feel consistent across the platform."
      currentPath="/admin/ui/surfaces"
    >
      <UiLabSection
        title="Foundational surface types"
        description="These are low-level visual surface weights. They answer how strong a container should feel before a semantic component is built on top of it."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <SurfaceExample
            title="app-card"
            label="Default"
            className="app-card p-5"
            description="Best for modular cards, repeated overview items, dashboard summaries, and most reusable content blocks."
          />

          <SurfaceExample
            title="app-surface"
            label="Elevated"
            className="app-surface p-5"
            description="Use for generic elevated wrappers when the content needs slightly more visual weight than a normal card."
          />

          <SurfaceExample
            title="app-surface-brand"
            label="Branded"
            className="app-surface-brand p-5"
            description="Reserve for hero areas, special highlights, premium flows, or landing moments rather than normal admin content."
          />

          <SurfaceExample
            title="app-surface-muted"
            label="Muted"
            className="app-surface-muted p-5"
            description="Good for supporting containers, internal grouping, and softer contrast areas that should stay visually quiet."
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Shared card primitives"
        description="These are the reusable building blocks for most admin pages. Their roles should stay visually distinct and should be reused before creating page-specific wrappers."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <Card>
            <CardBody className="space-y-3">
              <Badge tone="muted">Base primitive</Badge>
              <div className="font-semibold text-[var(--text-primary)]">Card</div>
              <p className="text-sm app-text-muted">
                Use as the default repeated surface for summaries, dashboard items,
                content previews, and compact grouped information.
              </p>
              <Button variant="secondary" icon="preview">
                Inspect default card
              </Button>
            </CardBody>
          </Card>

          <PanelCard
            title="PanelCard"
            description="Inspector-style or metadata-focused grouping."
          >
            <div className="space-y-3">
              <p className="text-sm app-text-muted">
                Use for structured detail panels where title, context, and content need
                stronger separation.
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge tone="info" icon="preview">
                  Published
                </Badge>
                <Badge tone="muted" icon="file">
                  8 items
                </Badge>
              </div>

              <div className="pt-1">
                <Button variant="secondary" icon="edit">
                  Edit panel
                </Button>
              </div>
            </div>
          </PanelCard>

          <SectionCard
            title="SectionCard"
            description="Section-level wrapper for settings, forms, and page content."
          >
            <div className="space-y-3">
              <p className="text-sm app-text-muted">
                Best when a section needs a visible heading and description before a body
                of controls, actions, or structured content.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon="create">
                  Primary action
                </Button>
                <Button variant="secondary" icon="back">
                  Secondary action
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Semantic content surface patterns"
        description="These are higher-level patterns for specific product experiences. The strongest ones below are now extracted into shared components."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <LessonSurfaceCard
            title="Lesson overview surface"
            description="Use for lesson entry points, lesson overview cards, and content summaries where the main job is orientation and structure."
            levelLabel="Higher"
            metaLabel="6 sections"
            primaryActionLabel="Open lesson"
            secondaryActionLabel="Preview content"
          />

          <PracticeSurfaceCard
            title="Practice task surface"
            description="Use for task blocks, revision prompts, and practice wrappers that need slightly more emphasis than a neutral content card."
            statusLabel="In progress"
            themeLabel="Theme 2"
            primaryActionLabel="Start practice"
            secondaryActionLabel="Back to module"
          />

          <div className="xl:col-span-2">
            <LockedContentCard
              title="Locked or premium surface"
              description="Use for premium upgrade prompts, locked blocks, or access-aware CTAs where you actually want more emotional weight and visibility."
              accessLabel="Full access"
              statusLabel="Locked"
              primaryActionLabel="Unlock full course"
              secondaryActionLabel="Compare access"
            />
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Semantic extraction direction"
        description="These examples are still page-level references for now, but they help define what should become reusable components later."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <AssessmentSurfaceCard
            title="Quiz or mock exam surface"
            description="Assessment wrappers should feel self-contained and serious, but not as promotional as a branded surface."
            typeLabel="Mock exam"
            metaLabel="12 questions"
            urgencyLabel="Timed"
            primaryActionLabel="Start mock exam"
            secondaryActionLabel="View instructions"
          />

          <SemanticSurfaceExample
            eyebrow="Progress / momentum"
            title="Revision milestone surface"
            className="app-surface p-5"
            badges={
              <>
                <Badge tone="success" icon="completed">
                  Milestone reached
                </Badge>
                <Badge tone="default" icon="courses">
                  Next module ready
                </Badge>
              </>
            }
            description="This kind of surface works for progress summaries, revision momentum moments, and encouraging next-step blocks."
            actions={
              <>
                <Button variant="soft" icon="next" iconPosition="right">
                  Continue revision
                </Button>
                <Button variant="secondary" icon="preview">
                  View progress
                </Button>
              </>
            }
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Surface intent guide"
        description="These rules make it easier to decide whether you should create a new semantic surface component or just reuse an existing foundational surface."
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardBody className="space-y-3">
              <Badge tone="muted">Low-level</Badge>
              <div className="font-semibold text-[var(--text-primary)]">
                Foundational surface
              </div>
              <p className="text-sm app-text-muted">
                Use when you only need visual weight control: default, muted, elevated, or
                branded.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3">
              <Badge tone="info">Semantic</Badge>
              <div className="font-semibold text-[var(--text-primary)]">
                Lesson or practice wrapper
              </div>
              <p className="text-sm app-text-muted">
                Use when the container has a repeated product meaning and will appear
                across multiple pages or variants.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3">
              <Badge tone="warning">Do later</Badge>
              <div className="font-semibold text-[var(--text-primary)]">
                Extract after pattern stabilises
              </div>
              <p className="text-sm app-text-muted">
                First prove the pattern inside the UI lab, then move it into a shared
                component with a dev marker.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3">
              <Badge tone="danger">Avoid</Badge>
              <div className="font-semibold text-[var(--text-primary)]">
                Too many raw surface classes
              </div>
              <p className="text-sm app-text-muted">
                Do not create dozens of low-level CSS surfaces for lesson, test, and
                premium states. Those should become semantic components instead.
              </p>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Surface hierarchy on dark emphasis"
        description="This helps verify that cards and badges still feel layered correctly when placed on stronger dark backgrounds."
      >
        <div className="space-y-4 rounded-[1.75rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,#0b1a30_0%,#142742_100%)] p-5 shadow-[0_16px_34px_rgba(16,32,51,0.24)]">
          <div className="text-sm font-semibold text-white">
            Dark-surface hierarchy check
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Card>
              <CardBody className="space-y-3">
                <Badge tone="info">Summary</Badge>
                <div className="font-semibold text-[var(--text-primary)]">
                  Default card
                </div>
                <p className="text-sm app-text-muted">
                  Should remain readable and quieter than branded surfaces.
                </p>
              </CardBody>
            </Card>

            <div className="app-surface-muted p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="font-semibold text-[var(--text-primary)]">
                  Muted support
                </div>
                <Badge tone="muted">Support</Badge>
              </div>
              <p className="text-sm app-text-muted">
                Use this when a section should recede slightly behind more important
                content.
              </p>
            </div>

            <div className="app-surface-brand p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="font-semibold text-[var(--text-primary)]">
                  Brand emphasis
                </div>
                <Badge tone="default">Highlight</Badge>
              </div>
              <p className="text-sm app-text-muted">
                Branded surfaces should feel elevated, but still readable in dark mode.
              </p>
            </div>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Spacing rhythm"
        description="Spacing consistency matters as much as colours or typography. Use these examples to compare density."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <SpacingBlock title="Compact padding" className="p-4" />
          <SpacingBlock
            title="Standard section padding"
            className="app-section-padding"
          />
          <SpacingBlock
            title="Large hero-style padding"
            className="app-section-padding-lg"
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Nested surfaces"
        description="Pages often need a top-level wrapper with quieter internal grouping. This section checks that nested layers still feel intentional."
      >
        <SectionCard
          title="Settings section"
          description="This simulates a realistic admin settings area with nested cards and grouped support content."
        >
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardBody className="space-y-3">
                  <div className="font-semibold text-[var(--text-primary)]">
                    Primary content block
                  </div>
                  <p className="text-sm app-text-muted">
                    Use a normal card when the content is part of the main section flow.
                  </p>
                  <Button variant="secondary" icon="edit">
                    Edit details
                  </Button>
                </CardBody>
              </Card>

              <div className="app-surface-muted p-5">
                <div className="mb-3 font-semibold text-[var(--text-primary)]">
                  Supporting grouped content
                </div>
                <p className="text-sm app-text-muted">
                  Muted surfaces help related support information stay grouped without
                  competing with the main content.
                </p>
              </div>
            </div>

            <div className="app-surface p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge tone="info" icon="preview">
                  Variant visible
                </Badge>
                <Badge tone="muted" icon="file">
                  3 linked modules
                </Badge>
              </div>
              <p className="text-sm app-text-muted">
                Elevated wrappers are useful when a section needs one additional layer of
                emphasis, but should still feel cleaner than a branded surface.
              </p>
            </div>
          </div>
        </SectionCard>
      </UiLabSection>

      <UiLabSection
        title="Stacked page composition"
        description="A real page usually combines a hero-like section, summary cards, and supporting blocks. This shows how those layers work together."
      >
        <div className="space-y-4">
          <div className="app-surface-brand app-section-padding-lg">
            <div className="max-w-2xl">
              <div className="mb-2 flex items-center gap-2">
                <AppIcon icon="surfaces" size={18} className="app-brand-text" />
                <div className="font-semibold text-[var(--text-primary)]">
                  Branded top section
                </div>
              </div>

              <p className="text-sm app-text-muted">
                Use a branded surface for page intros, premium highlights, or key landing
                sections — not for every admin container.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardBody>
                <div className="font-semibold text-[var(--text-primary)]">
                  Summary card
                </div>
                <p className="mt-2 text-sm app-text-muted">
                  Repeated cards should stay visually lighter than hero or brand sections.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="font-semibold text-[var(--text-primary)]">
                  Summary card
                </div>
                <p className="mt-2 text-sm app-text-muted">
                  This helps the eye understand hierarchy quickly.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="font-semibold text-[var(--text-primary)]">
                  Summary card
                </div>
                <p className="mt-2 text-sm app-text-muted">
                  Keep these compact and easy to scan.
                </p>
              </CardBody>
            </Card>
          </div>

          <SectionCard
            title="Supporting content block"
            description="Large supporting sections should usually sit below summary cards and use neutral surfaces unless there is a strong reason to elevate or brand them."
          >
            <p className="text-sm app-text-muted">
              Section-level wrappers should feel stable, structured, and calmer than
              hero-style areas above them.
            </p>
          </SectionCard>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Usage rules"
        description="These are the rules that will keep future pages visually consistent."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardBody>
              <div className="mb-2 flex items-center gap-2">
                <AppIcon icon="component" size={16} className="app-brand-text" />
                <div className="font-semibold text-[var(--text-primary)]">
                  Use app-card by default
                </div>
              </div>
              <p className="text-sm app-text-muted">
                Most repeated blocks should start with app-card unless they clearly need a
                different level of emphasis.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="mb-2 flex items-center gap-2">
                <AppIcon icon="warning" size={16} className="app-brand-text" />
                <div className="font-semibold text-[var(--text-primary)]">
                  Use branded surfaces sparingly
                </div>
              </div>
              <p className="text-sm app-text-muted">
                Branded surfaces lose impact if they appear too often.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="mb-2 flex items-center gap-2">
                <AppIcon icon="forms" size={16} className="app-brand-text" />
                <div className="font-semibold text-[var(--text-primary)]">
                  Match surface to density
                </div>
              </div>
              <p className="text-sm app-text-muted">
                Dense form or inspector content often benefits from panel-like grouping
                rather than decorative styling.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="mb-2 flex items-center gap-2">
                <AppIcon icon="idea" size={16} className="app-brand-text" />
                <div className="font-semibold text-[var(--text-primary)]">
                  Prefer hierarchy over effects
                </div>
              </div>
              <p className="text-sm app-text-muted">
                Use spacing, heading structure, and surface choice before adding more
                visual flair.
              </p>
            </CardBody>
          </Card>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}
