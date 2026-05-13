import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import type { AppIconKey } from "@/lib/shared/icons";
import type { PlatformSidebarNextUp } from "@/lib/dashboard/sidebar-next-up";

export function SidebarHeader({
  eyebrow,
  title,
  subtitle,
  statusIcon,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string | null;
  statusIcon: AppIconKey;
}) {
  return (
    <div className="mb-3 px-2 pt-0.5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {eyebrow}
      </div>
      <h2 className="mt-0.5 text-[1.6rem] font-semibold leading-none text-[var(--text-primary)]">
        {title}
      </h2>
      {subtitle ? (
        <div className="mt-2 inline-flex max-w-full items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent-border-ink)_24%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_4%,var(--background-muted))] px-2.5 py-1 text-xs font-semibold text-[color-mix(in_srgb,var(--accent-border-ink)_40%,var(--text-secondary))] [html[data-theme=dark]_&]:border-[color-mix(in_srgb,var(--accent-border-ink)_42%,var(--dark-surface-border))] [html[data-theme=dark]_&]:text-[color-mix(in_srgb,var(--accent-border-ink)_72%,var(--text-secondary))]">
          <AppIcon
            icon={statusIcon}
            size={13}
            className="shrink-0 text-[var(--accent-on-soft)]"
          />
          <span className="min-w-0 truncate">{subtitle}</span>
        </div>
      ) : null}
      <div className="mt-3 border-t border-[color-mix(in_srgb,var(--accent-border-ink)_16%,var(--border))] [html[data-theme=dark]_&]:border-[color-mix(in_srgb,var(--accent-border-ink)_34%,var(--dark-surface-border))]" />
    </div>
  );
}

export function SidebarNextUpCard({ nextUp }: { nextUp: PlatformSidebarNextUp }) {
  return (
    <Link
      href={nextUp.href}
      className="app-btn-variant-journey app-btn-journey app-focus-ring group relative mb-4 flex overflow-hidden rounded-2xl px-3.5 py-3 text-left transition hover:-translate-y-0.5"
      aria-label={`${nextUp.label}: ${nextUp.title}`}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[color-mix(in_srgb,var(--accent-on-fill)_78%,transparent)]">
          {nextUp.eyebrow}
        </span>
        <span className="mt-1 flex min-w-0 items-center gap-2">
          <span className="min-w-0 truncate text-[0.95rem] font-bold leading-tight text-[var(--accent-on-fill)]">
            {nextUp.title}
          </span>
        </span>
        <span className="mt-1 block truncate text-[11px] font-medium leading-tight text-[color-mix(in_srgb,var(--accent-on-fill)_76%,transparent)]">
          {nextUp.description}
        </span>
      </span>
      <span className="ml-2 mr-0.5 flex shrink-0 scale-x-110 items-center justify-center self-center text-[var(--accent-on-fill)] opacity-95 transition group-hover:translate-x-1 group-hover:opacity-100">
        <AppIcon icon="chevronRight" size={19} strokeWidth={2.8} />
      </span>
    </Link>
  );
}
