"use client";

import Link from "next/link";
import { useEffect } from "react";
import AppIcon from "@/components/ui/app-icon";
import {
  getButtonClassName,
  getButtonIconSize,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";
import {
  DevOnlyComponentMarker,
  SHOW_UI_DEBUG,
} from "@/components/ui/dev-component-marker";
import type { AppIconKey } from "@/lib/shared/icons";

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
  title?: string;
};

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

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

function getResolvedTitle({ ariaLabel, title }: { ariaLabel?: string; title?: string }) {
  return ariaLabel ?? title;
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
  const iconSize = getButtonIconSize(size);

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
  return (
    <DevOnlyComponentMarker
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
  const resolvedTitle = getResolvedTitle({
    ariaLabel: resolvedAriaLabel,
    title: "title" in props ? props.title : undefined,
  });

  const mergedClassName = getButtonClassName({
    variant,
    size,
    iconOnly,
    className,
    disabled,
  });

  useEffect(() => {
    if (!SHOW_UI_DEBUG || !iconOnly || resolvedAriaLabel) {
      return;
    }

    console.warn(
      "Button rendered with iconOnly=true but no ariaLabel. Add ariaLabel for screen reader users.",
      { icon, variant, size }
    );
  }, [icon, iconOnly, resolvedAriaLabel, size, variant]);

  if ("href" in props && props.href) {
    return (
      <span className="dev-marker-host relative inline-flex max-w-full">
        <ButtonMarker />

        <Link
          href={props.href}
          className={mergedClassName}
          aria-label={resolvedAriaLabel}
          title={resolvedTitle}
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

  const buttonProps = {
    ...(props as ButtonAsButtonProps),
  } as React.ButtonHTMLAttributes<HTMLButtonElement> & Partial<BaseProps>;

  delete buttonProps.variant;
  delete buttonProps.size;
  delete buttonProps.className;
  delete buttonProps.icon;
  delete buttonProps.iconPosition;
  delete buttonProps.iconOnly;
  delete buttonProps.ariaLabel;
  delete buttonProps.children;
  delete buttonProps.title;

  return (
    <span className="dev-marker-host relative inline-flex max-w-full">
      <ButtonMarker />

      <button
        {...buttonProps}
        className={mergedClassName}
        aria-label={resolvedAriaLabel}
        title={resolvedTitle}
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
