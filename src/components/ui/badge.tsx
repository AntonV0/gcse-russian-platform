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
        "border border-[var(--info-border)]",
        "bg-[var(--info-surface)]",
        "text-[var(--info-text)]",
        "shadow-[0_6px_14px_var(--info-shadow)]",
      ].join(" ");

    case "info":
      return [
        "app-badge-info",
        "border border-[var(--info-border)]",
        "bg-[var(--info-surface)]",
        "text-[var(--info-text)]",
        "shadow-[0_6px_14px_var(--info-shadow)]",
      ].join(" ");

    case "success":
      return [
        "app-badge-success",
        "border border-[var(--success-border)]",
        "bg-[var(--success-surface)]",
        "text-[var(--success-text)]",
        "shadow-[0_6px_14px_var(--success-shadow)]",
      ].join(" ");

    case "warning":
      return [
        "app-badge-warning",
        "border border-[var(--warning-border)]",
        "bg-[var(--warning-surface)]",
        "text-[var(--warning-text)]",
        "shadow-[0_6px_14px_var(--warning-shadow)]",
      ].join(" ");

    case "danger":
      return [
        "app-badge-danger",
        "border border-[var(--danger-border)]",
        "bg-[var(--danger-surface)]",
        "text-[var(--danger-text)]",
        "shadow-[0_6px_14px_var(--danger-shadow)]",
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
