import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  bulkCreateVocabularyItemsAction,
  createVocabularyItemAction,
  deleteVocabularyItemAction,
  updateVocabularyItemAction,
} from "@/app/actions/admin/admin-vocabulary-items-actions";
import {
  getVocabularyItemCoverageByItemIdsDb,
  getVocabularyListModeLabel,
  getVocabularyProductiveReceptiveLabel,
  getVocabularyTierLabel,
  loadVocabularySetByIdDb,
  type DbVocabularyItemCoverage,
  type DbVocabularyItem,
  type DbVocabularyTier,
} from "@/lib/vocabulary/vocabulary-helpers-db";

function getSourceTypeLabel(sourceType: DbVocabularyItem["source_type"]) {
  switch (sourceType) {
    case "spec_required":
      return "Spec required";
    case "extended":
      return "Extended";
    case "custom":
      return "Custom";
    default:
      return sourceType;
  }
}

function getPriorityLabel(priority: DbVocabularyItem["priority"]) {
  switch (priority) {
    case "core":
      return "Core";
    case "extension":
      return "Extension";
    default:
      return priority;
  }
}

function getItemTypeLabel(itemType: DbVocabularyItem["item_type"]) {
  switch (itemType) {
    case "word":
      return "Word";
    case "phrase":
      return "Phrase";
    default:
      return itemType;
  }
}

function getPartOfSpeechLabel(partOfSpeech: DbVocabularyItem["part_of_speech"]) {
  return partOfSpeech.replaceAll("_", " ");
}

function getDefaultItemTier(setTier: DbVocabularyTier) {
  return setTier === "foundation" || setTier === "higher" || setTier === "both"
    ? setTier
    : "unknown";
}

function getRequiredLessonCoverageKeys(tier: DbVocabularyTier) {
  if (tier === "foundation") {
    return ["foundation"] as const;
  }

  if (tier === "higher") {
    return ["higher", "volna"] as const;
  }

  return ["foundation", "higher", "volna"] as const;
}

function getLessonCoverageValue(
  coverage: DbVocabularyItemCoverage | null,
  key: "foundation" | "higher" | "volna"
) {
  if (!coverage) return false;

  switch (key) {
    case "foundation":
      return coverage.used_in_foundation;
    case "higher":
      return coverage.used_in_higher;
    case "volna":
      return coverage.used_in_volna;
    default:
      return false;
  }
}

function getLessonCoverageLabel(key: "foundation" | "higher" | "volna") {
  switch (key) {
    case "foundation":
      return "Foundation";
    case "higher":
      return "Higher";
    case "volna":
      return "Volna";
    default:
      return key;
  }
}

function CoverageBadge({
  label,
  isUsed,
}: {
  label: string;
  isUsed: boolean;
}) {
  return (
    <Badge tone={isUsed ? "success" : "danger"} icon={isUsed ? "success" : "cancel"}>
      {label}
    </Badge>
  );
}

function VocabularyItemCoverageBadges({
  item,
  coverage,
}: {
  item: DbVocabularyItem;
  coverage: DbVocabularyItemCoverage | null;
}) {
  const lessonCoverageKeys = getRequiredLessonCoverageKeys(item.tier);

  return (
    <div className="flex flex-wrap gap-2">
      {lessonCoverageKeys.map((key) => (
        <CoverageBadge
          key={key}
          label={getLessonCoverageLabel(key)}
          isUsed={getLessonCoverageValue(coverage, key)}
        />
      ))}

      <CoverageBadge
        label="Custom list"
        isUsed={Boolean(coverage?.used_in_custom_list)}
      />
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-[var(--text-primary)]"
      >
        {label}
      </label>

      {hint ? (
        <p className="text-sm leading-6 text-[var(--text-secondary)]">{hint}</p>
      ) : null}

      {children}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-[var(--background-muted)] px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
        {label}
      </div>
      <div className="mt-1.5 text-base font-semibold text-[var(--text-primary)]">
        {value}
      </div>
    </div>
  );
}

