import DevComponentMarker from "@/components/ui/dev-component-marker";

type DataTableProps = {
  children: React.ReactNode;
  className?: string;
};

type DataTableSectionProps = {
  children: React.ReactNode;
  className?: string;
};

type DataTableRowProps = {
  children: React.ReactNode;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="DataTable"
          filePath="src/components/ui/data-table.tsx"
          tier="semantic"
          componentRole="Reusable structured table primitive"
          bestFor="Admin tables, filtered lists, billing records, course/content inventories, and scan-heavy tabular data."
          usageExamples={[
            "Course/module/lesson table",
            "Student access table",
            "Billing records table",
            "Vocabulary or grammar data table",
          ]}
          notes="Use when columns matter and users need to compare rows. For nested relationships or row-heavy admin lists, consider AdminRow or CardListItem instead."
        />
      ) : null}

      <div className="max-w-full overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          {children}
        </table>
      </div>
    </div>
  );
}

export function DataTableHead({ children, className }: DataTableSectionProps) {
  return <thead className={className}>{children}</thead>;
}

export function DataTableBody({ children, className }: DataTableSectionProps) {
  return <tbody className={className}>{children}</tbody>;
}

export function DataTableHeaderRow({ children, className }: DataTableRowProps) {
  return (
    <tr
      className={[
        "border-b border-[var(--border-subtle)] bg-[var(--background-muted)] text-left",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </tr>
  );
}

export function DataTableRow({ children, className }: DataTableRowProps) {
  return (
    <tr
      className={[
        "border-b border-[var(--border-subtle)] transition hover:bg-[var(--background-muted)]/70",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </tr>
  );
}

export function DataTableHeaderCell({ children, className }: DataTableSectionProps) {
  return (
    <th
      className={[
        "whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] sm:px-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </th>
  );
}

export function DataTableCell({ children, className }: DataTableSectionProps) {
  return (
    <td
      className={["px-4 py-4 align-middle text-[var(--text-secondary)] sm:px-5 [overflow-wrap:anywhere]", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </td>
  );
}

export function DataTableCompactHeaderCell({
  children,
  className,
}: DataTableSectionProps) {
  return (
    <th
      className={[
        "whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </th>
  );
}

export function DataTableCompactCell({ children, className }: DataTableSectionProps) {
  return (
    <td
      className={["px-4 py-3 align-middle text-[var(--text-secondary)] [overflow-wrap:anywhere]", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </td>
  );
}
