import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  deleteVocabularyItemAction,
  updateVocabularyItemAction,
} from "@/app/actions/admin/vocabulary/item-actions";
import CoreMetadataFields from "@/components/admin/vocabulary/items/metadata-fields";
import {
  VocabularyAdminDisclosurePanel,
  VocabularyAdminFormField,
} from "@/components/admin/vocabulary/items/primitives";
import type { DbVocabularyItem, DbVocabularyTier } from "@/lib/vocabulary/types";

export default function VocabularyItemEditForm({
  item,
  vocabularySetId,
  vocabularyListId,
  defaultTier,
}: {
  item: DbVocabularyItem;
  vocabularySetId: string;
  vocabularyListId: string | null;
  defaultTier: DbVocabularyTier;
}) {
  return (
    <>
      <form action={updateVocabularyItemAction} className="space-y-5">
        <input type="hidden" name="vocabularyItemId" value={item.id} />
        <input type="hidden" name="vocabularySetId" value={vocabularySetId} />
        {vocabularyListId ? (
          <input type="hidden" name="vocabularyListId" value={vocabularyListId} />
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <VocabularyAdminFormField label="Russian" htmlFor={`russian-${item.id}`}>
            <Input
              id={`russian-${item.id}`}
              name="russian"
              defaultValue={item.russian}
              required
            />
          </VocabularyAdminFormField>

          <VocabularyAdminFormField label="English" htmlFor={`english-${item.id}`}>
            <Input
              id={`english-${item.id}`}
              name="english"
              defaultValue={item.english}
              required
            />
          </VocabularyAdminFormField>

          <VocabularyAdminFormField
            label="Transliteration"
            htmlFor={`transliteration-${item.id}`}
          >
            <Input
              id={`transliteration-${item.id}`}
              name="transliteration"
              defaultValue={item.transliteration ?? ""}
            />
          </VocabularyAdminFormField>

          <VocabularyAdminFormField label="Position" htmlFor={`position-${item.id}`}>
            <Input
              id={`position-${item.id}`}
              name="position"
              type="number"
              min={0}
              step={1}
              defaultValue={item.position}
            />
          </VocabularyAdminFormField>
        </div>

        <VocabularyAdminDisclosurePanel title="Core metadata" defaultOpen>
          <CoreMetadataFields
            idPrefix={`edit-${item.id}`}
            defaultTier={defaultTier}
            item={item}
          />
        </VocabularyAdminDisclosurePanel>

        <VocabularyAdminDisclosurePanel title="Examples and notes">
          <div className="grid gap-4 md:grid-cols-2">
            <VocabularyAdminFormField
              label="Productive / receptive"
              htmlFor={`productive-receptive-${item.id}`}
            >
              <Select
                id={`productive-receptive-${item.id}`}
                name="productiveReceptive"
                defaultValue={item.productive_receptive}
              >
                <option value="unknown">Unknown</option>
                <option value="productive">Productive</option>
                <option value="receptive">Receptive</option>
                <option value="both">Productive + receptive</option>
              </Select>
            </VocabularyAdminFormField>

            <VocabularyAdminFormField label="Priority" htmlFor={`priority-${item.id}`}>
              <Select
                id={`priority-${item.id}`}
                name="priority"
                defaultValue={item.priority}
              >
                <option value="core">Core</option>
                <option value="extension">Extension</option>
              </Select>
            </VocabularyAdminFormField>

            <div className="md:col-span-2">
              <VocabularyAdminFormField
                label="Example (Russian)"
                htmlFor={`example-ru-${item.id}`}
              >
                <Textarea
                  id={`example-ru-${item.id}`}
                  name="exampleRu"
                  rows={3}
                  defaultValue={item.example_ru ?? ""}
                />
              </VocabularyAdminFormField>
            </div>

            <div className="md:col-span-2">
              <VocabularyAdminFormField
                label="Example (English)"
                htmlFor={`example-en-${item.id}`}
              >
                <Textarea
                  id={`example-en-${item.id}`}
                  name="exampleEn"
                  rows={3}
                  defaultValue={item.example_en ?? ""}
                />
              </VocabularyAdminFormField>
            </div>

            <div className="md:col-span-2">
              <VocabularyAdminFormField label="Notes" htmlFor={`notes-${item.id}`}>
                <Textarea
                  id={`notes-${item.id}`}
                  name="notes"
                  rows={3}
                  defaultValue={item.notes ?? ""}
                />
              </VocabularyAdminFormField>
            </div>
          </div>
        </VocabularyAdminDisclosurePanel>

        <VocabularyAdminDisclosurePanel title="Grammar metadata">
          <div className="grid gap-4 md:grid-cols-2">
            <VocabularyAdminFormField label="Gender" htmlFor={`gender-${item.id}`}>
              <Select id={`gender-${item.id}`} name="gender" defaultValue={item.gender}>
                <option value="unknown">Unknown</option>
                <option value="not_applicable">Not applicable</option>
                <option value="masculine">Masculine</option>
                <option value="feminine">Feminine</option>
                <option value="neuter">Neuter</option>
                <option value="plural_only">Plural only</option>
                <option value="common">Common</option>
              </Select>
            </VocabularyAdminFormField>

            <VocabularyAdminFormField label="Plural" htmlFor={`plural-${item.id}`}>
              <Input
                id={`plural-${item.id}`}
                name="plural"
                defaultValue={item.plural ?? ""}
              />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField label="Aspect" htmlFor={`aspect-${item.id}`}>
              <Select id={`aspect-${item.id}`} name="aspect" defaultValue={item.aspect}>
                <option value="unknown">Unknown</option>
                <option value="not_applicable">Not applicable</option>
                <option value="imperfective">Imperfective</option>
                <option value="perfective">Perfective</option>
                <option value="both">Both</option>
              </Select>
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Case governed"
              htmlFor={`case-governed-${item.id}`}
            >
              <Input
                id={`case-governed-${item.id}`}
                name="caseGoverned"
                defaultValue={item.case_governed ?? ""}
              />
            </VocabularyAdminFormField>

            <label className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
              <input
                type="checkbox"
                name="isReflexive"
                value="true"
                defaultChecked={item.is_reflexive}
                className="mt-1"
              />
              <span>
                <span className="block app-label">Reflexive verb</span>
                <span className="mt-1 block app-text-caption">
                  Mark words such as заниматься or учиться.
                </span>
              </span>
            </label>
          </div>
        </VocabularyAdminDisclosurePanel>

        <VocabularyAdminDisclosurePanel title="Taxonomy and import metadata">
          <div className="grid gap-4 md:grid-cols-2">
            <VocabularyAdminFormField label="Theme key" htmlFor={`theme-key-${item.id}`}>
              <Input
                id={`theme-key-${item.id}`}
                name="themeKey"
                defaultValue={item.theme_key ?? ""}
              />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField label="Topic key" htmlFor={`topic-key-${item.id}`}>
              <Input
                id={`topic-key-${item.id}`}
                name="topicKey"
                defaultValue={item.topic_key ?? ""}
              />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Category key"
              htmlFor={`category-key-${item.id}`}
            >
              <Input
                id={`category-key-${item.id}`}
                name="categoryKey"
                defaultValue={item.category_key ?? ""}
              />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Subcategory key"
              htmlFor={`subcategory-key-${item.id}`}
            >
              <Input
                id={`subcategory-key-${item.id}`}
                name="subcategoryKey"
                defaultValue={item.subcategory_key ?? ""}
              />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Canonical key"
              htmlFor={`canonical-key-${item.id}`}
            >
              <Input
                id={`canonical-key-${item.id}`}
                name="canonicalKey"
                defaultValue={item.canonical_key ?? ""}
              />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Source key"
              htmlFor={`source-key-${item.id}`}
            >
              <Input
                id={`source-key-${item.id}`}
                name="sourceKey"
                defaultValue={item.source_key ?? ""}
              />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Source version"
              htmlFor={`source-version-${item.id}`}
            >
              <Input
                id={`source-version-${item.id}`}
                name="sourceVersion"
                defaultValue={item.source_version ?? ""}
              />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Source section reference"
              htmlFor={`source-section-ref-${item.id}`}
            >
              <Input
                id={`source-section-ref-${item.id}`}
                name="sourceSectionRef"
                defaultValue={item.source_section_ref ?? ""}
              />
            </VocabularyAdminFormField>

            <VocabularyAdminFormField
              label="Import key"
              htmlFor={`import-key-${item.id}`}
            >
              <Input
                id={`import-key-${item.id}`}
                name="importKey"
                defaultValue={item.import_key ?? ""}
              />
            </VocabularyAdminFormField>
          </div>
        </VocabularyAdminDisclosurePanel>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="sm" icon="save">
            Save item
          </Button>
        </div>
      </form>

      <div className="border-t border-[var(--border)] pt-4">
        <form action={deleteVocabularyItemAction}>
          <input type="hidden" name="vocabularyItemId" value={item.id} />
          <input type="hidden" name="vocabularySetId" value={vocabularySetId} />

          <AdminConfirmButton
            variant="danger"
            icon="delete"
            confirmMessage={`Delete ${item.russian}? This removes it from this vocabulary set and any linked lists.`}
          >
            Delete item
          </AdminConfirmButton>
        </form>
      </div>
    </>
  );
}
