import Badge from "@/components/ui/badge";
import {
  getGrammarKnowledgeRequirementLabel,
  getGrammarTierLabel,
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
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-xs)]">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="app-text-meta">Grammar set</div>
          <h3 className="app-heading-subsection">{title || grammarSet.title}</h3>
          {grammarSet.description ? (
            <p className="mt-1 app-text-body-muted">{grammarSet.description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="info" icon="school">
            {getGrammarTierLabel(grammarSet.tier)}
          </Badge>
          <Badge tone="muted" icon="list">
            {points.length} point{points.length === 1 ? "" : "s"}
          </Badge>
        </div>
      </div>

      {points.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 app-text-helper">
          No grammar points are available for this course variant yet.
        </div>
      ) : (
        <div className="grid gap-3">
          {points.map((point, index) => (
            <div
              key={point.id}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted-bg)] px-4 py-3"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {index + 1}. {point.title}
                  </div>
                  <p className="mt-1 app-text-body-muted">
                    {point.short_description ?? "Grammar rule being prepared."}
                  </p>
                </div>
                <Badge
                  tone={
                    point.knowledge_requirement === "receptive" ? "warning" : "success"
                  }
                  icon={point.knowledge_requirement === "receptive" ? "preview" : "write"}
                >
                  {getGrammarKnowledgeRequirementLabel(point.knowledge_requirement)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
