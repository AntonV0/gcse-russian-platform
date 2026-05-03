import Button from "@/components/ui/button";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import type { AdminVocabularyMetadataHealth } from "@/components/admin/vocabulary/list/types";

type VocabularyMetadataHealthPanelProps = {
  metadataHealth: AdminVocabularyMetadataHealth;
};

export default function VocabularyMetadataHealthPanel({
  metadataHealth,
}: VocabularyMetadataHealthPanelProps) {
  const metadataGapCount =
    metadataHealth.unknownPartOfSpeechItems +
    metadataHealth.missingTransliterationItems +
    metadataHealth.missingCategoryItems;

  return (
    <section className="app-surface">
      <details
        className="group"
        open={metadataHealth.canonicalKeyCollisions > 0 || metadataGapCount > 0}
      >
        <summary className="flex cursor-pointer list-none flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="app-heading-subsection">Metadata health</h2>
            <p className="mt-1 app-text-body-muted">
              Import-quality checks for labels, pronunciation aids, and coverage
              metadata.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--warning-border)] bg-[var(--warning-surface)] px-3 py-1 text-sm font-semibold text-[var(--warning-text)]">
              {metadataHealth.canonicalKeyCollisions} collisions
            </span>
            <span
              className={[
                "rounded-full border px-3 py-1 text-sm font-semibold",
                metadataGapCount === 0
                  ? "border-[var(--success-border)] bg-[var(--success-surface)] text-[var(--success-text)]"
                  : "border-[var(--warning-border)] bg-[var(--warning-surface)] text-[var(--warning-text)]",
              ].join(" ")}
            >
              {metadataGapCount} metadata gaps
            </span>
            <span className="text-sm font-semibold text-[var(--text-secondary)] group-open:hidden">
              Open
            </span>
            <span className="hidden text-sm font-semibold text-[var(--text-secondary)] group-open:inline">
              Hide
            </span>
          </div>
        </summary>

        <div className="space-y-5 border-t border-[var(--border-subtle)] px-5 py-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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
          title="Canonical key collisions"
          value={metadataHealth.canonicalKeyCollisions}
          description="Same generated key attached to different entries."
          icon="duplicate"
          tone={metadataHealth.canonicalKeyCollisions === 0 ? "success" : "warning"}
          compact
        />
        <SummaryStatCard
          title="Repeated spec entries"
          value={metadataHealth.repeatedCanonicalKeyGroups}
          description="Same word appears in more than one spec place."
          icon="duplicate"
          tone="info"
          compact
        />
      </div>

      {metadataHealth.sampleIssues.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]">
          <div className="flex flex-col gap-2 border-b border-[var(--border-subtle)] px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="app-heading-card">Review queue</h3>
              <p className="mt-1 app-text-caption">
                Fast links into the affected vocabulary set with the closest item
                filter applied.
              </p>
            </div>
            <Button
              href="/admin/vocabulary?setType=specification"
              variant="secondary"
              size="sm"
              icon="filter"
            >
              Spec sets
            </Button>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            {metadataHealth.sampleIssues.slice(0, 8).map((issue) => (
              <div
                key={`${issue.title}-${issue.setId}-${issue.russian}`}
                className="grid gap-3 px-4 py-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_auto] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {issue.title}
                  </div>
                  <div className="mt-1 truncate app-text-caption">
                    {issue.setTitle}
                    {issue.setSlug ? ` / ${issue.setSlug}` : ""}
                  </div>
                </div>

                <div className="min-w-0">
                  <div
                    lang="ru"
                    className="truncate font-medium text-[var(--text-primary)]"
                  >
                    {issue.russian}
                  </div>
                  {issue.english ? (
                    <div className="mt-1 truncate text-sm text-[var(--text-secondary)]">
                      {issue.english}
                    </div>
                  ) : null}
                </div>

                <div className="lg:justify-self-end">
                  <Button href={issue.href} variant="secondary" size="sm" icon="edit">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
        </div>
      </details>
    </section>
  );
}
