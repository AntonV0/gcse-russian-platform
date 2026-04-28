import {
  stackedSummaryCards,
  surfaceUsageRules,
} from "@/components/admin/ui-lab-surfaces-data";
import UiLabSection from "@/components/admin/ui-lab-section";
import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import SectionCard from "@/components/ui/section-card";
import Surface from "@/components/ui/surface";
import type { AppIconKey } from "@/lib/shared/icons";

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

function SummaryCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardBody>
        <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        <p className="mt-2 text-sm app-text-muted">{description}</p>
      </CardBody>
    </Card>
  );
}

function SurfaceUsageRuleCard({
  icon,
  title,
  description,
}: {
  icon: AppIconKey;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardBody>
        <div className="mb-2 flex items-center gap-2">
          <AppIcon icon={icon} size={16} className="app-brand-text" />
          <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        </div>
        <p className="text-sm app-text-muted">{description}</p>
      </CardBody>
    </Card>
  );
}

export function DarkSurfaceHierarchySection() {
  return (
    <UiLabSection
      id="dark-surfaces"
      title="Surface hierarchy on dark emphasis"
      description="This helps verify that cards and badges still feel layered correctly when placed on stronger dark backgrounds."
    >
      <div
        data-theme="dark"
        className="space-y-4 rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--dark-surface-elevated)_0%,var(--dark-surface-muted)_100%)] p-5 shadow-[0_16px_34px_rgba(16,32,51,0.24)]"
      >
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

          <Surface variant="muted" className="p-5">
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
          </Surface>

          <Surface variant="brand" className="p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="font-semibold text-[var(--text-primary)]">
                Brand emphasis
              </div>
              <Badge tone="default">Highlight</Badge>
            </div>
            <p className="text-sm app-text-muted">
              Branded surfaces should feel elevated, but still readable in dark mode.
            </p>
          </Surface>
        </div>
      </div>
    </UiLabSection>
  );
}

export function SpacingRhythmSection() {
  return (
    <UiLabSection
      title="Spacing rhythm"
      description="Spacing consistency matters as much as colours or typography. Use these examples to compare density."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <SpacingBlock title="Compact padding" className="p-4" />
        <SpacingBlock title="Standard section padding" className="app-section-padding" />
        <SpacingBlock title="Large hero-style padding" className="app-section-padding-lg" />
      </div>
    </UiLabSection>
  );
}

export function NestedSurfacesSection() {
  return (
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

            <Surface variant="muted" className="p-5">
              <div className="mb-3 font-semibold text-[var(--text-primary)]">
                Supporting grouped content
              </div>
              <p className="text-sm app-text-muted">
                Muted surfaces help related support information stay grouped without
                competing with the main content.
              </p>
            </Surface>
          </div>

          <Surface variant="default" className="p-5">
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
          </Surface>
        </div>
      </SectionCard>
    </UiLabSection>
  );
}

export function StackedPageCompositionSection() {
  return (
    <UiLabSection
      title="Stacked page composition"
      description="A real page usually combines a hero-like section, summary cards, and supporting blocks. This shows how those layers work together."
    >
      <div className="space-y-4">
        <Surface variant="brand" className="app-section-padding-lg">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon icon="surfaces" size={18} className="app-brand-text" />
              <div className="font-semibold text-[var(--text-primary)]">
                Branded top section
              </div>
            </div>

            <p className="text-sm app-text-muted">
              Use a branded surface for page intros, premium highlights, or key landing
              sections - not for every admin container.
            </p>
          </div>
        </Surface>

        <div className="grid gap-4 lg:grid-cols-3">
          {stackedSummaryCards.map((summary) => (
            <SummaryCard
              key={summary.id}
              title={summary.title}
              description={summary.description}
            />
          ))}
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
  );
}

export function SurfaceUsageRulesSection() {
  return (
    <UiLabSection
      title="Usage rules"
      description="These are the rules that will keep future pages visually consistent."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {surfaceUsageRules.map((rule) => (
          <SurfaceUsageRuleCard
            key={rule.title}
            icon={rule.icon}
            title={rule.title}
            description={rule.description}
          />
        ))}
      </div>
    </UiLabSection>
  );
}
