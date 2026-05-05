import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PageIntroPanel from "@/components/ui/page-intro-panel";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import {
  getGrammarCategoryLabel,
  getGrammarKnowledgeRequirementLabel,
  getGrammarPointReadiness,
  getGrammarTierLabel,
  type DbGrammarExample,
  type DbGrammarPoint,
  type DbGrammarSet,
  type DbGrammarTable,
} from "@/lib/grammar/grammar-helpers-db";

export default function GrammarPointEditHeader({
  grammarSet,
  grammarPoint,
  examples,
  tables,
}: {
  grammarSet: DbGrammarSet;
  grammarPoint: DbGrammarPoint;
  examples: DbGrammarExample[];
  tables: DbGrammarTable[];
}) {
  const readiness = getGrammarPointReadiness({
    fullExplanation: grammarPoint.full_explanation,
    exampleCount: examples.length,
    tableCount: tables.length,
  });

  return (
    <PageIntroPanel
      tone="admin"
      eyebrow="Edit grammar point"
      title={grammarPoint.title}
      description="Update the explanation and manage the examples and flexible tables attached to this grammar point."
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
              grammarPoint.knowledge_requirement === "receptive" ? "warning" : "muted"
            }
          >
            {getGrammarKnowledgeRequirementLabel(grammarPoint.knowledge_requirement)}
          </Badge>
          <PublishStatusBadge isPublished={grammarPoint.is_published} />
          <Badge tone={readiness.canPublish ? "success" : "warning"}>
            {readiness.canPublish ? "Publish ready" : "Publish blocked"}
          </Badge>
        </>
      }
      actions={
        <>
          <Button
            href={`/admin/grammar/${grammarSet.id}/points`}
            variant="secondary"
            icon="back"
          >
            Back to points
          </Button>
          <Button
            href={`/grammar/${grammarSet.slug}/${grammarPoint.slug}`}
            variant="secondary"
            icon="preview"
          >
            Student view
          </Button>
        </>
      }
    />
  );
}
