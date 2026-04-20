"use client";

import Card, { CardBody, CardHeader } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function SectionCard({
  title,
  description,
  children,
  className,
  contentClassName,
}: Props) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="SectionCard"
          filePath="src/components/ui/section-card.tsx"
        />
      ) : null}

      <Card className="app-section-card overflow-hidden">
        <CardHeader className="app-section-card-header">
          <h2 className="app-card-title">{title}</h2>
          {description ? <p className="app-card-desc">{description}</p> : null}
        </CardHeader>

        <CardBody
          className={["app-section-card-body", contentClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </CardBody>
      </Card>
    </div>
  );
}
