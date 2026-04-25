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
        card: "app-section-tone-brand",
        header: "app-section-header-tone-brand",
      };

    case "student":
      return {
        card: "app-section-tone-student",
        header: "app-section-header-tone-student",
      };

    case "muted":
      return {
        card: "app-section-tone-muted",
        header: "app-section-header-tone-muted",
      };

    case "admin":
      return {
        card: "app-section-tone-admin",
        header: "app-section-header-tone-admin",
      };

    case "default":
    default:
      return {
        card: "app-section-tone-default",
        header: "app-section-header-tone-default",
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
