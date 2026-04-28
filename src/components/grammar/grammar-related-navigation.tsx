import Button from "@/components/ui/button";
import PanelCard from "@/components/ui/panel-card";
import type { DbGrammarPoint, DbGrammarSet } from "@/lib/grammar/types";

type RelatedGrammarLink = {
  href: string;
  title: string;
};

function RelatedLinkList({ links }: { links: RelatedGrammarLink[] }) {
  if (links.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 app-text-helper">
        More related grammar will appear here as the course map grows.
      </p>
    );
  }

  return (
    <nav className="grid gap-2" aria-label="Related grammar links">
      {links.map((link) => (
        <Button
          key={link.href}
          href={link.href}
          variant="secondary"
          icon="grammar"
          className="w-full justify-start"
        >
          {link.title}
        </Button>
      ))}
    </nav>
  );
}

export function RelatedGrammarSetsPanel({
  grammarSets,
}: {
  grammarSets: DbGrammarSet[];
}) {
  const links = grammarSets.map((grammarSet) => ({
    href: `/grammar/${grammarSet.slug}`,
    title: grammarSet.title,
  }));

  return (
    <PanelCard
      title="Related grammar"
      description="Move sideways to other sets from the same GCSE theme."
      tone="student"
    >
      <RelatedLinkList links={links} />
    </PanelCard>
  );
}

export function GrammarPointSetNavigationPanel({
  grammarSet,
  currentPoint,
  previousPoint,
  nextPoint,
  relatedPoints,
}: {
  grammarSet: DbGrammarSet;
  currentPoint: DbGrammarPoint;
  previousPoint: DbGrammarPoint | null;
  nextPoint: DbGrammarPoint | null;
  relatedPoints: DbGrammarPoint[];
}) {
  const relatedLinks = relatedPoints.map((point) => ({
    href: `/grammar/${grammarSet.slug}/${point.slug}`,
    title: point.title,
  }));

  return (
    <PanelCard
      title="In this set"
      description="Use nearby points to revise the rule in context."
      tone="student"
    >
      <div className="space-y-4">
        <div className="grid gap-2">
          {previousPoint ? (
            <Button
              href={`/grammar/${grammarSet.slug}/${previousPoint.slug}`}
              variant="secondary"
              icon="back"
              className="w-full justify-start"
            >
              Previous: {previousPoint.title}
            </Button>
          ) : null}

          {nextPoint ? (
            <Button
              href={`/grammar/${grammarSet.slug}/${nextPoint.slug}`}
              variant="secondary"
              icon="next"
              iconPosition="right"
              className="w-full justify-between"
            >
              Next: {nextPoint.title}
            </Button>
          ) : null}

          {!previousPoint && !nextPoint ? (
            <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-muted)] px-4 py-3 app-text-helper">
              {currentPoint.title} is the only published point in this set.
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="app-text-meta">Same category</div>
          <RelatedLinkList links={relatedLinks} />
        </div>
      </div>
    </PanelCard>
  );
}
