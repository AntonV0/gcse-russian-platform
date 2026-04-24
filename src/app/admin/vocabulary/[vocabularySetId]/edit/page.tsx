import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { updateVocabularySetAction } from "@/app/actions/admin/admin-vocabulary-actions";
import { loadVocabularySetByIdDb } from "@/lib/vocabulary/vocabulary-helpers-db";

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

function ToggleField({
  name,
  label,
  description,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div>
      <input type="hidden" name={name} value="false" />
      <CheckboxField
        name={name}
        label={label}
        value="true"
        description={description}
        defaultChecked={defaultChecked}
      />
    </div>
  );
}

export default async function EditVocabularySetPage({
  params,
}: {
  params: Promise<{ vocabularySetId: string }>;
}) {
  const { vocabularySetId } = await params;
  const { vocabularySet, items, usageStats } =
    await loadVocabularySetByIdDb(vocabularySetId);

  if (!vocabularySet) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <PageHeader
        title="Edit vocabulary set"
        description="Update vocabulary-set metadata, publication state, and structure."
      />

      <section className="app-surface app-section-padding">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="edit">
                Editing set
              </Badge>

              <Badge
                tone={vocabularySet.is_published ? "success" : "warning"}
                icon={vocabularySet.is_published ? "success" : "info"}
              >
                {vocabularySet.is_published ? "Published" : "Draft"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {vocabularySet.title}
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                Update the set metadata now. Item management can be added next as its own
                dedicated flow.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/admin/vocabulary" variant="secondary" icon="back">
              Back to vocabulary
            </Button>
          </div>
        </div>
      </section>

      <form
        action={updateVocabularySetAction}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        <input type="hidden" name="vocabularySetId" value={vocabularySet.id} />

        <div className="space-y-4">
          <section className="app-surface app-section-padding">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Core details
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Update the main metadata used by admin and future student-facing tools.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField label="Title" htmlFor="title">
                  <Input
                    id="title"
                    name="title"
                    defaultValue={vocabularySet.title}
                    required
                  />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField
                  label="Slug"
                  htmlFor="slug"
                  hint="Optional. Leave blank if this set does not need a slug yet."
                >
                  <Input id="slug" name="slug" defaultValue={vocabularySet.slug ?? ""} />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Description" htmlFor="description">
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={vocabularySet.description ?? ""}
                  />
                </FormField>
              </div>

              <FormField label="Theme key" htmlFor="themeKey">
                <Input
                  id="themeKey"
                  name="themeKey"
                  defaultValue={vocabularySet.theme_key ?? ""}
                />
              </FormField>

              <FormField label="Topic key" htmlFor="topicKey">
                <Input
                  id="topicKey"
                  name="topicKey"
                  defaultValue={vocabularySet.topic_key ?? ""}
                />
              </FormField>

              <FormField label="Sort order" htmlFor="sortOrder">
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={vocabularySet.sort_order}
                />
              </FormField>
            </div>
          </section>

          <section className="app-surface app-section-padding">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Vocabulary settings
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Control set structure, display defaults, and classification.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Tier" htmlFor="tier">
                <Select id="tier" name="tier" defaultValue={vocabularySet.tier}>
                  <option value="both">Both tiers</option>
                  <option value="foundation">Foundation</option>
                  <option value="higher">Higher</option>
                  <option value="unknown">Unknown</option>
                </Select>
              </FormField>

              <FormField label="List mode" htmlFor="listMode">
                <Select
                  id="listMode"
                  name="listMode"
                  defaultValue={vocabularySet.list_mode}
                >
                  <option value="custom">Custom</option>
                  <option value="spec_only">Spec only</option>
                  <option value="extended_only">Extended only</option>
                  <option value="spec_and_extended">Spec + extended</option>
                </Select>
              </FormField>

              <FormField label="Set type" htmlFor="setType">
                <Select id="setType" name="setType" defaultValue={vocabularySet.set_type}>
                  <option value="lesson_custom">Lesson custom</option>
                  <option value="specification">Specification</option>
                  <option value="core">Core</option>
                  <option value="theme">Theme</option>
                  <option value="phrase_bank">Phrase bank</option>
                  <option value="exam_prep">Exam prep</option>
                </Select>
              </FormField>

              <FormField label="Default display" htmlFor="defaultDisplayVariant">
                <Select
                  id="defaultDisplayVariant"
                  name="defaultDisplayVariant"
                  defaultValue={vocabularySet.default_display_variant}
                >
                  <option value="single_column">Single column</option>
                  <option value="two_column">Two column</option>
                  <option value="compact_cards">Compact cards</option>
                </Select>
              </FormField>
            </div>
          </section>

          <section className="app-surface app-section-padding">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Import metadata
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Stable source metadata for repeatable manifest imports.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Source key" htmlFor="sourceKey">
                <Input
                  id="sourceKey"
                  name="sourceKey"
                  defaultValue={vocabularySet.source_key ?? ""}
                />
              </FormField>

              <FormField label="Source version" htmlFor="sourceVersion">
                <Input
                  id="sourceVersion"
                  name="sourceVersion"
                  defaultValue={vocabularySet.source_version ?? ""}
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Import key" htmlFor="importKey">
                  <Input
                    id="importKey"
                    name="importKey"
                    defaultValue={vocabularySet.import_key ?? ""}
                  />
                </FormField>
              </div>
            </div>
          </section>

          <section className="app-surface app-section-padding">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Publication
              </h2>
            </div>

            <div className="grid gap-3">
              <ToggleField
                name="isPublished"
                label="Published"
                description="Turn this on when the set should be available to student-facing vocabulary features."
                defaultChecked={vocabularySet.is_published}
              />
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="app-surface app-section-padding">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Current stats
              </h2>

              <div className="grid gap-3">
                <div className="rounded-xl bg-[var(--background-muted)] px-4 py-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
                    Items
                  </div>
                  <div className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                    {items.length}
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--background-muted)] px-4 py-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
                    Total usage
                  </div>
                  <div className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                    {usageStats.totalOccurrences}
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--background-muted)] px-4 py-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
                    Variant usage
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="text-sm text-[var(--text-secondary)]">
                      Foundation: {usageStats.foundationOccurrences}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      Higher: {usageStats.higherOccurrences}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      Volna: {usageStats.volnaOccurrences}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button variant="primary" icon="save">
                  Save changes
                </Button>

                <Button href="/admin/vocabulary" variant="secondary" icon="cancel">
                  Cancel
                </Button>
              </div>
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}
