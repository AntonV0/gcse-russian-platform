import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import CoreMetadataFields from "@/components/admin/vocabulary/items/metadata-fields";
import {
  bulkCreateVocabularyItemsAction,
  createVocabularyItemAction,
} from "@/app/actions/admin/vocabulary/item-actions";
import type { DbVocabularyTier } from "@/lib/vocabulary/shared/types";
import {
  VocabularyAdminDisclosurePanel,
  VocabularyAdminFormField,
} from "@/components/admin/vocabulary/items/primitives";

export function NewVocabularyItemForm({
  vocabularySetId,
  vocabularyListId,
  defaultTier,
}: {
  vocabularySetId: string;
  vocabularyListId: string | null;
  defaultTier: DbVocabularyTier;
}) {
  return (
    <section className="app-surface app-section-padding">
      <div className="mb-5 flex flex-col gap-2">
        <h2 className="app-heading-subsection">Quick add item</h2>
        <p className="app-text-body-muted">
          Add the essentials first. Open optional sections only when this item needs extra
          metadata.
        </p>
      </div>

      <form action={createVocabularyItemAction} className="space-y-5">
        <input type="hidden" name="vocabularySetId" value={vocabularySetId} />
        {vocabularyListId ? (
          <input type="hidden" name="vocabularyListId" value={vocabularyListId} />
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <VocabularyAdminFormField label="Russian" htmlFor="create-russian">
            <Input
              id="create-russian"
              name="russian"
              required
              placeholder="урок"
              autoComplete="off"
            />
          </VocabularyAdminFormField>

          <VocabularyAdminFormField label="English" htmlFor="create-english">
            <Input
              id="create-english"
              name="english"
              required
              placeholder="lesson"
              autoComplete="off"
            />
          </VocabularyAdminFormField>
        </div>

        <CoreMetadataFields idPrefix="create" defaultTier={defaultTier} />

        <VocabularyAdminDisclosurePanel
          title="Examples and notes"
          description="Use this when you already have a model sentence or teaching note."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <VocabularyAdminFormField
              label="Transliteration"
              htmlFor="create-transliteration"
            >
              <Input id="create-transliteration" name="transliteration" />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Productive / receptive"
              htmlFor="create-productive-receptive"
            >
              <Select
                id="create-productive-receptive"
                name="productiveReceptive"
                defaultValue="unknown"
              >
                <option value="unknown">Unknown</option>
                <option value="productive">Productive</option>
                <option value="receptive">Receptive</option>
                <option value="both">Productive + receptive</option>
              </Select>
            </VocabularyAdminFormField>

            <div className="md:col-span-2">
              <VocabularyAdminFormField
                label="Example (Russian)"
                htmlFor="create-example-ru"
              >
                <Textarea id="create-example-ru" name="exampleRu" rows={3} />
              </VocabularyAdminFormField>
            </div>

            <div className="md:col-span-2">
              <VocabularyAdminFormField
                label="Example (English)"
                htmlFor="create-example-en"
              >
                <Textarea id="create-example-en" name="exampleEn" rows={3} />
              </VocabularyAdminFormField>
            </div>

            <div className="md:col-span-2">
              <VocabularyAdminFormField label="Notes" htmlFor="create-notes">
                <Textarea id="create-notes" name="notes" rows={3} />
              </VocabularyAdminFormField>
            </div>
          </div>
        </VocabularyAdminDisclosurePanel>

        <VocabularyAdminDisclosurePanel
          title="Grammar metadata"
          description="Useful for nouns, verbs, case-governing phrases, and grammar-aware filtering."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <VocabularyAdminFormField label="Gender" htmlFor="create-gender">
              <Select id="create-gender" name="gender" defaultValue="unknown">
                <option value="unknown">Unknown</option>
                <option value="not_applicable">Not applicable</option>
                <option value="masculine">Masculine</option>
                <option value="feminine">Feminine</option>
                <option value="neuter">Neuter</option>
                <option value="plural_only">Plural only</option>
                <option value="common">Common</option>
              </Select>
            </VocabularyAdminFormField>

            <VocabularyAdminFormField label="Plural" htmlFor="create-plural">
              <Input id="create-plural" name="plural" />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField label="Aspect" htmlFor="create-aspect">
              <Select id="create-aspect" name="aspect" defaultValue="unknown">
                <option value="unknown">Unknown</option>
                <option value="not_applicable">Not applicable</option>
                <option value="imperfective">Imperfective</option>
                <option value="perfective">Perfective</option>
                <option value="both">Both</option>
              </Select>
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Case governed"
              htmlFor="create-case-governed"
            >
              <Input id="create-case-governed" name="caseGoverned" />
            </VocabularyAdminFormField>

            <label className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
              <input type="checkbox" name="isReflexive" value="true" className="mt-1" />
              <span>
                <span className="block app-label">Reflexive verb</span>
                <span className="mt-1 block app-text-caption">
                  Mark words such as заниматься or учиться.
                </span>
              </span>
            </label>
          </div>
        </VocabularyAdminDisclosurePanel>

        <VocabularyAdminDisclosurePanel
          title="Taxonomy and import metadata"
          description="Usually only needed for specification imports or curated large sets."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <VocabularyAdminFormField label="Priority" htmlFor="create-priority">
              <Select id="create-priority" name="priority" defaultValue="core">
                <option value="core">Core</option>
                <option value="extension">Extension</option>
              </Select>
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Canonical key"
              htmlFor="create-canonical-key"
            >
              <Input id="create-canonical-key" name="canonicalKey" />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField label="Theme key" htmlFor="create-theme-key">
              <Input id="create-theme-key" name="themeKey" />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField label="Topic key" htmlFor="create-topic-key">
              <Input id="create-topic-key" name="topicKey" />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField label="Category key" htmlFor="create-category-key">
              <Input id="create-category-key" name="categoryKey" />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Subcategory key"
              htmlFor="create-subcategory-key"
            >
              <Input id="create-subcategory-key" name="subcategoryKey" />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField label="Source key" htmlFor="create-source-key">
              <Input id="create-source-key" name="sourceKey" />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Source version"
              htmlFor="create-source-version"
            >
              <Input id="create-source-version" name="sourceVersion" />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Source section reference"
              htmlFor="create-source-section-ref"
            >
              <Input id="create-source-section-ref" name="sourceSectionRef" />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField label="Import key" htmlFor="create-import-key">
              <Input id="create-import-key" name="importKey" />
            </VocabularyAdminFormField>
          </div>
        </VocabularyAdminDisclosurePanel>

        <Button variant="primary" icon="save">
          Add item
        </Button>
      </form>
    </section>
  );
}

export function BulkVocabularyItemForm({
  vocabularySetId,
  vocabularyListId,
  defaultTier,
}: {
  vocabularySetId: string;
  vocabularyListId: string | null;
  defaultTier: DbVocabularyTier;
}) {
  return (
    <section className="app-surface app-section-padding">
      <div className="mb-5 flex flex-col gap-2">
        <h2 className="app-heading-subsection">Bulk add</h2>
        <p className="app-text-body-muted">
          Paste one pair per line. Use a tab, pipe, or comma between Russian and English.
        </p>
      </div>

      <form action={bulkCreateVocabularyItemsAction} className="space-y-4">
        <input type="hidden" name="vocabularySetId" value={vocabularySetId} />
        {vocabularyListId ? (
          <input type="hidden" name="vocabularyListId" value={vocabularyListId} />
        ) : null}

        <VocabularyAdminFormField label="Vocabulary pairs" htmlFor="bulk-items">
          <Textarea
            id="bulk-items"
            name="bulkItems"
            rows={8}
            required
            placeholder={"урок | lesson\nслово | word\nзадание | task"}
          />
        </VocabularyAdminFormField>

        <VocabularyAdminDisclosurePanel
          title="Shared metadata"
          description="Apply these values to every item created from this paste."
        >
          <div className="space-y-4">
            <CoreMetadataFields idPrefix="bulk" defaultTier={defaultTier} />

            <div className="grid gap-4 md:grid-cols-2">
              <VocabularyAdminFormField
                label="Productive / receptive"
                htmlFor="bulk-productive-receptive"
              >
                <Select
                  id="bulk-productive-receptive"
                  name="productiveReceptive"
                  defaultValue="unknown"
                >
                  <option value="unknown">Unknown</option>
                  <option value="productive">Productive</option>
                  <option value="receptive">Receptive</option>
                  <option value="both">Productive + receptive</option>
                </Select>
              </VocabularyAdminFormField>

              <VocabularyAdminFormField label="Priority" htmlFor="bulk-priority">
                <Select id="bulk-priority" name="priority" defaultValue="core">
                  <option value="core">Core</option>
                  <option value="extension">Extension</option>
                </Select>
              </VocabularyAdminFormField>

              <VocabularyAdminFormField label="Theme key" htmlFor="bulk-theme-key">
                <Input id="bulk-theme-key" name="themeKey" />
              </VocabularyAdminFormField>

              <VocabularyAdminFormField label="Topic key" htmlFor="bulk-topic-key">
                <Input id="bulk-topic-key" name="topicKey" />
              </VocabularyAdminFormField>

              <VocabularyAdminFormField label="Category key" htmlFor="bulk-category-key">
                <Input id="bulk-category-key" name="categoryKey" />
              </VocabularyAdminFormField>

              <VocabularyAdminFormField label="Source key" htmlFor="bulk-source-key">
                <Input id="bulk-source-key" name="sourceKey" />
              </VocabularyAdminFormField>

              <VocabularyAdminFormField
                label="Source version"
                htmlFor="bulk-source-version"
              >
                <Input id="bulk-source-version" name="sourceVersion" />
              </VocabularyAdminFormField>

              <VocabularyAdminFormField
                label="Source section reference"
                htmlFor="bulk-source-section-ref"
              >
                <Input id="bulk-source-section-ref" name="sourceSectionRef" />
              </VocabularyAdminFormField>

              <VocabularyAdminFormField label="Import key" htmlFor="bulk-import-key">
                <Input id="bulk-import-key" name="importKey" />
              </VocabularyAdminFormField>
            </div>
          </div>
        </VocabularyAdminDisclosurePanel>

        <Button variant="primary" icon="create">
          Add pasted items
        </Button>
      </form>
    </section>
  );
}
