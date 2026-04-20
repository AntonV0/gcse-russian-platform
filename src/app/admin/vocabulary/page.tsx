import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import DashboardCard from "@/components/ui/dashboard-card";
import {
  getVocabularyListModeLabel,
  getVocabularySetsDb,
  getVocabularyTierLabel,
} from "@/lib/vocabulary/vocabulary-helpers-db";

export default async function AdminVocabularyPage() {
  const vocabularySets = await getVocabularySetsDb();

  const totalSets = vocabularySets.length;
  const publishedSets = vocabularySets.filter((set) => set.is_published).length;
  const totalItems = vocabularySets.reduce((sum, set) => sum + set.item_count, 0);

  return (
    <main className="space-y-8">
      <PageHeader
        title="Vocabulary"
        description="Manage reusable vocabulary sets for lessons, student revision, and future vocabulary tools."
      />

      <section className="grid gap-4 md:grid-cols-3">
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

        <DashboardCard title="Vocabulary items">
          <p className="text-3xl font-semibold text-[var(--text-primary)]">
            {totalItems}
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Total words and phrases across all stored vocabulary sets.
          </p>
        </DashboardCard>
      </section>

      <section className="app-surface app-section-padding">
        <div className="mb-5 flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Current vocabulary library
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            This is the first admin slice for vocabulary. Create/edit/delete, usage
            tracking, and F/H/V indicators can be added next.
          </p>
        </div>

        {vocabularySets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-5 py-8 text-sm text-[var(--text-secondary)]">
            No vocabulary sets found yet. Once sets are added to the database, they will
            appear here.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {vocabularySets.map((vocabularySet) => (
              <DashboardCard key={vocabularySet.id} title={vocabularySet.title}>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="muted" icon="language">
                      {getVocabularyListModeLabel(vocabularySet.list_mode)}
                    </Badge>

                    <Badge tone="muted" icon="school">
                      {getVocabularyTierLabel(vocabularySet.tier)}
                    </Badge>

                    <Badge
                      tone={vocabularySet.is_published ? "success" : "warning"}
                      icon={vocabularySet.is_published ? "success" : "info"}
                    >
                      {vocabularySet.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                    {vocabularySet.description ? (
                      <p>{vocabularySet.description}</p>
                    ) : (
                      <p>No description yet.</p>
                    )}

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl bg-[var(--background-muted)] px-3 py-2">
                        <span className="block text-xs font-medium uppercase tracking-wide app-text-soft">
                          Items
                        </span>
                        <span className="text-[var(--text-primary)]">
                          {vocabularySet.item_count}
                        </span>
                      </div>

                      <div className="rounded-xl bg-[var(--background-muted)] px-3 py-2">
                        <span className="block text-xs font-medium uppercase tracking-wide app-text-soft">
                          Set type
                        </span>
                        <span className="text-[var(--text-primary)]">
                          {vocabularySet.set_type}
                        </span>
                      </div>

                      <div className="rounded-xl bg-[var(--background-muted)] px-3 py-2">
                        <span className="block text-xs font-medium uppercase tracking-wide app-text-soft">
                          Theme
                        </span>
                        <span className="text-[var(--text-primary)]">
                          {vocabularySet.theme_key ?? "—"}
                        </span>
                      </div>

                      <div className="rounded-xl bg-[var(--background-muted)] px-3 py-2">
                        <span className="block text-xs font-medium uppercase tracking-wide app-text-soft">
                          Topic
                        </span>
                        <span className="text-[var(--text-primary)]">
                          {vocabularySet.topic_key ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
