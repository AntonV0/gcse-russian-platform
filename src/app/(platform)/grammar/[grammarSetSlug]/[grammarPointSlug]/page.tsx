import { notFound } from "next/navigation";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import GrammarTableRenderer from "@/components/grammar/grammar-table-renderer";
import {
  canDashboardAccessGrammarSet,
  getGrammarCategoryLabel,
  getGrammarTierLabel,
  loadGrammarPointBySlugsDb,
} from "@/lib/grammar/grammar-helpers-db";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";

type GrammarPointPageProps = {
  params: Promise<{ grammarSetSlug: string; grammarPointSlug: string }>;
};

function renderExplanation(explanation: string | null) {
  if (!explanation) {
    return (
      <EmptyState
        icon="text"
        iconTone="default"
        title="No explanation yet"
        description="This grammar point is published, but the full explanation has not been added."
      />
    );
  }

  const blocks = explanation
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.startsWith("### ")) {
          return (
            <h3 key={`${block}-${index}`} className="text-lg font-semibold text-[var(--text-primary)]">
              {block.replace(/^###\s+/, "")}
            </h3>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h2 key={`${block}-${index}`} className="text-xl font-semibold text-[var(--text-primary)]">
              {block.replace(/^##\s+/, "")}
            </h2>
          );
        }

        if (block.startsWith("- ")) {
          const items = block
            .split("\n")
            .map((item) => item.replace(/^-\s+/, "").trim())
            .filter(Boolean);

          return (
            <ul key={`${block}-${index}`} className="space-y-2 text-sm leading-7 text-[var(--text-secondary)]">
              {items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-blue)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`${block}-${index}`} className="text-sm leading-7 text-[var(--text-secondary)]">
            {block}
          </p>
        );
      })}
    </div>
  );
}

function RussianExampleText({
  text,
  highlight,
}: {
  text: string;
  highlight: string | null;
}) {
  if (!highlight || !text.includes(highlight)) {
    return <>{text}</>;
  }

  const highlightStart = text.indexOf(highlight);
  const before = text.slice(0, highlightStart);
  const after = text.slice(highlightStart + highlight.length);

  return (
    <>
      {before}
      <mark className="rounded-md bg-[var(--brand-blue-soft)] px-1 py-0.5 text-[var(--accent-on-soft)]">
        {highlight}
      </mark>
      {after}
    </>
  );
}

export default async function GrammarPointPage({ params }: GrammarPointPageProps) {
  const { grammarSetSlug, grammarPointSlug } = await params;
  const dashboard = await getDashboardInfo();
  const { grammarSet, grammarPoint, examples, tables } = await loadGrammarPointBySlugsDb(
    grammarSetSlug,
    grammarPointSlug,
    { publishedOnly: true }
  );

  if (!grammarSet || !grammarPoint || !canDashboardAccessGrammarSet(grammarSet, dashboard)) {
    notFound();
  }

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow={grammarSet.title}
        title={grammarPoint.title}
        description={grammarPoint.short_description ?? "Grammar explanation and examples."}
        badges={
          <>
            <Badge tone="info" icon="school">
              {getGrammarTierLabel(grammarPoint.tier)}
            </Badge>
            <Badge tone="muted" className="capitalize">
              {getGrammarCategoryLabel(grammarPoint.category_key)}
            </Badge>
            {grammarPoint.grammar_tag_key ? (
              <Badge tone="muted">{grammarPoint.grammar_tag_key.replaceAll("_", " ")}</Badge>
            ) : null}
          </>
        }
        actions={
          <>
            <Button href={`/grammar/${grammarSet.slug}`} variant="secondary" icon="back">
              Back to set
            </Button>
            <Button href="/grammar" variant="secondary" icon="lessonContent">
              All grammar
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <SectionCard
            title="Explanation"
            description="Read the rule first, then check the table and examples below."
            tone="student"
          >
            {renderExplanation(grammarPoint.full_explanation)}
          </SectionCard>

          {tables.length > 0 ? (
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  Grammar tables
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                  Reference tables for forms, endings, or patterns.
                </p>
              </div>

              {tables.map((table) => (
                <GrammarTableRenderer key={table.id} table={table} />
              ))}
            </div>
          ) : null}

          <SectionCard
            title="Examples"
            description="Read the Russian sentence, then compare it with the English translation."
            tone="student"
          >
            {examples.length === 0 ? (
              <EmptyState
                icon="language"
                iconTone="default"
                title="No examples yet"
                description="Examples will appear here once they are added in the grammar CMS."
              />
            ) : (
              <div className="grid gap-3">
                {examples.map((example) => (
                  <div
                    key={example.id}
                    className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4"
                  >
                    <div className="text-lg font-semibold leading-8 text-[var(--text-primary)]">
                      <RussianExampleText
                        text={example.russian_text}
                        highlight={example.optional_highlight}
                      />
                    </div>
                    <div className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      {example.english_translation}
                    </div>
                    {example.note ? (
                      <div className="mt-3 rounded-xl bg-[var(--background-muted)] px-3 py-2 text-sm leading-6 text-[var(--text-secondary)]">
                        {example.note}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-4">
          <PanelCard title="Details" tone="student">
            <DetailList
              items={[
                {
                  label: "Tier",
                  value: getGrammarTierLabel(grammarPoint.tier),
                },
                {
                  label: "Category",
                  value: getGrammarCategoryLabel(grammarPoint.category_key),
                },
                {
                  label: "Spec reference",
                  value: grammarPoint.spec_reference ?? "Not specified",
                },
                {
                  label: "Set",
                  value: grammarSet.title,
                },
              ]}
            />
          </PanelCard>

          <PanelCard
            title="Related learning"
            description="Lesson and practice links will connect here when those integrations are added."
            tone="student"
          >
            <div className="flex flex-col gap-3">
              <Button href="/courses" variant="secondary" icon="lessons">
                Lessons
              </Button>
              <Button href="/dashboard" variant="secondary" icon="exercise">
                Practice
              </Button>
            </div>
          </PanelCard>
        </div>
      </div>
    </main>
  );
}
