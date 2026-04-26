import AppIcon from "@/components/ui/app-icon";
import Card, { CardBody } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type { AppIconKey } from "@/lib/shared/icons";

type SummaryStatCardTone =
  | "default"
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "danger";
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
        card: "app-section-tone-brand",
        iconWrap: "bg-[var(--info-surface)] text-[var(--info-text)]",
        value: "text-[var(--accent-ink)]",
      };

    case "info":
      return {
        card: "border-[var(--info-border)] bg-[var(--info-surface)]",
        iconWrap: "bg-[var(--info-surface-strong)] text-[var(--info-text)]",
        value: "text-[var(--info-text)]",
      };

    case "success":
      return {
        card: "border-[var(--success-border)] bg-[var(--success-surface)]",
        iconWrap: "bg-[var(--success-surface-strong)] text-[var(--success-text)]",
        value: "text-[var(--success-text)]",
      };

    case "warning":
      return {
        card: "border-[var(--warning-border)] bg-[var(--warning-surface)]",
        iconWrap: "bg-[var(--warning-surface-strong)] text-[var(--warning-text)]",
        value: "text-[var(--warning-text)]",
      };

    case "danger":
      return {
        card: "border-[var(--danger-border)] bg-[var(--danger-surface)]",
        iconWrap: "bg-[var(--danger-surface-strong)] text-[var(--danger-text)]",
        value: "text-[var(--danger-text)]",
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
                    <div className="truncate app-heading-card">
                      {title}
                    </div>

                    <div
                      className={[
                        "shrink-0 font-semibold",
                        compact ? "text-[1.35rem]" : "text-[1.5rem]",
                        toneClasses.value,
                      ].join(" ")}
                    >
                      {value}
                    </div>

                    {description ? (
                      <p className="hidden min-w-0 truncate app-text-caption lg:block">
                        {description}
                      </p>
                    ) : null}
                  </div>

                  {description ? (
                    <p className="mt-1 app-text-caption lg:hidden">{description}</p>
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
              <div className="app-text-caption">
                {title}
              </div>

              <div
                className={[
                  "mt-2 font-semibold",
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
                <p className="min-w-0 flex-1 app-text-body-muted">
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
