import AppIcon from "@/components/ui/app-icon";
import type { LucideIcon } from "lucide-react";

type BadgeTone = "muted" | "info" | "success" | "warning" | "danger";

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  icon?: LucideIcon;
  className?: string;
};

function getToneClass(tone: BadgeTone) {
  switch (tone) {
    case "info":
      return "app-pill app-pill-info";
    case "success":
      return "app-pill app-pill-success";
    case "warning":
      return "app-pill app-pill-warning";
    case "danger":
      return "app-pill app-pill-danger";
    case "muted":
    default:
      return "app-pill app-pill-muted";
  }
}

export default function Badge({ children, tone = "muted", icon, className }: BadgeProps) {
  return (
    <span className={[getToneClass(tone), className].filter(Boolean).join(" ")}>
      {icon ? <AppIcon icon={icon} size={14} /> : null}
      <span>{children}</span>
    </span>
  );
}
