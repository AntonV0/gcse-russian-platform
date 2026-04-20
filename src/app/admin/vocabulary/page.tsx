import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import {
  getVocabularyListModeLabel,
  getVocabularySetsDb,
  getVocabularyTierLabel,
  type DbVocabularySetListItem,
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

function VocabularySetCard({
  vocabularySet,
}: {
  vocabularySet: DbVocabularySetListItem;
}) {
  return (
    <div className="app-card app-card-hover h-full">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge tone="muted" icon="language">
                {getVocabularyListModeLabel(vocabularySet.list_mode)}
              </Badge>

              <Badge tone="muted" icon="school">
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

            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {vocabularySet.title}
              </h2>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {vocabularySet.description || "No description yet."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Button variant="secondary" size="sm" icon="preview" ariaLabel="Preview set">
              Preview
            </Button>

            <Button variant="soft" size="sm" icon="edit" ariaLabel="Edit set">
              Edit
            </Button>

            <Button variant="quiet" size="sm" icon="list" ariaLabel="Manage items">
              Items
            </Button>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          <div className="rounded-xl bg-[var(--background-muted)] px-3 py-3">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
              Items
            </span>
            <span className="mt-1 block text-sm font-medium text-[var(--text-primary)]">
              {vocabularySet.item_count}
            </span>
          </div>

          <div className="rounded-xl bg-[var(--background-muted)] px-3 py-3">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
              Source mix
            </span>
            <span className="mt-1 block text-sm font-medium text-[var(--text-primary)]">
              {getSourceSummaryLabel(vocabularySet)}
            </span>
          </div>

          <div className="rounded-xl bg-[var(--background-muted)] px-3 py-3">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
              Display
            </span>
            <span className="mt-1 block text-sm font-medium text-[var(--text-primary)]">
              {getDisplayVariantLabel(vocabularySet.default_display_variant)}
            </span>
          </div>

          <div className="rounded-xl bg-[var(--background-muted)] px-3 py-3">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
              Theme
            </span>
            <span className="mt-1 block text-sm font-medium capitalize text-[var(--text-primary)]">
              {getThemeDisplayLabel(vocabularySet)}
            </span>
          </div>

          <div className="rounded-xl bg-[var(--background-muted)] px-3 py-3">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
              Topic
            </span>
            <span className="mt-1 block text-sm font-medium capitalize text-[var(--text-primary)]">
              {getTopicDisplayLabel(vocabularySet)}
            </span>
          </div>

          <div className="rounded-xl bg-[var(--background-muted)] px-3 py-3">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
              Sort order
            </span>
            <span className="mt-1 block text-sm font-medium text-[var(--text-primary)]">
              {vocabularySet.sort_order}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] px-4 py-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] app-text-soft">
                Variant usage
              </span>

              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 text-xs font-semibold text-[var(--text-secondary)]">
                  F
                </span>
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 text-xs font-semibold text-[var(--text-secondary)]">
                  H
                </span>
                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 text-xs font-semibold text-[var(--text-secondary)]">
                  V
                </span>
              </div>

              <span className="text-sm text-[var(--text-secondary)]">
                Usage tracking can be connected next from lesson references.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="quiet" size="sm" icon="delete" ariaLabel="Delete set">
              Delete
            </Button>
          </div>
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
  const totalItems = vocabularySets.reduce((sum, set) => sum + set.item_count, 0);

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
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Build and organise reusable vocabulary sets
              </h2>
              <p className="max-w-3xl text-sm text-[var(--text-secondary)]">
                This area is the control centre for spec vocabulary, extended vocabulary,
                mixed sets, and custom lesson lists. Editing workflows, item management,
                and usage tracking can now be layered onto this foundation.
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

        <DashboardCard title="Vocabulary items">
          <p className="text-3xl font-semibold text-[var(--text-primary)]">
            {totalItems}
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Total words and phrases across all stored vocabulary sets.
          </p>
        </DashboardCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_360px]">
        <div className="app-surface app-section-padding">
          <div className="mb-5 flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Current vocabulary library
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Review vocabulary sets, check metadata, and prepare the library for deeper
              admin tooling such as usage tracking, CRUD workflows, and variant-aware
              reporting.
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
            <div className="grid gap-4 2xl:grid-cols-2">
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

              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li>• Create and edit vocabulary set forms</li>
                <li>• Item-level add, edit, reorder, and delete flows</li>
                <li>• Spec / extended / custom item grouping</li>
                <li>• F / H / V lesson usage indicators</li>
                <li>• Occurrence counting across lesson content</li>
              </ul>
            </div>
          </div>

          <div className="app-surface app-section-padding">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Student experience link
              </h2>

              <p className="text-sm text-[var(--text-secondary)]">
                Published sets from this library can power the student vocabulary page,
                lesson vocabulary-set blocks, and future searchable revision tools.
              </p>

              <Link
                href="/vocabulary"
                className="inline-flex items-center gap-2 text-sm font-medium app-brand-text"
              >
                Open student vocabulary page
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
