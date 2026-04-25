import { notFound } from "next/navigation";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import GrammarTableEditor from "@/components/admin/grammar/grammar-table-editor";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  deleteGrammarPointAction,
  updateGrammarPointAction,
} from "@/app/actions/admin/admin-grammar-point-actions";
import {
  createGrammarExampleAction,
  deleteGrammarExampleAction,
  updateGrammarExampleAction,
} from "@/app/actions/admin/admin-grammar-example-actions";
import {
  createGrammarTableAction,
  deleteGrammarTableAction,
  updateGrammarTableAction,
} from "@/app/actions/admin/admin-grammar-table-actions";
import {
  getGrammarCategoryLabel,
  getGrammarTierLabel,
  loadGrammarPointByIdDb,
} from "@/lib/grammar/grammar-helpers-db";
import { GRAMMAR_TAGS } from "@/lib/curriculum/grammar-tags";

type EditGrammarPointPageProps = {
  params: Promise<{ grammarSetId: string; grammarPointId: string }>;
};

export default async function EditGrammarPointPage({
  params,
}: EditGrammarPointPageProps) {
  const { grammarSetId, grammarPointId } = await params;
  const { grammarSet, grammarPoint, examples, tables } =
    await loadGrammarPointByIdDb(grammarPointId);

  if (!grammarSet || !grammarPoint || grammarSet.id !== grammarSetId) {
    notFound();
  }

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Edit grammar point"
        title={grammarPoint.title}
        description="Update the explanation and manage the examples and flexible tables attached to this grammar point."
        badges={
          <>
            <Badge tone="info" icon="school">
              {getGrammarTierLabel(grammarPoint.tier)}
            </Badge>
            <Badge tone="muted" className="capitalize">
              {getGrammarCategoryLabel(grammarPoint.category_key)}
            </Badge>
            <PublishStatusBadge isPublished={grammarPoint.is_published} />
          </>
        }
        actions={
          <>
            <Button
              href={`/admin/grammar/${grammarSet.id}/points`}
              variant="secondary"
              icon="back"
            >
              Back to points
            </Button>
            <Button href={`/grammar/${grammarSet.slug}/${grammarPoint.slug}`} variant="secondary" icon="preview">
              Student view
            </Button>
          </>
        }
      />

      <form
        action={updateGrammarPointAction}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        <input type="hidden" name="grammarSetId" value={grammarSet.id} />
        <input type="hidden" name="grammarPointId" value={grammarPoint.id} />

        <SectionCard
          title="Teaching content"
          description="This is the main student-facing grammar explanation."
          tone="admin"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField label="Title" required>
                <Input name="title" defaultValue={grammarPoint.title} required />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Slug">
                <Input name="slug" defaultValue={grammarPoint.slug} />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Short description">
                <Textarea
                  name="shortDescription"
                  rows={4}
                  defaultValue={grammarPoint.short_description ?? ""}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Full explanation">
                <Textarea
                  name="fullExplanation"
                  rows={14}
                  defaultValue={grammarPoint.full_explanation ?? ""}
                />
              </FormField>
            </div>

            <FormField label="Spec reference">
              <Input
                name="specReference"
                defaultValue={grammarPoint.spec_reference ?? ""}
              />
            </FormField>

            <FormField label="Grammar tag">
              <Select name="grammarTagKey" defaultValue={grammarPoint.grammar_tag_key ?? ""}>
                <option value="">No tag</option>
                {GRAMMAR_TAGS.map((tag) => (
                  <option key={tag.key} value={tag.key}>
                    {tag.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Category key">
              <Input name="categoryKey" defaultValue={grammarPoint.category_key ?? ""} />
            </FormField>

            <FormField label="Tier">
              <Select name="tier" defaultValue={grammarPoint.tier}>
                <option value="both">Both tiers</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
                <option value="unknown">Unknown</option>
              </Select>
            </FormField>

            <FormField label="Sort order">
              <Input
                name="sortOrder"
                type="number"
                min={0}
                step={1}
                defaultValue={grammarPoint.sort_order}
              />
            </FormField>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <PanelCard title="Publication" tone="admin">
            <div className="space-y-4">
              <CheckboxField
                name="isPublished"
                label="Published"
                defaultChecked={grammarPoint.is_published}
              />

              <div className="flex flex-col gap-3">
                <Button type="submit" variant="primary" icon="save">
                  Save point
                </Button>
                <Button
                  href={`/admin/grammar/${grammarSet.id}/points`}
                  variant="secondary"
                  icon="cancel"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </PanelCard>
        </div>
      </form>

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
                <div
                  key={example.id}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4"
                >
                  <form action={updateGrammarExampleAction} className="space-y-4">
                    <input type="hidden" name="grammarSetId" value={grammarSet.id} />
                    <input type="hidden" name="grammarPointId" value={grammarPoint.id} />
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
                    <input type="hidden" name="grammarSetId" value={grammarSet.id} />
                    <input type="hidden" name="grammarPointId" value={grammarPoint.id} />
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
              ))}
            </div>
          )}
        </SectionCard>

        <PanelCard title="Add example" tone="admin">
          <form action={createGrammarExampleAction} className="space-y-4">
            <input type="hidden" name="grammarSetId" value={grammarSet.id} />
            <input type="hidden" name="grammarPointId" value={grammarPoint.id} />

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
      </div>

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
                <div
                  key={table.id}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4"
                >
                  <div className="mb-4 text-base font-semibold text-[var(--text-primary)]">
                    {table.title}
                  </div>

                  <form action={updateGrammarTableAction} className="space-y-4">
                    <input type="hidden" name="grammarSetId" value={grammarSet.id} />
                    <input type="hidden" name="grammarPointId" value={grammarPoint.id} />
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

                    <GrammarTableEditor
                      defaultColumns={table.columns}
                      defaultRows={table.rows}
                    />

                    <Button type="submit" variant="secondary" size="sm" icon="save">
                      Save table
                    </Button>
                  </form>

                  <form action={deleteGrammarTableAction} className="mt-3">
                    <input type="hidden" name="grammarSetId" value={grammarSet.id} />
                    <input type="hidden" name="grammarPointId" value={grammarPoint.id} />
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
              ))}
            </div>
          )}
        </SectionCard>

        <PanelCard title="Add grammar table" tone="admin">
          <form action={createGrammarTableAction} className="space-y-4">
            <input type="hidden" name="grammarSetId" value={grammarSet.id} />
            <input type="hidden" name="grammarPointId" value={grammarPoint.id} />

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
      </div>

      <PanelCard
        title="Danger zone"
        description="Deleting this point also removes its examples and tables."
        tone="muted"
      >
        <form action={deleteGrammarPointAction}>
          <input type="hidden" name="grammarSetId" value={grammarSet.id} />
          <input type="hidden" name="grammarPointId" value={grammarPoint.id} />
          <AdminConfirmButton
            variant="danger"
            icon="delete"
            confirmMessage={`Delete ${grammarPoint.title}? This cannot be undone.`}
          >
            Delete grammar point
          </AdminConfirmButton>
        </form>
      </PanelCard>
    </main>
  );
}
