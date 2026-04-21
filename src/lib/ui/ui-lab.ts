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
    description: "Design system summary, usage guidance, and implementation targets.",
    status: "complete",
  },
  {
    href: "/admin/ui/typography",
    label: "Typography",
    description:
      "Page hierarchy, body styles, labels, metadata, and readable text patterns.",
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
    description:
      "Headers, sidebars, breadcrumbs, tabs, and access-aware navigation states.",
    status: "complete",
  },
  {
    href: "/admin/ui/forms",
    label: "Forms",
    description: "Inputs, field groups, validation states, and form layouts.",
    status: "complete",
  },
  {
    href: "/admin/ui/feedback",
    label: "Feedback",
    description: "Badges, banners, alerts, empty states, and status messaging.",
    status: "complete",
  },
  {
    href: "/admin/ui/components",
    label: "Components",
    description:
      "Reusable compositions for admin, student, teacher, and locked-state UI.",
    status: "complete",
  },
  {
    href: "/admin/ui/surfaces",
    label: "Surfaces",
    description: "Cards, panels, containers, and spacing examples.",
    status: "complete",
  },
  {
    href: "/admin/ui/layout",
    label: "Layout",
    description: "Page shells, grids, density patterns, and responsive structure.",
    status: "complete",
  },
  {
    href: "/admin/ui/tables",
    label: "Tables",
    description: "Table layouts, toolbars, row actions, statuses, and empty states.",
    status: "complete",
  },
  {
    href: "/admin/ui/icons",
    label: "Icons",
    description: "Practical icon usage, sizing rules, and the full Lucide browser.",
    status: "complete",
  },
];
