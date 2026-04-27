import type { DevMarkerTier } from "@/components/providers/dev-marker-provider";
import type { MarkerPanelPosition } from "@/components/ui/dev-component-marker-types";

const PANEL_WIDTH = 352;
const PANEL_GAP = 10;
const VIEWPORT_MARGIN = 12;
const ARROW_OFFSET = 18;

export function DevMarkerIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="dev-marker-trigger-icon"
      fill="none"
    >
      <circle cx="8" cy="8" r="2.25" fill="currentColor" />
      <path
        d="M8 1.75V3.1M8 12.9v1.35M14.25 8H12.9M3.1 8H1.75M12.42 3.58l-.95.96M4.53 11.47l-.95.95M12.42 12.42l-.95-.95M4.53 4.53l-.95-.95"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function getTriggerClass(tier: DevMarkerTier, isOpen: boolean) {
  const base = "dev-marker-trigger";
  const stateClass = isOpen ? "dev-marker-trigger-open" : "";

  if (tier === "container") {
    return [base, stateClass, "dev-marker-trigger-container"].filter(Boolean).join(" ");
  }

  if (tier === "layout") {
    return [base, stateClass, "dev-marker-trigger-layout"].filter(Boolean).join(" ");
  }

  if (tier === "semantic") {
    return [base, stateClass, "dev-marker-trigger-semantic"].filter(Boolean).join(" ");
  }

  return [base, stateClass].filter(Boolean).join(" ");
}

export function getPanelClass(tier: DevMarkerTier) {
  if (tier === "container") {
    return ["dev-marker-panel", "dev-marker-panel-container"].join(" ");
  }

  if (tier === "layout") {
    return ["dev-marker-panel", "dev-marker-panel-layout"].join(" ");
  }

  if (tier === "semantic") {
    return ["dev-marker-panel", "dev-marker-panel-semantic"].join(" ");
  }

  return "dev-marker-panel";
}

export function getDefaultRole(componentName: string) {
  const lower = componentName.toLowerCase();

  if (lower.includes("button")) return "Primitive action control";
  if (lower.includes("badge")) return "Primitive status and metadata label";
  if (lower.includes("icon")) return "Primitive icon wrapper";
  if (lower.includes("card")) return "Shared content container";
  if (lower.includes("panel")) return "Section or inspector container";
  if (lower.includes("header")) return "Page or section heading pattern";
  if (lower.includes("empty")) return "Empty-state pattern";
  if (lower.includes("table")) return "Structured data display pattern";
  if (lower.includes("input") || lower.includes("select") || lower.includes("textarea")) {
    return "Form field control";
  }

  return "Shared UI component";
}

export function getTierLabel(tier: DevMarkerTier) {
  switch (tier) {
    case "container":
      return "Shared container";
    case "layout":
      return "Layout pattern";
    case "semantic":
      return "Semantic wrapper";
    case "primitive":
    default:
      return "Shared component";
  }
}

export function getPositionForTrigger(triggerRect: DOMRect): MarkerPanelPosition {
  const panelWidth = Math.min(PANEL_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2);
  const preferredLeft = triggerRect.right - panelWidth;
  const minLeft = VIEWPORT_MARGIN;
  const maxLeft = Math.max(
    VIEWPORT_MARGIN,
    window.innerWidth - panelWidth - VIEWPORT_MARGIN
  );
  const left = Math.min(Math.max(preferredLeft, minLeft), maxLeft);
  const top = Math.min(
    triggerRect.bottom + PANEL_GAP,
    window.innerHeight - VIEWPORT_MARGIN - 120
  );
  const arrowLeft = Math.min(
    Math.max(triggerRect.right - left - ARROW_OFFSET, 18),
    panelWidth - 30
  );

  return { top, left, arrowLeft };
}
