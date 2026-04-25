import { notFound } from "next/navigation";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  deleteGrammarSetAction,
  updateGrammarSetAction,
} from "@/app/actions/admin/admin-grammar-actions";
import { getGrammarTierLabel, loadGrammarSetByIdDb } from "@/lib/grammar/grammar-helpers-db";

type EditGrammarSetPageProps = {
  params: Promise<{ grammarSetId: string }>;
};

export default async function EditGrammarSetPage({ params }: EditGrammarSetPageProps) {
  const { grammarSetId } = await params;
  const { grammarSet, points } = await loadGrammarSetByIdDb(grammarSetId);

  if (!grammarSet) {
    notFound();
  }

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Edit grammar set"
        title={grammarSet.title}
        description="Update grammar-set metadata, access rules, and publication state."
        badges={
          <>
            <Badge tone="info" icon="school">
              {getGrammarTierLabel(grammarSet.tier)}
            </Badge>
            <PublishStatusBadge isPublished={grammarSet.is_published} />
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
              href={`/admin/grammar/${grammarSet.id}/points`}
              variant="primary"
              icon="list"
            >
              Manage points
            </Button>
          </>
        }
      />

      <form
        action={updateGrammarSetAction}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        <input type="hidden" name="grammarSetId" value={grammarSet.id} />

        <div className="space-y-4">
          <SectionCard
            title="Core details"
            description="These details organise the grammar set across admin and student pages."
            tone="admin"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField label="Title" required>
                  <Input name="title" defaultValue={grammarSet.title} required />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Slug">
                  <Input name="slug" defaultValue={grammarSet.slug} />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Description">
                  <Textarea
                    name="description"
                    defaultValue={grammarSet.description ?? ""}
                  />
                </FormField>
              </div>

              <FormField label="Theme key">
                <Input name="themeKey" defaultValue={grammarSet.theme_key ?? ""} />
              </FormField>

              <FormField label="Topic key">
                <Input name="topicKey" defaultValue={grammarSet.topic_key ?? ""} />
              </FormField>

              <FormField label="Sort order">
                <Input
                  name="sortOrder"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={grammarSet.sort_order}
                />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Classification" tone="admin">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Tier">
                <Select name="tier" defaultValue={grammarSet.tier}>
                  <option value="both">Both tiers</option>
                  <option value="foundation">Foundation</option>
                  <option value="higher">Higher</option>
                  <option value="unknown">Unknown</option>
                </Select>
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Import metadata" tone="admin">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Source key">
                <Input name="sourceKey" defaultValue={grammarSet.source_key ?? ""} />
              </FormField>

              <FormField label="Source version">
                <Input
                  name="sourceVersion"
                  defaultValue={grammarSet.source_version ?? ""}
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Import key">
                  <Input name="importKey" defaultValue={grammarSet.import_key ?? ""} />
                </FormField>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <PanelCard
            title="Publication and access"
            description="These controls shape student and teacher visibility."
            tone="admin"
          >
            <div className="space-y-3">
              <CheckboxField
                name="isPublished"
                label="Published"
                defaultChecked={grammarSet.is_published}
              />
              <CheckboxField
                name="isTrialVisible"
                label="Trial visible"
                defaultChecked={grammarSet.is_trial_visible}
              />
              <CheckboxField
                name="requiresPaidAccess"
                label="Requires paid access"
                defaultChecked={grammarSet.requires_paid_access}
              />
              <CheckboxField
                name="availableInVolna"
                label="Available in Volna"
                defaultChecked={grammarSet.available_in_volna}
              />
            </div>
          </PanelCard>

          <PanelCard title="Save changes" tone="admin">
            <div className="flex flex-col gap-3">
              <Button type="submit" variant="primary" icon="save">
                Save grammar set
              </Button>
              <Button href="/admin/grammar" variant="secondary" icon="cancel">
                Cancel
              </Button>
            </div>
          </PanelCard>
        </div>
      </form>

      <PanelCard
        title="Danger zone"
        description="Deleting a set also removes its grammar points, examples, and tables."
        tone="muted"
      >
        <form action={deleteGrammarSetAction}>
          <input type="hidden" name="grammarSetId" value={grammarSet.id} />
          <AdminConfirmButton
            variant="danger"
            icon="delete"
            confirmMessage={`Delete ${grammarSet.title}? This cannot be undone.`}
          >
            Delete grammar set
          </AdminConfirmButton>
        </form>
      </PanelCard>
    </main>
  );
}
