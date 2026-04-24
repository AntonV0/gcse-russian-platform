import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableHeaderRow,
  DataTableRow,
} from "@/components/ui/data-table";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import Select from "@/components/ui/select";
import TableShell from "@/components/ui/table-shell";
import TableToolbar from "@/components/ui/table-toolbar";
import Textarea from "@/components/ui/textarea";
import {
  bulkCreatePastPaperResourcesAction,
  createPastPaperResourceAction,
  deletePastPaperResourceAction,
  updatePastPaperResourceAction,
} from "@/app/actions/admin/admin-past-paper-actions";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getPastPaperExamSeriesOptions,
  getPastPaperResourceTypeLabel,
  getPastPaperResourcesDb,
  getPastPaperTierLabel,
  pastPaperPaperNames,
  pastPaperResourceTypes,
  pastPaperTiers,
  type PastPaperResourceFilters,
  type PastPaperResourceType,
  type PastPaperTier,
} from "@/lib/past-papers/past-paper-helpers-db";

type AdminPastPapersPageProps = {
  searchParams?: Promise<{
    examSeries?: string;
    paperNumber?: string;
    tier?: string;
    resourceType?: string;
    published?: string;
  }>;
};

function normalizePaperNumberFilter(
  value?: string
): PastPaperResourceFilters["paperNumber"] {
  const numberValue = Number(value);

  if ([1, 2, 3, 4].includes(numberValue)) {
    return numberValue;
  }

  return "all";
}

function normalizeTierFilter(value?: string): PastPaperResourceFilters["tier"] {
  if (pastPaperTiers.includes(value as PastPaperTier)) {
    return value as PastPaperTier;
  }

  return "all";
}

function normalizeResourceTypeFilter(
  value?: string
): PastPaperResourceFilters["resourceType"] {
  if (pastPaperResourceTypes.includes(value as PastPaperResourceType)) {
    return value as PastPaperResourceType;
  }

  return "all";
}

function normalizePublishedFilter(value?: string): PastPaperResourceFilters["published"] {
  if (value === "published" || value === "draft") return value;
  return "all";
}

export default async function AdminPastPapersPage({
  searchParams,
}: AdminPastPapersPageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const params = (await searchParams) ?? {};
  const allResources = await getPastPaperResourcesDb();
  const filters: PastPaperResourceFilters = {
    examSeries: params.examSeries ?? null,
    paperNumber: normalizePaperNumberFilter(params.paperNumber),
    tier: normalizeTierFilter(params.tier),
    resourceType: normalizeResourceTypeFilter(params.resourceType),
    published: normalizePublishedFilter(params.published),
  };
  const resources = await getPastPaperResourcesDb(filters);
  const examSeriesOptions = getPastPaperExamSeriesOptions(allResources);
  const publishedCount = allResources.filter((resource) => resource.is_published).length;

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Admin exam resources"
        title="Past Papers Library"
        description="Manage official Pearson Edexcel GCSE Russian 1RU0 past paper resource links. Store metadata and official URLs only, not Pearson paper content."
        badges={
          <>
            <Badge tone="info" icon="file">
              Pearson links
            </Badge>
            <Badge tone="muted" icon="list">
              {allResources.length} resource{allResources.length === 1 ? "" : "s"}
            </Badge>
            <Badge tone="success" icon="preview">
              {publishedCount} published
            </Badge>
          </>
        }
        actions={
          <Button href="/past-papers" variant="secondary" icon="preview">
            Student view
          </Button>
        }
      />

      <FeedbackBanner
        tone="warning"
        title="Copyright-safe resource model"
        description="Paste official Pearson URLs and keep this library as metadata plus links. Do not copy Pearson question papers, mark schemes, transcripts, or audio content into the platform database."
      />

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
              className="font-mono"
              rows={8}
              placeholder={"title,exam_series,paper_number,paper_name,tier,resource_type,official_url,source_label,is_official,sort_order,is_published,is_trial_visible,requires_paid_access,available_in_volna\nJune 2026 Paper 1 Listening Foundation question paper,June 2026,1,Paper 1 Listening,foundation,question_paper,https://qualifications.pearson.com/...,Pearson,true,0,false,true,false,true"}
            />
          </FormField>

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

      <TableShell
        title="Past paper resources"
        description="Filter official links, edit metadata, publish drafts, and delete outdated entries."
      >
        <TableToolbar>
          <form className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
            <div className="w-full lg:max-w-[180px]">
              <Select name="examSeries" defaultValue={params.examSeries ?? ""}>
                <option value="">All series</option>
                {examSeriesOptions.map((examSeries) => (
                  <option key={examSeries} value={examSeries}>
                    {examSeries}
                  </option>
                ))}
              </Select>
            </div>

            <div className="w-full lg:max-w-[150px]">
              <Select
                name="paperNumber"
                defaultValue={String(filters.paperNumber ?? "all")}
              >
                <option value="all">All papers</option>
                <option value="1">Paper 1</option>
                <option value="2">Paper 2</option>
                <option value="3">Paper 3</option>
                <option value="4">Paper 4</option>
              </Select>
            </div>

            <div className="w-full lg:max-w-[170px]">
              <Select name="tier" defaultValue={filters.tier ?? "all"}>
                <option value="all">All tiers</option>
                {pastPaperTiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {getPastPaperTierLabel(tier)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="w-full lg:max-w-[220px]">
              <Select
                name="resourceType"
                defaultValue={filters.resourceType ?? "all"}
              >
                <option value="all">All resource types</option>
                {pastPaperResourceTypes.map((resourceType) => (
                  <option key={resourceType} value={resourceType}>
                    {getPastPaperResourceTypeLabel(resourceType)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="w-full lg:max-w-[160px]">
              <Select name="published" defaultValue={filters.published ?? "all"}>
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="secondary" size="sm" icon="filter">
                Apply
              </Button>
              <Button href="/admin/past-papers" variant="quiet" size="sm" icon="refresh">
                Reset
              </Button>
            </div>
          </form>
        </TableToolbar>

        {resources.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon="file"
              iconTone="brand"
              title="No past paper resources found"
              description="Add the first Pearson resource link, or clear the current filters."
            />
          </div>
        ) : (
          <DataTable>
            <DataTableHead>
              <DataTableHeaderRow>
                <DataTableHeaderCell>Resource</DataTableHeaderCell>
                <DataTableHeaderCell>Paper</DataTableHeaderCell>
                <DataTableHeaderCell>Type</DataTableHeaderCell>
                <DataTableHeaderCell>Status</DataTableHeaderCell>
                <DataTableHeaderCell>Access</DataTableHeaderCell>
                <DataTableHeaderCell>Actions</DataTableHeaderCell>
              </DataTableHeaderRow>
            </DataTableHead>

            <DataTableBody>
              {resources.map((resource) => {
                const formId = `past-paper-${resource.id}`;

                return (
                  <DataTableRow key={resource.id}>
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
                        <Badge
                          tone={resource.is_published ? "success" : "warning"}
                          icon={resource.is_published ? "preview" : "pending"}
                        >
                          {resource.is_published ? "Published" : "Draft"}
                        </Badge>
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
              })}
            </DataTableBody>
          </DataTable>
        )}
      </TableShell>
    </main>
  );
}