function DisclosurePanel({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-2xl border border-[var(--border)] bg-[var(--background)]"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-3">
        <span>
          <span className="block text-sm font-semibold text-[var(--text-primary)]">
            {title}
          </span>
          {description ? (
            <span className="mt-1 block text-sm leading-6 text-[var(--text-secondary)]">
              {description}
            </span>
          ) : null}
        </span>
        <span className="text-sm font-semibold text-[var(--text-secondary)] group-open:hidden">
          Open
        </span>
        <span className="hidden text-sm font-semibold text-[var(--text-secondary)] group-open:inline">
          Close
        </span>
      </summary>

      <div className="border-t border-[var(--border)] px-4 py-4">{children}</div>
    </details>
  );
}

function CoreMetadataFields({
  idPrefix,
  defaultTier,
  item,
}: {
  idPrefix: string;
  defaultTier: DbVocabularyTier;
  item?: DbVocabularyItem;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <FormField label="Item type" htmlFor={`${idPrefix}-item-type`}>
        <Select
          id={`${idPrefix}-item-type`}
          name="itemType"
          defaultValue={item?.item_type ?? "word"}
        >
          <option value="word">Word</option>
          <option value="phrase">Phrase</option>
        </Select>
      </FormField>

      <FormField label="Part of speech" htmlFor={`${idPrefix}-part-of-speech`}>
        <Select
          id={`${idPrefix}-part-of-speech`}
          name="partOfSpeech"
          defaultValue={item?.part_of_speech ?? "unknown"}
        >
          <option value="unknown">Unknown</option>
          <option value="noun">Noun</option>
          <option value="verb">Verb</option>
          <option value="adjective">Adjective</option>
          <option value="adverb">Adverb</option>
          <option value="pronoun">Pronoun</option>
          <option value="preposition">Preposition</option>
          <option value="conjunction">Conjunction</option>
          <option value="number">Number</option>
          <option value="phrase">Phrase</option>
          <option value="interjection">Interjection</option>
          <option value="other">Other</option>
        </Select>
      </FormField>

      <FormField label="Tier" htmlFor={`${idPrefix}-tier`}>
        <Select id={`${idPrefix}-tier`} name="tier" defaultValue={item?.tier ?? defaultTier}>
          <option value="unknown">Unknown</option>
          <option value="both">Both tiers</option>
          <option value="foundation">Foundation</option>
          <option value="higher">Higher</option>
        </Select>
      </FormField>

      <FormField label="Source type" htmlFor={`${idPrefix}-source-type`}>
        <Select
          id={`${idPrefix}-source-type`}
          name="sourceType"
          defaultValue={item?.source_type ?? "custom"}
        >
          <option value="custom">Custom</option>
          <option value="spec_required">Spec required</option>
          <option value="extended">Extended</option>
        </Select>
      </FormField>
    </div>
  );
}

