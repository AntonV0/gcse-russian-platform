import Badge from "@/components/ui/badge";
import AppIcon from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type { AppIconKey } from "@/lib/shared/icons";

type CourseFocusItem = {
  icon: AppIconKey;
  title: string;
  description: string;
};

type PlanCardProps = {
  id?: string;
  title: string;
  subtitle: string;
  bestFor: string;
  gradeBadge: string;
  priceLabel: string;
  recommendedPriceLabel?: string;
  courseFocus: CourseFocusItem[];
  actionTitle: string;
  tone?: "default" | "highlight";
  optionNote?: string;
  children: React.ReactNode;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function PlanCard({
  id,
  title,
  subtitle,
  bestFor,
  gradeBadge,
  priceLabel,
  recommendedPriceLabel,
  courseFocus,
  actionTitle,
  tone = "default",
  optionNote,
  children,
}: PlanCardProps) {
  const isHighlight = tone === "highlight";

  return (
    <section
      id={id}
      className={[
        "dev-marker-host relative app-card flex h-full flex-col overflow-hidden",
        isHighlight
          ? "border-[var(--accent-selected-border)] [background:var(--accent-gradient-selected)] shadow-[0_1px_2px_color-mix(in_srgb,var(--text-primary)_10%,transparent),0_18px_42px_color-mix(in_srgb,var(--accent)_14%,transparent)] before:absolute before:inset-x-0 before:top-0 before:h-1 before:[background:var(--accent-progress-gradient)]"
          : "",
      ].join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PlanCard"
          filePath="src/components/billing/pricing/plan-card.tsx"
          tier="container"
          componentRole="Pricing plan container with title, price, course focus, and purchasable options"
          bestFor="Billing and pricing pages where a GCSE Russian access tier needs comparable pricing and action content."
          usageExamples={[
            "Foundation pricing panel",
            "Higher pricing panel",
            "Billing/pricing/access UI",
            "Upgrade offer comparison",
          ]}
          notes="Use for purchasable plan cards only. Do not use it for dashboard summaries, account facts, or generic feature lists."
        />
      ) : null}

      <div className="border-b border-[var(--border-subtle)] px-5 py-5 md:px-6 lg:min-h-[11rem]">
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                {title}
              </h2>
              <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                {subtitle}
              </p>
              <p className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--background-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                {bestFor}
              </p>
            </div>

            <span className="shrink-0">
              <Badge tone={isHighlight ? "info" : "muted"} icon="exam">
                {gradeBadge}
              </Badge>
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Best value
            </p>
            <p className="text-xl font-bold tracking-tight text-[var(--text-primary)] md:text-2xl">
              {recommendedPriceLabel ?? priceLabel}
            </p>
            {recommendedPriceLabel ? (
              <p className="text-sm font-semibold text-[var(--text-secondary)]">
                or {priceLabel.toLowerCase()}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--border-subtle)] px-5 py-4 md:px-6 lg:min-h-[12.5rem]">
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Course focus
          </p>

          <div className="grid gap-3">
            {courseFocus.map((item) => (
              <div key={item.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--background-muted)] text-[var(--accent-ink)]">
                  <AppIcon icon={item.icon} size={15} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-[var(--text-secondary)]">
                    {item.description}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-4 md:px-6">
        <div className="space-y-3.5">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {actionTitle}
          </p>
          {children}
          {optionNote ? (
            <p className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] px-3 py-2 text-xs leading-5 text-[var(--text-secondary)]">
              {optionNote}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
