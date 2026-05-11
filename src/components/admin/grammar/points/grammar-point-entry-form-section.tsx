import { createGrammarPointAction } from "@/app/actions/admin/admin-grammar-point-actions";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { GRAMMAR_TAGS } from "@/lib/curriculum/grammar-tags";
import type { DbGrammarSet } from "@/lib/grammar/grammar-helpers-db";

export function GrammarPointEntryFormSection({
  grammarSet,
  defaultOpen = false,
}: {
  grammarSet: DbGrammarSet;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group" open={defaultOpen}>
      <summary className="app-surface app-section-padding flex cursor-pointer list-none items-start justify-between gap-4">
        <span>
          <span className="block app-heading-subsection">Add grammar point</span>
          <span className="mt-2 block app-text-body-muted">
            Create the core teaching point first; examples and tables are edited after
            creation.
          </span>
        </span>
        <span className="font-semibold app-text-caption group-open:hidden">Open</span>
        <span className="hidden font-semibold app-text-caption group-open:inline">
          Close
        </span>
      </summary>

      <form
        action={createGrammarPointAction}
        className="mt-4 app-surface app-section-padding space-y-4"
      >
        <input type="hidden" name="grammarSetId" value={grammarSet.id} />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
          <div className="space-y-4">
            <FormField label="Title" required>
              <Input name="title" required placeholder="Present tense endings" />
            </FormField>

            <FormField label="Slug" description="Leave blank to generate from the title.">
              <Input name="slug" placeholder="present-tense-endings" />
            </FormField>

            <FormField label="Short description">
              <Textarea
                name="shortDescription"
                rows={4}
                placeholder="How regular present tense verbs change for different subjects."
              />
            </FormField>

            <FormField label="Full explanation">
              <Textarea
                name="fullExplanation"
                rows={8}
                placeholder="Write the full student-facing explanation here."
              />
            </FormField>

            <FormField label="Receptive scope">
              <Textarea
                name="receptiveScope"
                rows={3}
                placeholder="Only this substructure is receptive, if the point cannot be split further."
              />
            </FormField>
          </div>

          <div className="space-y-4">
            <FormField label="Spec reference">
              <Input
                name="specReference"
                placeholder="Foundation grammar appendix: verbs"
              />
            </FormField>

            <FormField label="Grammar tag">
              <Select name="grammarTagKey" defaultValue="">
                <option value="">No tag</option>
                {GRAMMAR_TAGS.map((tag) => (
                  <option key={tag.key} value={tag.key}>
                    {tag.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Category key">
              <Input name="categoryKey" placeholder="verbs" />
            </FormField>

            <FormField
              label="Knowledge requirement"
              description="Use receptive for structures marked (R) in the specification."
            >
              <Select name="knowledgeRequirement" defaultValue="productive">
                <option value="productive">Productive knowledge</option>
                <option value="receptive">Receptive knowledge</option>
                <option value="mixed">Mixed knowledge</option>
                <option value="unknown">Unknown requirement</option>
              </Select>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Tier">
                <Select name="tier" defaultValue={grammarSet.tier}>
                  <option value="both">Both tiers</option>
                  <option value="foundation">Foundation</option>
                  <option value="higher">Higher</option>
                  <option value="unknown">Unknown</option>
                </Select>
              </FormField>

              <FormField label="Sort order">
                <Input name="sortOrder" type="number" min={0} step={1} />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <FormField label="Source key">
                <Input name="sourceKey" placeholder="edexcel_gcse_russian_spec" />
              </FormField>

              <FormField label="Source version">
                <Input name="sourceVersion" placeholder="Appendix 2" />
              </FormField>

              <FormField label="Import key">
                <Input name="importKey" placeholder="foundation:verbs:present-tense" />
              </FormField>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
              <p className="app-text-caption font-semibold">Draft first</p>
              <p className="mt-1 app-text-body-muted">
                New grammar points start as drafts. Add examples, review the student
                content, then publish from the edit page.
              </p>
            </div>

            <Button type="submit" variant="primary" icon="create">
              Add grammar point
            </Button>
          </div>
        </div>
      </form>
    </details>
  );
}