function NewVocabularyItemForm({
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
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Quick add item
        </h2>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
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
          <FormField label="Russian" htmlFor="create-russian">
            <Input
              id="create-russian"
              name="russian"
              required
              placeholder="урок"
              autoComplete="off"
            />
          </FormField>

          <FormField label="English" htmlFor="create-english">
            <Input
              id="create-english"
              name="english"
              required
              placeholder="lesson"
              autoComplete="off"
            />
          </FormField>
        </div>

        <CoreMetadataFields idPrefix="create" defaultTier={defaultTier} />

        <DisclosurePanel
          title="Examples and notes"
          description="Use this when you already have a model sentence or teaching note."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Transliteration" htmlFor="create-transliteration">
              <Input id="create-transliteration" name="transliteration" />
            </FormField>

            <FormField label="Productive / receptive" htmlFor="create-productive-receptive">
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
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Example (Russian)" htmlFor="create-example-ru">
                <Textarea id="create-example-ru" name="exampleRu" rows={3} />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Example (English)" htmlFor="create-example-en">
                <Textarea id="create-example-en" name="exampleEn" rows={3} />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Notes" htmlFor="create-notes">
                <Textarea id="create-notes" name="notes" rows={3} />
              </FormField>
            </div>
          </div>
        </DisclosurePanel>

        <DisclosurePanel
          title="Grammar metadata"
          description="Useful for nouns, verbs, case-governing phrases, and grammar-aware filtering."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Gender" htmlFor="create-gender">
              <Select id="create-gender" name="gender" defaultValue="unknown">
                <option value="unknown">Unknown</option>
                <option value="not_applicable">Not applicable</option>
                <option value="masculine">Masculine</option>
                <option value="feminine">Feminine</option>
                <option value="neuter">Neuter</option>
                <option value="plural_only">Plural only</option>
                <option value="common">Common</option>
              </Select>
            </FormField>

            <FormField label="Plural" htmlFor="create-plural">
              <Input id="create-plural" name="plural" />
            </FormField>

            <FormField label="Aspect" htmlFor="create-aspect">
              <Select id="create-aspect" name="aspect" defaultValue="unknown">
                <option value="unknown">Unknown</option>
                <option value="not_applicable">Not applicable</option>
                <option value="imperfective">Imperfective</option>
                <option value="perfective">Perfective</option>
                <option value="both">Both</option>
              </Select>
            </FormField>

            <FormField label="Case governed" htmlFor="create-case-governed">
              <Input id="create-case-governed" name="caseGoverned" />
            </FormField>

            <label className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
              <input type="checkbox" name="isReflexive" value="true" className="mt-1" />
              <span>
                <span className="block text-sm font-semibold text-[var(--text-primary)]">
                  Reflexive verb
                </span>
                <span className="mt-1 block text-sm text-[var(--text-secondary)]">
                  Mark words such as заниматься or учиться.
                </span>
              </span>
            </label>
          </div>
        </DisclosurePanel>

        <DisclosurePanel
          title="Taxonomy and import metadata"
          description="Usually only needed for specification imports or curated large sets."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Priority" htmlFor="create-priority">
              <Select id="create-priority" name="priority" defaultValue="core">
                <option value="core">Core</option>
                <option value="extension">Extension</option>
              </Select>
            </FormField>

            <FormField label="Canonical key" htmlFor="create-canonical-key">
              <Input id="create-canonical-key" name="canonicalKey" />
            </FormField>

            <FormField label="Theme key" htmlFor="create-theme-key">
              <Input id="create-theme-key" name="themeKey" />
            </FormField>

            <FormField label="Topic key" htmlFor="create-topic-key">
              <Input id="create-topic-key" name="topicKey" />
            </FormField>

            <FormField label="Category key" htmlFor="create-category-key">
              <Input id="create-category-key" name="categoryKey" />
            </FormField>

            <FormField label="Subcategory key" htmlFor="create-subcategory-key">
              <Input id="create-subcategory-key" name="subcategoryKey" />
            </FormField>

            <FormField label="Source key" htmlFor="create-source-key">
              <Input id="create-source-key" name="sourceKey" />
            </FormField>

            <FormField label="Source version" htmlFor="create-source-version">
              <Input id="create-source-version" name="sourceVersion" />
            </FormField>

            <FormField label="Source section reference" htmlFor="create-source-section-ref">
              <Input id="create-source-section-ref" name="sourceSectionRef" />
            </FormField>

            <FormField label="Import key" htmlFor="create-import-key">
              <Input id="create-import-key" name="importKey" />
            </FormField>
          </div>
        </DisclosurePanel>

        <Button variant="primary" icon="save">
          Add item
        </Button>
      </form>
    </section>
  );
}

