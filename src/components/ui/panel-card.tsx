import Card, { CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

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
  headingLevel?: HeadingLevel;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getToneClasses(tone: PanelCardTone) {
  switch (tone) {
    case "brand":
      return {
        card: "app-panel-tone-brand",
        header: "app-panel-header-tone-brand",
      };

    case "student":
      return {
        card: "app-panel-tone-student",
        header: "app-panel-header-tone-student",
      };

    case "muted":
      return {
        card: "app-panel-tone-muted",
        header: "app-panel-header-tone-muted",
      };

    case "admin":
      return {
        card: "app-panel-tone-admin",
        header: "app-panel-header-tone-admin",
      };

    case "default":
    default:
      return {
        card: "app-panel-tone-default",
        header: "app-panel-header-tone-default",
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
  headingLevel = 2,
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
                {title ? (
                  <Heading level={headingLevel} className="app-card-title">
                    {title}
                  </Heading>
                ) : null}
                {description ? <p className="app-card-desc">{description}</p> : null}
              </div>

              {actions ? (
                <div className="app-mobile-action-stack flex shrink-0 flex-wrap gap-2 md:justify-end">
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
