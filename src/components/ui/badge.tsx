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
        "border border-[color-mix(in_srgb,var(--brand-blue)_14%,transparent)]",
        "bg-[linear-gradient(135deg,var(--brand-blue-soft)_0%,var(--background-elevated)_100%)]",
        "text-[var(--accent-on-soft)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--brand-blue)_5%,transparent),0_8px_18px_color-mix(in_srgb,var(--brand-blue)_8%,transparent)]",
      ].join(" ");

    case "info":
      return [
        "app-badge-info",
        "border border-[color-mix(in_srgb,var(--brand-blue)_16%,transparent)]",
        "bg-[linear-gradient(135deg,var(--info-soft)_0%,var(--background-elevated)_100%)]",
        "text-[var(--info)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--brand-blue)_4%,transparent),0_6px_14px_color-mix(in_srgb,var(--brand-blue)_8%,transparent)]",
      ].join(" ");

    case "success":
      return [
        "app-badge-success",
        "border border-[color-mix(in_srgb,var(--success)_16%,transparent)]",
        "bg-[linear-gradient(135deg,var(--success-soft)_0%,var(--background-elevated)_100%)]",
        "text-[var(--success)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--success)_4%,transparent),0_6px_14px_color-mix(in_srgb,var(--success)_8%,transparent)]",
      ].join(" ");

    case "warning":
      return [
        "app-badge-warning",
        "border border-[color-mix(in_srgb,var(--warning)_18%,transparent)]",
        "bg-[linear-gradient(135deg,var(--warning-soft)_0%,var(--background-elevated)_100%)]",
        "text-[var(--warning)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--warning)_4%,transparent),0_6px_14px_color-mix(in_srgb,var(--warning)_8%,transparent)]",
      ].join(" ");

    case "danger":
      return [
        "app-badge-danger",
        "border border-[color-mix(in_srgb,var(--danger)_16%,transparent)]",
        "bg-[linear-gradient(135deg,var(--danger-soft)_0%,var(--background-elevated)_100%)]",
        "text-[var(--danger)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--danger)_4%,transparent),0_6px_14px_color-mix(in_srgb,var(--danger)_8%,transparent)]",
      ].join(" ");

    case "muted":
    default:
      return [
        "app-badge-muted",
        "border border-[var(--border)]",
        "bg-[var(--background-muted)]",
        "text-[var(--text-secondary)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--text-primary)_4%,transparent)]",
      ].join(" ");
  }
}

export default function Badge({ children, tone = "muted", icon, className }: BadgeProps) {
  return (
    <span
      className={[
        "dev-marker-host relative inline-flex max-w-full items-center rounded-full px-3 py-1.5",
        "min-h-[1.9rem] align-middle",
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
          componentRole="Compact status, category, or metadata label"
          bestFor="Short labels that explain state, type, access, progress, or category without becoming full content."
          usageExamples={[
            "Published / Draft labels",
            "Foundation / Higher access labels",
            "Pricing or discount pills",
            "Small workflow status labels",
          ]}
          notes="Keep badge text short. Do not use Badge for long explanations, buttons, or large callouts."
        />
      ) : null}

      <span className="flex min-w-0 items-center gap-1.5 leading-[1.25]">
        {icon ? (
          <span className="shrink-0">
            <AppIcon icon={icon} size={13} />
          </span>
        ) : null}

        <span className="truncate leading-[1.25]">{children}</span>
      </span>
    </span>
  );
}
