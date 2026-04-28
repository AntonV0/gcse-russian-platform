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
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import Select from "@/components/ui/select";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import TableShell from "@/components/ui/table-shell";
import TableToolbar from "@/components/ui/table-toolbar";
import { deleteVocabularySetAction } from "@/app/actions/admin/admin-vocabulary-actions";
import {
  getVocabularyDisplayVariantLabel,
  getVocabularyListModeLabel,
  getVocabularySetTypeLabel,
  getVocabularySourceLabel,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
  getVocabularyTopicLabel,
} from "@/lib/vocabulary/shared/labels";
import { getVocabularyMetadataHealthDb } from "@/lib/vocabulary/shared/metadata-health";
import { getVocabularySetsDb } from "@/lib/vocabulary/sets/set-list-queries";
import {
  getVocabularySetSourceKeysDb,
  getVocabularySetThemeKeysDb,
} from "@/lib/vocabulary/sets/set-options";
import type { VocabularySetFilters } from "@/lib/vocabulary/shared/types";

type AdminVocabularyPageProps = {
  searchParams?: Promise<{
    search?: string;
    tier?: string;
    listMode?: string;
    setType?: string;
    themeKey?: string;
    sourceKey?: string;
    usageVariant?: string;
    published?: string;
  }>;
};

function normalizeTierFilter(value?: string): VocabularySetFilters["tier"] {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "both" ||
    value === "unknown"
  ) {
    return value;
  }

  return "all";
}

function normalizeListModeFilter(value?: string): VocabularySetFilters["listMode"] {
  if (
    value === "spec_only" ||
    value === "extended_only" ||
    value === "spec_and_extended" ||
    value === "custom"
  ) {
    return value;
  }

  return "all";
}

function normalizePublishedFilter(value?: string): VocabularySetFilters["published"] {
  if (value === "published" || value === "draft") return value;
  return "all";
}

function normalizeSetTypeFilter(value?: string): VocabularySetFilters["setType"] {
  if (
    value === "specification" ||
    value === "core" ||
    value === "theme" ||
    value === "phrase_bank" ||
    value === "exam_prep" ||
    value === "lesson_custom"
  ) {
    return value;
  }

  return "all";
}

function normalizeUsageVariantFilter(
  value?: string
): VocabularySetFilters["usageVariant"] {
  if (
    value === "foundation" ||
    value === "higher" ||
    value === "volna" ||
    value === "unused"
  ) {
    return value;
  }

  return "all";
}

function getVocabularySetHref(vocabularySet: { id: string; slug: string | null }) {
  return `/vocabulary/${vocabularySet.slug ?? vocabularySet.id}`;
}

function getUsageFilterLabel(value?: VocabularySetFilters["usageVariant"]) {
  switch (value) {
    case "foundation":
      return "Foundation usage";
    case "higher":
      return "Higher usage";
    case "volna":
      return "Volna usage";
    case "unused":
      return "Unused sets";
    default:
      return "All usage";
  }
}

const VOCABULARY_ADMIN_SAVED_FILTERS = [
  {
    label: "Spec sets",
    href: "/admin/vocabulary?setType=specification&published=published",
    description: "Published specification vocabulary only.",
  },
  {
    label: "Custom lesson sets",
    href: "/admin/vocabulary?listMode=custom&setType=lesson_custom",
    description: "Teacher-built sets for lessons.",
  },
  {
    label: "Unused spec sets",
    href: "/admin/vocabulary?setType=specification&usageVariant=unused",
    description: "Spec sets not attached to lessons yet.",
  },
  {
    label: "Foundation coverage",
    href: "/admin/vocabulary?setType=specification&usageVariant=foundation",
    description: "Spec sets already used in Foundation lessons.",
  },
  {
    label: "Higher coverage",
    href: "/admin/vocabulary?setType=specification&usageVariant=higher",
    description: "Spec sets already used in Higher lessons.",
  },
  {
    label: "Volna coverage",
    href: "/admin/vocabulary?setType=specification&usageVariant=volna",
    description: "Spec sets already used in Volna lessons.",
  },
] as const;

