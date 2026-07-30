import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import Input from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import OperationsWorkspace, {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  VocabularyAdminFormField as FormField,
  VocabularyAdminNoteList,
} from "@/components/admin/vocabulary/items/primitives";
import { createVocabularySetAction } from "@/app/actions/admin/admin-vocabulary-actions";

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

export default function CreateVocabularySetPage() {
  return (
    <main>
      <OperationsWorkspace>
        <OperationsHeader
          eyebrow="Vocabulary admin"
          title="Create vocabulary set"
          description="Add a new reusable vocabulary set for lessons, revision, and future vocabulary tools."
          badges={
            <>
              <Badge tone="info" icon="create">
                New set
              </Badge>
              <Badge tone="muted" icon="language">
                Vocabulary admin
              </Badge>
            </>
          }
          actions={
            <Button href="/admin/vocabulary" variant="secondary" icon="back">
              Back to vocabulary
            </Button>
          }
        />

        <OperationsSection>
          <form
            action={createVocabularySetAction}
            className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]"
          >
        <div className="space-y-4">
          <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4 md:p-5">
            <div className="mb-5">
              <h2 className="app-heading-subsection">Core details</h2>
              <p className="mt-2 app-text-body-muted">
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

          <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4 md:p-5">
            <div className="mb-5">
              <h2 className="app-heading-subsection">Vocabulary settings</h2>
              <p className="mt-2 app-text-body-muted">
                These settings control what kind of set this is and how it should behave.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Tier / path"
                htmlFor="tier"
                hint="Choose which course path this set belongs to."
              >
                <Select id="tier" name="tier" defaultValue="both">
                  <option value="both">All paths</option>
                  <option value="foundation">Foundation path</option>
                  <option value="higher">Higher path</option>
                </Select>
              </FormField>

              <FormField
                label="Source mode"
                htmlFor="listMode"
                hint="Choose whether this set is a curated lesson set or a specification source set."
              >
                <Select id="listMode" name="listMode" defaultValue="custom">
                  <option value="custom">Lesson/custom</option>
                  <option value="spec_only">Specification only</option>
                </Select>
              </FormField>

              <FormField
                label="Set kind"
                htmlFor="setType"
                hint="Keep this aligned with the vocabulary-set filters used across admin."
              >
                <Select id="setType" name="setType" defaultValue="lesson_custom">
                  <option value="lesson_custom">Lesson set</option>
                  <option value="specification">Specification</option>
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

          <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4 md:p-5">
            <div className="mb-5">
              <h2 className="app-heading-subsection">Import metadata</h2>
              <p className="mt-2 app-text-body-muted">
                Optional fields used by the future idempotent vocabulary importer.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Source key" htmlFor="sourceKey">
                <Input
                  id="sourceKey"
                  name="sourceKey"
                  placeholder="pearson_edexcel_gcse_russian"
                />
              </FormField>

              <FormField label="Source version" htmlFor="sourceVersion">
                <Input
                  id="sourceVersion"
                  name="sourceVersion"
                  placeholder="manual-review-v1"
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Import key" htmlFor="importKey">
                  <Input
                    id="importKey"
                    name="importKey"
                    placeholder="pearson_edexcel_gcse_russian:theme_1"
                  />
                </FormField>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4 md:p-5">
            <div className="mb-5">
              <h2 className="app-heading-subsection">Publication</h2>
              <p className="mt-2 app-text-body-muted">
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
          <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)]/45 p-4 md:p-5">
            <div className="space-y-4">
              <h2 className="app-heading-card">Before you save</h2>

              <VocabularyAdminNoteList
                notes={[
                  "Create the set first, then add vocabulary items and usage links after.",
                  "Slug, theme key, and topic key can stay blank if you are not ready to structure them yet.",
                  "Draft is the safer default while the set is still being built.",
                ]}
              />

              <div className="flex flex-col gap-3 pt-2">
                <LoadingButton
                  idleLabel="Create vocabulary set"
                  pendingLabel="Creating vocabulary set..."
                  idleIcon="create"
                  variant="primary"
                />

                <Button href="/admin/vocabulary" variant="secondary" icon="cancel">
                  Cancel
                </Button>
              </div>
            </div>
          </section>
        </div>
          </form>
        </OperationsSection>
      </OperationsWorkspace>
    </main>
  );
}
