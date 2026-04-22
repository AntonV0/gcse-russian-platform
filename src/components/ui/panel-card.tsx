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
        card: "border-[rgba(37,99,235,0.16)] bg-[linear-gradient(135deg,rgba(37,99,235,0.06)_0%,rgba(255,255,255,0.98)_45%,rgba(217,75,82,0.04)_100%)] shadow-[0_14px_32px_rgba(16,32,51,0.08)]",
        header:
          "border-b-[rgba(37,99,235,0.14)] bg-[linear-gradient(180deg,rgba(37,99,235,0.06)_0%,rgba(37,99,235,0)_100%)]",
      };

    case "student":
      return {
        card: "border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.04)_0%,rgba(255,255,255,0.99)_55%,rgba(217,75,82,0.03)_100%)] shadow-[0_12px_28px_rgba(16,32,51,0.07)]",
        header:
          "border-b-[rgba(37,99,235,0.10)] bg-[linear-gradient(180deg,rgba(37,99,235,0.04)_0%,rgba(37,99,235,0)_100%)]",
      };

    case "muted":
      return {
        card: "border-[var(--border)] bg-[var(--background-muted)] shadow-[0_10px_22px_rgba(16,32,51,0.04)]",
        header:
          "border-b-[var(--border)] bg-[linear-gradient(180deg,rgba(16,32,51,0.02)_0%,rgba(16,32,51,0)_100%)]",
      };

    case "admin":
      return {
        card: "border-[var(--border)] bg-[linear-gradient(180deg,rgba(37,99,235,0.03)_0%,var(--background-elevated)_100%)] shadow-[0_12px_28px_rgba(16,32,51,0.06)]",
        header:
          "border-b-[rgba(37,99,235,0.12)] bg-[linear-gradient(180deg,rgba(37,99,235,0.05)_0%,rgba(37,99,235,0)_100%)]",
      };

    case "default":
    default:
      return {
        card: "",
        header:
          "border-b-[rgba(37,99,235,0.10)] bg-[linear-gradient(180deg,rgba(37,99,235,0.04)_0%,rgba(37,99,235,0)_100%)]",
      };
  }
}

function getDensityClasses(density: PanelCardDensity) {
  switch (density) {
    case "compact":
      return {
        header: "px-4 py-3.5",
        body: "p-4",
        footer: "px-4 py-3.5",
      };

    case "default":
    default:
      return {
        header: "px-5 py-4",
        body: "p-5",
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

  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PanelCard"
          filePath="src/components/ui/panel-card.tsx"
          tier="container"
          componentRole="Premium section and inspector container"
          bestFor="Admin edit sections, side inspectors, metadata panels, grouped settings, and softer student support sections."
          usageExamples={[
            "Lesson builder inspector",
            "Admin settings sections",
            "Course detail side panels",
            "Student guidance/support panels",
          ]}
          notes="Use footer for action rows or link rows. When there is no body content, the footer automatically avoids creating a double divider."
        />
      ) : null}

      <Card
        className={["app-panel-card overflow-hidden", toneClasses.card]
          .filter(Boolean)
          .join(" ")}
      >
        {title || description || actions ? (
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
              <div className="min-w-0">
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
              hasBody ? "border-t border-[var(--border)]" : "",
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