export default async function AdminVocabularyPage({
  searchParams,
}: AdminVocabularyPageProps) {
  const params = (await searchParams) ?? {};
  const filters: VocabularySetFilters = {
    search: params.search ?? null,
    tier: normalizeTierFilter(params.tier),
    listMode: normalizeListModeFilter(params.listMode),
    setType: normalizeSetTypeFilter(params.setType),
    themeKey: params.themeKey ?? null,
    sourceKey: params.sourceKey ?? null,
    usageVariant: normalizeUsageVariantFilter(params.usageVariant),
    published: normalizePublishedFilter(params.published),
  };
  const [vocabularySets, themeKeys, sourceKeys, metadataHealth] = await Promise.all([
    getVocabularySetsDb({ filters }),
    getVocabularySetThemeKeysDb(),
    getVocabularySetSourceKeysDb(),
    getVocabularyMetadataHealthDb(),
  ]);
  const totalSets = vocabularySets.length;
  const publishedSets = vocabularySets.filter((set) => set.is_published).length;
  const draftSets = totalSets - publishedSets;
  const totalItems = vocabularySets.reduce((sum, set) => sum + set.item_count, 0);
  const totalUsages = vocabularySets.reduce(
    (sum, set) => sum + set.usage_stats.totalOccurrences,
    0
  );

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Admin vocabulary"
        title="Vocabulary Management"
        description="Create, edit, publish, filter, and inspect reusable vocabulary sets for lessons and revision."
        badges={
          <>
            <Badge tone="info" icon="vocabulary">
              Vocabulary CMS
            </Badge>
            <Badge tone="muted" icon="list">
              {totalSets} set{totalSets === 1 ? "" : "s"}
            </Badge>
            <Badge tone="success" icon="published">
              {publishedSets} published
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/vocabulary" variant="secondary" icon="preview">
              Student view
            </Button>
            <Button href="/admin/vocabulary/create" variant="primary" icon="create">
              Create vocabulary set
            </Button>
          </>
        }
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <SummaryStatCard
          title="Vocabulary sets"
          value={totalSets}
          description="Reusable sets matching the current filters."
          icon="vocabulary"
        />
        <SummaryStatCard
          title="Published"
          value={publishedSets}
          description="Visible on the student vocabulary page."
          icon="published"
        />
        <SummaryStatCard
          title="Draft"
          value={draftSets}
          description="Hidden from students until published."
          icon="draft"
        />
        <SummaryStatCard
          title="Items"
          value={totalItems}
          description="Total vocabulary items inside filtered sets."
          icon="list"
        />
        <SummaryStatCard
          title="Lesson usage"
          value={totalUsages}
          description={`${getUsageFilterLabel(filters.usageVariant)} across filtered sets.`}
          icon="lessons"
        />
      </section>

      <section className="app-surface app-section-padding">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="app-heading-subsection">Saved vocabulary views</h2>
            <p className="mt-2 app-text-body-muted">
              Jump straight to the admin slices that matter most when planning lessons and
              checking spec coverage.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {VOCABULARY_ADMIN_SAVED_FILTERS.map((filter) => (
              <Button
                key={filter.href}
                href={filter.href}
                variant="secondary"
                size="sm"
                icon="filter"
                title={filter.description}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="app-surface app-section-padding">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="app-heading-subsection">Metadata health</h2>
          <p className="app-text-body-muted">
            Import-quality checks for finding words that need better labels,
            transliteration, or coverage metadata.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryStatCard
            title="Unknown part of speech"
            value={metadataHealth.unknownPartOfSpeechItems}
            description={`${metadataHealth.specItems} spec items checked.`}
            icon="vocabulary"
            tone={metadataHealth.unknownPartOfSpeechItems === 0 ? "success" : "warning"}
            compact
          />
          <SummaryStatCard
            title="Missing transliteration"
            value={metadataHealth.missingTransliterationItems}
            description="Items without a student-friendly pronunciation aid."
            icon="language"
            tone={
              metadataHealth.missingTransliterationItems === 0 ? "success" : "warning"
            }
            compact
          />
          <SummaryStatCard
            title="Missing category"
            value={metadataHealth.missingCategoryItems}
            description="Items that cannot yet be filtered by category."
            icon="folder"
            tone={metadataHealth.missingCategoryItems === 0 ? "success" : "warning"}
            compact
          />
          <SummaryStatCard
            title="Duplicate canonical keys"
            value={metadataHealth.duplicateCanonicalKeys}
            description="Repeated keys worth reviewing before custom-set reuse."
            icon="duplicate"
            tone={metadataHealth.duplicateCanonicalKeys === 0 ? "success" : "warning"}
            compact
          />
        </div>
      </section>

      <TableShell
        title="Vocabulary sets"
        description="Use filters to find sets, publish drafts, manage items, or preview the student-facing page."
        actions={
          <Button
            href="/admin/vocabulary/create"
            variant="primary"
            size="sm"
            icon="create"
          >
            New set
          </Button>
        }
      >
        <TableToolbar>
          <form className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.2fr)_repeat(7,minmax(140px,1fr))_max-content] xl:items-center">
            <div className="min-w-0">
              <Input
                name="search"
                defaultValue={params.search ?? ""}
                placeholder="Search title, slug, topic, source..."
              />
            </div>

            <div className="min-w-0">
              <Select name="tier" defaultValue={filters.tier ?? "all"}>
                <option value="all">All tiers</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
                <option value="both">Both tiers</option>
                <option value="unknown">Unknown</option>
              </Select>
            </div>

            <div className="min-w-0">
              <Select name="listMode" defaultValue={filters.listMode ?? "all"}>
                <option value="all">All modes</option>
                <option value="custom">Custom</option>
                <option value="spec_only">Spec only</option>
                <option value="extended_only">Extended only</option>
                <option value="spec_and_extended">Spec + extended</option>
              </Select>
            </div>

            <div className="min-w-0">
              <Select name="setType" defaultValue={filters.setType ?? "all"}>
                <option value="all">All types</option>
                <option value="specification">Specification</option>
                <option value="core">Core</option>
                <option value="theme">Theme</option>
                <option value="phrase_bank">Phrase bank</option>
                <option value="exam_prep">Exam prep</option>
                <option value="lesson_custom">Lesson custom</option>
              </Select>
            </div>

            <div className="min-w-0">
              <Select name="themeKey" defaultValue={filters.themeKey ?? ""}>
                <option value="">All themes</option>
                {themeKeys.map((themeKey) => (
                  <option key={themeKey} value={themeKey}>
                    {getVocabularyThemeLabel(themeKey)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="min-w-0">
              <Select name="sourceKey" defaultValue={filters.sourceKey ?? ""}>
                <option value="">All sources</option>
                {sourceKeys.map((sourceKey) => (
                  <option key={sourceKey} value={sourceKey}>
                    {getVocabularySourceLabel(sourceKey)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="min-w-0">
              <Select name="usageVariant" defaultValue={filters.usageVariant ?? "all"}>
                <option value="all">All usage</option>
                <option value="foundation">Used in Foundation</option>
                <option value="higher">Used in Higher</option>
                <option value="volna">Used in Volna</option>
                <option value="unused">Unused</option>
              </Select>
            </div>

            <div className="min-w-0">
              <Select name="published" defaultValue={filters.published ?? "all"}>
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-1 xl:justify-end">
              <Button type="submit" variant="secondary" size="sm" icon="filter">
                Apply
              </Button>
              <Button href="/admin/vocabulary" variant="quiet" size="sm" icon="refresh">
                Reset
              </Button>
            </div>
          </form>
        </TableToolbar>

        {vocabularySets.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon="vocabulary"
              iconTone="brand"
              title="No vocabulary sets found"
              description="Create a set, or clear the current filters to see all vocabulary content."
              action={
                <Button href="/admin/vocabulary/create" variant="primary" icon="create">
                  Create vocabulary set
                </Button>
              }
            />
          </div>
        ) : (
          <DataTable>
            <DataTableHead>
              <DataTableHeaderRow>
                <DataTableHeaderCell>Set</DataTableHeaderCell>
                <DataTableHeaderCell>Tier</DataTableHeaderCell>
                <DataTableHeaderCell>Mode</DataTableHeaderCell>
                <DataTableHeaderCell>Items</DataTableHeaderCell>
                <DataTableHeaderCell>Usage</DataTableHeaderCell>
                <DataTableHeaderCell>Status</DataTableHeaderCell>
                <DataTableHeaderCell>Metadata</DataTableHeaderCell>
                <DataTableHeaderCell>Actions</DataTableHeaderCell>
              </DataTableHeaderRow>
            </DataTableHead>

            <DataTableBody>
              {vocabularySets.map((vocabularySet) => (
                <DataTableRow key={vocabularySet.id}>
                  <DataTableCell>
                    <div className="space-y-1">
                      <div className="app-heading-card">{vocabularySet.title}</div>
                      <div className="app-text-caption">
                        {vocabularySet.slug ?? vocabularySet.id}
                      </div>
                      <div className="max-w-md app-text-body-muted">
                        {vocabularySet.description ?? "No description yet."}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Badge tone="muted">
                          {getVocabularySetTypeLabel(vocabularySet.set_type)}
                        </Badge>
                        <Badge tone="muted">
                          {getVocabularyDisplayVariantLabel(
                            vocabularySet.default_display_variant
                          )}
                        </Badge>
                      </div>
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <Badge tone="info" icon="school">
                      {getVocabularyTierLabel(vocabularySet.tier)}
                    </Badge>
                  </DataTableCell>

                  <DataTableCell>
                    <Badge tone="muted" icon="vocabularySet">
                      {getVocabularyListModeLabel(vocabularySet.list_mode)}
                    </Badge>
                  </DataTableCell>

                  <DataTableCell>
                    <div className="font-semibold app-text-detail">
                      {vocabularySet.item_count}
                    </div>
                    <div className="app-text-caption">
                      {vocabularySet.list_count} list
                      {vocabularySet.list_count === 1 ? "" : "s"}
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <div className="grid min-w-[8rem] grid-cols-3 gap-1 text-center">
                      <div className="rounded-lg bg-[var(--background-muted)] px-2 py-1">
                        <div className="app-text-meta">F</div>
                        <div className="font-semibold text-[var(--text-primary)]">
                          {vocabularySet.usage_stats.foundationOccurrences}
                        </div>
                      </div>
                      <div className="rounded-lg bg-[var(--background-muted)] px-2 py-1">
                        <div className="app-text-meta">H</div>
                        <div className="font-semibold text-[var(--text-primary)]">
                          {vocabularySet.usage_stats.higherOccurrences}
                        </div>
                      </div>
                      <div className="rounded-lg bg-[var(--background-muted)] px-2 py-1">
                        <div className="app-text-meta">V</div>
                        <div className="font-semibold text-[var(--text-primary)]">
                          {vocabularySet.usage_stats.volnaOccurrences}
                        </div>
                      </div>
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <PublishStatusBadge isPublished={vocabularySet.is_published} />
                  </DataTableCell>

                  <DataTableCell>
                    <div className="space-y-1">
                      <div className="capitalize text-[var(--text-primary)]">
                        {getVocabularyThemeLabel(vocabularySet.theme_key)}
                      </div>
                      {vocabularySet.topic_key ? (
                        <div className="app-text-caption">
                          Topic: {getVocabularyTopicLabel(vocabularySet.topic_key)}
                        </div>
                      ) : null}
                      {vocabularySet.source_key ? (
                        <div className="app-text-caption">
                          Source: {getVocabularySourceLabel(vocabularySet.source_key)}
                        </div>
                      ) : null}
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        href={`/admin/vocabulary/${vocabularySet.id}/items`}
                        variant="secondary"
                        size="sm"
                        icon="list"
                      >
                        Items
                      </Button>
                      <Button
                        href={`/admin/vocabulary/${vocabularySet.id}/edit`}
                        variant="quiet"
                        size="sm"
                        icon="edit"
                      >
                        Edit
                      </Button>
                      <Button
                        href={getVocabularySetHref(vocabularySet)}
                        variant="quiet"
                        size="sm"
                        icon="preview"
                      >
                        View
                      </Button>
                      <form action={deleteVocabularySetAction}>
                        <input
                          type="hidden"
                          name="vocabularySetId"
                          value={vocabularySet.id}
                        />
                        <AdminConfirmButton
                          variant="danger"
                          icon="delete"
                          confirmMessage={`Delete ${vocabularySet.title}? This also deletes its items and list links.`}
                        >
                          Delete
                        </AdminConfirmButton>
                      </form>
                    </div>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </TableShell>
    </main>
  );
}
