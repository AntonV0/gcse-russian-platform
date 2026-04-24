import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { createVocabularySetAction } from "@/app/actions/admin/admin-vocabulary-actions";

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
    <label className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
      <input type="hidden" name={name} value="false" />
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        className="mt-1 h-4 w-4 rounded border-[var(--border)]"
      />

      <div className="min-w-0">
        <div className="text-sm font-semibold text-[var(--text-primary)]">{label}</div>
        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
    </label>
  );
}

export default function CreateVocabularySetPage() {
  return (
    <main className="space-y-8">
      <PageHeader
        title="Create vocabulary set"
        description="Add a new reusable vocabulary set for lessons, revision, and future vocabulary tools."
      />

      <section className="app-surface app-section-padding">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="create">
                New set
              </Badge>
              <Badge tone="muted" icon="language">
                Vocabulary admin
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                Create a reusable vocabulary set
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                Start with the core metadata. Item-level add, edit, reorder, and delete
                can come next once the set exists.
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
        action={createVocabularySetAction}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="space-y-4">
          <section className="app-surface app-section-padding">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Core details
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                These fields define how the vocabulary set is identified and organised.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField
                  label="Title"
                  htmlFor="title"
                  hint="Required. Use a clear internal admin title."
                >
                  <Input
                    id="title"
                    name="title"
                    placeholder="Starter vocabulary"
                    required
                  />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField
                  label="Slug"
                  htmlFor="slug"
                  hint="Optional for now. Leave blank if you do not need a public/admin slug yet."
                >
                  <Input id="slug" name="slug" placeholder="starter-vocabulary" />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField
                  label="Description"
                  htmlFor="description"
                  hint="Optional summary shown in admin and potentially in student-facing tools later."
                >
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Starter vocabulary for introduction to the course"
                  />
                </FormField>
              </div>

              <FormField
                label="Theme key"
                htmlFor="themeKey"
                hint="Optional. Usually matches your spec or platform theme key."
              >
                <Input id="themeKey" name="themeKey" placeholder="identity_and_culture" />
              </FormField>

              <FormField
                label="Topic key"
                htmlFor="topicKey"
                hint="Optional. Usually a more specific topic inside the theme."
              >
                <Input id="topicKey" name="topicKey" placeholder="family_and_friends" />
              </FormField>

              <FormField
                label="Sort order"
                htmlFor="sortOrder"
                hint="Lower numbers appear earlier. Defaults to 0."
              >
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={0}
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
                These settings control what kind of set this is and how it should behave.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Tier"
                htmlFor="tier"
                hint="Choose which course tier this set belongs to."
              >
                <Select id="tier" name="tier" defaultValue="both">
                  <option value="both">Both tiers</option>
                  <option value="foundation">Foundation</option>
                  <option value="higher">Higher</option>
                  <option value="unknown">Unknown</option>
                </Select>
              </FormField>

              <FormField
                label="List mode"
                htmlFor="listMode"
                hint="Defines the vocabulary source mix."
              >
                <Select id="listMode" name="listMode" defaultValue="custom">
                  <option value="custom">Custom</option>
                  <option value="spec_only">Spec only</option>
                  <option value="extended_only">Extended only</option>
                  <option value="spec_and_extended">Spec + extended</option>
                </Select>
              </FormField>

              <FormField
                label="Set type"
                htmlFor="setType"
                hint="Use this to classify the set for future admin filtering."
              >
                <Select id="setType" name="setType" defaultValue="lesson_custom">
                  <option value="lesson_custom">Lesson custom</option>
                  <option value="specification">Specification</option>
                  <option value="core">Core</option>
                  <option value="theme">Theme</option>
                  <option value="phrase_bank">Phrase bank</option>
                  <option value="exam_prep">Exam prep</option>
                </Select>
              </FormField>

              <FormField
                label="Default display"
                htmlFor="defaultDisplayVariant"
                hint="Initial display mode for future student/admin presentation."
              >
                <Select
                  id="defaultDisplayVariant"
                  name="defaultDisplayVariant"
                  defaultValue="single_column"
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
                Optional fields used by the future idempotent vocabulary importer.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Source key" htmlFor="sourceKey">
                <Input id="sourceKey" name="sourceKey" placeholder="pearson_edexcel_gcse_russian" />
              </FormField>

              <FormField label="Source version" htmlFor="sourceVersion">
                <Input id="sourceVersion" name="sourceVersion" placeholder="manual-review-v1" />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Import key" htmlFor="importKey">
                  <Input id="importKey" name="importKey" placeholder="pearson_edexcel_gcse_russian:theme_1" />
                </FormField>
              </div>
            </div>
          </section>

          <section className="app-surface app-section-padding">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Publication
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Decide whether the set should start as a draft or be visible immediately.
              </p>
            </div>

            <div className="grid gap-3">
              <ToggleField
                name="isPublished"
                label="Publish immediately"
                description="Enable this if the set should be available to student-facing vocabulary tools right away."
                defaultChecked={false}
              />
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="app-surface app-section-padding">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Before you save
              </h2>

              <div className="space-y-3">
                <div className="rounded-xl bg-[var(--background-muted)] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
                  Create the set first, then add vocabulary items and usage links after.
                </div>

                <div className="rounded-xl bg-[var(--background-muted)] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
                  Slug, theme key, and topic key can stay blank if you are not ready to
                  structure them yet.
                </div>

                <div className="rounded-xl bg-[var(--background-muted)] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
                  Draft is the safer default while the set is still being built.
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button variant="primary" icon="save">
                  Create vocabulary set
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
