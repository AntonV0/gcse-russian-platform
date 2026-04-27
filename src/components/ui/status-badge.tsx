import Badge from "@/components/ui/badge";
import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";

type Status = "not_started" | "submitted" | "reviewed" | "returned";

type StatusBadgeProps = {
  status?: string | null;
  className?: string;
};

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
        icon: "back" as const,
      };

    case "not_started":
    default:
      return {
        label: "Not started",
        tone: "muted" as const,
        icon: "help" as const,
      };
  }
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized: Status =
    status === "submitted" || status === "reviewed" || status === "returned"
      ? status
      : "not_started";

  const { label, tone, icon } = getStatusConfig(normalized);

  return (
    <span
      className={["dev-marker-host relative inline-flex", className]
        .filter(Boolean)
        .join(" ")}
    >
      <DevOnlyComponentMarker
        componentName="StatusBadge"
        filePath="src/components/ui/status-badge.tsx"
        tier="semantic"
        componentRole="Semantic wrapper for standardized workflow status labels"
        bestFor="Repeated product states where the same status should always map to the same label, tone, and icon."
        usageExamples={[
          "Assignment submission state",
          "Teacher review state",
          "Student workflow progress",
          "Returned work status",
        ]}
        notes="Use StatusBadge instead of hand-building Badge when the status is a known product/workflow state. Do not use it for one-off marketing labels."
      />

      <Badge tone={tone} icon={icon}>
        {label}
      </Badge>
    </span>
  );
}
