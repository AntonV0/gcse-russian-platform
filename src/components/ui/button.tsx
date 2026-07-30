"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { LinkProps } from "next/link";
import AppIcon from "@/components/ui/app-icon";
import {
  getButtonClassName,
  getButtonIconSize,
  type ButtonInteraction,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";
import {
  DevOnlyComponentMarker,
  SHOW_UI_DEBUG,
} from "@/components/ui/dev-component-marker";
import type { AppIconKey } from "@/lib/shared/icons";
import { appendAuthDestination } from "@/lib/auth/redirect-paths";

type BaseProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: AppIconKey;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
  ariaLabel?: string;
  loading?: boolean;
  loadingLabel?: string;
  loadingIcon?: AppIconKey;
  interaction?: ButtonInteraction;
};

type ButtonAsButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

type ButtonAsLinkProps = BaseProps & {
  href: string;
  prefetch?: LinkProps["prefetch"];
  replace?: LinkProps["replace"];
  scroll?: LinkProps["scroll"];
  onNavigate?: LinkProps["onNavigate"];
} & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children" | "href" | "onNavigate"
  >;

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
  loading = false,
  loadingLabel,
  loadingIcon = "sync",
}: {
  children?: React.ReactNode;
  icon?: AppIconKey;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
  loadingIcon?: AppIconKey;
}) {
  const iconSize = getButtonIconSize(size);
  const resolvedIcon = loading ? loadingIcon : icon;
  const resolvedChildren = loading && loadingLabel ? loadingLabel : children;
  const iconClassName = loading ? "animate-spin motion-reduce:animate-none" : undefined;

  if (iconOnly) {
    return resolvedIcon ? (
      <AppIcon icon={resolvedIcon} size={iconSize} className={iconClassName} />
    ) : null;
  }

  return (
    <>
      {resolvedIcon && iconPosition === "left" ? (
        <span className="shrink-0">
          <AppIcon icon={resolvedIcon} size={iconSize} className={iconClassName} />
        </span>
      ) : null}

      {resolvedChildren ? (
        <span className="min-w-0 truncate leading-[1.35]">{resolvedChildren}</span>
      ) : null}

      {resolvedIcon && iconPosition === "right" ? (
        <span className="shrink-0">
          <AppIcon icon={resolvedIcon} size={iconSize} className={iconClassName} />
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

function ButtonLinkInner(props: {
  children?: React.ReactNode;
  icon?: AppIconKey;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
  loadingIcon?: AppIconKey;
}) {
  const { pending } = useLinkStatus();
  const isLoading = props.loading || pending;

  return (
    <ButtonInner
      icon={props.icon}
      iconPosition={props.iconPosition}
      iconOnly={props.iconOnly}
      size={props.size}
      loading={isLoading}
      loadingLabel={props.loadingLabel}
      loadingIcon={props.loadingIcon}
    >
      {props.children}
    </ButtonInner>
  );
}

function shouldShowNavigationPending(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  target?: string
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey ||
    target === "_blank" ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }

  return href.startsWith("/");
}

export default function Button(props: ButtonProps) {
  const pathname = usePathname();
  const {
    children,
    variant = "secondary",
    size = "md",
    className,
    icon,
    iconPosition = "left",
    iconOnly = false,
    ariaLabel,
    loading = false,
    loadingLabel,
    loadingIcon = "sync",
    interaction,
  } = props;
  const [linkPending, setLinkPending] = useState(false);

  const disabled =
    ("disabled" in props ? Boolean(props.disabled) : false) || loading || linkPending;
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
    interaction,
    className,
    disabled,
  });
  const classTokens = className?.split(/\s+/) ?? [];
  const wrapperClassName = [
    "dev-marker-host relative inline-flex max-w-full",
    classTokens.includes("w-full") ? "w-full" : null,
    classTokens.includes("flex-1") ? "flex-1" : null,
    classTokens.includes("sm:w-auto") ? "sm:w-auto" : null,
    classTokens.includes("md:w-auto") ? "md:w-auto" : null,
    classTokens.includes("lg:w-auto") ? "lg:w-auto" : null,
    classTokens.includes("sm:flex-none") ? "sm:flex-none" : null,
    classTokens.includes("sm:shrink-0") ? "sm:shrink-0" : null,
    classTokens.includes("lg:shrink-0") ? "lg:shrink-0" : null,
  ]
    .filter(Boolean)
    .join(" ");

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
    const resolvedHref = appendAuthDestination(props.href, pathname);
    const linkProps = {
      ...(props as ButtonAsLinkProps),
    } as React.AnchorHTMLAttributes<HTMLAnchorElement> &
      Partial<BaseProps> & {
        href: string;
      };

    delete linkProps.variant;
    delete linkProps.size;
    delete linkProps.className;
    delete linkProps.icon;
    delete linkProps.iconPosition;
    delete linkProps.iconOnly;
    delete linkProps.ariaLabel;
    delete linkProps.children;
    delete linkProps.loading;
    delete linkProps.loadingLabel;
    delete linkProps.loadingIcon;
    delete linkProps.interaction;

    const linkOnClick = linkProps.onClick;
    const isBusy = loading || linkPending;

    return (
      <span className={wrapperClassName}>
        <ButtonMarker />

        <Link
          {...linkProps}
          href={resolvedHref}
          className={mergedClassName}
          aria-label={resolvedAriaLabel}
          aria-busy={isBusy || props["aria-busy"] || undefined}
          aria-disabled={isBusy || undefined}
          data-pending={isBusy ? "" : undefined}
          tabIndex={isBusy ? -1 : linkProps.tabIndex}
          title={resolvedTitle}
          onClick={(event) => {
            if (isBusy) {
              event.preventDefault();
              return;
            }

            linkOnClick?.(event);

            if (shouldShowNavigationPending(event, resolvedHref, props.target)) {
              setLinkPending(true);
            }
          }}
        >
          <ButtonLinkInner
            icon={icon}
            iconPosition={iconPosition}
            iconOnly={iconOnly}
            size={size}
            loading={isBusy}
            loadingLabel={loadingLabel}
            loadingIcon={loadingIcon}
          >
            {children}
          </ButtonLinkInner>
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
  delete buttonProps.loading;
  delete buttonProps.loadingLabel;
  delete buttonProps.loadingIcon;
  delete buttonProps.interaction;
  delete buttonProps.children;
  delete buttonProps.title;

  return (
    <span className={wrapperClassName}>
      <ButtonMarker />

      <button
        {...buttonProps}
        disabled={disabled}
        className={mergedClassName}
        aria-label={resolvedAriaLabel}
        aria-busy={loading || buttonProps["aria-busy"] || undefined}
        title={resolvedTitle}
      >
        <ButtonInner
          icon={icon}
          iconPosition={iconPosition}
          iconOnly={iconOnly}
          size={size}
          loading={loading}
          loadingLabel={loadingLabel}
          loadingIcon={loadingIcon}
        >
          {children}
        </ButtonInner>
      </button>
    </span>
  );
}
