import {
  createGrammarTableAction,
  deleteGrammarTableAction,
  updateGrammarTableAction,
} from "@/app/actions/admin/admin-grammar-table-actions";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import GrammarTableEditor from "@/components/admin/grammar/grammar-table-editor";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import Textarea from "@/components/ui/textarea";
import type {
  DbGrammarPoint,
  DbGrammarSet,
  DbGrammarTable,
} from "@/lib/grammar/grammar-helpers-db";

function GrammarPointHiddenFields({
  grammarSet,
  grammarPoint,
}: {
  grammarSet: DbGrammarSet;
  grammarPoint: DbGrammarPoint;
}) {
  return (
    <>
      <input type="hidden" name="grammarSetId" value={grammarSet.id} />
      <input type="hidden" name="grammarPointId" value={grammarPoint.id} />
    </>
  );
}

function GrammarTableForm({
  grammarSet,
  grammarPoint,
  table,
}: {
  grammarSet: DbGrammarSet;
  grammarPoint: DbGrammarPoint;
  table: DbGrammarTable;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4">
      <div className="mb-4 text-base font-semibold text-[var(--text-primary)]">
        {table.title}
      </div>

      <form action={updateGrammarTableAction} className="space-y-4">
        <GrammarPointHiddenFields grammarSet={grammarSet} grammarPoint={grammarPoint} />
        <input type="hidden" name="grammarTableId" value={table.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Title" required>
            <Input name="title" defaultValue={table.title} required />
          </FormField>

          <FormField label="Sort order">
            <Input
              name="sortOrder"
              type="number"
              min={0}
              step={1}
              defaultValue={table.sort_order}
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Optional note">
              <Textarea
                name="optionalNote"
                rows={3}
                defaultValue={table.optional_note ?? ""}
              />
            </FormField>
          </div>
        </div>

        <GrammarTableEditor defaultColumns={table.columns} defaultRows={table.rows} />

        <Button type="submit" variant="secondary" size="sm" icon="save">
          Save table
        </Button>
      </form>

      <form action={deleteGrammarTableAction} className="mt-3">
        <GrammarPointHiddenFields grammarSet={grammarSet} grammarPoint={grammarPoint} />
        <input type="hidden" name="grammarTableId" value={table.id} />
        <AdminConfirmButton
          variant="danger"
          icon="delete"
          confirmMessage={`Delete ${table.title}?`}
        >
          Delete table
        </AdminConfirmButton>
      </form>
    </div>
  );
}

function AddGrammarTablePanel({
  grammarSet,
  grammarPoint,
}: {
  grammarSet: DbGrammarSet;
  grammarPoint: DbGrammarPoint;
}) {
  return (
    <PanelCard title="Add grammar table" tone="admin">
      <form action={createGrammarTableAction} className="space-y-4">
        <GrammarPointHiddenFields grammarSet={grammarSet} grammarPoint={grammarPoint} />

        <FormField label="Title" required>
          <Input name="title" required placeholder="Present tense endings" />
        </FormField>

        <FormField label="Optional note">
          <Textarea name="optionalNote" rows={3} />
        </FormField>

        <FormField label="Sort order">
          <Input name="sortOrder" type="number" min={0} step={1} />
        </FormField>

        <GrammarTableEditor />

        <Button type="submit" variant="primary" icon="create">
          Add table
        </Button>
      </form>
    </PanelCard>
  );
}

export default function GrammarPointTablesPanel({
  grammarSet,
  grammarPoint,
  tables,
}: {
  grammarSet: DbGrammarSet;
  grammarPoint: DbGrammarPoint;
  tables: DbGrammarTable[];
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <SectionCard
        title="Grammar tables"
        description="Tables are JSON-backed so the same data can later render inside lessons, explanations, and practice."
        tone="admin"
      >
        {tables.length === 0 ? (
          <EmptyState
            icon="list"
            iconTone="brand"
            title="No tables yet"
            description="Add a dynamic table using the table builder."
          />
        ) : (
          <div className="space-y-4">
            {tables.map((table) => (
              <GrammarTableForm
                key={table.id}
                grammarSet={grammarSet}
                grammarPoint={grammarPoint}
                table={table}
              />
            ))}
          </div>
        )}
      </SectionCard>

      <AddGrammarTablePanel grammarSet={grammarSet} grammarPoint={grammarPoint} />
    </div>
  );
}
