import AppIcon from "@/components/ui/app-icon";
import type { LucideIcon } from "lucide-react";

type BadgeTone = "default" | "muted" | "success" | "warning" | "danger" | "info";

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  icon?: LucideIcon;
  className?: string;
};

function getToneClass(tone: BadgeTone) {
  switch (tone) {
    case "success":
      return "border-green-200 bg-green-50 text-green-700";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "danger":
      return "border-red-200 bg-red-50 text-red-700";
    case "info":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "muted":
      return "border-gray-200 bg-gray-50 text-gray-600";
    case "default":
    default:
      return "border-gray-200 bg-white text-gray-700";
  }
}

export default function Badge({
  children,
  tone = "default",
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs",
        getToneClass(tone),
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
