import DevComponentMarker from "@/components/ui/dev-component-marker";

type SurfaceVariant = "default" | "muted" | "brand";
type SurfacePadding = "none" | "md" | "lg";

type SurfaceProps = {
  children: React.ReactNode;
  variant?: SurfaceVariant;
  padding?: SurfacePadding;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getVariantClass(variant: SurfaceVariant) {
  switch (variant) {
    case "muted":
      return "app-surface-muted";
    case "brand":
      return "app-surface-brand";
    case "default":
    default:
      return "app-surface";
  }
}

function getPaddingClass(padding: SurfacePadding) {
  switch (padding) {
    case "none":
      return "";
    case "lg":
      return "app-section-padding-lg";
    case "md":
    default:
      return "app-section-padding";
  }
}

export default function Surface({
  children,
  variant = "default",
  padding = "md",
  className,
}: SurfaceProps) {
  return (
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="Surface"
          filePath="src/components/ui/surface.tsx"
          tier="layout"
          componentRole="Page or section background surface"
          bestFor="Top-level layout zones, muted page bands, brand-tinted sections, and page composition wrappers."
          usageExamples={[
            "Pricing page background section",
            "Dashboard content zone",
            "Muted admin workspace area",
            "Student-facing brand surface",
          ]}
          notes="Surface should wrap areas, not individual content cards. Use Card, SectionCard, or PanelCard inside it for contained content."
        />
      ) : null}

      <div
        className={[getVariantClass(variant), getPaddingClass(padding), className]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
