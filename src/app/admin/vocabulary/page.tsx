import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import type { DbVocabularySetListItem } from "@/lib/vocabulary/vocabulary-helpers-db";
import {
  getVocabularyListModeLabel,
  getVocabularySetsDb,
  getVocabularyTierLabel,
} from "@/lib/vocabulary/vocabulary-helpers-db";

function getSetTypeLabel(setType: DbVocabularySetListItem["set_type"]) {
  switch (setType) {
    case "core":
      return "Core";
    case "theme":
      return "Theme";
    case "phrase_bank":
      return "Phrase bank";
    case "exam_prep":
      return "Exam prep";
    case "lesson_custom":
      return "Lesson custom";
    default:
      return setType;
  }
}

function getDisplayVariantLabel(
  displayVariant: DbVocabularySetListItem["default_display_variant"]
) {
  switch (displayVariant) {
    case "single_column":
      return "Single column";
    case "two_column":
      return "Two column";
    case "compact_cards":
      return "Compact cards";
    default:
      return displayVariant;
  }
}

function getSourceSummaryLabel(vocabularySet: DbVocabularySetListItem) {
  switch (vocabularySet.list_mode) {
    case "spec_only":
      return "Spec content only";
    case "extended_only":
      return "Extended vocabulary only";
    case "spec_and_extended":
      return "Spec + extended mix";
    case "custom":
      return "Custom lesson list";
    default:
      return "Mixed source";
  }
}

function getThemeDisplayLabel(vocabularySet: DbVocabularySetListItem) {
  if (!vocabularySet.theme_key) {
    return "—";
  }

  return vocabularySet.theme_key.replaceAll("_", " ");
}

function getTopicDisplayLabel(vocabularySet: DbVocabularySetListItem) {
  if (!vocabularySet.topic_key) {
    return "—";
  }

  return vocabularySet.topic_key.replaceAll("_", " ");
}

function sortVocabularySets(vocabularySets: DbVocabularySetListItem[]) {
  return [...vocabularySets].sort((a, b) => {
    if (a.is_published !== b.is_published) {
      return a.is_published ? -1 : 1;
    }

    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }

    return a.title.localeCompare(b.title);
  });
}

function MetadataCell({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl bg-[var(--background-muted)] px-3.5 py-3",
        className ?? "",
      ].join(" ")}
    >
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
        {label}
      </span>
      <span className="mt-1.5 block text-sm font-medium text-[var(--text-primary)]">
        {value}
      </span>
    </div>
  );
}

