import DevComponentMarker from "@/components/ui/dev-component-marker";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

type PageIntroPanelTone = "admin" | "student" | "brand" | "neutral";

type PageIntroPanelProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  visual?: React.ReactNode;
  children?: React.ReactNode;
  tone?: PageIntroPanelTone;
  headingLevel?: HeadingLevel;
  className?: string;
  contentClassName?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getToneClass(tone: PageIntroPanelTone) {
  switch (tone) {
    case "brand":
      return "app-intro-panel app-intro-panel-brand";

    case "student":
      return "app-intro-panel app-intro-panel-student";

    case "neutral":
      return "app-intro-panel app-intro-panel-neutral";

    case "admin":
    default:
      return "app-intro-panel app-intro-panel-admin";
  }
}

export default function PageIntroPanel({
  title,
  description,
  eyebrow,
  badges,
  actions,
  visual,
  children,
  tone = "admin",
  headingLevel = 1,
  className,
  contentClassName,
}: PageIntroPanelProps) {
  const headerContent = (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <div className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] app-text-soft">
            {eyebrow}
          </div>
        ) : null}

        <Heading
          level={headingLevel}
          className={eyebrow ? "mt-2.5 app-title" : "app-title"}
        >
          {title}
        </Heading>

        {description ? (
          <p className="mt-3 max-w-3xl app-text-lede">{description}</p>
        ) : null}

        {badges ? <div className="mt-4 flex flex-wrap gap-2">{badges}</div> : null}
      </div>

      {actions ? (
        <div className="app-mobile-action-stack flex shrink-0 flex-col gap-2.5 sm:flex-row sm:flex-wrap xl:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  );

  const supportingContent = children ? <div className="mt-5">{children}</div> : null;

  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PageIntroPanel"
          filePath="src/components/ui/page-intro-panel.tsx"
          tier="container"
          componentRole="Premium top-of-page context panel"
          bestFor="Important page introductions that need title, explanation, badges, actions, optional visuals, and supporting content."
          usageExamples={[
            "Student dashboard intro",
            "Admin overview header",
            "Course landing context panel",
            "Upgrade or access explanation panel",
          ]}
          notes="Use this when a page needs more presence than PageHeader. Keep visuals restrained and meaningful; avoid using it repeatedly on the same page or for small subsections."
        />
      ) : null}

      <section
        className={[
          "overflow-hidden px-5 py-5 md:px-6 md:py-6",
          getToneClass(tone),
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {visual ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(220px,320px)] xl:items-start">
            <div className="min-w-0">
              {headerContent}
              {supportingContent}
            </div>

            <div className="flex justify-center xl:justify-end">{visual}</div>
          </div>
        ) : (
          <>
            {headerContent}
            {supportingContent}
          </>
        )}
      </section>
    </div>
  );
}
