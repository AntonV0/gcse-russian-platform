import type { ReactNode } from "react";
import ActionPill from "@/components/ui/action-pill";
import PanelCard from "@/components/ui/panel-card";
import PendingLinkCard from "@/components/ui/pending-link-card";

export type AdminNavCard = {
  title: string;
  description: string;
  href: string;
  badge?: ReactNode;
  ctaLabel: string;
};

export default function AdminLinkCard({
  title,
  description,
  href,
  badge,
  ctaLabel,
}: AdminNavCard) {
  return (
    <PendingLinkCard
      href={href}
      className="app-focus-ring group block h-full rounded-2xl"
      ariaLabel={ctaLabel}
      pendingLabel="Opening..."
    >
      <PanelCard
        title={title}
        description={description}
        headingLevel={3}
        density="compact"
        className="app-card-interaction-subtle h-full min-h-[162px]"
        headerClassName="min-h-[92px]"
        actions={badge}
        footer={
          <div className="flex items-center gap-3">
            <ActionPill>{ctaLabel}</ActionPill>
          </div>
        }
      />
    </PendingLinkCard>
  );
}
