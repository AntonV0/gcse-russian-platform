"use client";

import DevComponentMarker from "@/components/ui/dev-component-marker";
import Badge from "@/components/ui/badge";

type Status = "not_started" | "submitted" | "reviewed" | "returned";

function getStatusConfig(status: Status) {
  switch (status) {
    case "submitted":
      return {
        label: "Submitted",
        tone: "warning" as const,
        icon: "pending" as const,
      };
    case "reviewed":
      return {
        label: "Reviewed",
        tone: "success" as const,
        icon: "completed" as const,
      };
    case "returned":
      return {
        label: "Returned",
        tone: "info" as const,
        icon: "next" as const,
      };
    default:
      return {
        label: "Not started",
        tone: "muted" as const,
        icon: "help" as const,
      };
  }
}

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function StatusBadge({ status }: { status?: string | null }) {
  const normalized: Status =
    status === "submitted" || status === "reviewed" || status === "returned"
      ? status
      : "not_started";

  const { label, tone, icon } = getStatusConfig(normalized);

  return (
    <span className="dev-marker-host inline-flex">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="StatusBadge"
          filePath="src/components/ui/status-badge.tsx"
        />
      ) : null}

      <Badge tone={tone} icon={icon}>
        {label}
      </Badge>
    </span>
  );
}
