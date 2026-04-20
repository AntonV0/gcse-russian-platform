"use client";

import Card, { CardBody, CardHeader } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type PanelCardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function PanelCard({
  title,
  description,
  children,
  className,
  contentClassName,
}: PanelCardProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PanelCard"
          filePath="src/components/ui/panel-card.tsx"
        />
      ) : null}

      <Card className="app-panel-card overflow-hidden">
        {title || description ? (
          <CardHeader className="app-panel-card-header bg-[linear-gradient(180deg,rgba(37,99,235,0.04)_0%,rgba(37,99,235,0)_100%)]">
            {title ? <h2 className="app-card-title">{title}</h2> : null}
            {description ? <p className="app-card-desc">{description}</p> : null}
          </CardHeader>
        ) : null}

        <CardBody
          className={["app-panel-card-body", contentClassName].filter(Boolean).join(" ")}
        >
          {children}
        </CardBody>
      </Card>
    </div>
  );
}
