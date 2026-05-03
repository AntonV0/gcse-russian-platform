import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import Input from "@/components/ui/input";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  VocabularyAdminFormField as FormField,
  VocabularyAdminStatTile,
} from "@/components/admin/vocabulary/items/primitives";
import { updateVocabularySetAction } from "@/app/actions/admin/admin-vocabulary-actions";
import { loadVocabularySetByIdDb } from "@/lib/vocabulary/sets/loaders";

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

              <PublishStatusBadge isPublished={vocabularySet.is_published} />
            </div>

            <div className="space-y-2">
              <h2 className="app-heading-section">{vocabularySet.title}</h2>
              <p className="max-w-3xl app-text-body-muted">
                Update set metadata here. Use the dedicated items page when you need to
                review, add, edit, or delete vocabulary entries.
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
              <h2 className="app-heading-subsection">Core details</h2>
              <p className="mt-2 app-text-body-muted">
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
              <h2 className="app-heading-subsection">Vocabulary settings</h2>
              <p className="mt-2 app-text-body-muted">
                Control set structure, display defaults, and classification.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Tier / path" htmlFor="tier">
                <Select id="tier" name="tier" defaultValue={vocabularySet.tier}>
                  <option value="both">All paths</option>
                  <option value="foundation">Foundation path</option>
                  <option value="higher">Higher path</option>
                  {vocabularySet.tier === "unknown" ? (
                    <option value="unknown">Unknown (legacy)</option>
                  ) : null}
                </Select>
              </FormField>

              <FormField label="Source mode" htmlFor="listMode">
                <Select
                  id="listMode"
                  name="listMode"
                  defaultValue={vocabularySet.list_mode}
                >
                  <option value="custom">Lesson/custom</option>
                  <option value="spec_only">Specification only</option>
                  {vocabularySet.list_mode === "extended_only" ? (
                    <option value="extended_only">Extended only (legacy)</option>
                  ) : null}
                  {vocabularySet.list_mode === "spec_and_extended" ? (
                    <option value="spec_and_extended">Spec + extended (legacy)</option>
                  ) : null}
                </Select>
              </FormField>

              <FormField label="Set kind" htmlFor="setType">
                <Select id="setType" name="setType" defaultValue={vocabularySet.set_type}>
                  <option value="lesson_custom">Lesson set</option>
                  <option value="specification">Specification</option>
                  {vocabularySet.set_type === "core" ? (
                    <option value="core">Core (legacy)</option>
                  ) : null}
                  {vocabularySet.set_type === "theme" ? (
                    <option value="theme">Theme (legacy)</option>
                  ) : null}
                  {vocabularySet.set_type === "phrase_bank" ? (
                    <option value="phrase_bank">Phrase bank (legacy)</option>
                  ) : null}
                  {vocabularySet.set_type === "exam_prep" ? (
                    <option value="exam_prep">Exam prep (legacy)</option>
                  ) : null}
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
              <h2 className="app-heading-subsection">Import metadata</h2>
              <p className="mt-2 app-text-body-muted">
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
              <h2 className="app-heading-subsection">Publication</h2>
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
              <h2 className="app-heading-card">Current stats</h2>

              <div className="grid gap-3">
                <VocabularyAdminStatTile label="Items" value={items.length} />
                <VocabularyAdminStatTile
                  label="Total usage"
                  value={usageStats.totalOccurrences}
                />

                <div className="rounded-xl bg-[var(--background-muted)] px-4 py-3">
                  <div className="app-text-meta">Variant usage</div>
                  <div className="mt-3 space-y-2">
                    <div className="app-text-caption">
                      Foundation: {usageStats.foundationOccurrences}
                    </div>
                    <div className="app-text-caption">
                      Higher: {usageStats.higherOccurrences}
                    </div>
                    <div className="app-text-caption">
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
