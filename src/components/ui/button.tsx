import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import type { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "quiet" | "success" | "warning" | "danger";

type ButtonSize = "sm" | "md";

type BaseProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: LucideIcon;
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

function getVariantClass(variant: ButtonVariant) {
  switch (variant) {
    case "primary":
      return "app-btn-primary";
    case "secondary":
      return "app-btn-secondary";
    case "quiet":
      return "bg-transparent text-[var(--text-secondary)] border border-transparent hover:bg-[var(--background-muted)] hover:text-[var(--brand-blue)]";
    case "success":
      return "border border-transparent bg-[var(--success-soft)] text-[var(--success)] hover:opacity-90";
    case "warning":
      return "border border-transparent bg-[var(--warning-soft)] text-[var(--warning)] hover:opacity-90";
    case "danger":
      return "border border-transparent bg-[var(--danger-soft)] text-[var(--danger)] hover:opacity-90";
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
    "app-btn-base app-focus-ring",
    getVariantClass(variant),
    getSizeClass(size, iconOnly),
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
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
}) {
  if (iconOnly && icon) {
    return <AppIcon icon={icon} size={18} />;
  }

  return (
    <>
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

  const { ...buttonProps } = props as ButtonAsButtonProps & { href?: never };

  return (
    <button
      {...buttonProps}
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