function BulkVocabularyItemForm({
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
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Bulk add</h2>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          Paste one pair per line. Use a tab, pipe, or comma between Russian and English.
        </p>
      </div>

      <form action={bulkCreateVocabularyItemsAction} className="space-y-4">
        <input type="hidden" name="vocabularySetId" value={vocabularySetId} />
        {vocabularyListId ? (
          <input type="hidden" name="vocabularyListId" value={vocabularyListId} />
        ) : null}

        <FormField label="Vocabulary pairs" htmlFor="bulk-items">
          <Textarea
            id="bulk-items"
            name="bulkItems"
            rows={8}
            required
            placeholder={"урок | lesson\nслово | word\nзадание | task"}
          />
        </FormField>

        <DisclosurePanel
          title="Shared metadata"
          description="Apply these values to every item created from this paste."
        >
          <div className="space-y-4">
            <CoreMetadataFields idPrefix="bulk" defaultTier={defaultTier} />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
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
              </FormField>

              <FormField label="Priority" htmlFor="bulk-priority">
                <Select id="bulk-priority" name="priority" defaultValue="core">
                  <option value="core">Core</option>
                  <option value="extension">Extension</option>
                </Select>
              </FormField>

              <FormField label="Theme key" htmlFor="bulk-theme-key">
                <Input id="bulk-theme-key" name="themeKey" />
              </FormField>

              <FormField label="Topic key" htmlFor="bulk-topic-key">
                <Input id="bulk-topic-key" name="topicKey" />
              </FormField>

              <FormField label="Category key" htmlFor="bulk-category-key">
                <Input id="bulk-category-key" name="categoryKey" />
              </FormField>

              <FormField label="Source key" htmlFor="bulk-source-key">
                <Input id="bulk-source-key" name="sourceKey" />
              </FormField>

              <FormField label="Source version" htmlFor="bulk-source-version">
                <Input id="bulk-source-version" name="sourceVersion" />
              </FormField>

              <FormField label="Source section reference" htmlFor="bulk-source-section-ref">
                <Input id="bulk-source-section-ref" name="sourceSectionRef" />
              </FormField>
            </div>
          </div>
        </DisclosurePanel>

        <Button variant="primary" icon="create">
          Add pasted items
        </Button>
      </form>
    </section>
  );
}

