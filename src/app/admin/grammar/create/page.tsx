import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CheckboxField from "@/components/ui/checkbox-field";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { createGrammarSetAction } from "@/app/actions/admin/admin-grammar-actions";

export default function CreateGrammarSetPage() {
  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="New grammar set"
        title="Create Grammar Set"
        description="Add a reusable grammar collection that can contain points, examples, and flexible tables."
        badges={
          <>
            <Badge tone="info" icon="create">
              Grammar CMS
            </Badge>
            <Badge tone="muted" icon="lessonContent">
              Set metadata
            </Badge>
          </>
        }
        actions={
          <Button href="/admin/grammar" variant="secondary" icon="back">
            Back to grammar
          </Button>
        }
      />

      <form
        action={createGrammarSetAction}
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="space-y-4">
          <SectionCard
            title="Core details"
            description="Name, describe, and organise this grammar set."
            tone="admin"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField label="Title" required>
                  <Input name="title" required placeholder="Present tense verbs" />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField
                  label="Slug"
                  description="Leave blank to generate from the title."
                >
                  <Input name="slug" placeholder="present-tense-verbs" />
                </FormField>
              </div>

              <div className="md:col-span-2">
                <FormField label="Description">
                  <Textarea
                    name="description"
                    placeholder="A focused set covering regular and common irregular present tense patterns."
                  />
                </FormField>
              </div>

              <FormField label="Theme key">
                <Input name="themeKey" placeholder="identity_and_culture" />
              </FormField>

              <FormField label="Topic key">
                <Input name="topicKey" placeholder="family_and_friends" />
              </FormField>

              <FormField label="Sort order">
                <Input name="sortOrder" type="number" min={0} step={1} defaultValue={0} />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard
            title="Classification"
            description="Connect the set to tier and future filtering."
            tone="admin"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Tier">
                <Select name="tier" defaultValue="both">
                  <option value="both">Both tiers</option>
                  <option value="foundation">Foundation</option>
                  <option value="higher">Higher</option>
                  <option value="unknown">Unknown</option>
                </Select>
              </FormField>
            </div>
          </SectionCard>

          <SectionCard
            title="Import metadata"
            description="Optional source fields for future spec imports."
            tone="admin"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Source key">
                <Input name="sourceKey" placeholder="pearson_edexcel_gcse_russian" />
              </FormField>

              <FormField label="Source version">
                <Input name="sourceVersion" placeholder="manual-review-v1" />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Import key">
                  <Input name="importKey" placeholder="grammar:foundation:verbs" />
                </FormField>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <PanelCard
            title="Publication"
            description="Control visibility and access before adding grammar points."
            tone="admin"
          >
            <div className="space-y-3">
              <CheckboxField
                name="isPublished"
                label="Published"
                description="Visible in the student grammar area once access checks pass."
              />

              <CheckboxField
                name="isTrialVisible"
                label="Trial visible"
                description="Allow trial students to view this grammar set."
              />

              <CheckboxField
                name="requiresPaidAccess"
                label="Requires paid access"
                description="Keep enabled for grammar content outside the trial sample."
                defaultChecked
              />

              <CheckboxField
                name="availableInVolna"
                label="Available in Volna"
                description="Allow Volna students and teachers to use this set."
                defaultChecked
              />
            </div>
          </PanelCard>

          <PanelCard tone="admin">
            <div className="flex flex-col gap-3">
              <Button type="submit" variant="primary" icon="save">
                Create grammar set
              </Button>
              <Button href="/admin/grammar" variant="secondary" icon="cancel">
                Cancel
              </Button>
            </div>
          </PanelCard>
        </div>
      </form>
    </main>
  );
}
