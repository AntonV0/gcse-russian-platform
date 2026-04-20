"use client";

import Card, { CardBody } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type DashboardCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function DashboardCard({
  title,
  children,
  className,
}: DashboardCardProps) {
  return (
    <Card className={["dev-marker-host", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="DashboardCard"
          filePath="src/components/ui/dashboard-card.tsx"
        />
      ) : null}

      <CardBody>
        {title ? <h2 className="app-card-title">{title}</h2> : null}
        <div className={[title ? "mt-2" : "", "text-sm app-text-muted"].join(" ")}>
          {children}
        </div>
      </CardBody>
    </Card>
  );
}
