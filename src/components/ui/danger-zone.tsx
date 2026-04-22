"use client";

import Card, { CardBody, CardHeader } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type Props = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function DangerZone({
  title = "Danger zone",
  description,
  action,
  children,
  className,
}: Props) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="DangerZone"
          filePath="src/components/ui/danger-zone.tsx"
          tier="container"
          componentRole="Danger and destructive action container"
          bestFor="Archive, delete, deactivate, or other destructive admin actions that need stronger visual separation."
          usageExamples={[
            "Archive course",
            "Archive variant",
            "Delete content block",
            "Deactivate account action",
          ]}
          notes="Use for genuinely destructive or high-risk actions only. Keep copy concise and action labels explicit."
        />
      ) : null}

      <Card className="border-[rgba(194,59,59,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,241,241,0.9)_100%)] shadow-[0_10px_22px_rgba(194,59,59,0.08)]">
        <CardHeader className="border-b-[rgba(194,59,59,0.18)] bg-[linear-gradient(180deg,rgba(194,59,59,0.08)_0%,rgba(194,59,59,0.02)_100%)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="font-semibold text-[var(--danger)]">{title}</div>
              {description ? (
                <p className="mt-1 text-sm app-text-muted">{description}</p>
              ) : null}
            </div>

            {action ? (
              <div className="flex shrink-0 flex-wrap gap-2">{action}</div>
            ) : null}
          </div>
        </CardHeader>

        {children ? (
          <CardBody className="space-y-3 text-sm text-[var(--text-primary)]">
            {children}
          </CardBody>
        ) : null}
      </Card>
    </div>
  );
}
