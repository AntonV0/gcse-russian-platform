import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import FeedbackBanner from "@/components/ui/feedback-banner";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PastPaperResourceForms from "@/components/admin/past-papers/past-paper-resource-forms";
import PastPaperResourceTable from "@/components/admin/past-papers/past-paper-resource-table";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getPastPaperExamSeriesOptions,
  getPastPaperResourcesDb,
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
    imported?: string;
    skipped?: string;
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
  const importedCount = Number(params.imported ?? "");
  const skippedCount = Number(params.skipped ?? "");
  const hasImportResult = Number.isFinite(importedCount) && Number.isFinite(skippedCount);

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Admin exam resources"
        title="Past Papers Library"
        description="Manage official Pearson Edexcel GCSE Russian 1RU0 past paper resource links. Store metadata and official URLs only, not Pearson paper content."
        badges={
          <>
            <Badge tone="info" icon="pastPapers">
              Pearson links
            </Badge>
            <Badge tone="muted" icon="list">
              {allResources.length} resource{allResources.length === 1 ? "" : "s"}
            </Badge>
            <Badge tone="success" icon="published">
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

      {hasImportResult ? (
        <FeedbackBanner
          tone="success"
          title="Bulk import complete"
          description={`${importedCount} row${importedCount === 1 ? "" : "s"} imported. ${skippedCount} duplicate row${skippedCount === 1 ? "" : "s"} skipped.`}
        />
      ) : null}

      <PastPaperResourceForms />

      <PastPaperResourceTable
        resources={resources}
        filters={filters}
        examSeriesOptions={examSeriesOptions}
        selectedExamSeries={params.examSeries}
      />
    </main>
  );
}
