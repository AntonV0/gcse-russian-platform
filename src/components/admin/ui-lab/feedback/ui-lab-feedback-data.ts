export const FEEDBACK_PAGE_NAV_ITEMS = [
  { id: "badges", label: "Badges" },
  { id: "status-badges", label: "Status badges" },
  { id: "banners", label: "Banners" },
  { id: "admin-feedback", label: "Admin feedback" },
  { id: "question-feedback", label: "Question feedback" },
  { id: "empty-states", label: "Empty states" },
  { id: "future-components", label: "Future" },
];

export const STATUS_BADGE_EXAMPLES: Array<{
  title: string;
  status: "not_started" | "submitted" | "reviewed" | "returned";
  description: string;
}> = [
  {
    title: "Not started",
    status: "not_started",
    description: "Default state before work begins.",
  },
  {
    title: "Submitted",
    status: "submitted",
    description: "Use for work waiting on review.",
  },
  {
    title: "Reviewed",
    status: "reviewed",
    description: "Use when a marking workflow is done.",
  },
  {
    title: "Returned",
    status: "returned",
    description: "Use when feedback has gone back to the student.",
  },
];

export const FEEDBACK_GUIDANCE_ITEMS = [
  {
    title: "Prefer badges for compact state",
    description:
      "Use badges inside cards, tables, and list items where space is limited.",
  },
  {
    title: "Use banners for page-level messaging",
    description:
      "Save results, warnings, and important guidance should be easier to notice than a badge.",
  },
  {
    title: "Empty states need a next action",
    description: "Avoid dead ends. Give users a clear first step wherever possible.",
  },
  {
    title: "Reserve danger for real blockers",
    description:
      "Overusing destructive colour weakens hierarchy and makes interfaces feel noisy.",
  },
];

export const FEEDBACK_FUTURE_ITEMS = [
  "Toast notifications for transient save and copy events.",
  "ConfirmDialog for destructive actions with richer context.",
  "InlineValidationSummary for long admin forms.",
  "LoadingState and Skeleton patterns for async lists and dashboards.",
  "ProgressAlert for unlock, completion, and next-step learning moments.",
  "ReviewOutcomeBanner for teacher marking and returned-work flows.",
];