function VariantUsageRow({
  label,
  shortLabel,
  occurrences,
}: {
  label: string;
  shortLabel: string;
  occurrences: number;
}) {
  const isUsed = occurrences > 0;

  return (
    <div
      className={[
        "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3",
        isUsed
          ? "border-[rgba(31,138,76,0.18)] bg-[var(--success-soft)]"
          : "border-[var(--border)] bg-[var(--background-elevated)]",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={[
            "inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[11px] font-bold ring-1",
            isUsed
              ? "bg-[var(--background-elevated)] text-[var(--success)] ring-[rgba(31,138,76,0.18)]"
              : "bg-[var(--background-muted)] text-[var(--text-secondary)] ring-[var(--border)]",
          ].join(" ")}
        >
          {shortLabel}
        </span>

        <div className="min-w-0">
          <div
            className={[
              "text-sm font-semibold",
              isUsed ? "text-[var(--success)]" : "text-[var(--text-primary)]",
            ].join(" ")}
          >
            {label}
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            {occurrences} occurrence{occurrences === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <span
        className={[
          "inline-flex min-h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm font-semibold",
          isUsed
            ? "bg-[var(--background-elevated)] text-[var(--success)] ring-1 ring-[rgba(31,138,76,0.18)]"
            : "bg-[var(--background-muted)] text-[var(--text-secondary)] ring-1 ring-[var(--border)]",
        ].join(" ")}
      >
        {occurrences}
      </span>
    </div>
  );
}

function UsageKeyRow({ label, shortLabel }: { label: string; shortLabel: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[var(--background-elevated)] px-2 text-[11px] font-bold text-[var(--text-secondary)] ring-1 ring-[var(--border)]">
        {shortLabel}
      </span>
      <div>
        <div className="text-sm font-semibold text-[var(--text-primary)]">{label}</div>
        <p className="text-xs text-[var(--text-secondary)]">Variant usage indicator</p>
      </div>
    </div>
  );
}

function VocabularySetCard({
  vocabularySet,
}: {
  vocabularySet: DbVocabularySetListItem;
}) {
  const { usage_stats: usageStats } = vocabularySet;

  return (
    <div className="app-card app-card-hover h-full overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="muted" icon="language">
              {getVocabularyListModeLabel(vocabularySet.list_mode)}
            </Badge>

            <Badge tone="info" icon="school">
              {getVocabularyTierLabel(vocabularySet.tier)}
            </Badge>

            <Badge tone="muted" icon="file">
              {getSetTypeLabel(vocabularySet.set_type)}
            </Badge>

            <Badge
              tone={vocabularySet.is_published ? "success" : "warning"}
              icon={vocabularySet.is_published ? "success" : "info"}
            >
              {vocabularySet.is_published ? "Published" : "Draft"}
            </Badge>
          </div>

          <div className="space-y-2">
            <h2 className="text-[1.65rem] font-semibold leading-tight tracking-[-0.03em] text-[var(--text-primary)]">
              {vocabularySet.title}
            </h2>

            <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              {vocabularySet.description || "No description yet."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" icon="preview">
              Preview
            </Button>

            <Button variant="soft" size="sm" icon="edit">
              Edit
            </Button>

            <Button variant="quiet" size="sm" icon="list">
              Items
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <MetadataCell label="Items" value={vocabularySet.item_count} />
          <MetadataCell label="Source mix" value={getSourceSummaryLabel(vocabularySet)} />
          <MetadataCell
            label="Display"
            value={getDisplayVariantLabel(vocabularySet.default_display_variant)}
          />
          <MetadataCell
            label="Theme"
            value={getThemeDisplayLabel(vocabularySet)}
            className="capitalize"
          />
          <MetadataCell
            label="Topic"
            value={getTopicDisplayLabel(vocabularySet)}
            className="capitalize"
          />
          <MetadataCell label="Sort order" value={vocabularySet.sort_order} />
        </div>

        <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-[var(--background)] px-4 py-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
                  Variant usage
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  See which lesson variants already reference this vocabulary set.
                </p>
              </div>

              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {usageStats.totalOccurrences} total occurrence
                {usageStats.totalOccurrences === 1 ? "" : "s"}
              </span>
            </div>

            <div className="grid gap-3">
              <VariantUsageRow
                label="Foundation"
                shortLabel="F"
                occurrences={usageStats.foundationOccurrences}
              />

              <VariantUsageRow
                label="Higher"
                shortLabel="H"
                occurrences={usageStats.higherOccurrences}
              />

              <VariantUsageRow
                label="Volna"
                shortLabel="V"
                occurrences={usageStats.volnaOccurrences}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="quiet" size="sm" icon="delete">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default async function AdminVocabularyPage() {
  const vocabularySets = sortVocabularySets(await getVocabularySetsDb());

  const totalSets = vocabularySets.length;
  const publishedSets = vocabularySets.filter((set) => set.is_published).length;
  const draftSets = totalSets - publishedSets;
  const totalOccurrences = vocabularySets.reduce(
    (sum, set) => sum + set.usage_stats.totalOccurrences,
    0
  );

  return (
    <main className="space-y-8">
      <PageHeader
        title="Vocabulary"
        description="Manage reusable vocabulary sets for lessons, student revision, and future vocabulary tools."
      />

      <section className="app-surface app-section-padding">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="language">
                Vocabulary library
              </Badge>
              <Badge tone="muted" icon="dashboard">
                Admin management
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                Build and organise reusable vocabulary sets
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                This area is the control centre for spec vocabulary, extended vocabulary,
                mixed sets, and custom lesson lists.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" icon="search">
              Search and filter
            </Button>

            <Button variant="primary" icon="create">
              Create vocabulary set
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Vocabulary sets">
          <p className="text-3xl font-semibold text-[var(--text-primary)]">{totalSets}</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Total reusable sets currently stored in the database.
          </p>
        </DashboardCard>

        <DashboardCard title="Published sets">
          <p className="text-3xl font-semibold text-[var(--text-primary)]">
            {publishedSets}
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Sets currently visible to the student-facing vocabulary experience.
          </p>
        </DashboardCard>

        <DashboardCard title="Draft sets">
          <p className="text-3xl font-semibold text-[var(--text-primary)]">{draftSets}</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Sets still in preparation before student publication.
          </p>
        </DashboardCard>

        <DashboardCard title="Lesson usages">
          <p className="text-3xl font-semibold text-[var(--text-primary)]">
            {totalOccurrences}
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Total lesson-linked vocabulary set occurrences across all variants.
          </p>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="app-surface app-section-padding">
          <div className="mb-5 flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Current vocabulary library
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Review vocabulary sets, check metadata, and see which variants already use
              each set.
            </p>
          </div>

          {vocabularySets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-5 py-8 text-sm text-[var(--text-secondary)]">
              <div className="space-y-3">
                <p>No vocabulary sets found yet.</p>
                <div>
                  <Button variant="primary" size="sm" icon="create">
                    Create first vocabulary set
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {vocabularySets.map((vocabularySet) => (
                <VocabularySetCard key={vocabularySet.id} vocabularySet={vocabularySet} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="app-surface app-section-padding">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                What should come next
              </h2>

              <div className="space-y-2">
                {[
                  "Create vocabulary set forms",
                  "Add item create, edit, reorder, and delete flows",
                  "Attach vocabulary sets inside the lesson builder",
                  "Auto-write usage rows when sets are linked",
                  "Add a set detail page with usage breakdown",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl bg-[var(--background-muted)] px-3 py-3"
                  >
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-[var(--brand-blue)]" />
                    <span className="text-sm leading-6 text-[var(--text-secondary)]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="app-surface app-section-padding">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Student experience link
              </h2>

              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Published sets from this library can power the student vocabulary page,
                lesson vocabulary-set blocks, and future searchable revision tools.
              </p>

              <Link
                href="/vocabulary"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--background-muted)] px-3 py-2 text-sm font-medium app-brand-text transition hover:bg-[var(--brand-blue-soft)]"
              >
                Open student vocabulary page
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="app-surface app-section-padding">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Usage key
              </h2>

              <div className="space-y-2">
                <UsageKeyRow label="Foundation" shortLabel="F" />
                <UsageKeyRow label="Higher" shortLabel="H" />
                <UsageKeyRow label="Volna" shortLabel="V" />
              </div>

              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                These labels show which course variant currently uses a vocabulary set.
                The number beside each row shows linked usage count.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
