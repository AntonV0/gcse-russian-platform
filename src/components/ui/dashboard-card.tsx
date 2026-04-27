import Card, { CardBody } from "@/components/ui/card";
import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

type DashboardCardProps = {
  title?: string;
  children: React.ReactNode;
  headingLevel?: HeadingLevel;
  className?: string;
};

export default function DashboardCard({
  title,
  children,
  headingLevel = 2,
  className,
}: DashboardCardProps) {
  return (
    <div className="dev-marker-host relative">
      <DevOnlyComponentMarker
        componentName="DashboardCard"
        filePath="src/components/ui/dashboard-card.tsx"
        tier="semantic"
        componentRole="Compact dashboard content card"
        bestFor="Small dashboard widgets, short summaries, progress snippets, and lightweight grouped dashboard content."
        usageExamples={[
          "Recent activity card",
          "Quick progress summary",
          "Student next-step card",
          "Compact admin dashboard widget",
        ]}
        notes="Use DashboardCard for compact dashboard blocks. Use SectionCard for larger sections and PanelCard for structured support panels."
      />

      <Card
        className={[
          "app-dashboard-card rounded-2xl border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[0_10px_22px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <CardBody className="px-4 py-4 sm:px-5">
          {title ? (
            <Heading level={headingLevel} className="app-card-title">
              {title}
            </Heading>
          ) : null}
          <div className={[title ? "mt-2.5" : "", "text-sm app-text-muted"].join(" ")}>
            {children}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
