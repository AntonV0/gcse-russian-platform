import {
  loadGrammarSetBySlugDb,
  type DbGrammarStudyVariant,
} from "@/lib/grammar/grammar-helpers-db";
import { StudyBlockShell } from "@/components/lesson-blocks/learning-warmth-kit";

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
    <StudyBlockShell
      eyebrow="Notice the pattern"
      title={title || grammarSet.title}
      description={grammarSet.description ?? undefined}
      tone="explain"
      icon="grammar"
    >
      {points.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 app-text-helper">
          No grammar points are available for this course variant yet.
        </div>
      ) : (
        <div className="space-y-3">
          {points.map((point, index) => (
            <div
              key={point.id}
              className="grid gap-3 rounded-lg border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-elevated)_78%,var(--lesson-paper-bg))] p-3 sm:grid-cols-[2rem_minmax(0,1fr)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--accent-border-ink)_28%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_6%,var(--background-muted))] text-sm font-semibold text-[var(--accent-ink)]">
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
    </StudyBlockShell>
  );
}
