"use client";

import DevComponentMarker from "@/components/ui/dev-component-marker";
import Badge from "@/components/ui/badge";
import Card, { CardBody } from "@/components/ui/card";

type StatusSummaryCardProps = {
  title: string;
  description: string;
  badgeTone: "default" | "info" | "success" | "warning" | "danger" | "muted";
  badgeLabel: string;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function StatusSummaryCard({
  title,
  description,
  badgeTone,
  badgeLabel,
  className,
}: StatusSummaryCardProps) {
  return (
    <Card className={["dev-marker-host", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="StatusSummaryCard"
          filePath="src/components/ui/status-summary-card.tsx"
        />
      ) : null}

      <CardBody className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="font-semibold text-[var(--text-primary)]">{title}</div>
          <Badge tone={badgeTone}>{badgeLabel}</Badge>
        </div>

        <p className="text-sm app-text-muted">{description}</p>
      </CardBody>
    </Card>
  );
}
