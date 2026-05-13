"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { useState } from "react";
import type { LinkProps } from "next/link";
import AppIcon from "@/components/ui/app-icon";

type PendingLinkCardProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  pendingLabel?: string;
  prefetch?: LinkProps["prefetch"];
};

function PendingCardOverlay({ label, forcePending = false }: { label: string; forcePending?: boolean }) {
  const { pending } = useLinkStatus();
  const isPending = pending || forcePending;

  if (!isPending) return null;

  return (
    <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] border border-[color-mix(in_srgb,var(--accent-border-ink)_30%,transparent)] bg-[color-mix(in_srgb,var(--background-elevated)_78%,transparent)] backdrop-blur-[2px]">
      <span className="inline-flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--accent-border-ink)_30%,transparent)] bg-[var(--background-elevated)] px-3 py-2 text-sm font-semibold text-[var(--accent-on-soft)] shadow-[0_12px_26px_color-mix(in_srgb,var(--accent-border-ink)_14%,transparent)]">
        <AppIcon icon="sync" size={16} className="animate-spin motion-reduce:animate-none" />
        <span>{label}</span>
      </span>
    </span>
  );
}

function shouldShowNavigationPending(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }

  return href.startsWith("/");
}

export default function PendingLinkCard({
  href,
  children,
  className,
  ariaLabel,
  pendingLabel = "Opening...",
  prefetch,
}: PendingLinkCardProps) {
  const [isClickPending, setIsClickPending] = useState(false);

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={["relative", className].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
      aria-busy={isClickPending || undefined}
      aria-disabled={isClickPending || undefined}
      data-pending={isClickPending ? "" : undefined}
      onClick={(event) => {
        if (isClickPending) {
          event.preventDefault();
          return;
        }

        if (shouldShowNavigationPending(event, href)) {
          setIsClickPending(true);
        }
      }}
    >
      {children}
      <PendingCardOverlay label={pendingLabel} forcePending={isClickPending} />
    </Link>
  );
}
