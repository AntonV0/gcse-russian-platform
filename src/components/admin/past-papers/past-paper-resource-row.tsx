import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Button from "@/components/ui/button";
import { DataTableCell, DataTableRow } from "@/components/ui/data-table";
import Input from "@/components/ui/input";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import Select from "@/components/ui/select";
import {
  deletePastPaperResourceAction,
  updatePastPaperResourceAction,
} from "@/app/actions/admin/admin-past-paper-actions";
import {
  getPastPaperResourceTypeLabel,
  getPastPaperResourcesDb,
  getPastPaperTierLabel,
  pastPaperPaperNames,
  pastPaperResourceTypes,
  pastPaperTiers,
} from "@/lib/past-papers/past-paper-helpers-db";

type PastPaperResource = Awaited<ReturnType<typeof getPastPaperResourcesDb>>[number];

export default function PastPaperResourceRow({
  resource,
}: {
  resource: PastPaperResource;
}) {
  const formId = `past-paper-${resource.id}`;

  return (
    <DataTableRow>
      <DataTableCell>
        <div className="grid gap-2">
          <Input
            form={formId}
            name="title"
            defaultValue={resource.title}
            aria-label="Title"
          />
          <Input
            form={formId}
            name="officialUrl"
            type="url"
            defaultValue={resource.official_url}
            aria-label="Official URL"
          />
          <div className="grid gap-2 md:grid-cols-2">
            <Input
              form={formId}
              name="examSeries"
              defaultValue={resource.exam_series}
              aria-label="Exam series"
            />
            <Input
              form={formId}
              name="sourceLabel"
              defaultValue={resource.source_label}
              aria-label="Source label"
            />
          </div>
        </div>
      </DataTableCell>

      <DataTableCell>
        <div className="grid gap-2">
          <Select
            form={formId}
            name="paperNumber"
            defaultValue={String(resource.paper_number)}
            aria-label="Paper number"
          >
            <option value="1">Paper 1</option>
            <option value="2">Paper 2</option>
            <option value="3">Paper 3</option>
            <option value="4">Paper 4</option>
          </Select>
          <Select
            form={formId}
            name="paperName"
            defaultValue={resource.paper_name}
            aria-label="Paper name"
          >
            {pastPaperPaperNames.map((paperName) => (
              <option key={paperName} value={paperName}>
                {paperName}
              </option>
            ))}
          </Select>
          <Select
            form={formId}
            name="tier"
            defaultValue={resource.tier}
            aria-label="Tier"
          >
            {pastPaperTiers.map((tier) => (
              <option key={tier} value={tier}>
                {getPastPaperTierLabel(tier)}
              </option>
            ))}
          </Select>
        </div>
      </DataTableCell>

      <DataTableCell>
        <div className="grid gap-2">
          <Select
            form={formId}
            name="resourceType"
            defaultValue={resource.resource_type}
            aria-label="Resource type"
          >
            {pastPaperResourceTypes.map((resourceType) => (
              <option key={resourceType} value={resourceType}>
                {getPastPaperResourceTypeLabel(resourceType)}
              </option>
            ))}
          </Select>
          <Input
            form={formId}
            name="sortOrder"
            type="number"
            min="0"
            defaultValue={String(resource.sort_order)}
            aria-label="Sort order"
          />
        </div>
      </DataTableCell>

      <DataTableCell>
        <div className="space-y-2">
          <PublishStatusBadge isPublished={resource.is_published} />
          <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <input
              form={formId}
              type="checkbox"
              name="isPublished"
              value="true"
              defaultChecked={resource.is_published}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <input
              form={formId}
              type="checkbox"
              name="isOfficial"
              value="true"
              defaultChecked={resource.is_official}
            />
            Official
          </label>
        </div>
      </DataTableCell>

      <DataTableCell>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <input
              form={formId}
              type="checkbox"
              name="isTrialVisible"
              value="true"
              defaultChecked={resource.is_trial_visible}
            />
            Trial
          </label>
          <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <input
              form={formId}
              type="checkbox"
              name="requiresPaidAccess"
              value="true"
              defaultChecked={resource.requires_paid_access}
            />
            Paid
          </label>
          <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <input
              form={formId}
              type="checkbox"
              name="availableInVolna"
              value="true"
              defaultChecked={resource.available_in_volna}
            />
            Volna
          </label>
        </div>
      </DataTableCell>

      <DataTableCell>
        <div className="flex flex-wrap gap-2">
          <form id={formId} action={updatePastPaperResourceAction}>
            <input type="hidden" name="resourceId" value={resource.id} />
            <Button type="submit" variant="primary" size="sm" icon="save">
              Save
            </Button>
          </form>

          <form action={deletePastPaperResourceAction}>
            <input type="hidden" name="resourceId" value={resource.id} />
            <AdminConfirmButton
              variant="danger"
              icon="delete"
              confirmMessage={`Delete ${resource.title}?`}
            >
              Delete
            </AdminConfirmButton>
          </form>
        </div>
      </DataTableCell>
    </DataTableRow>
  );
}
