import ActionPill from "@/components/ui/action-pill";
import AppIcon from "@/components/ui/app-icon";
import PendingLinkCard from "@/components/ui/pending-link-card";
import type { AppIconKey } from "@/lib/shared/icons";

const accountLinks: {
  title: string;
  href: string;
  label: string;
  description: string;
  icon: AppIconKey;
}[] = [
  {
    title: "Profile",
    href: "/profile",
    label: "Open profile",
    description: "Choose the name and avatar you want to see while you study.",
    icon: "user",
  },
  {
    title: "Settings",
    href: "/settings",
    label: "Open settings",
    description: "Pick your theme, colour, and account security settings.",
    icon: "settings",
  },
  {
    title: "Billing",
    href: "/account/billing",
    label: "Open billing",
    description: "Compare Foundation, Higher, and the ways to keep access active.",
    icon: "billing",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    label: "Open dashboard",
    description: "Return to your lessons, progress, assignments, and next steps.",
    icon: "dashboard",
  },
];

export function AccountQuickLinks() {
  return (
    <section className="space-y-3" aria-labelledby="account-quick-links-title">
      <div>
        <h2 id="account-quick-links-title" className="app-heading-section">
          Account quick links
        </h2>
        <p className="mt-1 text-sm app-text-muted">
          Jump to the main account areas without hunting through the dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {accountLinks.map((item) => (
          <PendingLinkCard
            key={item.href}
            href={item.href}
            className="app-card app-card-hover app-card-interaction-subtle group flex min-h-[166px] flex-col justify-between gap-5 p-4 no-underline sm:p-5"
            ariaLabel={item.label}
            pendingLabel="Opening..."
          >
            <span className="flex items-start justify-between gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--accent-ink)]">
                <AppIcon icon={item.icon} size={26} />
              </span>

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised-bg)] text-[var(--text-secondary)] transition group-hover:border-[var(--accent-selected-border)] group-hover:text-[var(--accent-ink)]">
                <AppIcon icon="chevronRight" size={16} />
              </span>
            </span>

            <span>
              <span className="block app-card-title">{item.title}</span>
              <span className="mt-2 block text-sm leading-6 text-[var(--text-secondary)]">
                {item.description}
              </span>
            </span>

            <ActionPill>{item.label}</ActionPill>
          </PendingLinkCard>
        ))}
      </div>
    </section>
  );
}
