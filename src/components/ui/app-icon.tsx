import type { LucideIcon } from "lucide-react";

type AppIconProps = {
  icon: LucideIcon;
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
  const mergedClassName = ["shrink-0", className].filter(Boolean).join(" ");

  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={mergedClassName}
      aria-hidden="true"
    />
  );
}
