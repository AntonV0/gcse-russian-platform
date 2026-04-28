import UiLabSection from "@/components/admin/ui-lab-section";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import Surface from "@/components/ui/surface";

function SurfaceExample({
  title,
  description,
  label,
  variant,
}: {
  title: string;
  description: string;
  label: string;
  variant: "default" | "muted" | "brand";
}) {
  return (
    <Surface variant={variant} className="p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="font-semibold text-[var(--text-primary)]">{title}</div>
        <Badge tone="muted">{label}</Badge>
      </div>

      <p className="text-sm app-text-muted">{description}</p>
    </Surface>
  );
}

export function SurfaceFoundationsSection() {
  return (
    <UiLabSection
      id="foundations"
      title="Foundational surface types"
      description="These are low-level visual surface weights. They answer how strong a container should feel before a semantic component is built on top of it."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <CardBody className="p-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="font-semibold text-[var(--text-primary)]">app-card</div>
              <Badge tone="muted">Card primitive</Badge>
            </div>

            <p className="text-sm app-text-muted">
              Best for modular cards, repeated overview items, dashboard summaries, and
              most reusable content blocks.
            </p>
          </CardBody>
        </Card>

        <SurfaceExample
          title="app-surface"
          label="Elevated"
          variant="default"
          description="Use for generic elevated wrappers when the content needs slightly more visual weight than a normal card."
        />

        <SurfaceExample
          title="app-surface-brand"
          label="Branded"
          variant="brand"
          description="Reserve for hero areas, special highlights, premium flows, or landing moments rather than normal admin content."
        />

        <SurfaceExample
          title="app-surface-muted"
          label="Muted"
          variant="muted"
          description="Good for supporting containers, internal grouping, and softer contrast areas that should stay visually quiet."
        />
      </div>
    </UiLabSection>
  );
}

export function SurfacePrimitivesSection() {
  return (
    <UiLabSection
      id="primitives"
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
  );
}

export function SurfaceCardAnatomySection() {
  return (
    <UiLabSection
      id="card-anatomy"
      title="Card anatomy"
      description="Use CardHeader, CardBody, and CardFooter when a card needs clear internal regions instead of one undifferentiated content block."
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  Lesson metadata
                </div>
                <p className="mt-1 text-sm app-text-muted">
                  A structured card with heading, body, and action footer.
                </p>
              </div>
              <Badge tone="warning" icon="pending">
                Draft
              </Badge>
            </div>
          </CardHeader>

          <CardBody className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              {["Variant:Higher", "Blocks:6", "Updated:Today"].map((item) => {
                const [label, value] = item.split(":");

                return (
                  <div key={label}>
                    <div className="text-xs font-semibold uppercase tracking-[0.08em] app-text-soft">
                      {label}
                    </div>
                    <div className="mt-1 text-sm text-[var(--text-primary)]">
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>

          <CardFooter>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon="completed">
                Save lesson
              </Button>
              <Button variant="secondary" icon="preview">
                Preview
              </Button>
            </div>
          </CardFooter>
        </Card>

        <PanelCard
          title="When to use anatomy"
          description="Card sections are best for repeated objects with a stable internal structure."
          tone="admin"
          density="compact"
        >
          <div className="space-y-3 text-sm app-text-muted">
            <p>
              Use a header when status, title, or context must remain visually tied to
              the card.
            </p>
            <p>
              Use a footer for actions that apply to the whole card, especially when the
              body contains scannable metadata.
            </p>
          </div>
        </PanelCard>
      </div>
    </UiLabSection>
  );
}

export function SurfaceToneDensitySection() {
  return (
    <UiLabSection
      id="tone-density"
      title="Tone and density matrix"
      description="PanelCard and SectionCard share tone and density options that should be tested explicitly."
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {(["default", "admin", "student", "brand", "muted"] as const).map((tone) => (
          <PanelCard
            key={tone}
            title={`${tone} panel`}
            description="Tone sample for reusable support panels."
            tone={tone}
            density={tone === "muted" ? "compact" : "default"}
          >
            <p className="text-sm app-text-muted">
              Use tone deliberately so admin, student, and brand contexts stay distinct.
            </p>
          </PanelCard>
        ))}
      </div>
    </UiLabSection>
  );
}
