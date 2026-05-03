import {
  loadGrammarSetBySlugDb,
  type DbGrammarStudyVariant,
} from "@/lib/grammar/grammar-helpers-db";

type GrammarSetBlockProps = {
  title?: string;
  grammarSetSlug: string;
  currentVariant: DbGrammarStudyVariant;
};

export default async function GrammarSetBlock({
  title,
  grammarSetSlug,
  currentVariant,
}: GrammarSetBlockProps) {
  const { grammarSet, points } = await loadGrammarSetBySlugDb(grammarSetSlug, {
    scopeVariant: currentVariant,
  });

  if (!grammarSet) {
    return (
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--danger)_24%,transparent)] bg-[var(--danger-soft)] px-5 py-4 text-sm text-[var(--danger)]">
        Grammar set not found: {grammarSetSlug}
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]">
      <div className="border-b border-[var(--border-subtle)] p-4">
        <div className="app-text-meta">Notice the pattern</div>
        <h3 className="app-heading-subsection">{title || grammarSet.title}</h3>
        {grammarSet.description ? (
          <p className="mt-1 max-w-3xl app-text-body-muted">{grammarSet.description}</p>
        ) : null}
      </div>

      <div className="p-4">
        {points.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 app-text-helper">
            No grammar points are available for this course variant yet.
          </div>
        ) : (
          <div className="space-y-4">
            {points.map((point, index) => (
              <div
                key={point.id}
                className="grid gap-3 border-b border-[var(--border-subtle)] pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[2rem_minmax(0,1fr)]"
              >
                <span className="pt-0.5 text-sm font-semibold text-[var(--accent-ink)]">
                  {index + 1}
                </span>

                <div className="min-w-0">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {point.title}
                  </div>
                  <p className="mt-1 text-sm leading-6 app-text-muted">
                    {point.full_explanation ??
                      point.short_description ??
                      "Grammar rule being prepared."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
