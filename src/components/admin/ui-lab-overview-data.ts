import type { AppIconKey } from "@/lib/shared/icons";

export function getUiLabStatusTone(status: "complete" | "in_progress" | "planned") {
  switch (status) {
    case "complete":
      return "success" as const;
    case "in_progress":
      return "warning" as const;
    case "planned":
    default:
      return "muted" as const;
  }
}

export function getUiLabStatusLabel(status: "complete" | "in_progress" | "planned") {
  switch (status) {
    case "complete":
      return "Complete";
    case "in_progress":
      return "In progress";
    case "planned":
    default:
      return "Planned";
  }
}

type ProductionPattern = {
  title: string;
  description: string;
  icon: AppIconKey;
};

export const productionPatterns: ProductionPattern[] = [
  {
    title: "Homepage and public-facing direction",
    description:
      "Premium brand presentation, clear hero hierarchy, and parent-friendly structure for first impressions.",
    icon: "home",
  },
  {
    title: "Platform shell and navigation",
    description:
      "Shared top-level navigation, sidebar direction, and access-aware movement across student, admin, and teacher areas.",
    icon: "navigation",
  },
  {
    title: "Shared UI primitives",
    description:
      "Buttons, badges, cards, typography, forms, and icon usage now shape most pages before page-specific styling is added.",
    icon: "component",
  },
  {
    title: "Content and dashboard composition",
    description:
      "Structured cards, sections, summaries, and denser admin layouts are beginning to feel like one cohesive product.",
    icon: "layout",
  },
];

export const refinementAreas = [
  "Validation and inline field errors",
  "Toast-style feedback patterns",
  "Dense inspector and builder controls",
  "Dashboard-specific card patterns",
  "Lesson block visual consistency",
  "Mobile navigation refinement",
];

export const designPrinciples = [
  "Premium and modern without feeling cold",
  "Readable for students aged 12-16 and reassuring for parents",
  "Consistent hierarchy before decorative styling",
  "Shared components first, page-specific styling second",
  "Use restrained branding and clear content structure",
  "Support admin density and student calmness within one system",
];

export const UI_LAB_OVERVIEW_NAV_ITEMS = [
  { id: "system-overview", label: "Overview" },
  { id: "sections", label: "Sections" },
  { id: "audience-fit", label: "Audience fit" },
  { id: "coverage", label: "Coverage" },
  { id: "consistency-next", label: "Consistency" },
  { id: "principles", label: "Principles" },
  { id: "future-components", label: "Future" },
];

export const audienceFit = [
  {
    title: "Students aged 12-16",
    badge: "Primary",
    tone: "info" as const,
    description:
      "Use confident, friendly examples with clear next steps, visible progress, and enough energy to feel motivating without becoming childish.",
    checks: ["Short labels", "Recognisable GCSE content", "Encouraging progression"],
  },
  {
    title: "Parents and guardians",
    badge: "Important",
    tone: "success" as const,
    description:
      "Surfaces should feel trustworthy, polished, and worth paying for. Avoid clutter, vague copy, or playful styling that weakens confidence.",
    checks: ["Premium restraint", "Clear value", "Stable hierarchy"],
  },
  {
    title: "Adult learners",
    badge: "Secondary",
    tone: "muted" as const,
    description:
      "Keep the system mature enough for older learners by using readable typography, practical task language, and calm support panels.",
    checks: ["Readable rhythm", "Practical examples", "No teen-only slang"],
  },
] as const;

export function getAudiencePanelTone(tone: (typeof audienceFit)[number]["tone"]) {
  if (tone === "info") return "student" as const;
  if (tone === "success") return "brand" as const;
  return "muted" as const;
}
