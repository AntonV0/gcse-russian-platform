"use client";

import Card, { CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type PanelCardTone = "default" | "admin" | "student" | "brand" | "muted";
type PanelCardDensity = "default" | "compact";

type PanelCardProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  tone?: PanelCardTone;
  density?: PanelCardDensity;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getToneClasses(tone: PanelCardTone) {
  switch (tone) {
    case "brand":
      return {
        card: "border-[color-mix(in_srgb,var(--brand-blue)_18%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-blue)_7%,transparent)_0%,color-mix(in_srgb,var(--background-elevated)_98%,transparent)_48%,color-mix(in_srgb,var(--brand-red)_4%,transparent)_100%)] shadow-[0_16px_34px_color-mix(in_srgb,var(--text-primary)_8%,transparent)]",
        header:
          "border-b-[color-mix(in_srgb,var(--brand-blue)_14%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand-blue)_7%,transparent)_0%,color-mix(in_srgb,var(--brand-blue)_0%,transparent)_100%)]",
      };

    case "student":
      return {
        card: "border-[var(--border-subtle)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-blue)_5%,transparent)_0%,color-mix(in_srgb,var(--background-elevated)_99%,transparent)_56%,color-mix(in_srgb,var(--brand-red)_3%,transparent)_100%)] shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_7%,transparent)]",
        header:
          "border-b-[color-mix(in_srgb,var(--brand-blue)_10%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand-blue)_5%,transparent)_0%,color-mix(in_srgb,var(--brand-blue)_0%,transparent)_100%)]",
      };

    case "muted":
      return {
        card: "border-[var(--border-subtle)] bg-[var(--background-muted)] shadow-[0_10px_22px_color-mix(in_srgb,var(--text-primary)_4%,transparent)]",
        header:
          "border-b-[var(--border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--text-primary)_2%,transparent)_0%,color-mix(in_srgb,var(--text-primary)_0%,transparent)_100%)]",
      };

    case "admin":
      return {
        card: "border-[var(--border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand-blue)_3%,transparent)_0%,var(--background-elevated)_100%)] shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_6%,transparent)]",
        header:
          "border-b-[color-mix(in_srgb,var(--brand-blue)_12%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand-blue)_5%,transparent)_0%,color-mix(in_srgb,var(--brand-blue)_0%,transparent)_100%)]",
      };

    case "default":
    default:
      return {
        card: "",
        header:
          "border-b-[color-mix(in_srgb,var(--brand-blue)_10%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand-blue)_4%,transparent)_0%,color-mix(in_srgb,var(--brand-blue)_0%,transparent)_100%)]",
      };
  }
}

function getDensityClasses(density: PanelCardDensity) {
  switch (density) {
    case "compact":
      return {
        header: "px-4 py-3.5",
        body: "px-4 py-3.5",
        footer: "px-4 py-3.5",
      };

    case "default":
    default:
      return {
        header: "px-5 py-4",
        body: "px-5 py-4",
        footer: "px-5 py-4",
      };
  }
}

export default function PanelCard({
  title,
  description,
  children,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  actions,
  footer,
  tone = "default",
  density = "default",
}: PanelCardProps) {
  const toneClasses = getToneClasses(tone);
  const densityClasses = getDensityClasses(density);
  const hasBody = children !== undefined && children !== null;
  const hasHeader = Boolean(title || description || actions);

  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PanelCard"
          filePath="src/components/ui/panel-card.tsx"
          tier="container"
          componentRole="Structured support panel with optional header, body, actions, and footer"
          bestFor="Side panels, inspector panels, settings groups, metadata panels, and secondary support sections."
          usageExamples={[
            "Lesson builder inspector",
            "Admin settings panel",
            "Course metadata side panel",
            "Student guidance/support panel",
          ]}
          notes="Use PanelCard for supporting or utility content. Use SectionCard for primary page sections and Card for neutral low-level containers."
        />
      ) : null}

      <Card
        className={["app-panel-card rounded-2xl", toneClasses.card]
          .filter(Boolean)
          .join(" ")}
      >
        {hasHeader ? (
          <CardHeader
            className={[
              "app-panel-card-header",
              densityClasses.header,
              toneClasses.header,
              headerClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 space-y-1">
                {title ? <h2 className="app-card-title">{title}</h2> : null}
                {description ? <p className="app-card-desc">{description}</p> : null}
              </div>

              {actions ? (
                <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
                  {actions}
                </div>
              ) : null}
            </div>
          </CardHeader>
        ) : null}

        {hasBody ? (
          <CardBody
            className={["app-panel-card-body", densityClasses.body, contentClassName]
              .filter(Boolean)
              .join(" ")}
          >
            {children}
          </CardBody>
        ) : null}

        {footer ? (
          <CardFooter
            className={[
              hasBody ? "" : "border-t-0",
              "app-panel-card-footer",
              densityClasses.footer,
              footerClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {footer}
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}
