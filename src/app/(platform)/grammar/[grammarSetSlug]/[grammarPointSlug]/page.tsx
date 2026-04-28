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
  getGrammarKnowledgeRequirementLabel,
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
        description="This explanation is being prepared. Check the examples and tables for now."
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
            <h4 key={`${block}-${index}`} className="app-heading-subsection">
              {block.replace(/^###\s+/, "")}
            </h4>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h3 key={`${block}-${index}`} className="app-heading-section">
              {block.replace(/^##\s+/, "")}
            </h3>
          );
        }

        if (block.startsWith("- ")) {
          const items = block
            .split("\n")
            .map((item) => item.replace(/^-\s+/, "").trim())
            .filter(Boolean);

          return (
            <ul key={`${block}-${index}`} className="space-y-2 app-text-body-muted">
              {items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-fill)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`${block}-${index}`} className="app-lesson-prose">
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
      <mark className="rounded-md [background:var(--accent-gradient-selected)] px-1 py-0.5 text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
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

  if (
    !grammarSet ||
    !grammarPoint ||
    !canDashboardAccessGrammarSet(grammarSet, dashboard)
  ) {
    notFound();
  }

  const relatedVocabularyHref = grammarSet.theme_key
    ? `/vocabulary?themeKey=${encodeURIComponent(grammarSet.theme_key)}`
    : "/vocabulary";

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="student"
        eyebrow={grammarSet.title}
        title={grammarPoint.title}
        description={
          grammarPoint.short_description ?? "Grammar explanation and examples."
        }
        badges={
          <>
            <Badge tone="info" icon="school">
              {getGrammarTierLabel(grammarPoint.tier)}
            </Badge>
            <Badge tone="muted" className="capitalize">
              {getGrammarCategoryLabel(grammarPoint.category_key)}
            </Badge>
            <Badge
              tone={
                grammarPoint.knowledge_requirement === "receptive"
                  ? "warning"
                  : "muted"
              }
            >
              {getGrammarKnowledgeRequirementLabel(
                grammarPoint.knowledge_requirement
              )}
            </Badge>
            {grammarPoint.grammar_tag_key ? (
              <Badge tone="muted">
                {grammarPoint.grammar_tag_key.replaceAll("_", " ")}
              </Badge>
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
                <h2 className="app-heading-section">Grammar tables</h2>
                <p className="mt-1 app-text-body-muted">
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
                description="Examples are being prepared for this grammar point."
              />
            ) : (
              <div className="grid gap-3">
                {examples.map((example) => (
                  <div
                    key={example.id}
                    className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4"
                  >
                    <div lang="ru" className="app-russian-text text-lg font-semibold">
                      <RussianExampleText
                        text={example.russian_text}
                        highlight={example.optional_highlight}
                      />
                    </div>
                    <div className="mt-2 app-text-body-muted">
                      {example.english_translation}
                    </div>
                    {example.note ? (
                      <div className="mt-3 rounded-xl bg-[var(--background-muted)] px-3 py-2 app-text-helper">
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
                  label: "Knowledge",
                  value: getGrammarKnowledgeRequirementLabel(
                    grammarPoint.knowledge_requirement
                  ),
                },
                ...(grammarPoint.receptive_scope
                  ? [
                      {
                        label: "Receptive scope",
                        value: grammarPoint.receptive_scope,
                      },
                    ]
                  : []),
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
            title="Next steps"
            description="Keep this rule connected to the rest of your revision."
            tone="student"
          >
            <div className="flex flex-col gap-3">
              <Button
                href={`/grammar/${grammarSet.slug}`}
                variant="secondary"
                icon="back"
              >
                Back to this set
              </Button>
              <Button href={relatedVocabularyHref} variant="secondary" icon="vocabulary">
                Related vocabulary
              </Button>
              <Button href="/courses" variant="secondary" icon="lessons">
                Course lessons
              </Button>
            </div>
          </PanelCard>
        </div>
      </div>
    </main>
  );
}
