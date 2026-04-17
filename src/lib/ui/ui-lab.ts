export type UiLabStatus = "complete" | "in_progress" | "planned";

export type UiLabPage = {
  href: string;
  label: string;
  description: string;
  status: UiLabStatus;
};

export const uiLabPages: UiLabPage[] = [
  {
    href: "/admin/ui",
    label: "Overview",
    description: "Design system summary and progress snapshot.",
    status: "in_progress",
  },
  {
    href: "/admin/ui/typography",
    label: "Typography",
    description: "Headings, body styles, labels, and text hierarchy.",
    status: "complete",
  },
  {
    href: "/admin/ui/buttons",
    label: "Buttons",
    description: "Variants, sizes, icon buttons, and action patterns.",
    status: "complete",
  },
  {
    href: "/admin/ui/navigation",
    label: "Navigation",
    description: "Headers, sidebars, back-nav, and navigation states.",
    status: "in_progress",
  },
  {
    href: "/admin/ui/forms",
    label: "Forms",
    description: "Inputs, field groups, validation states, and form layouts.",
    status: "in_progress",
  },
  {
    href: "/admin/ui/feedback",
    label: "Feedback",
    description: "Badges, banners, alerts, empty states, and status messaging.",
    status: "in_progress",
  },
  {
    href: "/admin/ui/components",
    label: "Components",
    description: "Badges, cards, forms, and reusable UI blocks.",
    status: "in_progress",
  },
  {
    href: "/admin/ui/surfaces",
    label: "Surfaces",
    description: "Cards, panels, containers, and spacing examples.",
    status: "in_progress",
  },
  {
    href: "/admin/ui/layout",
    label: "Layout",
    description: "Containers, grids, stacking patterns, and responsive page structure.",
    status: "in_progress",
  },
  {
    href: "/admin/ui/tables",
    label: "Tables",
    description: "Table layouts, toolbars, row actions, statuses, and empty states.",
    status: "in_progress",
  },
  {
    href: "/admin/ui/icons",
    label: "Icons",
    description: "Curated app icons and full Lucide browser.",
    status: "complete",
  },
];
