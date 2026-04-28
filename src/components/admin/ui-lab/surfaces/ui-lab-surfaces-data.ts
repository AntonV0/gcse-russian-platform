import type { AppIconKey } from "@/lib/shared/icons";

export const surfacePageNavItems = [
  { id: "foundations", label: "Foundations" },
  { id: "primitives", label: "Primitives" },
  { id: "card-anatomy", label: "Card anatomy" },
  { id: "tone-density", label: "Tone + density" },
  { id: "semantic-surfaces", label: "Semantic" },
  { id: "dark-surfaces", label: "Dark surfaces" },
  { id: "future-components", label: "Future" },
];

export const surfaceIntentGuides: Array<{
  badge: string;
  badgeTone: "muted" | "info" | "warning" | "danger";
  title: string;
  description: string;
}> = [
  {
    badge: "Low-level",
    badgeTone: "muted",
    title: "Foundational surface",
    description:
      "Use when you only need visual weight control: default, muted, elevated, or branded.",
  },
  {
    badge: "Semantic",
    badgeTone: "info",
    title: "Lesson or practice wrapper",
    description:
      "Use when the container has a repeated product meaning and will appear across multiple pages or variants.",
  },
  {
    badge: "Do later",
    badgeTone: "warning",
    title: "Extract after pattern stabilises",
    description:
      "First prove the pattern inside the UI lab, then move it into a shared component with a dev marker.",
  },
  {
    badge: "Avoid",
    badgeTone: "danger",
    title: "Too many raw surface classes",
    description:
      "Do not create dozens of low-level CSS surfaces for lesson, test, and premium states. Those should become semantic components instead.",
  },
];

export const stackedSummaryCards = [
  {
    id: "visual-weight",
    title: "Summary card",
    description:
      "Repeated cards should stay visually lighter than hero or brand sections.",
  },
  {
    id: "hierarchy",
    title: "Summary card",
    description: "This helps the eye understand hierarchy quickly.",
  },
  {
    id: "scan",
    title: "Summary card",
    description: "Keep these compact and easy to scan.",
  },
];

export const surfaceUsageRules: Array<{
  icon: AppIconKey;
  title: string;
  description: string;
}> = [
  {
    icon: "component",
    title: "Use app-card by default",
    description:
      "Most repeated blocks should start with app-card unless they clearly need a different level of emphasis.",
  },
  {
    icon: "warning",
    title: "Use branded surfaces sparingly",
    description: "Branded surfaces lose impact if they appear too often.",
  },
  {
    icon: "forms",
    title: "Match surface to density",
    description:
      "Dense form or inspector content often benefits from panel-like grouping rather than decorative styling.",
  },
  {
    icon: "idea",
    title: "Prefer hierarchy over effects",
    description:
      "Use spacing, heading structure, and surface choice before adding more visual flair.",
  },
];
