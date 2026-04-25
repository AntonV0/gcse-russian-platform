export type ButtonVariant =
  | "primary"
  | "secondary"
  | "quiet"
  | "success"
  | "warning"
  | "danger"
  | "exit"
  | "soft"
  | "accent"
  | "inverse";

export type ButtonSize = "sm" | "md";

function getVariantClass(variant: ButtonVariant, disabled: boolean) {
  switch (variant) {
    case "primary":
      return [
        "app-btn-variant-primary border border-transparent !text-[var(--accent-on-fill)]",
        "[background:var(--accent-gradient-fill)]",
        "shadow-[inset_0_1px_0_color-mix(in_srgb,var(--brand-white)_18%,transparent),0_12px_26px_color-mix(in_srgb,var(--accent)_24%,transparent),0_2px_6px_color-mix(in_srgb,var(--accent)_14%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:[background:var(--accent-gradient-fill-hover)]",
              "hover:brightness-[1.04]",
              "hover:saturate-[1.04]",
              "hover:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--brand-white)_22%,transparent),0_16px_34px_color-mix(in_srgb,var(--accent)_27%,transparent),0_5px_12px_color-mix(in_srgb,var(--accent)_16%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "secondary":
      return [
        "app-btn-variant-secondary",
        "border border-[var(--border)]",
        "bg-[var(--background-elevated)] text-[var(--text-primary)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--text-primary)_5%,transparent),0_7px_16px_color-mix(in_srgb,var(--text-primary)_4%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--text-primary)]",
              "hover:border-[var(--border-strong)]",
              "hover:bg-[var(--background-muted)]",
              "hover:shadow-[0_12px_26px_color-mix(in_srgb,var(--text-primary)_9%,transparent),0_2px_7px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "quiet":
      return [
        "app-btn-variant-quiet",
        "border border-transparent",
        "bg-transparent text-[var(--text-secondary)]",
        disabled
          ? "opacity-55"
          : [
              "hover:text-[var(--accent-ink)]",
              "hover:border-[color-mix(in_srgb,var(--accent)_14%,transparent)]",
              "hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]",
              "hover:shadow-[0_8px_18px_color-mix(in_srgb,var(--accent)_8%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "success":
      return [
        "app-btn-variant-success",
        "border border-[color-mix(in_srgb,var(--success)_18%,transparent)]",
        "bg-[var(--success-soft)] text-[var(--success)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--success)_3%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--success)]",
              "hover:border-[color-mix(in_srgb,var(--success)_32%,transparent)]",
              "hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--success)_16%,transparent)_0%,var(--success-soft)_100%)]",
              "hover:shadow-[0_12px_24px_color-mix(in_srgb,var(--success)_14%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "warning":
      return [
        "app-btn-variant-warning",
        "border border-[color-mix(in_srgb,var(--warning)_18%,transparent)]",
        "bg-[var(--warning-soft)] text-[var(--warning)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--warning)_3%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--warning)]",
              "hover:border-[color-mix(in_srgb,var(--warning)_32%,transparent)]",
              "hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--warning)_16%,transparent)_0%,var(--warning-soft)_100%)]",
              "hover:shadow-[0_12px_24px_color-mix(in_srgb,var(--warning)_14%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "danger":
      return [
        "app-btn-variant-danger",
        "border border-[var(--danger-border)]",
        "text-[var(--danger-text)]",
        "bg-[linear-gradient(135deg,var(--danger-surface-strong)_0%,var(--danger-surface)_100%)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--danger)_5%,transparent),0_9px_20px_color-mix(in_srgb,var(--danger)_9%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--danger-text-strong)]",
              "hover:border-[var(--danger-border-strong)]",
              "hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--danger)_17%,var(--background-elevated))_0%,var(--danger-surface-strong)_100%)]",
              "hover:shadow-[0_1px_2px_color-mix(in_srgb,var(--danger)_6%,transparent),0_13px_28px_color-mix(in_srgb,var(--danger)_14%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "exit":
      return [
        "app-btn-variant-exit",
        "border border-[color-mix(in_srgb,var(--danger)_18%,var(--border))]",
        "text-[color-mix(in_srgb,var(--danger-text)_82%,var(--text-primary))]",
        "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--danger)_8%,var(--background-elevated))_0%,color-mix(in_srgb,var(--danger)_2%,var(--background-elevated))_100%)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--danger)_4%,transparent),0_8px_18px_color-mix(in_srgb,var(--text-primary)_4%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--danger-text-strong)]",
              "hover:border-[color-mix(in_srgb,var(--danger)_34%,var(--border))]",
              "hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--danger)_12%,var(--background-elevated))_0%,color-mix(in_srgb,var(--danger)_4%,var(--background-elevated))_100%)]",
              "hover:shadow-[0_12px_24px_color-mix(in_srgb,var(--danger)_11%,transparent),0_2px_7px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "soft":
      return [
        "app-btn-variant-soft",
        "border border-[color-mix(in_srgb,var(--accent)_14%,transparent)]",
        "text-[var(--accent-on-soft)]",
        "[background:var(--accent-gradient-soft)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--accent)_4%,transparent),0_8px_18px_color-mix(in_srgb,var(--accent)_7%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--accent-on-soft)]",
              "hover:border-[color-mix(in_srgb,var(--accent)_30%,transparent)]",
              "hover:[background:var(--accent-gradient-soft-hover)]",
              "hover:shadow-[0_13px_26px_color-mix(in_srgb,var(--accent)_14%,transparent),0_3px_8px_color-mix(in_srgb,var(--accent)_7%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "accent":
      return [
        "app-btn-variant-accent border border-transparent !text-[var(--accent-on-fill)]",
        "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent-fill)_94%,var(--brand-white))_0%,var(--accent-fill)_48%,color-mix(in_srgb,var(--accent-fill-hover)_92%,var(--accent-fill))_100%)]",
        "shadow-[inset_0_1px_0_color-mix(in_srgb,var(--brand-white)_18%,transparent),0_11px_25px_color-mix(in_srgb,var(--accent)_22%,transparent),0_2px_7px_color-mix(in_srgb,var(--accent)_13%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent-fill-hover)_88%,var(--brand-white))_0%,var(--accent-fill-hover)_100%)]",
              "hover:brightness-[1.04]",
              "hover:saturate-[1.04]",
              "hover:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--brand-white)_22%,transparent),0_16px_34px_color-mix(in_srgb,var(--accent)_28%,transparent),0_4px_11px_color-mix(in_srgb,var(--accent)_16%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "inverse":
      return [
        "app-btn-variant-inverse border border-transparent !text-[var(--brand-white)]",
        "bg-[linear-gradient(135deg,var(--text-primary)_0%,color-mix(in_srgb,var(--text-primary)_90%,var(--accent-fill))_58%,color-mix(in_srgb,var(--text-primary)_82%,var(--accent-fill))_100%)]",
        "[html[data-theme=dark]_&]:border-[color-mix(in_srgb,var(--accent)_30%,var(--dark-surface-border))]",
        "[html[data-theme=dark]_&]:!text-[var(--accent-on-soft)]",
        "[html[data-theme=dark]_&]:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_13%,var(--dark-control-bg))_0%,color-mix(in_srgb,var(--accent)_6%,var(--dark-control-bg-hover))_100%)]",
        "[html[data-theme=dark]_&]:shadow-[0_1px_2px_rgba(0,0,0,0.24),0_0_0_1px_color-mix(in_srgb,var(--accent)_13%,transparent),0_13px_30px_color-mix(in_srgb,var(--accent)_10%,transparent)]",
        "shadow-[inset_0_1px_0_color-mix(in_srgb,var(--brand-white)_9%,transparent),0_12px_26px_color-mix(in_srgb,var(--text-primary)_25%,transparent),0_3px_8px_color-mix(in_srgb,var(--text-primary)_12%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:brightness-[1.07]",
              "hover:saturate-[1.03]",
              "hover:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--brand-white)_12%,transparent),0_17px_34px_color-mix(in_srgb,var(--text-primary)_30%,transparent),0_5px_12px_color-mix(in_srgb,var(--text-primary)_15%,transparent)]",
              "[html[data-theme=dark]_&]:hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--dark-surface-border))]",
              "[html[data-theme=dark]_&]:hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_18%,var(--dark-control-bg))_0%,color-mix(in_srgb,var(--accent)_8%,var(--dark-surface-strong))_100%)]",
              "[html[data-theme=dark]_&]:hover:shadow-[0_1px_2px_rgba(0,0,0,0.26),0_0_0_1px_color-mix(in_srgb,var(--accent)_19%,transparent),0_17px_36px_color-mix(in_srgb,var(--accent)_15%,transparent)]",
            ].join(" "),
      ].join(" ");

    default:
      return [
        "border border-[var(--border)]",
        "bg-[var(--background-elevated)] text-[var(--text-primary)]",
      ].join(" ");
  }
}

function getSizeClass(size: ButtonSize, iconOnly: boolean) {
  if (iconOnly) {
    return size === "sm" ? "h-9 w-9 rounded-xl p-0" : "h-10 w-10 rounded-2xl p-0";
  }

  return size === "sm"
    ? "min-h-9 rounded-xl px-3.5 py-2 text-sm"
    : "min-h-10 rounded-2xl px-4.5 py-2.5 text-sm";
}

export function getButtonIconSize(size: ButtonSize) {
  return size === "sm" ? 16 : 18;
}

export function getButtonClassName({
  variant = "secondary",
  size = "md",
  iconOnly = false,
  className,
  disabled = false,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return [
    "app-focus-ring app-btn-surface-fix inline-flex items-center justify-center gap-2 font-semibold leading-none",
    "max-w-full select-none whitespace-nowrap",
    "transition-[transform,background-color,border-color,color,box-shadow,opacity,filter] duration-200 ease-out motion-reduce:transition-none",
    disabled
      ? "cursor-not-allowed saturate-[0.72] grayscale-[0.08] !shadow-none"
      : "hover:-translate-y-[2px] active:translate-y-[0px] active:scale-[0.985]",
    getVariantClass(variant, disabled),
    getSizeClass(size, iconOnly),
    iconOnly
      ? "app-btn-icon-only aspect-square shrink-0 ring-1 ring-inset ring-[color-mix(in_srgb,var(--text-primary)_5%,transparent)]"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
