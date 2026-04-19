import type { LucideIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { appIcons } from "@/lib/shared/icons";

export type AppIconKey = keyof typeof appIcons;
export type AppIconValue = AppIconKey | LucideIcon;

type AppIconProps = {
  icon?: AppIconValue;
  className?: string;
  size?: number;
  strokeWidth?: number;
};

function isIconKey(value: AppIconValue | undefined): value is AppIconKey {
  return typeof value === "string";
}

export default function AppIcon({
  icon,
  className,
  size = 20,
  strokeWidth = 1.75,
}: AppIconProps) {
  const SafeIcon = isIconKey(icon) ? appIcons[icon] : (icon ?? AlertCircle);

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
