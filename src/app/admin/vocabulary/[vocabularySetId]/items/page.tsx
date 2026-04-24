import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  createVocabularyItemAction,
  deleteVocabularyItemAction,
  updateVocabularyItemAction,
} from "@/app/actions/admin/admin-vocabulary-items-actions";
import {
  getVocabularyListModeLabel,
  getVocabularyProductiveReceptiveLabel,
  getVocabularyTierLabel,
  loadVocabularySetByIdDb,
  type DbVocabularyItem,
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

function FormField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
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

function NewVocabularyItemForm({
  vocabularySetId,
  vocabularyListId,
}: {
  vocabularySetId: string;
  vocabularyListId: string | null;
}) {
  return (
    <section className="app-surface app-section-padding">
      <div className="mb-5 flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Add item</h2>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          Add a new word or phrase to this vocabulary set.
        </p>
      </div>

      <form action={createVocabularyItemAction} className="space-y-5">
        <input type="hidden" name="vocabularySetId" value={vocabularySetId} />
        {vocabularyListId ? (
          <input type="hidden" name="vocabularyListId" value={vocabularyListId} />
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Russian"
            htmlFor="create-russian"
            hint="Required. Main Russian word or phrase."
          >
            <Input id="create-russian" name="russian" required />
          </FormField>

          <FormField
            label="English"
            htmlFor="create-english"
            hint="Required. Main English meaning."
          >
            <Input id="create-english" name="english" required />
          </FormField>

          <FormField
            label="Transliteration"
            htmlFor="create-transliteration"
            hint="Optional. Helpful for beginners."
          >
            <Input id="create-transliteration" name="transliteration" />
          </FormField>

          <FormField
            label="Item type"
            htmlFor="create-item-type"
            hint="Choose whether this entry is a word or phrase."
          >
            <Select id="create-item-type" name="itemType" defaultValue="word">
              <option value="word">Word</option>
              <option value="phrase">Phrase</option>
            </Select>
          </FormField>

          <FormField
            label="Productive / receptive"
            htmlFor="create-productive-receptive"
            hint="Use unknown when the source does not say."
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
          </FormField>

          <FormField
            label="Tier"
            htmlFor="create-tier"
            hint="Use item-level tier only when known."
          >
            <Select id="create-tier" name="tier" defaultValue="unknown">
              <option value="unknown">Unknown</option>
              <option value="both">Both tiers</option>
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
            </Select>
          </FormField>

          <FormField
            label="Part of speech"
            htmlFor="create-part-of-speech"
            hint="Useful for Russian grammar-aware filtering."
          >
            <Select id="create-part-of-speech" name="partOfSpeech" defaultValue="unknown">
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

          <FormField
            label="Source type"
            htmlFor="create-source-type"
            hint="Marks where the vocabulary came from."
          >
            <Select id="create-source-type" name="sourceType" defaultValue="custom">
              <option value="custom">Custom</option>
              <option value="spec_required">Spec required</option>
              <option value="extended">Extended</option>
            </Select>
          </FormField>

          <FormField
            label="Priority"
            htmlFor="create-priority"
            hint="Use extension for less essential items."
          >
            <Select id="create-priority" name="priority" defaultValue="core">
              <option value="core">Core</option>
              <option value="extension">Extension</option>
            </Select>
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

          <FormField label="Case governed" htmlFor="create-case-governed">
            <Input id="create-case-governed" name="caseGoverned" />
          </FormField>

          <FormField label="Canonical key" htmlFor="create-canonical-key">
            <Input id="create-canonical-key" name="canonicalKey" />
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Example (Russian)"
              htmlFor="create-example-ru"
              hint="Optional example sentence in Russian."
            >
              <Textarea id="create-example-ru" name="exampleRu" />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Example (English)"
              htmlFor="create-example-en"
              hint="Optional translation of the example sentence."
            >
              <Textarea id="create-example-en" name="exampleEn" />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Notes"
              htmlFor="create-notes"
              hint="Optional admin note or grammar reminder."
            >
              <Textarea id="create-notes" name="notes" />
            </FormField>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" icon="save">
            Add vocabulary item
          </Button>
        </div>
      </form>
    </section>
  );
}

function VocabularyItemCard({
  item,
  vocabularySetId,
  vocabularyListId,
}: {
  item: DbVocabularyItem;
  vocabularySetId: string;
  vocabularyListId: string | null;
}) {
  return (
    <section className="app-card overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-3">
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

            <div>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                {item.russian}
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.english}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatTile label="Russian" value={item.russian} />
          <StatTile label="English" value={item.english} />
          <StatTile label="Type" value={getItemTypeLabel(item.item_type)} />
          <StatTile label="Part of speech" value={getPartOfSpeechLabel(item.part_of_speech)} />
          <StatTile label="Position" value={item.position} />
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

            <FormField label="Item type" htmlFor={`item-type-${item.id}`}>
              <Select
                id={`item-type-${item.id}`}
                name="itemType"
                defaultValue={item.item_type}
              >
                <option value="word">Word</option>
                <option value="phrase">Phrase</option>
              </Select>
            </FormField>

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

            <FormField label="Tier" htmlFor={`tier-${item.id}`}>
              <Select id={`tier-${item.id}`} name="tier" defaultValue={item.tier}>
                <option value="unknown">Unknown</option>
                <option value="both">Both tiers</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
              </Select>
            </FormField>

            <FormField label="Part of speech" htmlFor={`part-of-speech-${item.id}`}>
              <Select
                id={`part-of-speech-${item.id}`}
                name="partOfSpeech"
                defaultValue={item.part_of_speech}
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

            <FormField label="Source type" htmlFor={`source-type-${item.id}`}>
              <Select
                id={`source-type-${item.id}`}
                name="sourceType"
                defaultValue={item.source_type}
              >
                <option value="custom">Custom</option>
                <option value="spec_required">Spec required</option>
                <option value="extended">Extended</option>
              </Select>
            </FormField>

            <FormField label="Priority" htmlFor={`priority-${item.id}`}>
              <Select
                id={`priority-${item.id}`}
                name="priority"
                defaultValue={item.priority}
              >
                <option value="core">Core</option>
                <option value="extension">Extension</option>
              </Select>
            </FormField>

            <FormField label="Plural" htmlFor={`plural-${item.id}`}>
              <Input id={`plural-${item.id}`} name="plural" defaultValue={item.plural ?? ""} />
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

            <FormField label="Theme key" htmlFor={`theme-key-${item.id}`}>
              <Input id={`theme-key-${item.id}`} name="themeKey" defaultValue={item.theme_key ?? ""} />
            </FormField>

            <FormField label="Topic key" htmlFor={`topic-key-${item.id}`}>
              <Input id={`topic-key-${item.id}`} name="topicKey" defaultValue={item.topic_key ?? ""} />
            </FormField>

            <FormField label="Category key" htmlFor={`category-key-${item.id}`}>
              <Input id={`category-key-${item.id}`} name="categoryKey" defaultValue={item.category_key ?? ""} />
            </FormField>

            <FormField label="Subcategory key" htmlFor={`subcategory-key-${item.id}`}>
              <Input
                id={`subcategory-key-${item.id}`}
                name="subcategoryKey"
                defaultValue={item.subcategory_key ?? ""}
              />
            </FormField>

            <FormField label="Case governed" htmlFor={`case-governed-${item.id}`}>
              <Input id={`case-governed-${item.id}`} name="caseGoverned" defaultValue={item.case_governed ?? ""} />
            </FormField>

            <FormField label="Canonical key" htmlFor={`canonical-key-${item.id}`}>
              <Input id={`canonical-key-${item.id}`} name="canonicalKey" defaultValue={item.canonical_key ?? ""} />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Example (Russian)" htmlFor={`example-ru-${item.id}`}>
                <Textarea
                  id={`example-ru-${item.id}`}
                  name="exampleRu"
                  defaultValue={item.example_ru ?? ""}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Example (English)" htmlFor={`example-en-${item.id}`}>
                <Textarea
                  id={`example-en-${item.id}`}
                  name="exampleEn"
                  defaultValue={item.example_en ?? ""}
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Notes" htmlFor={`notes-${item.id}`}>
                <Textarea
                  id={`notes-${item.id}`}
                  name="notes"
                  defaultValue={item.notes ?? ""}
                />
              </FormField>
            </div>
          </div>

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

            <Button variant="quiet" size="sm" icon="delete">
              Delete item
            </Button>
          </form>
        </div>
      </div>
    </section>
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

      <NewVocabularyItemForm
        vocabularySetId={vocabularySet.id}
        vocabularyListId={vocabularyList?.id ?? null}
      />

      <section className="app-surface app-section-padding">
        <div className="mb-5 flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Current items
          </h2>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            Edit wording, examples, ordering, and item metadata for this set.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-5 py-8 text-sm text-[var(--text-secondary)]">
            No items in this set yet. Use the add form above to create the first one.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <VocabularyItemCard
                key={item.id}
                item={item}
                vocabularySetId={vocabularySet.id}
                vocabularyListId={item.vocabulary_list_id ?? vocabularyList?.id ?? null}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
