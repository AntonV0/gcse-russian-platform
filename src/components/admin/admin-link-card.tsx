import type { ReactNode } from "react";
import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import { getButtonClassName } from "@/components/ui/button-styles";
import PanelCard from "@/components/ui/panel-card";

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
    <Link href={href} className="block h-full">
      <PanelCard
        title={title}
        description={description}
        headingLevel={3}
        density="compact"
        className="h-full min-h-[162px] transition-transform duration-200 hover:-translate-y-0.5"
        headerClassName="min-h-[92px]"
        actions={badge}
        footer={
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm app-text-muted">{ctaLabel}</div>
            <span
              aria-hidden="true"
              className={getButtonClassName({
                variant: "quiet",
                size: "sm",
                iconOnly: true,
              })}
            >
              <AppIcon icon="next" size={16} />
            </span>
          </div>
        }
      />
    </Link>
  );
}
