import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
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
      <PageHeader
        title="Grammar points"
        description="Manage the teaching points inside this reusable grammar set."
      />

      <section className="app-surface app-section-padding">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
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
            </div>

            <div>
              <h2 className="app-heading-section">{grammarSet.title}</h2>
              <p className="mt-2 max-w-3xl app-text-body-muted">
                {grammarSet.description || "No description yet."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
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
          </div>
        </div>
      </section>
    </>
  );
}