function VocabularyItemCard({
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
                {getItemTypeLabel(item.item_type)}
              </Badge>
              <Badge tone="muted" icon="language">
                {getSourceTypeLabel(item.source_type)}
              </Badge>
              <Badge
                tone={item.priority === "core" ? "success" : "warning"}
                icon={item.priority === "core" ? "success" : "info"}
              >
                {getPriorityLabel(item.priority)}
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
          <StatTile label="Russian" value={item.russian} />
          <StatTile label="English" value={item.english} />
          <StatTile label="Type" value={getItemTypeLabel(item.item_type)} />
          <StatTile
            label="Part of speech"
            value={getPartOfSpeechLabel(item.part_of_speech)}
          />
          <StatTile label="Position" value={item.position} />
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
            <FormField label="Russian" htmlFor={`russian-${item.id}`}>
              <Input
                id={`russian-${item.id}`}
                name="russian"
                defaultValue={item.russian}
                required
              />
            </FormField>

            <FormField label="English" htmlFor={`english-${item.id}`}>
              <Input
                id={`english-${item.id}`}
                name="english"
                defaultValue={item.english}
                required
              />
            </FormField>

            <FormField label="Transliteration" htmlFor={`transliteration-${item.id}`}>
              <Input
                id={`transliteration-${item.id}`}
                name="transliteration"
                defaultValue={item.transliteration ?? ""}
              />
            </FormField>

            <FormField label="Position" htmlFor={`position-${item.id}`}>
              <Input
                id={`position-${item.id}`}
                name="position"
                type="number"
                min={0}
                step={1}
                defaultValue={item.position}
              />
            </FormField>
          </div>

          <DisclosurePanel title="Core metadata" defaultOpen>
            <CoreMetadataFields idPrefix={`edit-${item.id}`} defaultTier={defaultTier} item={item} />
          </DisclosurePanel>

          <DisclosurePanel title="Examples and notes">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
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
              </FormField>

              <FormField label="Priority" htmlFor={`priority-${item.id}`}>
                <Select id={`priority-${item.id}`} name="priority" defaultValue={item.priority}>
                  <option value="core">Core</option>
                  <option value="extension">Extension</option>
                </Select>
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Example (Russian)" htmlFor={`example-ru-${item.id}`}>
                  <Textarea
                    id={`example-ru-${item.id}`}
                    name="exampleRu"
                    rows={3}
                    defaultValue={item.example_ru ?? ""}
                  />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Example (English)" htmlFor={`example-en-${item.id}`}>
                  <Textarea
                    id={`example-en-${item.id}`}
                    name="exampleEn"
                    rows={3}
                    defaultValue={item.example_en ?? ""}
                  />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Notes" htmlFor={`notes-${item.id}`}>
                  <Textarea
                    id={`notes-${item.id}`}
                    name="notes"
                    rows={3}
                    defaultValue={item.notes ?? ""}
                  />
                </FormField>
              </div>
            </div>
          </DisclosurePanel>

          <DisclosurePanel title="Grammar metadata">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Gender" htmlFor={`gender-${item.id}`}>
                <Select id={`gender-${item.id}`} name="gender" defaultValue={item.gender}>
                  <option value="unknown">Unknown</option>
                  <option value="not_applicable">Not applicable</option>
                  <option value="masculine">Masculine</option>
                  <option value="feminine">Feminine</option>
                  <option value="neuter">Neuter</option>
                  <option value="plural_only">Plural only</option>
                  <option value="common">Common</option>
                </Select>
              </FormField>

              <FormField label="Plural" htmlFor={`plural-${item.id}`}>
                <Input
                  id={`plural-${item.id}`}
                  name="plural"
                  defaultValue={item.plural ?? ""}
                />
              </FormField>

              <FormField label="Aspect" htmlFor={`aspect-${item.id}`}>
                <Select id={`aspect-${item.id}`} name="aspect" defaultValue={item.aspect}>
                  <option value="unknown">Unknown</option>
                  <option value="not_applicable">Not applicable</option>
                  <option value="imperfective">Imperfective</option>
                  <option value="perfective">Perfective</option>
                  <option value="both">Both</option>
                </Select>
              </FormField>

              <FormField label="Case governed" htmlFor={`case-governed-${item.id}`}>
                <Input
                  id={`case-governed-${item.id}`}
                  name="caseGoverned"
                  defaultValue={item.case_governed ?? ""}
                />
              </FormField>

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
                    Mark words such as заниматься or учиться.
                  </span>
                </span>
              </label>
            </div>
          </DisclosurePanel>

          <DisclosurePanel title="Taxonomy and import metadata">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Theme key" htmlFor={`theme-key-${item.id}`}>
                <Input
                  id={`theme-key-${item.id}`}
                  name="themeKey"
                  defaultValue={item.theme_key ?? ""}
                />
              </FormField>

              <FormField label="Topic key" htmlFor={`topic-key-${item.id}`}>
                <Input
                  id={`topic-key-${item.id}`}
                  name="topicKey"
                  defaultValue={item.topic_key ?? ""}
                />
              </FormField>

              <FormField label="Category key" htmlFor={`category-key-${item.id}`}>
                <Input
                  id={`category-key-${item.id}`}
                  name="categoryKey"
                  defaultValue={item.category_key ?? ""}
                />
              </FormField>

              <FormField label="Subcategory key" htmlFor={`subcategory-key-${item.id}`}>
                <Input
                  id={`subcategory-key-${item.id}`}
                  name="subcategoryKey"
                  defaultValue={item.subcategory_key ?? ""}
                />
              </FormField>

              <FormField label="Canonical key" htmlFor={`canonical-key-${item.id}`}>
                <Input
                  id={`canonical-key-${item.id}`}
                  name="canonicalKey"
                  defaultValue={item.canonical_key ?? ""}
                />
              </FormField>

              <FormField label="Source key" htmlFor={`source-key-${item.id}`}>
                <Input
                  id={`source-key-${item.id}`}
                  name="sourceKey"
                  defaultValue={item.source_key ?? ""}
                />
              </FormField>

              <FormField label="Source version" htmlFor={`source-version-${item.id}`}>
                <Input
                  id={`source-version-${item.id}`}
                  name="sourceVersion"
                  defaultValue={item.source_version ?? ""}
                />
              </FormField>

              <FormField
                label="Source section reference"
                htmlFor={`source-section-ref-${item.id}`}
              >
                <Input
                  id={`source-section-ref-${item.id}`}
                  name="sourceSectionRef"
                  defaultValue={item.source_section_ref ?? ""}
                />
              </FormField>

              <FormField label="Import key" htmlFor={`import-key-${item.id}`}>
                <Input
                  id={`import-key-${item.id}`}
                  name="importKey"
                  defaultValue={item.import_key ?? ""}
                />
              </FormField>
            </div>
          </DisclosurePanel>

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

            <Button variant="danger" size="sm" icon="delete">
              Delete item
            </Button>
          </form>
        </div>
      </div>
    </details>
  );
}

