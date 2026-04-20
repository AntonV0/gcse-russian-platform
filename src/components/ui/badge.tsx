"use client";

import AppIcon from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type { AppIconKey } from "@/lib/shared/icons";

type BadgeTone = "default" | "muted" | "info" | "success" | "warning" | "danger";

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
  icon?: AppIconKey;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

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
        "dev-marker-host",
        getToneClass(tone),
        "inline-flex items-center gap-1.5 whitespace-nowrap",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="Badge"
          filePath="src/components/ui/badge.tsx"
        />
      ) : null}

      {icon ? <AppIcon icon={icon} size={14} /> : null}
      <span>{children}</span>
    </span>
  );
}
