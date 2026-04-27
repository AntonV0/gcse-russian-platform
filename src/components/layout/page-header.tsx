import DevComponentMarker from "@/components/ui/dev-component-marker";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

type PageHeaderProps = {
  title: string;
  description?: string;
  headingLevel?: HeadingLevel;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function PageHeader({
  title,
  description,
  headingLevel = 1,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={["dev-marker-host relative app-header-block mb-8 space-y-2", className]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PageHeader"
          filePath="src/components/layout/page-header.tsx"
          tier="semantic"
          componentRole="Simple page heading block"
          bestFor="Pages that need a straightforward title and optional description without a full hero panel."
          usageExamples={[
            "Account page header",
            "Settings page header",
            "Admin list page title",
            "Simple student page heading",
          ]}
          notes="Use PageIntroPanel instead when the page needs stronger visual presence, actions, badges, or premium context."
        />
      ) : null}

      <Heading level={headingLevel} className="app-title">
        {title}
      </Heading>
      {description ? <p className="max-w-3xl app-text-lede">{description}</p> : null}
    </div>
  );
}
