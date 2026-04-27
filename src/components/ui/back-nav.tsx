import Button from "@/components/ui/button";
import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";

type BackNavItem = {
  href: string;
  label: string;
};

type BackNavProps = {
  items: BackNavItem[];
  className?: string;
};

export default function BackNav({ items, className }: BackNavProps) {
  if (items.length === 0) return null;

  return (
    <nav
      className={["dev-marker-host relative", className].filter(Boolean).join(" ")}
      aria-label="Back navigation"
    >
      <DevOnlyComponentMarker
        componentName="BackNav"
        filePath="src/components/ui/back-nav.tsx"
        tier="semantic"
        componentRole="Back-navigation action group"
        bestFor="Returning from detail/edit screens to parent admin, course, lesson, or dashboard areas."
        usageExamples={[
          "Back to content",
          "Back to GCSE Russian",
          "Back to module",
          "Back to dashboard",
        ]}
        notes="Use for page-level backwards movement only. Do not use for breadcrumb trails or primary navigation."
      />

      <div className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <Button
            key={`${item.href}-${item.label}`}
            href={item.href}
            variant="quiet"
            icon="back"
          >
            {item.label}
          </Button>
        ))}
      </div>
    </nav>
  );
}
