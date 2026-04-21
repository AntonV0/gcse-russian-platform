"use client";

import Card, { CardHeader } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type TableShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function TableShell({
  title,
  description,
  children,
  actions,
  className,
}: TableShellProps) {
  return (
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="TableShell"
          filePath="src/components/ui/table-shell.tsx"
        />
      ) : null}

      <Card className={["overflow-hidden", className].filter(Boolean).join(" ")}>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="font-semibold text-[var(--text-primary)]">{title}</div>
              <p className="mt-1 text-sm app-text-muted">{description}</p>
            </div>

            {actions ? (
              <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
            ) : null}
          </div>
        </CardHeader>

        <div>{children}</div>
      </Card>
    </div>
  );
}
