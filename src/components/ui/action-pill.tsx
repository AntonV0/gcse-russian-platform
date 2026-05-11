import AppIcon from "@/components/ui/app-icon";
import type { AppIconKey } from "@/lib/shared/icons";

type ActionPillProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  icon?: AppIconKey;
  iconPosition?: "left" | "right";
  tone?: "accent" | "muted" | "success" | "locked" | "danger";
};

export default function ActionPill({
  children,
  icon = "next",
  iconPosition = "right",
  tone = "accent",
  className,
  ...spanProps
}: ActionPillProps) {
  const toneClass = actionPillToneClasses[tone];

  return (
    <span
      {...spanProps}
      className={[
        "inline-flex min-h-10 max-w-full items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold shadow-[0_4px_10px_color-mix(in_srgb,var(--text-primary)_4%,transparent)] transition-[background-color,border-color,color,box-shadow,filter] duration-200 ease-out",
        toneClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && iconPosition === "left" ? (
        <AppIcon icon={icon} size={15} className="shrink-0" />
      ) : null}
      <span className="min-w-0 truncate">{children}</span>
      {icon && iconPosition === "right" ? (
        <AppIcon icon={icon} size={15} className="shrink-0" />
      ) : null}
    </span>
  );
}

const actionPillToneClasses: Record<NonNullable<ActionPillProps["tone"]>, string> = {
  accent:
    "border-[color-mix(in_srgb,var(--accent)_18%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,var(--background-elevated))] text-[var(--accent-on-soft)] group-hover:border-[color-mix(in_srgb,var(--accent)_30%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--accent)_11%,var(--background-elevated))] group-hover:shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_9%,transparent)]",
  muted:
    "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-secondary)] group-hover:border-[var(--border-strong)] group-hover:bg-[var(--background-muted)] group-hover:text-[var(--text-primary)] group-hover:shadow-[0_7px_16px_color-mix(in_srgb,var(--text-primary)_6%,transparent)]",
  success:
    "border-[color-mix(in_srgb,var(--success)_18%,transparent)] bg-[var(--success-soft)] text-[var(--success)] group-hover:border-[color-mix(in_srgb,var(--success)_30%,transparent)] group-hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--success)_13%,transparent)_0%,var(--success-soft)_100%)] group-hover:shadow-[0_8px_18px_color-mix(in_srgb,var(--success)_10%,transparent)]",
  locked:
    "border-dashed border-[var(--border-subtle)] bg-[var(--background-muted)] text-[var(--text-muted)] shadow-none group-hover:border-[var(--border)] group-hover:bg-[var(--background-muted)] group-hover:text-[var(--text-secondary)] group-hover:shadow-none",
  danger:
    "border-[color-mix(in_srgb,var(--danger)_18%,var(--border))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--danger)_8%,var(--background-elevated))_0%,color-mix(in_srgb,var(--danger)_2%,var(--background-elevated))_100%)] text-[color-mix(in_srgb,var(--danger-text)_82%,var(--text-primary))] group-hover:border-[color-mix(in_srgb,var(--danger)_30%,var(--border))] group-hover:text-[var(--danger-text-strong)] group-hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--danger)_8%,transparent)]",
};
