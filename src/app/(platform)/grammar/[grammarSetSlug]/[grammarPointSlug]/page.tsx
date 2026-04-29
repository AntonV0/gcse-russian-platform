import { notFound } from "next/navigation";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DetailList from "@/components/ui/detail-list";
import EmptyState from "@/components/ui/empty-state";
import LockedContentCard from "@/components/ui/locked-content-card";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PanelCard from "@/components/ui/panel-card";
import SectionCard from "@/components/ui/section-card";
import GrammarTableRenderer from "@/components/grammar/grammar-table-renderer";
import { GrammarPointRequirementBadges } from "@/components/grammar/grammar-requirement-badges";
import { GrammarPointSetNavigationPanel } from "@/components/grammar/grammar-related-navigation";
import {
  canDashboardAccessGrammarSet,
  getGrammarCategoryLabel,
  getGrammarKnowledgeRequirementLabel,
  getGrammarTierLabel,
  getGrammarPointsBySetIdDb,
  loadGrammarPointBySlugsDb,
} from "@/lib/grammar/grammar-helpers-db";
import { getDashboardInfo, type DashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import type {
  DbGrammarExample,
  DbGrammarPoint,
  DbGrammarStudyVariant,
} from "@/lib/grammar/types";

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

function getStudyVariantForDashboard(
  dashboard: DashboardInfo
): DbGrammarStudyVariant | "all" | null {
  if (dashboard.role === "admin" || dashboard.role === "teacher") {
    return "all";
  }

  if (
    dashboard.variant === "foundation" ||
    dashboard.variant === "higher" ||
    dashboard.variant === "volna"
  ) {
    return dashboard.variant;
  }

  return null;
}

function getPracticeTasks(
  grammarPoint: DbGrammarPoint,
  examples: DbGrammarExample[]
) {
  const firstExample = examples[0];
  const highlightedText =
    firstExample?.optional_highlight ?? firstExample?.russian_text ?? grammarPoint.title;

  return [
    {
      title: "Spot it",
      description: firstExample
        ? `Find "${highlightedText}" in the first example and explain what job it is doing.`
        : "Underline the part of the rule that changes the meaning of the sentence.",
    },
    {
      title: "Change it",
      description:
        grammarPoint.knowledge_requirement === "receptive"
          ? "Write two English meanings this form could signal when you meet it in reading or listening."
          : "Change the example into a new sentence by switching the person, tense, or noun.",
    },
    {
      title: "Use it",
      description:
        grammarPoint.knowledge_requirement === "receptive"
          ? "Add this point to your recognition notes so you can identify it quickly in an exam text."
          : "Write one exam-style sentence of your own and check the form against the explanation.",
    },
  ];
}

function PracticeTasks({
  grammarPoint,
  examples,
}: {
  grammarPoint: DbGrammarPoint;
  examples: DbGrammarExample[];
}) {
  const tasks = getPracticeTasks(grammarPoint, examples);

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {tasks.map((task, index) => (
        <div
          key={task.title}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full [background:var(--accent-gradient-selected)] text-sm font-semibold text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]">
              {index + 1}
            </span>
            <h3 className="app-heading-card">{task.title}</h3>
          </div>
          <p className="app-text-body-muted">{task.description}</p>
        </div>
      ))}
    </div>
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

  if (!grammarSet || !grammarPoint) {
    notFound();
  }

  if (!canDashboardAccessGrammarSet(grammarSet, dashboard)) {
    return (
      <main className="space-y-4">
        <PageIntroPanel
          tone="student"
          eyebrow={grammarSet.title}
          title={grammarPoint.title}
          description={
            grammarPoint.short_description ??
            "This grammar point is part of the full GCSE Russian course."
          }
          badges={
            <GrammarPointRequirementBadges
              point={grammarPoint}
              showSpecReference={false}
            />
          }
          actions={
            <Button href="/grammar" variant="secondary" icon="back">
              All grammar
            </Button>
          }
        />

        <LockedContentCard
          title="Unlock this grammar point"
          description="This explanation, examples, and practice route are published, but your current access does not include them yet."
          accessLabel="Full course"
          statusLabel="Locked"
          primaryActionHref="/account/billing"
          primaryActionLabel="Review access"
          secondaryActionHref="/grammar"
          secondaryActionLabel="Browse grammar"
        />
      </main>
    );
  }

  const setPoints = await getGrammarPointsBySetIdDb(grammarSet.id, {
    publishedOnly: true,
    scopeVariant: getStudyVariantForDashboard(dashboard),
  });
  const currentPointIndex = setPoints.findIndex((point) => point.id === grammarPoint.id);
  const previousPoint =
    currentPointIndex > 0 ? setPoints[currentPointIndex - 1] ?? null : null;
  const nextPoint =
    currentPointIndex >= 0 ? setPoints[currentPointIndex + 1] ?? null : null;
  const relatedPoints = setPoints
    .filter(
      (point) =>
        point.id !== grammarPoint.id &&
        point.category_key === grammarPoint.category_key
    )
    .slice(0, 4);

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
          <GrammarPointRequirementBadges
            point={grammarPoint}
            showSpecReference={false}
          />
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

          <SectionCard
            title="Reference tables"
            description="Use these forms, endings, or patterns as a quick check while practising."
            tone="student"
          >
            {tables.length > 0 ? (
              <div className="space-y-3">
                {tables.map((table) => (
                  <GrammarTableRenderer key={table.id} table={table} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="table"
                iconTone="default"
                title="No reference table yet"
                description="This point can be studied from the explanation and examples while the table is prepared."
              />
            )}
          </SectionCard>

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
                    <div className="mb-3">
                      <Badge tone="muted" icon="language">
                        Example
                      </Badge>
                    </div>
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

          <SectionCard
            title="Practice"
            description="Turn the rule into a small active task before moving on."
            tone="student"
          >
            <PracticeTasks grammarPoint={grammarPoint} examples={examples} />
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
                  label: "Set",
                  value: grammarSet.title,
                },
              ]}
            />
          </PanelCard>

          <GrammarPointSetNavigationPanel
            grammarSet={grammarSet}
            currentPoint={grammarPoint}
            previousPoint={previousPoint}
            nextPoint={nextPoint}
            relatedPoints={relatedPoints}
          />

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
              <Button href="/vocabulary" variant="secondary" icon="vocabulary">
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
