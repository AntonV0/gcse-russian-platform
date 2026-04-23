"use client";

import Card, { CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type SectionCardTone = "default" | "admin" | "student" | "brand" | "muted";
type SectionCardDensity = "default" | "compact";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  tone?: SectionCardTone;
  density?: SectionCardDensity;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getToneClasses(tone: SectionCardTone) {
  switch (tone) {
    case "brand":
      return {
        card: "border-[rgba(37,99,235,0.18)] bg-[linear-gradient(135deg,rgba(37,99,235,0.07)_0%,rgba(255,255,255,0.985)_48%,rgba(217,75,82,0.04)_100%)] shadow-[0_16px_34px_rgba(16,32,51,0.08)]",
        header:
          "border-b-[rgba(37,99,235,0.14)] bg-[linear-gradient(180deg,rgba(37,99,235,0.07)_0%,rgba(37,99,235,0)_100%)]",
      };

    case "student":
      return {
        card: "border-[var(--border-subtle)] bg-[linear-gradient(135deg,rgba(37,99,235,0.05)_0%,rgba(255,255,255,0.99)_56%,rgba(217,75,82,0.03)_100%)] shadow-[0_14px_30px_rgba(16,32,51,0.07)]",
        header:
          "border-b-[rgba(37,99,235,0.10)] bg-[linear-gradient(180deg,rgba(37,99,235,0.05)_0%,rgba(37,99,235,0)_100%)]",
      };

    case "muted":
      return {
        card: "border-[var(--border-subtle)] bg-[var(--background-muted)] shadow-[0_10px_22px_rgba(16,32,51,0.04)]",
        header:
          "border-b-[var(--border-subtle)] bg-[linear-gradient(180deg,rgba(16,32,51,0.02)_0%,rgba(16,32,51,0)_100%)]",
      };

    case "admin":
      return {
        card: "border-[var(--border-subtle)] bg-[linear-gradient(180deg,rgba(37,99,235,0.035)_0%,var(--background-elevated)_100%)] shadow-[0_14px_30px_rgba(16,32,51,0.06)]",
        header:
          "border-b-[rgba(37,99,235,0.12)] bg-[linear-gradient(180deg,rgba(37,99,235,0.05)_0%,rgba(37,99,235,0)_100%)]",
      };

    case "default":
    default:
      return {
        card: "shadow-[0_12px_26px_rgba(16,32,51,0.05)]",
        header:
          "border-b-[rgba(37,99,235,0.10)] bg-[linear-gradient(180deg,rgba(37,99,235,0.04)_0%,rgba(37,99,235,0)_100%)]",
      };
  }
}

function getDensityClasses(density: SectionCardDensity) {
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
        header: "px-5 py-4.5",
        body: "px-5 py-4.5",
        footer: "px-5 py-4",
      };
  }
}

export default function SectionCard({
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
  ...divProps
}: Props) {
  const toneClasses = getToneClasses(tone);
  const densityClasses = getDensityClasses(density);
  const hasBody = children !== undefined && children !== null;

  return (
    <div
      {...divProps}
      className={["dev-marker-host relative", className].filter(Boolean).join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="SectionCard"
          filePath="src/components/ui/section-card.tsx"
          tier="container"
          componentRole="Primary page section container with header, body, actions, and optional footer"
          bestFor="Main content sections, large grouped page areas, admin management blocks, and primary reusable content wrappers."
          usageExamples={[
            "Course management section",
            "Pricing plan comparison area",
            "Dashboard content section",
            "Large form or table section",
          ]}
          notes="Use SectionCard for primary page content. Use PanelCard for secondary/support panels and Card for neutral low-level containers."
        />
      ) : null}

      <Card
        className={["app-section-card overflow-hidden rounded-2xl", toneClasses.card]
          .filter(Boolean)
          .join(" ")}
      >
        <CardHeader
          className={[
            "app-section-card-header",
            densityClasses.header,
            toneClasses.header,
            headerClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 space-y-1">
              <h2 className="app-card-title">{title}</h2>
              {description ? <p className="app-card-desc">{description}</p> : null}
            </div>

            {actions ? (
              <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
                {actions}
              </div>
            ) : null}
          </div>
        </CardHeader>

        {hasBody ? (
          <CardBody
            className={["app-section-card-body", densityClasses.body, contentClassName]
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
              "app-section-card-footer",
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
