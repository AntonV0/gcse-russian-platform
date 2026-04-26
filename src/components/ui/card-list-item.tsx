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
          <div className="app-heading-card">
            {title}
          </div>

          {subtitle ? (
            <div className="mt-1 app-text-body-muted">
              {subtitle}
            </div>
          ) : null}

          {badges ? <div className="mt-3 flex flex-wrap gap-2">{badges}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default function CardListItem({
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
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="CardListItem"
          filePath="src/components/ui/card-list-item.tsx"
          tier="semantic"
          componentRole="Reusable card-style list row"
          bestFor="Dashboard lists, course/module rows, assignment entries, compact navigation cards, and rows with optional actions."
          usageExamples={[
            "Course overview item",
            "Assignment list row",
            "Recent activity card row",
            "Module or lesson list item",
          ]}
          notes="Use for card-based lists where each item needs title, subtitle, badges, and actions. Use AdminRow for denser admin management rows."
        />
      ) : null}

      <Card
        interactive={Boolean(href)}
        className={["p-4", className].filter(Boolean).join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          {href ? (
            <Link
              href={href}
              className="app-focus-ring -m-2 block min-w-0 flex-1 rounded-xl p-2"
            >
              {content}
            </Link>
          ) : (
            content
          )}

          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </Card>
    </div>
  );
}
