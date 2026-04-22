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
      return [
        "app-badge-default",
        "border border-[rgba(37,99,235,0.14)]",
        "bg-[linear-gradient(135deg,var(--brand-blue-soft)_0%,var(--background-elevated)_100%)]",
        "text-[var(--brand-blue)]",
        "shadow-[0_1px_2px_rgba(37,99,235,0.05),0_8px_18px_rgba(37,99,235,0.08)]",
      ].join(" ");

    case "info":
      return [
        "app-badge-info",
        "border border-[rgba(37,99,235,0.16)]",
        "bg-[linear-gradient(135deg,var(--info-soft)_0%,var(--background-elevated)_100%)]",
        "text-[var(--info)]",
        "shadow-[0_1px_2px_rgba(37,99,235,0.04),0_6px_14px_rgba(37,99,235,0.08)]",
      ].join(" ");

    case "success":
      return [
        "app-badge-success",
        "border border-[rgba(31,138,76,0.16)]",
        "bg-[linear-gradient(135deg,var(--success-soft)_0%,var(--background-elevated)_100%)]",
        "text-[var(--success)]",
        "shadow-[0_1px_2px_rgba(31,138,76,0.04),0_6px_14px_rgba(31,138,76,0.08)]",
      ].join(" ");

    case "warning":
      return [
        "app-badge-warning",
        "border border-[rgba(183,121,31,0.18)]",
        "bg-[linear-gradient(135deg,var(--warning-soft)_0%,var(--background-elevated)_100%)]",
        "text-[var(--warning)]",
        "shadow-[0_1px_2px_rgba(183,121,31,0.04),0_6px_14px_rgba(183,121,31,0.08)]",
      ].join(" ");

    case "danger":
      return [
        "app-badge-danger",
        "border border-[rgba(194,59,59,0.16)]",
        "bg-[linear-gradient(135deg,var(--danger-soft)_0%,var(--background-elevated)_100%)]",
        "text-[var(--danger)]",
        "shadow-[0_1px_2px_rgba(194,59,59,0.04),0_6px_14px_rgba(194,59,59,0.08)]",
      ].join(" ");

    case "muted":
    default:
      return [
        "app-badge-muted",
        "border border-[var(--border)]",
        "bg-[var(--background-muted)]",
        "text-[var(--text-secondary)]",
        "shadow-[0_1px_2px_rgba(16,32,51,0.04)]",
      ].join(" ");
  }
}

export default function Badge({ children, tone = "muted", icon, className }: BadgeProps) {
  return (
    <span
      className={[
        "dev-marker-host",
        "inline-flex max-w-full items-center rounded-full px-3 py-1.5",
        "text-[0.76rem] font-semibold tracking-[-0.01em]",
        getToneClass(tone),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="Badge"
          filePath="src/components/ui/badge.tsx"
          tier="primitive"
          componentRole="Shared status and metadata label"
          bestFor="Short statuses, counts, category labels, and lightweight contextual markers."
          usageExamples={[
            "Published / Draft status",
            "Tier or access labels",
            "Compact metadata pills",
            "Small status counters",
          ]}
          notes="Use for short labels only. Avoid turning badges into full content containers or overusing many on the same surface."
        />
      ) : null}

      <span className="flex min-w-0 items-center gap-1.5 leading-[1.25]">
        {icon ? <AppIcon icon={icon} size={13} /> : null}
        <span className="truncate leading-[1.25]">{children}</span>
      </span>
    </span>
  );
}
