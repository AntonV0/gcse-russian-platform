"use client";

import DevComponentMarker from "@/components/ui/dev-component-marker";

type AdminRowProps = {
  title: string;
  description?: string;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  state?: "default" | "hover" | "selected" | "disabled";
  nested?: boolean;
  compact?: boolean;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getStateClass(state: NonNullable<AdminRowProps["state"]>) {
  switch (state) {
    case "hover":
      return "border-[var(--border-strong)] bg-[var(--background-muted)] shadow-[0_10px_20px_color-mix(in_srgb,var(--text-primary)_6%,transparent)]";

    case "selected":
      return "app-selected-surface";

    case "disabled":
      return "border-[var(--border-subtle)] bg-[var(--background-muted)] opacity-60";

    case "default":
    default:
      return "border-[var(--border-subtle)] bg-[var(--background-elevated)]";
  }
}

export default function AdminRow({
  title,
  description,
  badges,
  actions,
  className,
  state = "default",
  nested = false,
  compact = false,
}: AdminRowProps) {
  return (
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="AdminRow"
          filePath="src/components/ui/admin-row.tsx"
          tier="semantic"
          componentRole="Dense admin management row"
          bestFor="Admin tables, draggable lists, nested lesson/module rows, CMS management lists, and rows with inline status/actions."
          usageExamples={[
            "Course variant row",
            "Lesson builder section row",
            "Question set admin row",
            "Nested module or block row",
          ]}
          notes="Use for admin/CMS rows where scanning and actions matter. Use CardListItem for more spacious student-facing or dashboard list items."
        />
      ) : null}

      <div
        className={[
          "relative overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow,opacity]",
          compact ? "px-3 py-2.5" : "px-4 py-3",
          nested ? "rounded-xl" : "",
          getStateClass(state),
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold leading-6 text-[var(--text-primary)]">
              {title}
            </div>

            {description ? (
              <div className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                {description}
              </div>
            ) : null}
          </div>

          {badges || actions ? (
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              {badges}
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
