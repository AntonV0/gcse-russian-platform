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
          tier="container"
          componentRole="Table container with header and actions"
          bestFor="Admin data sections, searchable management tables, vocabulary/grammar tables, billing tables, and structured table panels."
          usageExamples={[
            "Student management table",
            "Vocabulary table wrapper",
            "Course content table",
            "Billing subscription list",
          ]}
          notes="Use with DataTable and optional TableToolbar. Avoid for simple card lists where columns do not add value."
        />
      ) : null}

      <Card className={["overflow-hidden", className].filter(Boolean).join(" ")}>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="font-semibold text-[var(--text-primary)]">{title}</div>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                {description}
              </p>
            </div>

            {actions ? (
              <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                {actions}
              </div>
            ) : null}
          </div>
        </CardHeader>

        <div>{children}</div>
      </Card>
    </div>
  );
}
