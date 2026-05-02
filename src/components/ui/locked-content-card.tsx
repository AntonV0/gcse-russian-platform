import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type LockedContentCardProps = {
  title: string;
  description: string;
  accessLabel?: string;
  statusLabel?: string;
  primaryActionHref?: string;
  primaryActionLabel?: string;
  secondaryActionHref?: string;
  secondaryActionLabel?: string;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function LockedContentCard({
  title,
  description,
  accessLabel = "Full access",
  statusLabel = "Locked",
  primaryActionHref,
  primaryActionLabel = "Unlock full course",
  secondaryActionHref,
  secondaryActionLabel = "Compare access",
  className,
}: LockedContentCardProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="LockedContentCard"
          filePath="src/components/ui/locked-content-card.tsx"
          tier="semantic"
          componentRole="Locked access and upgrade prompt surface"
          bestFor="Locked course content, upgrade prompts, trial limitations, and student access conversion moments."
          usageExamples={[
            "Higher tier locked lesson",
            "Trial access limit prompt",
            "Full course upgrade card",
            "Locked mock exam card",
          ]}
          notes="Use for access/funnel moments only. Avoid using it for general warnings, empty states, or normal lesson cards."
        />
      ) : null}

      <Card
        className="app-section-tone-brand border-[var(--warning-border)] bg-[linear-gradient(135deg,var(--surface-elevated)_0%,var(--warning-surface)_100%)] shadow-[0_18px_42px_color-mix(in_srgb,var(--warning-text)_10%,transparent)]"
        interactive
      >
        <CardBody className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
          <div className="space-y-3">
            <div>
              <div className="mb-1 app-text-meta">Access / funnel</div>
              <h3 className="app-heading-card">{title}</h3>
            </div>

            <div className="flex max-w-full flex-wrap gap-2">
              <Badge tone="default" icon="info">
                {accessLabel}
              </Badge>
              <Badge tone="warning" icon="pending">
                {statusLabel}
              </Badge>
            </div>
          </div>

          <p className="app-text-body-muted">{description}</p>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {primaryActionHref ? (
              <Button
                href={primaryActionHref}
                variant="inverse"
                icon="next"
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                {primaryActionLabel}
              </Button>
            ) : (
              <Button
                variant="inverse"
                icon="next"
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                {primaryActionLabel}
              </Button>
            )}

            {secondaryActionHref ? (
              <Button
                href={secondaryActionHref}
                variant="secondary"
                icon="preview"
                className="w-full sm:w-auto"
              >
                {secondaryActionLabel}
              </Button>
            ) : (
              <Button variant="secondary" icon="preview" className="w-full sm:w-auto">
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
