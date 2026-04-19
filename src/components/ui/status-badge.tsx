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

export default function StatusBadge({ status }: { status?: string | null }) {
  const normalized: Status =
    status === "submitted" || status === "reviewed" || status === "returned"
      ? status
      : "not_started";

  const { label, tone, icon } = getStatusConfig(normalized);

  return (
    <Badge tone={tone} icon={icon}>
      {label}
    </Badge>
  );
}