export default async function VocabularySetItemsPage({
  params,
}: {
  params: Promise<{ vocabularySetId: string }>;
}) {
  const { vocabularySetId } = await params;
  const { vocabularySet, vocabularyList, lists, items, usageStats } =
    await loadVocabularySetByIdDb(vocabularySetId);

  if (!vocabularySet) {
    notFound();
  }

  const defaultTier = getDefaultItemTier(vocabularySet.tier);
  const itemCoverageById = await getVocabularyItemCoverageByItemIdsDb(
    items.map((item) => item.id)
  );

  return (
    <main className="space-y-8">
      <PageHeader
        title="Vocabulary items"
        description="Manage the words and phrases inside this reusable vocabulary set."
      />

      <section className="app-surface app-section-padding">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="language">
                {getVocabularyTierLabel(vocabularySet.tier)}
              </Badge>

              <Badge tone="muted" icon="list">
                {getVocabularyListModeLabel(vocabularySet.list_mode)}
              </Badge>

              <Badge
                tone={vocabularySet.is_published ? "success" : "warning"}
                icon={vocabularySet.is_published ? "success" : "info"}
              >
                {vocabularySet.is_published ? "Published" : "Draft"}
              </Badge>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {vocabularySet.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                {vocabularySet.description || "No description yet."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/admin/vocabulary" variant="secondary" icon="back">
              Back to vocabulary
            </Button>

            <Button
              href={`/admin/vocabulary/${vocabularySet.id}/edit`}
              variant="soft"
              icon="edit"
            >
              Edit set
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Items" value={items.length} />
        <StatTile label="Lists" value={lists.length} />
        <StatTile label="Foundation usages" value={usageStats.foundationOccurrences} />
        <StatTile label="Higher usages" value={usageStats.higherOccurrences} />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <NewVocabularyItemForm
          vocabularySetId={vocabularySet.id}
          vocabularyListId={vocabularyList?.id ?? null}
          defaultTier={defaultTier}
        />

        <BulkVocabularyItemForm
          vocabularySetId={vocabularySet.id}
          vocabularyListId={vocabularyList?.id ?? null}
          defaultTier={defaultTier}
        />
      </div>

      <section className="app-surface app-section-padding">
        <div className="mb-5 flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Current items
          </h2>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            Items are collapsed by default so long sets stay scannable. Open one item when
            you need detailed editing.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-5 py-8 text-sm text-[var(--text-secondary)]">
            No items in this set yet. Use quick add or bulk add above to create the first
            entries.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <VocabularyItemCard
                key={item.id}
                item={item}
                vocabularySetId={vocabularySet.id}
                vocabularyListId={item.vocabulary_list_id ?? vocabularyList?.id ?? null}
                defaultTier={defaultTier}
                coverage={itemCoverageById.get(item.id) ?? null}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
