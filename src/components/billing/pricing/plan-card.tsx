import Badge from "@/components/ui/badge";

type PlanCardProps = {
  title: string;
  subtitle: string;
  priceLabel: string;
  features: string[];
  tone?: "default" | "highlight";
  children: React.ReactNode;
};

export default function PlanCard({
  title,
  subtitle,
  priceLabel,
  features,
  tone = "default",
  children,
}: PlanCardProps) {
  const isHighlight = tone === "highlight";

  return (
    <div
      className={[
        "app-card flex h-full flex-col overflow-hidden",
        isHighlight ? "ring-2 ring-[color:var(--brand-blue)] shadow-lg" : "",
      ].join(" ")}
    >
      <div className="border-b border-[var(--border-subtle)] px-5 py-5 md:px-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                {title}
              </h2>
              <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                {subtitle}
              </p>
            </div>

            {isHighlight ? (
              <Badge tone="info" icon="star">
                Best for exam prep
              </Badge>
            ) : null}
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Pricing
            </p>
            <p className="text-2xl font-bold tracking-tight text-[var(--text-primary)] md:text-3xl">
              {priceLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--border-subtle)] px-5 py-4 md:px-6">
        <div className="space-y-2.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Included
          </p>

          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-[var(--brand-blue)]">✓</span>
                <span className="leading-6">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 px-5 py-4 md:px-6">
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Options
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
