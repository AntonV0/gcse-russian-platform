import {
  createGrammarExampleAction,
  deleteGrammarExampleAction,
  updateGrammarExampleAction,
} from "@/app/actions/admin/admin-grammar-example-actions";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import Textarea from "@/components/ui/textarea";
import type {
  DbGrammarExample,
  DbGrammarPoint,
  DbGrammarSet,
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

function GrammarExampleEditor({
  grammarSet,
  grammarPoint,
  example,
}: {
  grammarSet: DbGrammarSet;
  grammarPoint: DbGrammarPoint;
  example: DbGrammarExample;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4">
      <form action={updateGrammarExampleAction} className="space-y-4">
        <GrammarPointHiddenFields grammarSet={grammarSet} grammarPoint={grammarPoint} />
        <input type="hidden" name="grammarExampleId" value={example.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Russian" required>
            <Textarea
              name="russianText"
              rows={3}
              defaultValue={example.russian_text}
              required
            />
          </FormField>

          <FormField label="English" required>
            <Textarea
              name="englishTranslation"
              rows={3}
              defaultValue={example.english_translation}
              required
            />
          </FormField>

          <FormField label="Highlight">
            <Input
              name="optionalHighlight"
              defaultValue={example.optional_highlight ?? ""}
            />
          </FormField>

          <FormField label="Sort order">
            <Input
              name="sortOrder"
              type="number"
              min={0}
              step={1}
              defaultValue={example.sort_order}
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Note">
              <Textarea name="note" rows={3} defaultValue={example.note ?? ""} />
            </FormField>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="secondary" size="sm" icon="save">
            Save example
          </Button>
        </div>
      </form>

      <form action={deleteGrammarExampleAction} className="mt-3">
        <GrammarPointHiddenFields grammarSet={grammarSet} grammarPoint={grammarPoint} />
        <input type="hidden" name="grammarExampleId" value={example.id} />
        <AdminConfirmButton
          variant="danger"
          icon="delete"
          confirmMessage="Delete this grammar example?"
        >
          Delete example
        </AdminConfirmButton>
      </form>
    </div>
  );
}

function AddGrammarExamplePanel({
  grammarSet,
  grammarPoint,
}: {
  grammarSet: DbGrammarSet;
  grammarPoint: DbGrammarPoint;
}) {
  return (
    <PanelCard title="Add example" tone="admin">
      <form action={createGrammarExampleAction} className="space-y-4">
        <GrammarPointHiddenFields grammarSet={grammarSet} grammarPoint={grammarPoint} />

        <FormField label="Russian" required>
          <Textarea name="russianText" rows={3} required />
        </FormField>

        <FormField label="English" required>
          <Textarea name="englishTranslation" rows={3} required />
        </FormField>

        <FormField label="Highlight">
          <Input name="optionalHighlight" placeholder="я читаю" />
        </FormField>

        <FormField label="Note">
          <Textarea name="note" rows={3} />
        </FormField>

        <FormField label="Sort order">
          <Input name="sortOrder" type="number" min={0} step={1} />
        </FormField>

        <Button type="submit" variant="primary" icon="create">
          Add example
        </Button>
      </form>
    </PanelCard>
  );
}

export default function GrammarPointExamplesPanel({
  grammarSet,
  grammarPoint,
  examples,
}: {
  grammarSet: DbGrammarSet;
  grammarPoint: DbGrammarPoint;
  examples: DbGrammarExample[];
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <SectionCard
        title="Examples"
        description="Examples appear below the explanation on the grammar point page."
        tone="admin"
      >
        {examples.length === 0 ? (
          <EmptyState
            icon="language"
            iconTone="brand"
            title="No examples yet"
            description="Add the first example sentence using the form beside this section."
          />
        ) : (
          <div className="space-y-4">
            {examples.map((example) => (
              <GrammarExampleEditor
                key={example.id}
                grammarSet={grammarSet}
                grammarPoint={grammarPoint}
                example={example}
              />
            ))}
          </div>
        )}
      </SectionCard>

      <AddGrammarExamplePanel grammarSet={grammarSet} grammarPoint={grammarPoint} />
    </div>
  );
}
