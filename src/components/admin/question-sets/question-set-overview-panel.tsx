import Link from "next/link";
import type { DbQuestionSet } from "@/lib/questions/question-db-types";
import Button from "@/components/ui/button";
import DetailList from "@/components/ui/detail-list";
import InlineActions from "@/components/ui/inline-actions";
import PanelCard from "@/components/ui/panel-card";

export function QuestionSetOverviewPanel({
  questionSet,
  questionCount,
}: {
  questionSet: DbQuestionSet;
  questionCount: number;
}) {
  return (
    <PanelCard
      title="Question set details"
      description="Core metadata and quick navigation for this reusable question set."
      tone="admin"
      contentClassName="space-y-4"
    >
      <DetailList
        items={[
          { label: "ID", value: questionSet.id },
          { label: "Slug", value: questionSet.slug ?? "-" },
          { label: "Source type", value: questionSet.source_type },
          { label: "Questions", value: questionCount },
        ]}
      />

      {questionSet.instructions ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/55 px-4 py-3 text-sm leading-6 app-text-muted">
          <span className="font-semibold text-[var(--text-primary)]">
            Instructions:
          </span>{" "}
          {questionSet.instructions}
        </div>
      ) : null}

      <InlineActions>
        <Button href="/admin/question-sets" variant="secondary" icon="back">
          Back to all question sets
        </Button>

        {questionSet.is_template ? (
          <Button
            href={`/admin/question-sets/templates/${questionSet.id}/create`}
            variant="secondary"
            icon="create"
          >
            Create from this template
          </Button>
        ) : null}

        <Button href="/admin/question-sets/templates" variant="secondary" icon="file">
          Open templates
        </Button>

        {questionSet.slug ? (
          <Link
            href={`/question-sets/${questionSet.slug}`}
            className="app-btn-base app-btn-secondary min-h-10 rounded-2xl px-4 py-2.5 text-sm"
            target="_blank"
            rel="noreferrer"
          >
            Open public view
          </Link>
        ) : null}
      </InlineActions>
    </PanelCard>
  );
}
