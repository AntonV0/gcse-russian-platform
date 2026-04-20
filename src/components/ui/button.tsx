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

function getVariantClass(variant: ButtonVariant) {
  switch (variant) {
    case "primary":
      return "app-btn-primary";
    case "secondary":
      return "app-btn-secondary";
    case "quiet":
      return [
        "border border-transparent bg-transparent",
        "text-[var(--text-secondary)] hover:bg-[var(--background-muted)] hover:text-[var(--brand-blue)]",
      ].join(" ");
    case "success":
      return [
        "border border-transparent",
        "bg-[var(--success-soft)] text-[var(--success)] hover:opacity-90",
      ].join(" ");
    case "warning":
      return [
        "border border-transparent",
        "bg-[var(--warning-soft)] text-[var(--warning)] hover:opacity-90",
      ].join(" ");
    case "danger":
      return [
        "border border-transparent",
        "bg-[var(--danger-soft)] text-[var(--danger)] hover:opacity-90",
      ].join(" ");
    default:
      return "app-btn-secondary";
  }
}

function getSizeClass(size: ButtonSize, iconOnly: boolean) {
  if (iconOnly) {
    return size === "sm" ? "h-9 w-9 rounded-lg" : "h-10 w-10 rounded-xl";
  }

  return size === "sm"
    ? "rounded-lg px-3 py-2 text-sm"
    : "rounded-xl px-4 py-2.5 text-sm";
}

function getClassName({
  variant = "secondary",
  size = "md",
  iconOnly = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  className?: string;
}) {
  return [
    "dev-marker-host",
    "app-btn-base app-focus-ring inline-flex items-center justify-center gap-2 transition",
    getVariantClass(variant),
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
}: {
  children?: React.ReactNode;
  icon?: AppIconKey;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
}) {
  if (iconOnly) {
    return (
      <>
        {SHOW_UI_DEBUG ? (
          <DevComponentMarker
            componentName="Button"
            filePath="src/components/ui/button.tsx"
          />
        ) : null}

        {icon ? <AppIcon icon={icon} size={18} /> : null}
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

      {icon && iconPosition === "left" ? <AppIcon icon={icon} size={18} /> : null}
      {children ? <span>{children}</span> : null}
      {icon && iconPosition === "right" ? <AppIcon icon={icon} size={18} /> : null}
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

  const mergedClassName = getClassName({
    variant,
    size,
    iconOnly,
    className,
  });

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={mergedClassName}
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        <ButtonInner icon={icon} iconPosition={iconPosition} iconOnly={iconOnly}>
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
      <ButtonInner icon={icon} iconPosition={iconPosition} iconOnly={iconOnly}>
        {children}
      </ButtonInner>
    </button>
  );
}
