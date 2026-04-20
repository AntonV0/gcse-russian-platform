"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import AppIcon from "@/components/ui/app-icon";
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

function DevMarkerIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="dev-marker-trigger-icon"
      fill="none"
    >
      <circle cx="8" cy="8" r="2.25" fill="currentColor" />
      <path
        d="M8 1.75V3.1M8 12.9v1.35M14.25 8H12.9M3.1 8H1.75M12.42 3.58l-.95.96M4.53 11.47l-.95.95M12.42 12.42l-.95-.95M4.53 4.53l-.95-.95"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DevComponentMarker({
  componentName,
  filePath,
}: {
  componentName: string;
  filePath: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!markerRef.current) {
        return;
      }

      if (event.target instanceof Node && !markerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function toggleOpen(event: React.MouseEvent<HTMLSpanElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen((current) => !current);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen((current) => !current);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
    }
  }

  return (
    <span ref={markerRef} className="dev-marker-anchor">
      <span
        role="button"
        tabIndex={0}
        className="dev-marker-trigger"
        data-state={isOpen ? "open" : "closed"}
        aria-label={`Show component info for ${componentName}`}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
      >
        <DevMarkerIcon />
      </span>

      {isOpen ? (
        <div
          id={panelId}
          className="dev-marker-panel"
          role="dialog"
          aria-label={`${componentName} component info`}
        >
          <div className="dev-marker-panel-label">Shared component</div>
          <div className="dev-marker-panel-name">{componentName}</div>
          <div className="dev-marker-panel-path">{filePath}</div>
        </div>
      ) : null}
    </span>
  );
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
  return (
    <>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="Button"
          filePath="src/components/ui/button.tsx"
        />
      ) : null}

      {icon && iconPosition === "left" ? <AppIcon icon={icon} size={18} /> : null}
      {iconOnly ? null : children ? <span>{children}</span> : null}
      {icon && iconPosition === "right" ? <AppIcon icon={icon} size={18} /> : null}
      {iconOnly && icon ? <AppIcon icon={icon} size={18} /> : null}
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
