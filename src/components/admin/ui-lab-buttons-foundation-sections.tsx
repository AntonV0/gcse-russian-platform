import ButtonExampleCard from "@/components/admin/ui-lab-button-example-card";
import { buttonVariantMatrix } from "@/components/admin/ui-lab-buttons-data";
import UiLabSection from "@/components/admin/ui-lab-section";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";

export default function UiLabButtonsFoundationSections() {
  return (
    <>
      <UiLabSection
        id="dev-markers"
        title="Dev marker behaviour"
        description="In development, shared buttons now show a subtle corner marker. Click it to inspect the reusable component name and source path without covering the button itself."
      >
        <div className="app-card app-section-padding flex flex-col gap-4 border border-dashed border-[var(--border-strong)] bg-[var(--background-muted)]">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Shared component inspection
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              This page is the first safe reference area for validating the new marker
              system on compact controls before expanding it across the shared UI layer.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Inspect primary button</Button>
            <Button variant="secondary" icon="settings">
              Inspect secondary button
            </Button>
            <Button
              variant="quiet"
              icon="search"
              iconOnly
              ariaLabel="Inspect icon button"
            />
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        id="core-hierarchy"
        title="Core hierarchy"
        description="These are the main reusable button hierarchies for admin pages, forms, and platform navigation."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="inverse">Inverse</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="exit" icon="userX">
            Exit
          </Button>
        </div>
      </UiLabSection>

      <UiLabSection
        id="variant-matrix"
        title="Variant matrix"
        description="Every shared variant should show a clear role, readable default state, strong focus state, and predictable disabled state in both light and dark mode."
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {buttonVariantMatrix.map((item) => (
            <Card key={item.variant}>
              <CardBody className="space-y-4 p-4">
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {item.label}
                  </div>
                  <p className="mt-1 text-sm app-text-muted">{item.role}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant={item.variant} icon={item.icon}>
                    {item.label}
                  </Button>
                  <Button
                    variant={item.variant}
                    size="sm"
                    icon={item.icon}
                    iconOnly
                    ariaLabel={`${item.label} icon action`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant={item.variant} disabled icon="pending">
                    Disabled
                  </Button>
                  <Button
                    variant={item.variant}
                    size="sm"
                    disabled
                    icon={item.icon}
                    iconOnly
                    ariaLabel={`${item.label} disabled icon action`}
                  />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </UiLabSection>

      <UiLabSection
        title="Dark mode variant matrix"
        description="This forced dark surface checks that gradients, muted controls, destructive actions, and icon-only states keep their hierarchy on darker UI."
      >
        <div
          data-theme="dark"
          className="rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(135deg,var(--dark-surface-elevated)_0%,var(--dark-surface-muted)_58%,var(--dark-surface-strong)_100%)] p-5 shadow-[0_16px_34px_rgba(0,0,0,0.28)]"
        >
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {buttonVariantMatrix.map((item) => (
              <div
                key={item.variant}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4"
              >
                <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                  {item.label}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant={item.variant} size="sm" icon={item.icon}>
                    {item.label}
                  </Button>
                  <Button
                    variant={item.variant}
                    size="sm"
                    icon={item.icon}
                    iconOnly
                    ariaLabel={`${item.label} dark icon action`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Hover emphasis comparison"
        description="Use this area to compare how clearly each variant responds on hover. The interaction should feel deliberate, not just slightly lifted."
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <ButtonExampleCard title="Main actions">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon="completed">
                Save progress
              </Button>
              <Button variant="accent" icon="create">
                Start challenge
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Supporting actions">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" icon="preview">
                Preview
              </Button>
              <Button variant="soft" icon="next" iconPosition="right">
                Continue revision
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Low-emphasis actions">
            <div className="flex flex-wrap gap-3">
              <Button variant="quiet" icon="edit">
                Save draft
              </Button>
              <Button variant="quiet" icon="file">
                View notes
              </Button>
            </div>
          </ButtonExampleCard>
        </div>
      </UiLabSection>

      <UiLabSection
        title="Gradient restraint checks"
        description="These examples compare premium gradient buttons against calmer variants. The stronger buttons should lead without making the secondary actions feel unfinished."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <ButtonExampleCard title="Primary progression">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon="next" iconPosition="right">
                Keep going
              </Button>
              <Button variant="secondary" icon="preview">
                Preview path
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Accent promotion">
            <div className="flex flex-wrap gap-3">
              <Button variant="accent" icon="create">
                Launch sprint
              </Button>
              <Button variant="quiet" icon="file">
                View details
              </Button>
            </div>
          </ButtonExampleCard>

          <ButtonExampleCard title="Soft continuation">
            <div className="flex flex-wrap gap-3">
              <Button variant="soft" icon="preview">
                Reveal next task
              </Button>
              <Button variant="secondary" icon="back">
                Back
              </Button>
            </div>
          </ButtonExampleCard>
        </div>
      </UiLabSection>
    </>
  );
}
