import Badge from "@/components/ui/badge";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type AttemptStatus = "draft" | "submitted" | "marked" | "abandoned";

type AttemptStatusBadgeProps = {
  status?: string | null;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getAttemptStatusConfig(status: AttemptStatus) {
  switch (status) {
    case "marked":
      return {
        label: "Marked",
        tone: "success" as const,
        icon: "marked" as const,
      };

    case "submitted":
      return {
        label: "Submitted",
        tone: "info" as const,
        icon: "submitted" as const,
      };

    case "abandoned":
      return {
        label: "Abandoned",
        tone: "danger" as const,
        icon: "warning" as const,
      };

    case "draft":
    default:
      return {
        label: "Draft",
        tone: "warning" as const,
        icon: "draft" as const,
      };
  }
}

export default function AttemptStatusBadge({
  status,
  className,
}: AttemptStatusBadgeProps) {
  const normalized: AttemptStatus =
    status === "submitted" || status === "marked" || status === "abandoned"
      ? status
      : "draft";
  const { label, tone, icon } = getAttemptStatusConfig(normalized);

  return (
    <span
      className={["dev-marker-host relative inline-flex", className]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="AttemptStatusBadge"
          filePath="src/components/ui/attempt-status-badge.tsx"
          tier="semantic"
          componentRole="Semantic mock exam attempt workflow status badge"
          bestFor="Mock exam attempt review queues, attempt detail pages, and student attempt summaries."
          usageExamples={[
            "Draft attempt",
            "Submitted attempt",
            "Marked attempt",
            "Admin review queue status",
          ]}
          notes="Use for mock exam attempt workflow states. Use StatusBadge for assignment submission states."
        />
      ) : null}

      <Badge tone={tone} icon={icon}>
        {label}
      </Badge>
    </span>
  );
}
