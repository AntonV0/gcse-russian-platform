import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import {
  bulkCreatePastPaperResourcesAction,
  createPastPaperResourceAction,
} from "@/app/actions/admin/admin-past-paper-actions";
import {
  getPastPaperResourceTypeLabel,
  getPastPaperTierLabel,
  pastPaperPaperNames,
  pastPaperResourceTypes,
  pastPaperTiers,
} from "@/lib/past-papers/past-paper-helpers-db";

const BULK_IMPORT_PLACEHOLDER =
  "title,exam_series,paper_number,paper_name,tier,resource_type,official_url\n" +
  "June 2026 Paper 1 Listening Foundation,June 2026,1,Paper 1 Listening,foundation,question_paper,https://qualifications.pearson.com/...";

export default function PastPaperResourceForms() {
  return (
    <>
      <PanelCard
        title="Bulk import yearly links"
        description="Paste CSV or tab-separated rows when Pearson releases a new exam series. Header row is supported."
        tone="admin"
      >
        <form action={bulkCreatePastPaperResourcesAction} className="space-y-4">
          <FormField
            label="Bulk import rows"
            hint="Columns: title, exam_series, paper_number, paper_name, tier, resource_type, official_url, source_label, is_official, sort_order, is_published, is_trial_visible, requires_paid_access, available_in_volna"
          >
            <Textarea
              name="bulkImport"
              className="font-mono text-sm leading-relaxed"
              rows={8}
              placeholder={BULK_IMPORT_PLACEHOLDER}
              spellCheck={false}
              wrap="off"
            />
          </FormField>

          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              name="skipDuplicateUrls"
              value="true"
              defaultChecked
            />
            Skip duplicate official URLs
          </label>

          <Button type="submit" variant="primary" icon="upload">
            Import links
          </Button>
        </form>
      </PanelCard>

      <PanelCard
        title="Add past paper resource"
        description="Create a new official resource link for a paper, tier, and exam series."
        tone="admin"
      >
        <form action={createPastPaperResourceAction} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField label="Title" required>
              <Input
                name="title"
                required
                placeholder="June 2023 Paper 1 Listening Foundation question paper"
              />
            </FormField>

            <FormField label="Official URL" required>
              <Input
                name="officialUrl"
                required
                type="url"
                placeholder="https://qualifications.pearson.com/..."
              />
            </FormField>

            <FormField label="Exam series / year" required>
              <Input name="examSeries" required placeholder="June 2023" />
            </FormField>

            <FormField label="Source label">
              <Input name="sourceLabel" defaultValue="Pearson" />
            </FormField>

            <FormField label="Paper number" required>
              <Select name="paperNumber" required defaultValue="1">
                <option value="1">Paper 1</option>
                <option value="2">Paper 2</option>
                <option value="3">Paper 3</option>
                <option value="4">Paper 4</option>
              </Select>
            </FormField>

            <FormField label="Paper name" required>
              <Select name="paperName" required defaultValue="Paper 1 Listening">
                {pastPaperPaperNames.map((paperName) => (
                  <option key={paperName} value={paperName}>
                    {paperName}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Tier" required>
              <Select name="tier" required defaultValue="both">
                {pastPaperTiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {getPastPaperTierLabel(tier)}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Resource type" required>
              <Select name="resourceType" required defaultValue="question_paper">
                {pastPaperResourceTypes.map((resourceType) => (
                  <option key={resourceType} value={resourceType}>
                    {getPastPaperResourceTypeLabel(resourceType)}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Sort order">
              <Input name="sortOrder" type="number" min="0" defaultValue="0" />
            </FormField>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="isOfficial" value="true" defaultChecked />
              Official resource
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="isPublished" value="true" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="isTrialVisible" value="true" defaultChecked />
              Trial visible
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="requiresPaidAccess" value="true" />
              Requires paid access
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="availableInVolna" value="true" defaultChecked />
              Volna visible
            </label>
          </div>

          <Button type="submit" variant="primary" icon="create">
            Add resource
          </Button>
        </form>
      </PanelCard>
    </>
  );
}
