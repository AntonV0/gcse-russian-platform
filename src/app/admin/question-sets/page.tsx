import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import CardListItem from "@/components/ui/card-list-item";
import EmptyState from "@/components/ui/empty-state";
import FeedbackBanner from "@/components/ui/feedback-banner";
import Input from "@/components/ui/input";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import SectionCard from "@/components/ui/section-card";
import Select from "@/components/ui/select";
import SummaryStatCard from "@/components/ui/summary-stat-card";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import {
  getQuestionSetTemplatesDb,
  getQuestionSetsDb,
  getQuestionsByQuestionSetIdIncludingInactiveDb,
} from "@/lib/questions/question-helpers-db";
import type { DbQuestionSet } from "@/lib/questions/question-helpers-db";

type AdminQuestionSetsPageProps = {
  searchParams?: Promise<{
    q?: string;
    type?: string;
    readiness?: string;
  }>;
};

type QuestionSetListItem = {
  questionSet: DbQuestionSet;
  questionCount: number;
  activeQuestionCount: number;
};

function getReadiness(item: QuestionSetListItem) {
  if (item.questionCount === 0) return "empty";
  if (!item.questionSet.instructions || !item.questionSet.description)
    return "needs_context";
  return "ready";
}

function getReadinessLabel(value: string) {
  if (value === "empty") return "Empty";
  if (value === "needs_context") return "Needs context";
  return "Ready";
}

function getReadinessTone(value: string) {
  if (value === "empty") return "warning" as const;
  if (value === "needs_context") return "info" as const;
  return "success" as const;
}

