import Card, { CardHeader } from "@/components/ui/card";
import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

type TableShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  headingLevel?: HeadingLevel;
  className?: string;
};

export default function TableShell({
  title,
  description,
  children,
  actions,
  headingLevel = 2,
  className,
}: TableShellProps) {
  return (
    <div className="dev-marker-host relative">
      <DevOnlyComponentMarker
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

      <Card className={["overflow-hidden", className].filter(Boolean).join(" ")}>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <Heading level={headingLevel} className="app-heading-card">
                {title}
              </Heading>
              <p className="mt-1 app-text-body-muted">{description}</p>
            </div>

            {actions ? (
              <div className="app-mobile-action-stack flex shrink-0 flex-wrap gap-2 lg:justify-end">
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
