import { updateGrammarPointAction } from "@/app/actions/admin/admin-grammar-point-actions";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { GRAMMAR_TAGS } from "@/lib/curriculum/grammar-tags";
import {
  getGrammarPointReadiness,
  type DbGrammarExample,
  type DbGrammarPoint,
  type DbGrammarSet,
  type DbGrammarTable,
} from "@/lib/grammar/grammar-helpers-db";

function ReadinessRow({
  label,
  isReady,
  readyLabel,
  missingLabel,
  required = true,
}: {
  label: string;
  isReady: boolean;
  readyLabel: string;
  missingLabel: string;
  required?: boolean;
}) {
  const tone = isReady ? "success" : required ? "warning" : "muted";

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="min-w-0 app-text-body-muted">{label}</span>
      <Badge tone={tone} icon={isReady ? "success" : required ? "warning" : "table"}>
        {isReady ? readyLabel : missingLabel}
      </Badge>
    </div>
  );
}

export default function GrammarPointMainForm({
  grammarSet,
  grammarPoint,
  examples,
  tables,
}: {
  grammarSet: DbGrammarSet;
  grammarPoint: DbGrammarPoint;
  examples: DbGrammarExample[];
  tables: DbGrammarTable[];
}) {
  const readiness = getGrammarPointReadiness({
    fullExplanation: grammarPoint.full_explanation,
    exampleCount: examples.length,
    tableCount: tables.length,
  });
  const publishDescription = grammarPoint.is_published
    ? readiness.canPublish
      ? "Visible on student grammar pages."
      : "This legacy published point stays editable, but it should be reviewed."
    : readiness.canPublish
      ? "Ready for first publish."
      : "First publish is blocked until required learner content is complete.";

  return (
    <form
      action={updateGrammarPointAction}
      className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]"
    >
      <input type="hidden" name="grammarSetId" value={grammarSet.id} />
      <input type="hidden" name="grammarPointId" value={grammarPoint.id} />

      <SectionCard
        title="Teaching content"
        description="This is the main student-facing grammar explanation."
        tone="admin"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField label="Title" required>
              <Input name="title" defaultValue={grammarPoint.title} required />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="Slug">
              <Input name="slug" defaultValue={grammarPoint.slug} />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="Short description">
              <Textarea
                name="shortDescription"
                rows={4}
                defaultValue={grammarPoint.short_description ?? ""}
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="Full explanation">
              <Textarea
                name="fullExplanation"
                rows={14}
                defaultValue={grammarPoint.full_explanation ?? ""}
              />
            </FormField>
          </div>

          <FormField label="Spec reference">
            <Input
              name="specReference"
              defaultValue={grammarPoint.spec_reference ?? ""}
            />
          </FormField>

          <FormField label="Grammar tag">
            <Select
              name="grammarTagKey"
              defaultValue={grammarPoint.grammar_tag_key ?? ""}
            >
              <option value="">No tag</option>
              {GRAMMAR_TAGS.map((tag) => (
                <option key={tag.key} value={tag.key}>
                  {tag.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Category key">
            <Input name="categoryKey" defaultValue={grammarPoint.category_key ?? ""} />
          </FormField>

          <FormField label="Tier">
            <Select name="tier" defaultValue={grammarPoint.tier}>
              <option value="both">Both tiers</option>
              <option value="foundation">Foundation</option>
              <option value="higher">Higher</option>
              <option value="unknown">Unknown</option>
            </Select>
          </FormField>

          <FormField
            label="Knowledge requirement"
            description="Use receptive for specification points marked (R)."
          >
            <Select
              name="knowledgeRequirement"
              defaultValue={grammarPoint.knowledge_requirement}
            >
              <option value="productive">Productive knowledge</option>
              <option value="receptive">Receptive knowledge</option>
              <option value="mixed">Mixed knowledge</option>
              <option value="unknown">Unknown requirement</option>
            </Select>
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Receptive scope">
              <Textarea
                name="receptiveScope"
                rows={3}
                defaultValue={grammarPoint.receptive_scope ?? ""}
              />
            </FormField>
          </div>

          <FormField label="Sort order">
            <Input
              name="sortOrder"
              type="number"
              min={0}
              step={1}
              defaultValue={grammarPoint.sort_order}
            />
          </FormField>

          <FormField label="Source key">
            <Input name="sourceKey" defaultValue={grammarPoint.source_key ?? ""} />
          </FormField>

          <FormField label="Source version">
            <Input
              name="sourceVersion"
              defaultValue={grammarPoint.source_version ?? ""}
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Import key">
              <Input name="importKey" defaultValue={grammarPoint.import_key ?? ""} />
            </FormField>
          </div>
        </div>
      </SectionCard>

      <div className="space-y-4">
        <PanelCard title="Publication" tone="admin">
          <div className="space-y-4">
            <CheckboxField
              name="isPublished"
              label="Published"
              defaultChecked={grammarPoint.is_published}
              description={publishDescription}
            />

            <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--background-muted)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="app-text-caption font-semibold">Content readiness</p>
                <Badge tone={readiness.canPublish ? "success" : "warning"}>
                  {readiness.canPublish ? "Ready" : "Needs content"}
                </Badge>
              </div>

              <div className="space-y-2">
                <ReadinessRow
                  label="Full explanation"
                  isReady={readiness.hasExplanation}
                  readyLabel="Ready"
                  missingLabel="Missing"
                />
                <ReadinessRow
                  label="Student examples"
                  isReady={readiness.hasExamples}
                  readyLabel={`${examples.length} example${examples.length === 1 ? "" : "s"}`}
                  missingLabel="Missing"
                />
                <ReadinessRow
                  label="Tables"
                  isReady={readiness.hasTables}
                  readyLabel={`${tables.length} table${tables.length === 1 ? "" : "s"}`}
                  missingLabel="Optional"
                  required={false}
                />
              </div>

              {readiness.canPublish ? (
                <p className="app-text-body-muted">
                  Tables stay advisory because some grammar points do not need a form
                  table.
                </p>
              ) : (
                <p className="app-text-body-muted">
                  Draft points need a full explanation and at least one student example
                  before first publish.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <LoadingButton
                idleLabel="Save point"
                pendingLabel="Saving point..."
                idleIcon="save"
                variant="primary"
              />
              <Button
                href={`/admin/grammar/${grammarSet.id}/points`}
                variant="secondary"
                icon="cancel"
              >
                Cancel
              </Button>
            </div>
          </div>
        </PanelCard>
      </div>
    </form>
  );
}
