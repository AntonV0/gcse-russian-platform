"use client";

import Link from "next/link";
import Card from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type CardListItemProps = {
  title: string;
  subtitle?: string;
  badges?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  href?: string;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function CardListItemContent({
  title,
  subtitle,
  badges,
  icon,
}: Pick<CardListItemProps, "title" | "subtitle" | "badges" | "icon">) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-start gap-3">
        {icon ? <div className="mt-0.5 shrink-0">{icon}</div> : null}

        <div className="min-w-0">
          <div className="font-medium text-[var(--text-primary)]">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-sm app-text-muted">{subtitle}</div>
          ) : null}
          {badges ? <div className="mt-3 flex flex-wrap gap-2">{badges}</div> : null}
        </div>
      </div>
    </div>
  );
}

function CardListItemInner({
  title,
  subtitle,
  badges,
  icon,
  actions,
  href,
  className,
}: CardListItemProps) {
  const content = (
    <CardListItemContent title={title} subtitle={subtitle} badges={badges} icon={icon} />
  );

  return (
    <Card
      interactive={Boolean(href)}
      className={["dev-marker-host", "p-4", className].filter(Boolean).join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="CardListItem"
          filePath="src/components/ui/card-list-item.tsx"
        />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        {href ? (
          <Link href={href} className="block min-w-0 flex-1">
            {content}
          </Link>
        ) : (
          content
        )}

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </Card>
  );
}

export default function CardListItem(props: CardListItemProps) {
  return <CardListItemInner {...props} />;
}
