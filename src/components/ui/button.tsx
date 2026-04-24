"use client";

import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type { AppIconKey } from "@/lib/shared/icons";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "quiet"
  | "success"
  | "warning"
  | "danger"
  | "soft"
  | "accent"
  | "inverse";

type ButtonSize = "sm" | "md";

type BaseProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: AppIconKey;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
  ariaLabel?: string;
};

type ButtonAsButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

type ButtonAsLinkProps = BaseProps & {
  href: string;
};

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getVariantClass(variant: ButtonVariant, disabled: boolean) {
  switch (variant) {
    case "primary":
      return [
        "app-btn-variant-primary border border-transparent !text-[var(--brand-white)]",
        "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-blue)_82%,var(--brand-white))_0%,var(--brand-blue)_58%,var(--brand-blue-hover)_100%)]",
        "shadow-[0_12px_28px_color-mix(in_srgb,var(--brand-blue)_28%,transparent),0_3px_8px_color-mix(in_srgb,var(--brand-blue)_16%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:brightness-[1.08]",
              "hover:saturate-[1.06]",
              "hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--brand-blue)_34%,transparent),0_6px_14px_color-mix(in_srgb,var(--brand-blue)_22%,transparent)]",
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
              "hover:text-[var(--brand-blue)]",
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
        "text-[var(--brand-blue)]",
        "bg-[linear-gradient(135deg,var(--info-soft)_0%,var(--background-elevated)_100%)]",
        "shadow-[0_1px_2px_color-mix(in_srgb,var(--brand-blue)_5%,transparent),0_8px_18px_color-mix(in_srgb,var(--brand-blue)_8%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--brand-blue-hover)]",
              "hover:border-[color-mix(in_srgb,var(--brand-blue)_30%,transparent)]",
              "hover:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-blue)_24%,transparent)_0%,var(--background-elevated)_100%)]",
              "hover:shadow-[0_14px_28px_color-mix(in_srgb,var(--brand-blue)_16%,transparent),0_4px_10px_color-mix(in_srgb,var(--brand-blue)_8%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "accent":
      return [
        "app-btn-variant-accent border border-transparent !text-[var(--brand-white)]",
        "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-red)_70%,var(--brand-white))_0%,var(--brand-red)_56%,var(--brand-red-hover)_100%)]",
        "shadow-[0_12px_28px_color-mix(in_srgb,var(--brand-red)_28%,transparent),0_3px_8px_color-mix(in_srgb,var(--brand-red)_16%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:brightness-[1.08]",
              "hover:saturate-[1.06]",
              "hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--brand-red)_34%,transparent),0_6px_14px_color-mix(in_srgb,var(--brand-red)_20%,transparent)]",
            ].join(" "),
      ].join(" ");

    case "inverse":
      return [
        "app-btn-variant-inverse border border-transparent !text-[var(--brand-white)]",
        "bg-[linear-gradient(135deg,var(--text-primary)_0%,color-mix(in_srgb,var(--text-primary)_92%,var(--brand-blue))_58%,color-mix(in_srgb,var(--text-primary)_84%,var(--brand-blue))_100%)]",
        "[html[data-theme=dark]_&]:bg-[linear-gradient(135deg,var(--text-inverse)_0%,color-mix(in_srgb,var(--text-inverse)_90%,var(--brand-blue))_58%,color-mix(in_srgb,var(--text-inverse)_80%,var(--brand-blue))_100%)]",
        "shadow-[0_12px_26px_color-mix(in_srgb,var(--text-primary)_28%,transparent),0_3px_8px_color-mix(in_srgb,var(--text-primary)_14%,transparent)]",
        disabled
          ? "opacity-60"
          : [
              "hover:brightness-[1.10]",
              "hover:saturate-[1.03]",
              "hover:shadow-[0_18px_36px_color-mix(in_srgb,var(--text-primary)_34%,transparent),0_6px_14px_color-mix(in_srgb,var(--text-primary)_18%,transparent)]",
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

function getIconSize(size: ButtonSize) {
  return size === "sm" ? 16 : 18;
}

function getClassName({
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

function getResolvedAriaLabel({
  ariaLabel,
  children,
  iconOnly,
}: {
  ariaLabel?: string;
  children?: React.ReactNode;
  iconOnly?: boolean;
}) {
  if (ariaLabel) {
    return ariaLabel;
  }

  if (iconOnly && typeof children === "string") {
    return children;
  }

  return undefined;
}

function ButtonInner({
  children,
  icon,
  iconPosition = "left",
  iconOnly = false,
  size = "md",
}: {
  children?: React.ReactNode;
  icon?: AppIconKey;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
  size?: ButtonSize;
}) {
  const iconSize = getIconSize(size);

  if (iconOnly) {
    return icon ? <AppIcon icon={icon} size={iconSize} /> : null;
  }

  return (
    <>
      {icon && iconPosition === "left" ? (
        <span className="shrink-0">
          <AppIcon icon={icon} size={iconSize} />
        </span>
      ) : null}

      {children ? <span className="truncate">{children}</span> : null}

      {icon && iconPosition === "right" ? (
        <span className="shrink-0">
          <AppIcon icon={icon} size={iconSize} />
        </span>
      ) : null}
    </>
  );
}

function ButtonMarker() {
  if (!SHOW_UI_DEBUG) {
    return null;
  }

  return (
    <DevComponentMarker
      componentName="Button"
      filePath="src/components/ui/button.tsx"
      tier="primitive"
      componentRole="Shared action primitive for buttons and button-styled links"
      bestFor="Primary CTAs, secondary actions, toolbar controls, row actions, and navigation links styled as buttons."
      usageExamples={[
        "Save and publish actions",
        "Pricing checkout CTAs",
        "Toolbar filters",
        "Card footer actions",
      ]}
      notes="Prefer shared variants and sizes over custom page-level button styling. Use iconOnly only for familiar actions with an accessible label."
    />
  );
}

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = "secondary",
    size = "md",
    className,
    icon,
    iconPosition = "left",
    iconOnly = false,
    ariaLabel,
  } = props;

  const disabled = "disabled" in props ? Boolean(props.disabled) : false;
  const resolvedAriaLabel = getResolvedAriaLabel({
    ariaLabel,
    children,
    iconOnly,
  });

  const mergedClassName = getClassName({
    variant,
    size,
    iconOnly,
    className,
    disabled,
  });

  if ("href" in props && props.href) {
    return (
      <span className="dev-marker-host relative inline-flex max-w-full">
        <ButtonMarker />

        <Link
          href={props.href}
          className={mergedClassName}
          aria-label={resolvedAriaLabel}
          title={resolvedAriaLabel}
        >
          <ButtonInner
            icon={icon}
            iconPosition={iconPosition}
            iconOnly={iconOnly}
            size={size}
          >
            {children}
          </ButtonInner>
        </Link>
      </span>
    );
  }

  const {
    variant: _variant,
    size: _size,
    className: _className,
    icon: _icon,
    iconPosition: _iconPosition,
    iconOnly: _iconOnly,
    ariaLabel: _ariaLabel,
    children: _children,
    ...buttonProps
  } = props as ButtonAsButtonProps;

  return (
    <span className="dev-marker-host relative inline-flex max-w-full">
      <ButtonMarker />

      <button
        {...buttonProps}
        className={mergedClassName}
        aria-label={resolvedAriaLabel}
        title={resolvedAriaLabel}
      >
        <ButtonInner
          icon={icon}
          iconPosition={iconPosition}
          iconOnly={iconOnly}
          size={size}
        >
          {children}
        </ButtonInner>
      </button>
    </span>
  );
}
