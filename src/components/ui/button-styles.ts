export type ButtonVariant =
  | "primary"
  | "secondary"
  | "quiet"
  | "success"
  | "warning"
  | "danger"
  | "soft"
  | "accent"
  | "inverse";

export type ButtonSize = "sm" | "md";

function getVariantClass(variant: ButtonVariant, disabled: boolean) {
  switch (variant) {
    case "primary":
      return [
        "app-btn-variant-primary border border-transparent !text-[var(--accent-on-fill)]",
        "bg-[linear-gradient(135deg,var(--accent-fill)_0%,var(--accent-fill)_58%,var(--accent-fill-hover)_100%)]",
        "shadow-[0_12px_28px_color-mix(in_srgb,var(--accent)_28%,transparent),0_3px_8px_color-mix(in_srgb,var(--accent)_16%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:brightness-[1.08]",
              "hover:saturate-[1.06]",
              "hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--accent)_34%,transparent),0_6px_14px_color-mix(in_srgb,var(--accent)_22%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "secondary":
      return [
        "app-btn-variant-secondary",
        "border border-[var(--border)]",
        "bg-[var(--background-elevated)] text-[var(--text-primary)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--text-primary)_5%,transparent),0_8px_18px_color-mix(in_srgb,var(--text-primary)_4%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--text-primary)]",
              "hover:border-[var(--border-strong)]",
              "hover:bg-[var(--background-muted)]",
              "hover:shadow-[0_14px_30px_color-mix(in_srgb,var(--text-primary)_10%,transparent),0_3px_8px_color-mix(in_srgb,var(--text-primary)_6%,transparent)]",
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
              "hover:border-[color-mix(in_srgb,var(--brand-blue)_14%,transparent)]",
              "hover:bg-[color-mix(in_srgb,var(--brand-blue)_10%,transparent)]",
              "hover:shadow-[0_8px_18px_color-mix(in_srgb,var(--brand-blue)_10%,transparent)]",
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
        "border border-[color-mix(in_srgb,var(--danger)_18%,transparent)]",
        "bg-[var(--danger-soft)] text-[var(--danger)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--danger)_3%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--danger)]",
              "hover:border-[color-mix(in_srgb,var(--danger)_32%,transparent)]",
              "hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--danger)_16%,transparent)_0%,var(--danger-soft)_100%)]",
              "hover:shadow-[0_12px_24px_color-mix(in_srgb,var(--danger)_14%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "soft":
      return [
        "app-btn-variant-soft",
        "border border-[color-mix(in_srgb,var(--brand-blue)_14%,transparent)]",
        "text-[var(--accent-on-soft)]",
        "bg-[linear-gradient(135deg,var(--info-soft)_0%,var(--background-elevated)_100%)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--brand-blue)_5%,transparent),0_8px_18px_color-mix(in_srgb,var(--brand-blue)_8%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--accent-on-soft)]",
              "hover:border-[color-mix(in_srgb,var(--brand-blue)_30%,transparent)]",
              "hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-blue)_24%,transparent)_0%,var(--background-elevated)_100%)]",
              "hover:shadow-[0_14px_28px_color-mix(in_srgb,var(--brand-blue)_16%,transparent),0_4px_10px_color-mix(in_srgb,var(--brand-blue)_8%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "accent":
      return [
        "app-btn-variant-accent border border-transparent !text-[var(--accent-on-fill)]",
        "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent-fill)_86%,var(--brand-white))_0%,var(--accent-fill)_56%,var(--accent-fill-hover)_100%)]",
        "shadow-[0_12px_28px_color-mix(in_srgb,var(--accent)_26%,transparent),0_3px_8px_color-mix(in_srgb,var(--accent)_15%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:brightness-[1.08]",
              "hover:saturate-[1.06]",
              "hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--accent)_32%,transparent),0_6px_14px_color-mix(in_srgb,var(--accent)_20%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "inverse":
      return [
        "app-btn-variant-inverse border border-transparent !text-[var(--brand-white)]",
        "bg-[linear-gradient(135deg,var(--text-primary)_0%,color-mix(in_srgb,var(--text-primary)_92%,var(--accent-fill))_58%,color-mix(in_srgb,var(--text-primary)_84%,var(--accent-fill))_100%)]",
        "[html[data-theme=dark]_&]:border-[var(--accent-selected-border)]",
        "[html[data-theme=dark]_&]:!text-[var(--accent-on-soft)]",
        "[html[data-theme=dark]_&]:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_11%,var(--dark-control-bg))_0%,color-mix(in_srgb,var(--accent)_5%,var(--dark-control-bg-hover))_100%)]",
        "[html[data-theme=dark]_&]:shadow-[0_1px_2px_rgba(0,0,0,0.22),0_0_0_1px_var(--accent-glow),0_14px_32px_color-mix(in_srgb,var(--accent)_10%,transparent)]",
        "shadow-[0_12px_26px_color-mix(in_srgb,var(--text-primary)_28%,transparent),0_3px_8px_color-mix(in_srgb,var(--text-primary)_14%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:brightness-[1.10]",
              "hover:saturate-[1.03]",
              "hover:shadow-[0_18px_36px_color-mix(in_srgb,var(--text-primary)_34%,transparent),0_6px_14px_color-mix(in_srgb,var(--text-primary)_18%,transparent)]",
              "[html[data-theme=dark]_&]:hover:border-[color-mix(in_srgb,var(--accent)_34%,var(--dark-surface-border))]",
              "[html[data-theme=dark]_&]:hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_16%,var(--dark-control-bg))_0%,color-mix(in_srgb,var(--accent)_7%,var(--dark-surface-strong))_100%)]",
              "[html[data-theme=dark]_&]:hover:shadow-[0_1px_2px_rgba(0,0,0,0.24),0_0_0_1px_color-mix(in_srgb,var(--accent)_20%,transparent),0_18px_38px_color-mix(in_srgb,var(--accent)_15%,transparent)]",
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
    "transition-[transform,background-color,border-color,color,box-shadow,opacity,filter] duration-200 ease-out",
    disabled
      ? "cursor-not-allowed"
      : "hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.985]",
    getVariantClass(variant, disabled),
    getSizeClass(size, iconOnly),
    iconOnly ? "aspect-square shrink-0" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
