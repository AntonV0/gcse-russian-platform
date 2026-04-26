import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableHeaderRow,
  DataTableRow,
} from "@/components/ui/data-table";
import PanelCard from "@/components/ui/panel-card";
import type { DbGrammarTable } from "@/lib/grammar/grammar-helpers-db";

type GrammarTableRendererProps = {
  table: DbGrammarTable;
};

export default function GrammarTableRenderer({ table }: GrammarTableRendererProps) {
  return (
    <PanelCard
      title={table.title}
      description={table.optional_note ?? undefined}
      headingLevel={3}
      tone="student"
      contentClassName="p-0"
    >
      <DataTable>
        <DataTableHead>
          <DataTableHeaderRow>
            {table.columns.map((column, index) => (
              <DataTableHeaderCell key={`${table.id}-column-${index}`}>
                {column}
              </DataTableHeaderCell>
            ))}
          </DataTableHeaderRow>
        </DataTableHead>

        <DataTableBody>
          {table.rows.map((row, rowIndex) => (
            <DataTableRow key={`${table.id}-row-${rowIndex}`}>
              {table.columns.map((_, columnIndex) => (
                <DataTableCell
                  key={`${table.id}-cell-${rowIndex}-${columnIndex}`}
                  className={
                    columnIndex === 0
                      ? "font-semibold text-[var(--text-primary)]"
                      : undefined
                  }
                >
                  {row[columnIndex] ?? ""}
                </DataTableCell>
              ))}
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </PanelCard>
  );
}
