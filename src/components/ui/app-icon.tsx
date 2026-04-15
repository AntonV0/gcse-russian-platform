import type { LucideIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";

type AppIconProps = {
  icon?: LucideIcon;
  className?: string;
  size?: number;
  strokeWidth?: number;
};

export default function AppIcon({
  icon: Icon,
  className,
  size = 20,
  strokeWidth = 1.75,
}: AppIconProps) {
  const SafeIcon = Icon ?? AlertCircle;
  const mergedClassName = ["shrink-0", className].filter(Boolean).join(" ");

  return (
    <SafeIcon
      size={size}
      strokeWidth={strokeWidth}
      className={mergedClassName}
      aria-hidden="true"
    />
  );
}
