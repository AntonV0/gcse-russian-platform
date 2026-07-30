import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  OperationsHeader,
  OperationsSection,
} from "@/components/ui/operations-workspace";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import {
  getGrammarTierLabel,
  getGrammarTopicLabel,
  type DbGrammarSet,
} from "@/lib/grammar/grammar-helpers-db";

export function GrammarSetPointsSummarySection({
  grammarSet,
}: {
  grammarSet: DbGrammarSet;
}) {
  return (
    <>
      <OperationsHeader
        eyebrow="Grammar points"
        title={grammarSet.title}
        description={
          grammarSet.description ||
          "Manage the teaching points inside this reusable grammar set."
        }
        badges={
          <>
            <Badge tone="info" icon="grammar">
              {getGrammarTierLabel(grammarSet.tier)}
            </Badge>

            <Badge tone="muted" icon="folder">
              {getGrammarTopicLabel(grammarSet.topic_key)}
            </Badge>

            <PublishStatusBadge
              isPublished={grammarSet.is_published}
              publishedLabel="Set published"
              draftLabel="Set draft"
            />
          </>
        }
        actions={
          <>
            <Button href="/admin/grammar" variant="secondary" icon="back">
              Back to grammar
            </Button>

            <Button
              href={`/admin/grammar/${grammarSet.id}/edit`}
              variant="soft"
              icon="edit"
            >
              Edit set
            </Button>

            <Button
              href={`/admin/grammar/${grammarSet.id}/export`}
              variant="soft"
              icon="download"
              download
              prefetch={false}
            >
              Export Markdown
            </Button>
          </>
        }
      />

      <OperationsSection muted>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div>
              <h2 className="app-heading-subsection">Teaching points</h2>
              <p className="mt-2 max-w-3xl app-text-body-muted">
                Review coverage, filter points, and add explanations, examples, and
                tables from one management screen.
              </p>
            </div>
          </div>
        </div>
      </OperationsSection>
    </>
  );
}
