import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  deleteVocabularyItemAction,
  updateVocabularyItemAction,
} from "@/app/actions/admin/vocabulary/item-actions";
import VocabularyItemCoverageBadges from "@/components/admin/vocabulary/items/coverage-badges";
import CoreMetadataFields from "@/components/admin/vocabulary/items/metadata-fields";
import {
  getVocabularyItemPriorityLabel,
  getVocabularyItemSourceTypeLabel,
  getVocabularyItemTypeLabel,
  getVocabularyPartOfSpeechLabel,
} from "@/components/admin/vocabulary/items/item-display";
import {
  VocabularyAdminDisclosurePanel,
  VocabularyAdminFormField,
  VocabularyAdminStatTile,
} from "@/components/admin/vocabulary/items/primitives";
import {
  getVocabularyProductiveReceptiveLabel,
  type DbVocabularyItem,
  type DbVocabularyItemCoverage,
  type DbVocabularyTier,
} from "@/lib/vocabulary/vocabulary-helpers-db";

export default function VocabularyItemCard({
  item,
  vocabularySetId,
  vocabularyListId,
  defaultTier,
  coverage,
}: {
  item: DbVocabularyItem;
  vocabularySetId: string;
  vocabularyListId: string | null;
  defaultTier: DbVocabularyTier;
  coverage: DbVocabularyItemCoverage | null;
}) {
  return (
    <details className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] shadow-[var(--shadow-sm)]">
      <summary className="cursor-pointer list-none px-5 py-4 transition hover:bg-[var(--background-muted)]/55">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Badge tone="muted" icon="list">
                Position {item.position}
              </Badge>
              <Badge tone="info" icon="file">
                {getVocabularyItemTypeLabel(item.item_type)}
              </Badge>
              <Badge tone="muted" icon="vocabularySet">
                {getVocabularyItemSourceTypeLabel(item.source_type)}
              </Badge>
              <Badge
                tone={item.priority === "core" ? "success" : "warning"}
                icon={item.priority === "core" ? "success" : "info"}
              >
                {getVocabularyItemPriorityLabel(item.priority)}
              </Badge>
              <Badge tone="muted" icon="info">
                {getVocabularyProductiveReceptiveLabel(item.productive_receptive)}
              </Badge>
            </div>

            <div className="mt-3">
              <VocabularyItemCoverageBadges item={item} coverage={coverage} />
            </div>

            <div className="mt-3">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                {item.russian}
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.english}</p>
            </div>
          </div>

          <div className="text-sm font-semibold text-[var(--text-secondary)] group-open:hidden">
            Edit
          </div>
          <div className="hidden text-sm font-semibold text-[var(--text-secondary)] group-open:block">
            Close
          </div>
        </div>
      </summary>

      <div className="space-y-5 border-t border-[var(--border)] p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <VocabularyAdminStatTile label="Russian" value={item.russian} />
          <VocabularyAdminStatTile label="English" value={item.english} />
          <VocabularyAdminStatTile
            label="Type"
            value={getVocabularyItemTypeLabel(item.item_type)}
          />
          <VocabularyAdminStatTile
            label="Part of speech"
            value={getVocabularyPartOfSpeechLabel(item.part_of_speech)}
          />
          <VocabularyAdminStatTile label="Position" value={item.position} />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
            Usage coverage
          </div>
          <div className="mt-3">
            <VocabularyItemCoverageBadges item={item} coverage={coverage} />
          </div>
        </div>

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
                <Select id={`priority-${item.id}`} name="priority" defaultValue={item.priority}>
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
                  <span className="block text-sm font-semibold text-[var(--text-primary)]">
                    Reflexive verb
                  </span>
                  <span className="mt-1 block text-sm text-[var(--text-secondary)]">
                    Mark words such as Ð·Ð°Ð½Ð¸Ð¼Ð°Ñ‚ÑŒÑÑ or ÑƒÑ‡Ð¸Ñ‚ÑŒÑÑ.
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

              <VocabularyAdminFormField label="Source key" htmlFor={`source-key-${item.id}`}>
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

              <VocabularyAdminFormField label="Import key" htmlFor={`import-key-${item.id}`}>
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
      </div>
    </details>
  );
}
