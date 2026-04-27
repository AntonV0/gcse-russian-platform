import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";

type TableToolbarProps = {
  children: React.ReactNode;
  className?: string;
};

export default function TableToolbar({ children, className }: TableToolbarProps) {
  return (
    <div className="dev-marker-host relative">
      <DevOnlyComponentMarker
        componentName="TableToolbar"
        filePath="src/components/ui/table-toolbar.tsx"
        tier="semantic"
        componentRole="Table filter and action toolbar"
        bestFor="Search, filters, status selectors, table-level actions, reset controls, and create buttons above tabular data."
        usageExamples={[
          "Search and status filter row",
          "Vocabulary table filters",
          "Admin list toolbar",
          "Create/new item action row",
        ]}
        notes="Use inside TableShell before DataTable. Keep controls compact and grouped; avoid placing unrelated page actions here."
      />

      <div
        className={[
          "min-w-0 border-b border-[var(--border-subtle)] bg-[var(--background-muted)]/45 px-4 py-4 sm:px-5",
          "flex flex-col gap-3",
          "lg:flex-row lg:items-center lg:justify-between",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
