"use client";

import AppIcon from "@/components/ui/app-icon";
import type { AppIconKey } from "@/lib/shared/icons";

type PricingOptionButtonProps = {
  label: string;
  meta?: string;
  badgeLabel?: string;
  trailingLabel?: string;
  recommended?: boolean;
  disabled?: boolean;
  loading?: boolean;
  state?: "action" | "owned" | "locked";
  icon?: AppIconKey;
  loadingLabel?: string;
  onClick?: () => void;
};

const stateIcons: Record<NonNullable<PricingOptionButtonProps["state"]>, AppIconKey> = {
  action: "next",
  owned: "completed",
  locked: "locked",
};

export function PricingOptionButton({
  label,
  meta,
  badgeLabel,
  trailingLabel,
  recommended = false,
  disabled = false,
  loading = false,
  state = "action",
  icon,
  loadingLabel,
  onClick,
}: PricingOptionButtonProps) {
  const isDisabled = disabled || loading;
  const resolvedIcon = loading ? "sync" : (icon ?? stateIcons[state]);
  const resolvedTrailingLabel = loading ? (loadingLabel ?? trailingLabel) : trailingLabel;
  const isAction = state === "action";

  const baseClasses =
    "app-focus-ring group flex w-full flex-col gap-3 rounded-xl border px-3.5 py-3 text-left transition sm:flex-row sm:items-center sm:justify-between";
  const stateClasses =
    state === "locked"
      ? "cursor-not-allowed border-dashed border-[var(--border-subtle)] bg-[var(--surface-secondary)]/75 text-[var(--text-secondary)] opacity-85"
      : state === "owned"
        ? "cursor-default border-[var(--success-border)] bg-[linear-gradient(135deg,var(--surface-primary)_0%,var(--success-surface)_100%)] text-[var(--text-primary)] shadow-[0_10px_24px_color-mix(in_srgb,var(--success-text)_8%,transparent)]"
        : recommended
          ? "border-[var(--accent-selected-border)] [background:var(--accent-gradient-selected)] shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_10%,transparent)]"
          : "border-[var(--border-subtle)] bg-[var(--background-elevated)] hover:border-[var(--border-strong)]";
  const motionClasses = isAction && !isDisabled ? "app-card-interaction-subtle" : "";
  const disabledClasses = isDisabled && isAction ? "cursor-not-allowed opacity-70" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={[baseClasses, stateClasses, motionClasses, disabledClasses]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="min-w-0 space-y-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-[var(--text-primary)]">{label}</span>
          {badgeLabel ? (
            <span className="rounded-full [background:var(--accent-gradient-fill)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--accent-on-fill)]">
              {badgeLabel}
            </span>
          ) : null}
        </span>
        {meta ? (
          <span className="block text-xs leading-5 text-[var(--text-secondary)]">
            {meta}
          </span>
        ) : null}
      </span>

      <span className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
        {resolvedTrailingLabel ? (
          <span className="text-sm font-extrabold text-[var(--text-primary)]">
            {resolvedTrailingLabel}
          </span>
        ) : null}
        <span
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition",
            loading ? "animate-spin motion-reduce:animate-none" : "",
            recommended || state === "owned"
              ? "border-transparent [background:var(--accent-gradient-fill)] text-[var(--accent-on-fill)]"
              : state === "locked"
                ? "border-[var(--border-subtle)] bg-[var(--background-muted)] text-[var(--text-muted)]"
                : "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-secondary)] group-hover:text-[var(--accent-ink)]",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        >
          <AppIcon icon={resolvedIcon} size={15} />
        </span>
      </span>
    </button>
  );
}
