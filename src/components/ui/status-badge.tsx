import Badge from "@/components/ui/badge";
import { appIcons } from "@/lib/icons";

type Status = "not_started" | "submitted" | "reviewed" | "returned";

function getStatusConfig(status: Status) {
  switch (status) {
    case "submitted":
      return {
        label: "Submitted",
        tone: "warning" as const,
        icon: appIcons.pending,
      };
    case "reviewed":
      return {
        label: "Reviewed",
        tone: "success" as const,
        icon: appIcons.completed,
      };
    case "returned":
      return {
        label: "Returned",
        tone: "info" as const,
        icon: appIcons.next,
      };
    default:
      return {
        label: "Not started",
        tone: "muted" as const,
        icon: appIcons.help,
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
