import { notFound } from "next/navigation";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import AdminRow from "@/components/ui/admin-row";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import EmptyState from "@/components/ui/empty-state";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  createGrammarPointAction,
  deleteGrammarPointAction,
} from "@/app/actions/admin/admin-grammar-point-actions";
import {
  getGrammarCategoryLabel,
  getGrammarKnowledgeRequirementLabel,
  getGrammarTierLabel,
  loadGrammarSetByIdDb,
} from "@/lib/grammar/grammar-helpers-db";
import { GRAMMAR_TAGS } from "@/lib/curriculum/grammar-tags";

type GrammarSetPointsPageProps = {
  params: Promise<{ grammarSetId: string }>;
};

export default async function GrammarSetPointsPage({
  params,
}: GrammarSetPointsPageProps) {
  const { grammarSetId } = await params;
  const { grammarSet, points } = await loadGrammarSetByIdDb(grammarSetId);

  if (!grammarSet) {
    notFound();
  }

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Grammar points"
        title={grammarSet.title}
        description="Add, edit, publish, and order the grammar points inside this set."
        badges={
          <>
            <Badge tone="info" icon="school">
              {getGrammarTierLabel(grammarSet.tier)}
            </Badge>
            <PublishStatusBadge
              isPublished={grammarSet.is_published}
              publishedLabel="Set published"
              draftLabel="Set draft"
            />
            <Badge tone="muted" icon="list">
              {points.length} point{points.length === 1 ? "" : "s"}
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/admin/grammar" variant="secondary" icon="back">
              Back
            </Button>
            <Button
              href={`/admin/grammar/${grammarSet.id}/edit`}
              variant="secondary"
              icon="edit"
            >
              Edit set
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <SectionCard
          title="Current points"
          description="Open a point to edit its explanation, examples, and tables."
          tone="admin"
        >
          {points.length === 0 ? (
            <EmptyState
              icon="lessonContent"
              iconTone="brand"
              title="No grammar points yet"
              description="Use the form beside this list to add the first point."
            />
          ) : (
            <div className="space-y-3">
              {points.map((point) => (
                <AdminRow
                  key={point.id}
                  title={point.title}
                  description={point.short_description ?? "No short description yet."}
                  badges={
                    <>
                      <Badge tone="muted">Order {point.sort_order}</Badge>
                      <Badge tone="info">{getGrammarTierLabel(point.tier)}</Badge>
                      <Badge tone="muted" className="capitalize">
                        {getGrammarCategoryLabel(point.category_key)}
                      </Badge>
                      <Badge
                        tone={
                          point.knowledge_requirement === "receptive"
                            ? "warning"
                            : "muted"
                        }
                      >
                        {getGrammarKnowledgeRequirementLabel(
                          point.knowledge_requirement
                        )}
                      </Badge>
                      <PublishStatusBadge isPublished={point.is_published} />
                    </>
                  }
                  actions={
                    <>
                      <Button
                        href={`/admin/grammar/${grammarSet.id}/points/${point.id}/edit`}
                        variant="secondary"
                        size="sm"
                        icon="edit"
                      >
                        Edit
                      </Button>
                      <form action={deleteGrammarPointAction}>
                        <input type="hidden" name="grammarSetId" value={grammarSet.id} />
                        <input type="hidden" name="grammarPointId" value={point.id} />
                        <AdminConfirmButton
                          variant="danger"
                          icon="delete"
                          confirmMessage={`Delete ${point.title}? This also deletes examples and tables.`}
                        >
                          Delete
                        </AdminConfirmButton>
                      </form>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </SectionCard>

        <PanelCard
          title="Add grammar point"
          description="Create the core teaching point first; examples and tables are edited after creation."
          tone="admin"
        >
          <form action={createGrammarPointAction} className="space-y-4">
            <input type="hidden" name="grammarSetId" value={grammarSet.id} />

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

            <FormField label="Receptive scope">
              <Textarea
                name="receptiveScope"
                rows={3}
                placeholder="Only this substructure is receptive, if the point cannot be split further."
              />
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

            <div className="grid gap-4 sm:grid-cols-3">
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

            <CheckboxField
              name="isPublished"
              label="Published"
              description="Visible on the student grammar set page."
            />

            <Button type="submit" variant="primary" icon="create">
              Add grammar point
            </Button>
          </form>
        </PanelCard>
      </div>
    </main>
  );
}
