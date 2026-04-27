import Badge from "@/components/ui/badge";
import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";

type ActiveStatusBadgeProps = {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
};

export default function ActiveStatusBadge({
  isActive,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  className,
}: ActiveStatusBadgeProps) {
  return (
    <span
      className={["dev-marker-host relative inline-flex", className]
        .filter(Boolean)
        .join(" ")}
    >
      <DevOnlyComponentMarker
        componentName="ActiveStatusBadge"
        filePath="src/components/ui/active-status-badge.tsx"
        tier="semantic"
        componentRole="Semantic active/inactive status badge"
        bestFor="Reusable admin enablement states for users, groups, templates, courses, variants, and grants."
        usageExamples={[
          "Active teaching group",
          "Inactive question",
          "Active course variant",
          "Inactive user access grant",
        ]}
        notes="Use for enablement states. Use PublishStatusBadge for content visibility and release states."
      />

      <Badge
        tone={isActive ? "success" : "warning"}
        icon={isActive ? "active" : "inactive"}
      >
        {isActive ? activeLabel : inactiveLabel}
      </Badge>
    </span>
  );
}
