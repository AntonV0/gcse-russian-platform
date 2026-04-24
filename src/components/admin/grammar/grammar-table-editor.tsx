"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import type { GrammarTableColumns, GrammarTableRows } from "@/lib/grammar/grammar-helpers-db";

type GrammarTableEditorProps = {
  columnsInputName?: string;
  rowsInputName?: string;
  defaultColumns?: GrammarTableColumns;
  defaultRows?: GrammarTableRows;
};

function normalizeRows(rows: GrammarTableRows, columnCount: number) {
  return rows.map((row) => {
    const nextRow = [...row];

    while (nextRow.length < columnCount) {
      nextRow.push("");
    }

    return nextRow.slice(0, columnCount);
  });
}

export default function GrammarTableEditor({
  columnsInputName = "columnsJson",
  rowsInputName = "rowsJson",
  defaultColumns = ["Russian", "English"],
  defaultRows = [["", ""]],
}: GrammarTableEditorProps) {
  const [columns, setColumns] = useState<GrammarTableColumns>(
    defaultColumns.length > 0 ? defaultColumns : ["Column 1"]
  );
  const [rows, setRows] = useState<GrammarTableRows>(
    normalizeRows(defaultRows.length > 0 ? defaultRows : [[""]], columns.length)
  );

  const normalizedRows = useMemo(() => normalizeRows(rows, columns.length), [rows, columns]);

  function updateColumn(index: number, value: string) {
    setColumns((current) =>
      current.map((column, columnIndex) => (columnIndex === index ? value : column))
    );
  }

  function addColumn() {
    setColumns((current) => [...current, `Column ${current.length + 1}`]);
    setRows((current) => current.map((row) => [...row, ""]));
  }

  function removeColumn(index: number) {
    setColumns((current) => {
      if (current.length <= 1) return current;
      return current.filter((_, columnIndex) => columnIndex !== index);
    });

    setRows((current) =>
      current.map((row) => {
        if (row.length <= 1) return row;
        return row.filter((_, columnIndex) => columnIndex !== index);
      })
    );
  }

  function updateCell(rowIndex: number, columnIndex: number, value: string) {
    setRows((current) =>
      normalizeRows(current, columns.length).map((row, currentRowIndex) => {
        if (currentRowIndex !== rowIndex) return row;

        return row.map((cell, currentColumnIndex) =>
          currentColumnIndex === columnIndex ? value : cell
        );
      })
    );
  }

  function addRow() {
    setRows((current) => [...normalizeRows(current, columns.length), columns.map(() => "")]);
  }

  function removeRow(index: number) {
    setRows((current) => {
      if (current.length <= 1) return current;
      return current.filter((_, rowIndex) => rowIndex !== index);
    });
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={columnsInputName} value={JSON.stringify(columns)} />
      <input type="hidden" name={rowsInputName} value={JSON.stringify(normalizedRows)} />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              Columns
            </div>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Table structure is stored as JSON, so it can render in any future lesson or practice surface.
            </p>
          </div>

          <Button type="button" variant="secondary" size="sm" icon="create" onClick={addColumn}>
            Add column
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {columns.map((column, index) => (
            <div key={`column-${index}`} className="flex items-end gap-2">
              <FormField label={`Column ${index + 1}`} className="flex-1">
                <Input
                  value={column}
                  onChange={(event) => updateColumn(index, event.target.value)}
                />
              </FormField>

              <Button
                type="button"
                variant="quiet"
                size="sm"
                icon="delete"
                iconOnly
                ariaLabel={`Remove column ${index + 1}`}
                disabled={columns.length <= 1}
                onClick={() => removeColumn(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">Rows</div>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Add as many rows as the grammar point needs.
            </p>
          </div>

          <Button type="button" variant="secondary" size="sm" icon="create" onClick={addRow}>
            Add row
          </Button>
        </div>

        <div className="space-y-4">
          {normalizedRows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-3"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  Row {rowIndex + 1}
                </div>

                <Button
                  type="button"
                  variant="quiet"
                  size="sm"
                  icon="delete"
                  iconOnly
                  ariaLabel={`Remove row ${rowIndex + 1}`}
                  disabled={normalizedRows.length <= 1}
                  onClick={() => removeRow(rowIndex)}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {columns.map((column, columnIndex) => (
                  <FormField key={`${rowIndex}-${columnIndex}`} label={column || "Column"}>
                    <Input
                      value={row[columnIndex] ?? ""}
                      onChange={(event) =>
                        updateCell(rowIndex, columnIndex, event.target.value)
                      }
                    />
                  </FormField>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
