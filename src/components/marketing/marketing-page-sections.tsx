import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardBody } from "@/components/ui/card";
import SectionCard from "@/components/ui/section-card";
import Surface from "@/components/ui/surface";
import type { AppIconKey } from "@/lib/shared/icons";

type FeatureItem = {
  title: string;
  description: string;
};

type LinkItem = {
  title: string;
  description: string;
  href: string;
  icon?: AppIconKey;
};

export function MarketingFeatureGrid({
  items,
  tone = "student",
}: {
  items: FeatureItem[];
  tone?: "student" | "brand" | "muted";
}) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <SectionCard
          key={item.title}
          title={item.title}
          description={item.description}
          tone={tone}
          density="compact"
        />
      ))}
    </section>
  );
}

export function MarketingStepList({
  title,
  description,
  steps,
}: {
  title: string;
  description: string;
  steps: FeatureItem[];
}) {
  return (
    <SectionCard title={title} description={description} tone="student">
      <div className="grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step.title}>
            <CardBody className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full [background:var(--accent-gradient-selected)] text-sm font-semibold text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
                {index + 1}
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {step.title}
                </h3>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  {step.description}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

export function MarketingRelatedLinks({
  title = "Related GCSE Russian pages",
  description = "Continue with the pages that match your next question.",
  links,
}: {
  title?: string;
  description?: string;
  links: LinkItem[];
}) {
  return (
    <SectionCard title={title} description={description} tone="muted">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => (
          <Card key={link.href} interactive>
            <CardBody className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {link.icon ? (
                  <Badge tone="info" icon={link.icon}>
                    Guide
                  </Badge>
                ) : null}
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {link.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                  {link.description}
                </p>
              </div>
              <Button href={link.href} variant="quiet" size="sm" icon="next">
                Open page
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </SectionCard>
  );
}

export function MarketingCtaBand({
  title,
  description,
  primaryHref = "/signup",
  primaryLabel = "Start trial",
  secondaryHref = "/pricing",
  secondaryLabel = "View pricing",
}: {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <Surface variant="muted" padding="lg">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-center">
        <div className="space-y-2">
          <h2 className="app-section-title text-xl">{title}</h2>
          <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Button href={primaryHref} variant="primary" icon="create">
            {primaryLabel}
          </Button>
          <Button href={secondaryHref} variant="secondary" icon="pricing">
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </Surface>
  );
}
