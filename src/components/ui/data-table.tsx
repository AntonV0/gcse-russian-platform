"use client";

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
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="DataTable"
          filePath="src/components/ui/data-table.tsx"
        />
      ) : null}

      <div className={["overflow-x-auto", className].filter(Boolean).join(" ")}>
        <table className="w-full border-collapse text-sm">{children}</table>
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
        "border-b border-[var(--border)] bg-[var(--background-muted)] text-left",
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
        "border-b border-[var(--border)] transition hover:bg-[var(--background-muted)]/65",
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
      className={["px-5 py-3 font-semibold text-[var(--text-primary)]", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </th>
  );
}

export function DataTableCell({ children, className }: DataTableSectionProps) {
  return (
    <td className={["px-5 py-4", className].filter(Boolean).join(" ")}>{children}</td>
  );
}

export function DataTableCompactHeaderCell({
  children,
  className,
}: DataTableSectionProps) {
  return (
    <th
      className={["px-4 py-2.5 font-semibold text-[var(--text-primary)]", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </th>
  );
}

export function DataTableCompactCell({ children, className }: DataTableSectionProps) {
  return (
    <td className={["px-4 py-3", className].filter(Boolean).join(" ")}>{children}</td>
  );
}
