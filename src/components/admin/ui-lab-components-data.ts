import type { AppLogoVariant } from "@/components/ui/app-logo";

export const COMPONENTS_PAGE_NAV_ITEMS = [
  { id: "inspection", label: "Inspection" },
  { id: "brand-logo", label: "Logo" },
  { id: "intro-panels", label: "Intro panels" },
  { id: "headers", label: "Headers" },
  { id: "stats", label: "Stats" },
  { id: "panels", label: "Panels" },
  { id: "lists", label: "Lists" },
  { id: "forms", label: "Forms" },
  { id: "future-components", label: "Future" },
];

export const COMPONENT_LOGO_DIRECTIONS: Array<{
  variant: AppLogoVariant;
  title: string;
  description: string;
  bestFor: string;
}> = [
  {
    variant: "full",
    title: "Platform lockup",
    description: "Primary app and marketing lockup using the approved learner mark.",
    bestFor: "Best for headers, sidebars, footers, and compact platform chrome.",
  },
  {
    variant: "domain",
    title: "Domain lockup",
    description: "GCSERussian.com lockup with the full-width speech-tail underline.",
    bestFor: "Best for marketing placements, social graphics, and domain-led material.",
  },
  {
    variant: "icon",
    title: "Favicon mark",
    description: "Icon-only learner mark exported for browser tabs and app icons.",
    bestFor: "Best for favicons, small mobile contexts, and future app shortcuts.",
  },
];

export const COMPONENTS_FUTURE_ITEMS = [
  "ActivityItem for dashboard history and recent admin work.",
  "ProgressCard for student module and lesson completion summaries.",
  "ReviewQueueCard for teacher submissions and marking workflows.",
  "SettingsPanel for account and admin configuration screens.",
  "MetadataGrid for dense details without ad-hoc rows.",
  "Timeline for future progress, audit, and feedback history.",
];
