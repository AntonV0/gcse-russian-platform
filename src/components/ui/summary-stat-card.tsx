"use client";

import AppIcon from "@/components/ui/app-icon";
import Card, { CardBody } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type { AppIconKey } from "@/lib/shared/icons";

type SummaryStatCardTone = "default" | "brand" | "success" | "warning" | "danger";

type SummaryStatCardProps = {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon?: AppIconKey;
  badge?: React.ReactNode;
  tone?: SummaryStatCardTone;
  compact?: boolean;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getToneClasses(tone: SummaryStatCardTone) {
  switch (tone) {
    case "brand":
      return {
        card: "border-[rgba(37,99,235,0.16)] bg-[linear-gradient(135deg,rgba(37,99,235,0.08)_0%,rgba(255,255,255,0.98)_55%,rgba(217,75,82,0.04)_100%)]",
        iconWrap: "bg-[rgba(37,99,235,0.10)] text-[var(--brand-blue)]",
        value: "text-[var(--brand-blue)]",
      };

    case "success":
      return {
        card: "border-[rgba(31,138,76,0.16)] bg-[linear-gradient(135deg,rgba(31,138,76,0.08)_0%,rgba(255,255,255,0.98)_100%)]",
        iconWrap: "bg-[rgba(31,138,76,0.10)] text-[var(--success)]",
        value: "text-[var(--success)]",
      };

    case "warning":
      return {
        card: "border-[rgba(183,121,31,0.16)] bg-[linear-gradient(135deg,rgba(183,121,31,0.08)_0%,rgba(255,255,255,0.98)_100%)]",
        iconWrap: "bg-[rgba(183,121,31,0.10)] text-[var(--warning)]",
        value: "text-[var(--warning)]",
      };

    case "danger":
      return {
        card: "border-[rgba(194,59,59,0.16)] bg-[linear-gradient(135deg,rgba(194,59,59,0.08)_0%,rgba(255,255,255,0.98)_100%)]",
        iconWrap: "bg-[rgba(194,59,59,0.10)] text-[var(--danger)]",
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

export default function SummaryStatCard({
  title,
  value,
  description,
  icon,
  badge,
  tone = "default",
  compact = false,
  className,
}: SummaryStatCardProps) {
  const toneClasses = getToneClasses(tone);

  return (
    <Card
      className={["dev-marker-host", toneClasses.card, className]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="SummaryStatCard"
          filePath="src/components/ui/summary-stat-card.tsx"
          tier="container"
          componentRole="Premium metric and summary card"
          bestFor="Dashboards, admin overview stats, teacher review queues, student progress summaries, and compact KPI rows."
          usageExamples={[
            "Dashboard metrics",
            "Assignments to review",
            "Completed lessons count",
            "Locked content summary",
          ]}
          notes="Prefer this over flatter dashboard metric cards when the page needs a strong premium stat pattern."
        />
      ) : null}

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
  );
}
