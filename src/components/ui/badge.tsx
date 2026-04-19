import AppIcon, { type AppIconKey } from "@/components/ui/app-icon";

type BadgeTone = "default" | "muted" | "info" | "success" | "warning" | "danger";

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  icon?: AppIconKey;
  className?: string;
};

function getToneClass(tone: BadgeTone) {
  switch (tone) {
    case "default":
      return "app-pill border-[var(--brand-blue)]/15 bg-[var(--brand-blue-soft)] text-[var(--brand-blue)]";
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
    <span
      className={[
        getToneClass(tone),
        "inline-flex items-center gap-1.5 whitespace-nowrap",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon ? <AppIcon icon={icon} size={14} /> : null}
      <span>{children}</span>
    </span>
  );
}
