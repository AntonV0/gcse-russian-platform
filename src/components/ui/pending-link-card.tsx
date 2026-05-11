"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
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

function PendingCardOverlay({ label }: { label: string }) {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] border border-[color-mix(in_srgb,var(--accent)_18%,transparent)] bg-[color-mix(in_srgb,var(--background-elevated)_78%,transparent)] backdrop-blur-[2px]">
      <span className="inline-flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--accent)_18%,transparent)] bg-[var(--background-elevated)] px-3 py-2 text-sm font-semibold text-[var(--accent-on-soft)] shadow-[0_12px_26px_color-mix(in_srgb,var(--accent)_12%,transparent)]">
        <AppIcon icon="sync" size={16} className="animate-spin motion-reduce:animate-none" />
        <span>{label}</span>
      </span>
    </span>
  );
}

export default function PendingLinkCard({
  href,
  children,
  className,
  ariaLabel,
  pendingLabel = "Opening...",
  prefetch,
}: PendingLinkCardProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={["relative", className].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
    >
      {children}
      <PendingCardOverlay label={pendingLabel} />
    </Link>
  );
}
