"use client";

import Card, { CardBody, CardHeader } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

type DangerZoneProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  headingLevel?: HeadingLevel;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function DangerZone({
  title = "Danger zone",
  description,
  action,
  children,
  headingLevel = 2,
  className,
}: DangerZoneProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="DangerZone"
          filePath="src/components/ui/danger-zone.tsx"
          tier="container"
          componentRole="Danger and destructive action container"
          bestFor="Archive, delete, deactivate, reset, or other high-risk admin actions that need strong visual separation."
          usageExamples={[
            "Archive course",
            "Delete content block",
            "Deactivate account",
            "Reset lesson progress",
          ]}
          notes="Use only for genuinely destructive or difficult-to-reverse actions. Keep copy short and action labels explicit."
        />
      ) : null}

      <Card className="border-[color-mix(in_srgb,var(--danger)_22%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background-elevated)_98%,transparent)_0%,color-mix(in_srgb,var(--danger-soft)_90%,transparent)_100%)] shadow-[0_10px_22px_color-mix(in_srgb,var(--danger)_8%,transparent)]">
        <CardHeader className="border-b-[color-mix(in_srgb,var(--danger)_18%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--danger)_8%,transparent)_0%,color-mix(in_srgb,var(--danger)_2%,transparent)_100%)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <Heading level={headingLevel} className="app-heading-card text-[var(--danger)]">
                {title}
              </Heading>
              {description ? (
                <p className="mt-1 app-text-body-muted">
                  {description}
                </p>
              ) : null}
            </div>

            {action ? (
              <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">{action}</div>
            ) : null}
          </div>
        </CardHeader>

        {children ? (
          <CardBody className="space-y-3 app-text-body">
            {children}
          </CardBody>
        ) : null}
      </Card>
    </div>
  );
}