function matchesQuery(item: QuestionSetListItem, query: string) {
  if (!query) return true;

  const haystack = [
    item.questionSet.title,
    item.questionSet.slug,
    item.questionSet.description,
    item.questionSet.instructions,
    item.questionSet.source_type,
    item.questionSet.template_type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function filterQuestionSets(
  items: QuestionSetListItem[],
  params: Awaited<NonNullable<AdminQuestionSetsPageProps["searchParams"]>>
) {
  const query = (params.q ?? "").trim();
  const type = params.type ?? "all";
  const readiness = params.readiness ?? "all";

  return items.filter((item) => {
    if (!matchesQuery(item, query)) return false;

    if (type === "templates" && !item.questionSet.is_template) return false;
    if (type === "sets" && item.questionSet.is_template) return false;
    if (type !== "all" && type !== "templates" && type !== "sets") {
      if (item.questionSet.source_type !== type) return false;
    }

    if (readiness !== "all" && getReadiness(item) !== readiness) return false;

    return true;
  });
}

export default async function AdminQuestionSetsPage({
  searchParams,
}: AdminQuestionSetsPageProps) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    return <main>Access denied.</main>;
  }

  const params = (await searchParams) ?? {};
  const [questionSets, templates] = await Promise.all([
    getQuestionSetsDb(),
    getQuestionSetTemplatesDb(),
  ]);
  const questionRowsBySet = await Promise.all(
    questionSets.map(async (questionSet) => ({
      questionSet,
      questions: await getQuestionsByQuestionSetIdIncludingInactiveDb(questionSet.id),
    }))
  );
  const items: QuestionSetListItem[] = questionRowsBySet.map(
    ({ questionSet, questions }) => ({
      questionSet,
      questionCount: questions.length,
      activeQuestionCount: questions.filter((question) => question.is_active).length,
    })
  );
  const filteredItems = filterQuestionSets(items, params);
  const sourceTypes = Array.from(
    new Set(questionSets.map((questionSet) => questionSet.source_type).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const totalQuestions = items.reduce((sum, item) => sum + item.questionCount, 0);
  const emptyCount = items.filter((item) => getReadiness(item) === "empty").length;
  const needsContextCount = items.filter(
    (item) => getReadiness(item) === "needs_context"
  ).length;

  return (
    <main className="space-y-4">
      <PageIntroPanel
        tone="admin"
        eyebrow="Admin question bank"
        title="Question Sets"
        description="Manage reusable practice banks, lesson question groups, templates, and GCSE-style tasks from one scan-friendly workspace."
        badges={
          <>
            <Badge tone="info" icon="questionSet">
              {questionSets.length} set{questionSets.length === 1 ? "" : "s"}
            </Badge>
            <Badge tone="muted" icon="file">
              {templates.length} template{templates.length === 1 ? "" : "s"}
            </Badge>
            <Badge tone={emptyCount > 0 ? "warning" : "success"} icon="question">
              {emptyCount} empty
            </Badge>
          </>
        }
        actions={
          <>
            <Button href="/admin/question-sets/create" variant="primary" icon="create">
              Create question set
            </Button>
            <Button href="/admin/question-sets/templates" variant="secondary" icon="file">
              Templates
            </Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryStatCard
            title="Question sets"
            value={questionSets.length}
            description="reusable banks and templates"
            icon="questionSet"
            tone="brand"
            compact
          />
          <SummaryStatCard
            title="Questions"
            value={totalQuestions}
            description="total active and inactive items"
            icon="question"
            compact
          />
          <SummaryStatCard
            title="Templates"
            value={templates.length}
            description="starting points for new sets"
            icon="file"
            tone="info"
            compact
          />
          <SummaryStatCard
            title="Needs setup"
            value={emptyCount + needsContextCount}
            description="empty or missing context"
            icon="warning"
            tone={emptyCount + needsContextCount > 0 ? "warning" : "success"}
            compact
          />
        </div>
      </PageIntroPanel>

      {emptyCount + needsContextCount > 0 ? (
        <FeedbackBanner
          tone="warning"
          title="Some question sets need publishing readiness work"
          description={`${emptyCount} empty set${emptyCount === 1 ? "" : "s"} and ${needsContextCount} set${needsContextCount === 1 ? "" : "s"} missing description or instructions.`}
        />
      ) : null}

      <SectionCard
        title="Find question sets"
        description="Search by title, slug, source, instructions, or template metadata."
        tone="admin"
      >
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_minmax(180px,220px)_minmax(180px,220px)_auto] xl:items-center">
          <Input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search question sets..."
          />

          <Select name="type" defaultValue={params.type ?? "all"}>
            <option value="all">All types</option>
            <option value="sets">Sets only</option>
            <option value="templates">Templates only</option>
            {sourceTypes.map((sourceType) => (
              <option key={sourceType} value={sourceType}>
                {sourceType}
              </option>
            ))}
          </Select>

          <Select name="readiness" defaultValue={params.readiness ?? "all"}>
            <option value="all">All readiness</option>
            <option value="ready">Ready</option>
            <option value="needs_context">Needs context</option>
            <option value="empty">Empty</option>
          </Select>

          <div className="app-mobile-action-stack flex flex-col gap-2 sm:flex-row md:col-span-2 xl:col-span-1">
            <Button type="submit" variant="secondary" icon="filter">
              Apply
            </Button>
            <Button href="/admin/question-sets" variant="quiet" icon="refresh">
              Reset
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Question set library"
        description={`${filteredItems.length} of ${items.length} set${items.length === 1 ? "" : "s"} shown.`}
        tone="admin"
        actions={
          <Button
            href="/admin/question-sets/create"
            variant="secondary"
            size="sm"
            icon="create"
          >
            New set
          </Button>
        }
      >
        {filteredItems.length === 0 ? (
          <EmptyState
            icon="questionSet"
            iconTone="brand"
            title="No question sets match these filters"
            description="Clear filters or create a new reusable question set."
            action={
              <Button href="/admin/question-sets/create" variant="primary" icon="create">
                Create question set
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3">
            {filteredItems.map((item) => {
              const readiness = getReadiness(item);

              return (
                <CardListItem
                  key={item.questionSet.id}
                  href={`/admin/question-sets/${item.questionSet.id}`}
                  title={item.questionSet.title}
                  subtitle={
                    item.questionSet.description ??
                    item.questionSet.instructions ??
                    "No description or instructions added yet."
                  }
                  badges={
                    <>
                      <Badge tone="muted" icon="file">
                        {item.questionSet.slug ?? "No slug"}
                      </Badge>
                      <Badge
                        tone={item.questionSet.is_template ? "info" : "muted"}
                        icon="questionSet"
                      >
                        {item.questionSet.is_template
                          ? "Template"
                          : item.questionSet.source_type}
                      </Badge>
                      <Badge
                        tone={getReadinessTone(readiness)}
                        icon={readiness === "ready" ? "completed" : "warning"}
                      >
                        {getReadinessLabel(readiness)}
                      </Badge>
                      <Badge tone="muted" icon="list">
                        {item.activeQuestionCount} active / {item.questionCount} total
                      </Badge>
                    </>
                  }
                  actions={
                    <div className="flex items-center gap-2 text-sm app-text-muted">
                      <AppIcon icon="next" size={16} />
                      <span>Open</span>
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </SectionCard>
    </main>
  );
}
