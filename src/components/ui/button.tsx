import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import type { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "quiet" | "success" | "warning" | "danger";

type ButtonSize = "sm" | "md";

type BaseProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
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
      return "bg-black text-white hover:opacity-90 border border-black";
    case "secondary":
      return "border bg-white text-black hover:bg-gray-50";
    case "quiet":
      return "border border-transparent bg-transparent text-gray-700 hover:bg-gray-100";
    case "success":
      return "border border-green-200 bg-green-50 text-green-800 hover:bg-green-100";
    case "warning":
      return "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100";
    case "danger":
      return "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100";
    default:
      return "border bg-white text-black hover:bg-gray-50";
  }
}

function getSizeClass(size: ButtonSize) {
  switch (size) {
    case "sm":
      return "px-3 py-2 text-sm rounded-lg";
    case "md":
      return "px-4 py-2.5 text-sm rounded-xl";
    default:
      return "px-4 py-2.5 text-sm rounded-xl";
  }
}

function getClassName({
  variant = "secondary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return [
    "inline-flex items-center justify-center gap-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
    getVariantClass(variant),
    getSizeClass(size),
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function ButtonInner({
  children,
  icon,
  iconPosition = "left",
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}) {
  return (
    <>
      {icon && iconPosition === "left" ? <AppIcon icon={icon} size={18} /> : null}
      <span>{children}</span>
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
  } = props;

  const mergedClassName = getClassName({ variant, size, className });

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={mergedClassName}>
        <ButtonInner icon={icon} iconPosition={iconPosition}>
          {children}
        </ButtonInner>
      </Link>
    );
  }

  return (
    <button {...props} className={mergedClassName}>
      <ButtonInner icon={icon} iconPosition={iconPosition}>
        {children}
      </ButtonInner>
    </button>
  );
}
