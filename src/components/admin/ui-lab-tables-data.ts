import type { AppIconKey } from "@/lib/shared/icons";

export const TABLES_PAGE_NAV_ITEMS = [
  { id: "standard-table", label: "Standard" },
  { id: "dense-table", label: "Dense" },
  { id: "row-states", label: "Row states" },
  { id: "hierarchy", label: "Hierarchy" },
  { id: "empty-states", label: "Empty states" },
  { id: "future-components", label: "Future" },
];

export type DemoTableRow = {
  name: string;
  type: string;
  status: "published" | "draft" | "in_progress";
  lessons: string;
  updated: string;
  variant?: "foundation" | "higher" | "volna";
};

export const DEMO_TABLE_ROWS: DemoTableRow[] = [
  {
    name: "GCSE Russian Foundation",
    type: "Course variant",
    status: "published",
    lessons: "24",
    updated: "2 hours ago",
    variant: "foundation",
  },
  {
    name: "Theme 1: Identity and culture",
    type: "Module",
    status: "in_progress",
    lessons: "8",
    updated: "Yesterday",
    variant: "higher",
  },
  {
    name: "School and daily routine",
    type: "Lesson",
    status: "draft",
    lessons: "—",
    updated: "3 days ago",
    variant: "higher",
  },
];

export const TABLE_GUIDANCE_RULES: Array<{
  icon: AppIconKey;
  title: string;
  description: string;
}> = [
  {
    icon: "list",
    title: "Use tables when comparison matters",
    description:
      "Tables work best when users need to scan across repeated columns like status, updated time, variant, or action availability.",
  },
  {
    icon: "layers",
    title: "Use hierarchy lists for structure",
    description:
      "Module → lesson → block structures are often clearer as nested rows than as rigid tables.",
  },
  {
    icon: "filter",
    title: "Pair tables with toolbars",
    description:
      "If search, filtering, or creation is expected, put those controls above the table rather than scattering them around the page.",
  },
  {
    icon: "warning",
    title: "Do not default to dense mode",
    description:
      "Compact layouts are useful, but standard density is usually easier to scan and safer for long-term admin use.",
  },
];

export const TABLES_FUTURE_ITEMS = [
  "Pagination controls for long admin datasets.",
  "SortableHeaderCell for comparison-heavy list screens.",
  "BulkActionBar for selected users, lessons, and vocabulary items.",
  "RowActionMenu for compact edit, duplicate, archive, and delete actions.",
  "ColumnVisibilityControl for dense admin tables.",
  "TableLoadingState for server-rendered and filtered data refreshes.",
];
