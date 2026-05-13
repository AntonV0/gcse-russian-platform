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

const CYRILLIC_PATTERN = /[\u0400-\u04ff]/;

function getCellLanguage(value: string) {
  return CYRILLIC_PATTERN.test(value) ? "ru" : undefined;
}

export default function GrammarTableRenderer({ table }: GrammarTableRendererProps) {
  return (
    <PanelCard
      title={table.title}
      description={table.optional_note ?? undefined}
      headingLevel={3}
      tone="student"
      contentClassName="p-0"
    >
      <DataTable tableClassName="min-w-[640px] text-[0.95rem]">
        <DataTableHead>
          <DataTableHeaderRow>
            {table.columns.map((column, index) => (
              <DataTableHeaderCell
                key={`${table.id}-column-${index}`}
                className="whitespace-normal text-[0.78rem] leading-5"
              >
                {column}
              </DataTableHeaderCell>
            ))}
          </DataTableHeaderRow>
        </DataTableHead>

        <DataTableBody>
          {table.rows.map((row, rowIndex) => (
            <DataTableRow key={`${table.id}-row-${rowIndex}`}>
              {table.columns.map((_, columnIndex) => {
                const cellValue = row[columnIndex] ?? "";

                return (
                  <DataTableCell
                    key={`${table.id}-cell-${rowIndex}-${columnIndex}`}
                    className={
                      columnIndex === 0
                        ? "font-semibold text-[var(--text-primary)]"
                        : undefined
                    }
                  >
                    <span lang={getCellLanguage(cellValue)}>{cellValue}</span>
                  </DataTableCell>
                );
              })}
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </PanelCard>
  );
}
