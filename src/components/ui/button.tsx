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
        "app-btn-variant-primary border border-transparent !text-white",
        "bg-[linear-gradient(135deg,#3b82f6_0%,#2563eb_58%,#1d4ed8_100%)]",
        "shadow-[0_12px_28px_rgba(37,99,235,0.28),0_3px_8px_rgba(37,99,235,0.16)]",
        disabled
          ? "opacity-60"
          : [
              "hover:brightness-[1.08]",
              "hover:saturate-[1.06]",
              "hover:shadow-[0_18px_40px_rgba(37,99,235,0.34),0_6px_14px_rgba(37,99,235,0.22)]",
            ].join(" "),
      ].join(" ");

    case "secondary":
      return [
        "app-btn-variant-secondary",
        "border border-[var(--border)]",
        "bg-[var(--background-elevated)] text-[var(--text-primary)]",
        "shadow-[0_1px_2px_rgba(16,32,51,0.05),0_8px_18px_rgba(16,32,51,0.04)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--text-primary)]",
              "hover:border-[var(--border-strong)]",
              "hover:bg-[var(--background-muted)]",
              "hover:shadow-[0_14px_30px_rgba(16,32,51,0.10),0_3px_8px_rgba(16,32,51,0.06)]",
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
              "hover:border-[rgba(37,99,235,0.14)]",
              "hover:bg-[rgba(37,99,235,0.10)]",
              "hover:shadow-[0_8px_18px_rgba(37,99,235,0.10)]",
            ].join(" "),
      ].join(" ");

    case "success":
      return [
        "app-btn-variant-success",
        "border border-[rgba(31,138,76,0.18)]",
        "bg-[var(--success-soft)] text-[var(--success)]",
        "shadow-[0_1px_2px_rgba(31,138,76,0.03)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--success)]",
              "hover:border-[rgba(31,138,76,0.32)]",
              "hover:bg-[linear-gradient(135deg,rgba(31,138,76,0.16)_0%,var(--success-soft)_100%)]",
              "hover:shadow-[0_12px_24px_rgba(31,138,76,0.14)]",
            ].join(" "),
      ].join(" ");

    case "warning":
      return [
        "app-btn-variant-warning",
        "border border-[rgba(183,121,31,0.18)]",
        "bg-[var(--warning-soft)] text-[var(--warning)]",
        "shadow-[0_1px_2px_rgba(183,121,31,0.03)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--warning)]",
              "hover:border-[rgba(183,121,31,0.32)]",
              "hover:bg-[linear-gradient(135deg,rgba(183,121,31,0.16)_0%,var(--warning-soft)_100%)]",
              "hover:shadow-[0_12px_24px_rgba(183,121,31,0.14)]",
            ].join(" "),
      ].join(" ");

    case "danger":
      return [
        "app-btn-variant-danger",
        "border border-[rgba(194,59,59,0.18)]",
        "bg-[var(--danger-soft)] text-[var(--danger)]",
        "shadow-[0_1px_2px_rgba(194,59,59,0.03)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--danger)]",
              "hover:border-[rgba(194,59,59,0.32)]",
              "hover:bg-[linear-gradient(135deg,rgba(194,59,59,0.16)_0%,var(--danger-soft)_100%)]",
              "hover:shadow-[0_12px_24px_rgba(194,59,59,0.14)]",
            ].join(" "),
      ].join(" ");

    case "soft":
      return [
        "app-btn-variant-soft",
        "border border-[rgba(37,99,235,0.14)]",
        "text-[var(--brand-blue)]",
        "bg-[linear-gradient(135deg,var(--info-soft)_0%,var(--background-elevated)_100%)]",
        "shadow-[0_1px_2px_rgba(37,99,235,0.05),0_8px_18px_rgba(37,99,235,0.08)]",
        disabled
          ? "opacity-60"
          : [
              "hover:text-[var(--brand-blue-hover)]",
              "hover:border-[rgba(37,99,235,0.30)]",
              "hover:bg-[linear-gradient(135deg,rgba(37,99,235,0.24)_0%,var(--background-elevated)_100%)]",
              "hover:shadow-[0_14px_28px_rgba(37,99,235,0.16),0_4px_10px_rgba(37,99,235,0.08)]",
            ].join(" "),
      ].join(" ");

    case "accent":
      return [
        "app-btn-variant-accent border border-transparent !text-white",
        "bg-[linear-gradient(135deg,#fb7185_0%,#ef4444_56%,#d94b52_100%)]",
        "shadow-[0_12px_28px_rgba(217,75,82,0.28),0_3px_8px_rgba(217,75,82,0.16)]",
        disabled
          ? "opacity-60"
          : [
              "hover:brightness-[1.08]",
              "hover:saturate-[1.06]",
              "hover:shadow-[0_18px_40px_rgba(217,75,82,0.34),0_6px_14px_rgba(217,75,82,0.20)]",
            ].join(" "),
      ].join(" ");

    case "inverse":
      return [
        "app-btn-variant-inverse border border-transparent !text-white",
        "bg-[linear-gradient(135deg,#102033_0%,#17314d_58%,#214466_100%)]",
        "shadow-[0_12px_26px_rgba(16,32,51,0.28),0_3px_8px_rgba(16,32,51,0.14)]",
        disabled
          ? "opacity-60"
          : [
              "hover:brightness-[1.10]",
              "hover:saturate-[1.03]",
              "hover:shadow-[0_18px_36px_rgba(16,32,51,0.34),0_6px_14px_rgba(16,32,51,0.18)]",
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
    "dev-marker-host",
    "app-focus-ring app-btn-surface-fix inline-flex items-center justify-center gap-2 font-semibold leading-none",
    "select-none whitespace-nowrap",
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
    return (
      <>
        {SHOW_UI_DEBUG ? (
          <DevComponentMarker
            componentName="Button"
            filePath="src/components/ui/button.tsx"
          />
        ) : null}

        {icon ? <AppIcon icon={icon} size={iconSize} /> : null}
      </>
    );
  }

  return (
    <>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="Button"
          filePath="src/components/ui/button.tsx"
        />
      ) : null}

      {icon && iconPosition === "left" ? <AppIcon icon={icon} size={iconSize} /> : null}
      {children ? <span className="truncate">{children}</span> : null}
      {icon && iconPosition === "right" ? <AppIcon icon={icon} size={iconSize} /> : null}
    </>
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

  const mergedClassName = getClassName({
    variant,
    size,
    iconOnly,
    className,
    disabled,
  });

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={mergedClassName}
        aria-label={ariaLabel}
        title={ariaLabel}
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
    <button
      {...buttonProps}
      className={mergedClassName}
      aria-label={ariaLabel}
      title={ariaLabel}
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
  );
}
