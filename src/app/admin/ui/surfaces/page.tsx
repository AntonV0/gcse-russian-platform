import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { appIcons } from "@/lib/shared/icons";
import UiLabShell from "@/components/admin/ui-lab-shell";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";

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
    <div className={`app-card ${className}`}>
      <div className="font-semibold text-[var(--text-primary)]">{title}</div>
      <p className="mt-2 text-sm app-text-muted">
        Use this to compare how dense or spacious a layout feels.
      </p>
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
        title="Surface types"
        description="Use these examples to decide whether a section should feel neutral, elevated, branded, or inspector-like."
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
            description="Reserve for hero areas, special highlights, and premium branded moments rather than normal admin content."
          />

          <SurfaceExample
            title="app-surface-muted"
            label="Muted"
            className="app-surface-muted p-5"
            description="Good for supporting containers, internal grouping, and places where you want softer contrast without full elevation."
          />
        </div>
      </UiLabSection>

      <UiLabSection
        title="Panel vs section patterns"
        description="These patterns are the most reusable for admin pages, detail screens, and settings areas."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <PanelCard title="PanelCard example">
            <div className="space-y-3">
              <p className="text-sm app-text-muted">
                Good for structured detail or metadata areas with a clear title and a body
                section underneath.
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge tone="info" icon={appIcons.preview}>
                  Published
                </Badge>
                <Badge tone="muted" icon={appIcons.file}>
                  8 items
                </Badge>
              </div>

              <div className="pt-2">
                <Button variant="secondary" icon={appIcons.edit}>
                  Edit panel
                </Button>
              </div>
            </div>
          </PanelCard>

          <SectionCard
            title="SectionCard example"
            description="Best when a section needs a visible heading and description before its content."
          >
            <div className="space-y-3">
              <p className="text-sm app-text-muted">
                Good for grouped admin page sections, especially where several related
                fields or actions belong together.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon={appIcons.create}>
                  Primary action
                </Button>
                <Button variant="secondary" icon={appIcons.back}>
                  Secondary action
                </Button>
              </div>
            </div>
          </SectionCard>
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
        title="Stacked page composition"
        description="A real page usually combines a hero-like section, summary cards, and supporting blocks. This shows how those layers work together."
      >
        <div className="space-y-4">
          <div className="app-surface-brand app-section-padding-lg">
            <div className="max-w-2xl">
              <div className="mb-2 flex items-center gap-2">
                <AppIcon icon={appIcons.surfaces} size={18} className="app-brand-text" />
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
            <div className="app-card p-4">
              <div className="font-semibold">Summary card</div>
              <p className="mt-2 text-sm app-text-muted">
                Repeated cards should stay visually lighter than hero or brand sections.
              </p>
            </div>

            <div className="app-card p-4">
              <div className="font-semibold">Summary card</div>
              <p className="mt-2 text-sm app-text-muted">
                This helps the eye understand hierarchy quickly.
              </p>
            </div>

            <div className="app-card p-4">
              <div className="font-semibold">Summary card</div>
              <p className="mt-2 text-sm app-text-muted">
                Keep these compact and easy to scan.
              </p>
            </div>
          </div>

          <div className="app-card app-section-padding">
            <div className="mb-3 font-semibold">Supporting content block</div>
            <p className="text-sm app-text-muted">
              Large supporting sections should usually sit below summary cards and use
              neutral surfaces unless there is a strong reason to elevate or brand them.
            </p>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Usage rules"
        description="These are the rules that will keep future pages visually consistent."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.component} size={16} className="app-brand-text" />
              <div className="font-semibold">Use app-card by default</div>
            </div>
            <p className="text-sm app-text-muted">
              Most repeated blocks should start with app-card unless they clearly need a
              different level of emphasis.
            </p>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.warning} size={16} className="app-brand-text" />
              <div className="font-semibold">Use branded surfaces sparingly</div>
            </div>
            <p className="text-sm app-text-muted">
              Branded surfaces lose impact if they appear too often.
            </p>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.forms} size={16} className="app-brand-text" />
              <div className="font-semibold">Match surface to density</div>
            </div>
            <p className="text-sm app-text-muted">
              Dense form or inspector content often benefits from panel-like grouping
              rather than decorative styling.
            </p>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon={appIcons.idea} size={16} className="app-brand-text" />
              <div className="font-semibold">Prefer hierarchy over effects</div>
            </div>
            <p className="text-sm app-text-muted">
              Use spacing, heading structure, and surface choice before adding more visual
              flair.
            </p>
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Readiness"
        description="A quick summary of which surface patterns already feel stable and which still need refinement."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="success">Strong already</Badge>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Cards and summary blocks</p>
              <p>Hero / branded surface pattern</p>
              <p>Standard spacing rhythm</p>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="warning">Needs refinement</Badge>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Dense admin page layouts</p>
              <p>Inspector-style panels</p>
              <p>Surface choice in builder screens</p>
            </div>
          </div>

          <div className="app-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="muted">Future additions</Badge>
            </div>
            <div className="space-y-1 text-sm app-text-muted">
              <p>Modal/dialog surfaces</p>
              <p>Table container patterns</p>
              <p>Mobile-specific spacing comparisons</p>
            </div>
          </div>
        </div>
      </UiLabSection>
    </UiLabShell>
  );
}
