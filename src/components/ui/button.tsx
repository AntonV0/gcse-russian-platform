"use client";

import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type { AppIconKey } from "@/lib/shared/icons";

type ButtonVariant = "primary" | "secondary" | "quiet" | "success" | "warning" | "danger";

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
        "border border-[var(--brand-blue)]",
        "bg-[var(--brand-blue)] text-[var(--text-inverse)]",
        "shadow-[0_10px_20px_rgba(37,99,235,0.18),0_2px_6px_rgba(37,99,235,0.18)]",
        disabled
          ? "opacity-60"
          : "hover:border-[var(--brand-blue-hover)] hover:bg-[var(--brand-blue-hover)] hover:shadow-[0_14px_28px_rgba(37,99,235,0.22),0_4px_10px_rgba(37,99,235,0.18)]",
      ].join(" ");

    case "secondary":
      return [
        "border border-[var(--border)]",
        "bg-[var(--background-elevated)] text-[var(--text-primary)]",
        "shadow-[0_1px_2px_rgba(16,32,51,0.04)]",
        disabled
          ? "opacity-60"
          : "hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)] hover:shadow-[0_8px_18px_rgba(16,32,51,0.08)]",
      ].join(" ");

    case "quiet":
      return [
        "border border-transparent",
        "bg-transparent text-[var(--text-secondary)]",
        disabled
          ? "opacity-55"
          : "hover:border-[rgba(37,99,235,0.12)] hover:bg-[rgba(37,99,235,0.08)] hover:text-[var(--brand-blue)]",
      ].join(" ");

    case "success":
      return [
        "border border-[rgba(31,138,76,0.18)]",
        "bg-[var(--success-soft)] text-[var(--success)]",
        disabled
          ? "opacity-60"
          : "hover:border-[rgba(31,138,76,0.28)] hover:bg-[rgba(31,138,76,0.12)]",
      ].join(" ");

    case "warning":
      return [
        "border border-[rgba(183,121,31,0.18)]",
        "bg-[var(--warning-soft)] text-[var(--warning)]",
        disabled
          ? "opacity-60"
          : "hover:border-[rgba(183,121,31,0.28)] hover:bg-[rgba(183,121,31,0.12)]",
      ].join(" ");

    case "danger":
      return [
        "border border-[rgba(194,59,59,0.18)]",
        "bg-[var(--danger-soft)] text-[var(--danger)]",
        disabled
          ? "opacity-60"
          : "hover:border-[rgba(194,59,59,0.28)] hover:bg-[rgba(194,59,59,0.12)]",
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
    return size === "sm" ? "h-9 w-9 rounded-xl p-0" : "h-10 w-10 rounded-xl p-0";
  }

  return size === "sm"
    ? "min-h-9 rounded-xl px-3.5 py-2 text-sm"
    : "min-h-10 rounded-xl px-4 py-2.5 text-sm";
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
    "app-focus-ring inline-flex items-center justify-center gap-2 font-semibold leading-none",
    "select-none whitespace-nowrap",
    "transition-[transform,background-color,border-color,color,box-shadow,opacity]",
    "duration-200 ease-out",
    disabled
      ? "cursor-not-allowed"
      : "hover:-translate-y-px active:translate-y-0 active:scale-[0.99]",
    getVariantClass(variant, disabled),
    getSizeClass(size, iconOnly),
    iconOnly ? "shrink-0" : "",
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
    ...nativeButtonProps
  } = props as ButtonAsButtonProps;

  return (
    <button
      {...nativeButtonProps}
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
