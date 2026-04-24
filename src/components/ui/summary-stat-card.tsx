"use client";

import AppIcon from "@/components/ui/app-icon";
import Card, { CardBody } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type { AppIconKey } from "@/lib/shared/icons";

type SummaryStatCardTone = "default" | "brand" | "success" | "warning" | "danger";
type SummaryStatCardLayout = "default" | "inline";

type SummaryStatCardProps = {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon?: AppIconKey;
  badge?: React.ReactNode;
  tone?: SummaryStatCardTone;
  compact?: boolean;
  layout?: SummaryStatCardLayout;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getToneClasses(tone: SummaryStatCardTone) {
  switch (tone) {
    case "brand":
      return {
        card: "border-[color-mix(in_srgb,var(--brand-blue)_16%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-blue)_8%,transparent)_0%,color-mix(in_srgb,var(--background-elevated)_98%,transparent)_55%,color-mix(in_srgb,var(--brand-red)_4%,transparent)_100%)]",
        iconWrap: "bg-[color-mix(in_srgb,var(--brand-blue)_10%,transparent)] text-[var(--accent-on-soft)]",
        value: "text-[var(--accent-ink)]",
      };

    case "success":
      return {
        card: "border-[color-mix(in_srgb,var(--success)_16%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--success)_8%,transparent)_0%,color-mix(in_srgb,var(--background-elevated)_98%,transparent)_100%)]",
        iconWrap: "bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-[var(--success)]",
        value: "text-[var(--success)]",
      };

    case "warning":
      return {
        card: "border-[color-mix(in_srgb,var(--warning)_16%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--warning)_8%,transparent)_0%,color-mix(in_srgb,var(--background-elevated)_98%,transparent)_100%)]",
        iconWrap: "bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] text-[var(--warning)]",
        value: "text-[var(--warning)]",
      };

    case "danger":
      return {
        card: "border-[color-mix(in_srgb,var(--danger)_16%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--danger)_8%,transparent)_0%,color-mix(in_srgb,var(--background-elevated)_98%,transparent)_100%)]",
        iconWrap: "bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-[var(--danger)]",
        value: "text-[var(--danger)]",
      };

    case "default":
    default:
      return {
        card: "",
        iconWrap: "bg-[var(--background-muted)] text-[var(--text-secondary)]",
        value: "text-[var(--text-primary)]",
      };
  }
}

function SummaryStatMarker() {
  if (!SHOW_UI_DEBUG) return null;

  return (
    <DevComponentMarker
      componentName="SummaryStatCard"
      filePath="src/components/ui/summary-stat-card.tsx"
      tier="semantic"
      componentRole="Premium metric and summary card"
      bestFor="Dashboards, admin overview stats, teacher review queues, student progress summaries, and compact KPI rows."
      usageExamples={[
        "Dashboard metrics",
        "Assignments to review",
        "Completed lessons count",
        "Locked content summary",
      ]}
      notes="Use for meaningful numbers and snapshot metrics. Avoid using it for ordinary descriptive content where Card, PanelCard, or InfoRow would be clearer."
    />
  );
}

export default function SummaryStatCard({
  title,
  value,
  description,
  icon,
  badge,
  tone = "default",
  compact = false,
  layout = "default",
  className,
}: SummaryStatCardProps) {
  const toneClasses = getToneClasses(tone);

  if (layout === "inline") {
    return (
      <div className="dev-marker-host relative">
        <SummaryStatMarker />

        <Card className={[toneClasses.card, className].filter(Boolean).join(" ")}>
          <CardBody className={compact ? "px-4 py-3.5" : "p-4"}>
            <div className="flex items-center gap-3">
              {icon ? (
                <span
                  className={[
                    "flex shrink-0 items-center justify-center rounded-2xl",
                    compact ? "h-9 w-9" : "h-10 w-10",
                    toneClasses.iconWrap,
                  ].join(" ")}
                >
                  <AppIcon icon={icon} size={compact ? 16 : 18} />
                </span>
              ) : null}

              <div className="min-w-0 flex flex-1 items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="truncate text-sm font-medium text-[var(--text-primary)]">
                      {title}
                    </div>

                    <div
                      className={[
                        "shrink-0 font-semibold tracking-[-0.03em]",
                        compact ? "text-[1.35rem]" : "text-[1.5rem]",
                        toneClasses.value,
                      ].join(" ")}
                    >
                      {value}
                    </div>

                    {description ? (
                      <p className="hidden min-w-0 truncate text-sm app-text-muted lg:block">
                        {description}
                      </p>
                    ) : null}
                  </div>

                  {description ? (
                    <p className="mt-1 text-sm app-text-muted lg:hidden">{description}</p>
                  ) : null}
                </div>

                {badge ? <div className="shrink-0">{badge}</div> : null}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="dev-marker-host relative">
      <SummaryStatMarker />

      <Card className={[toneClasses.card, className].filter(Boolean).join(" ")}>
        <CardBody className={compact ? "p-4" : "p-5"}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-[var(--text-secondary)]">
                {title}
              </div>

              <div
                className={[
                  "mt-2 font-semibold tracking-[-0.03em]",
                  compact ? "text-[1.75rem]" : "text-[2rem]",
                  toneClasses.value,
                ].join(" ")}
              >
                {value}
              </div>
            </div>

            {icon ? (
              <span
                className={[
                  "flex shrink-0 items-center justify-center rounded-2xl",
                  compact ? "h-10 w-10" : "h-11 w-11",
                  toneClasses.iconWrap,
                ].join(" ")}
              >
                <AppIcon icon={icon} size={compact ? 18 : 20} />
              </span>
            ) : null}
          </div>

          {description || badge ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {description ? (
                <p className="min-w-0 flex-1 text-sm leading-6 app-text-muted">
                  {description}
                </p>
              ) : (
                <div />
              )}

              {badge ? <div className="shrink-0">{badge}</div> : null}
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
