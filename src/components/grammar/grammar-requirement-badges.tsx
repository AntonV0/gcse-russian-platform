import Badge from "@/components/ui/badge";
import {
  getGrammarCategoryLabel,
  getGrammarKnowledgeRequirementLabel,
  getGrammarTierLabel,
} from "@/lib/grammar/grammar-helpers-db";
import type { DbGrammarPoint, DbGrammarSet } from "@/lib/grammar/types";

function getKnowledgeTone(requirement: DbGrammarPoint["knowledge_requirement"]) {
  if (requirement === "productive") return "success";
  if (requirement === "receptive") return "warning";
  if (requirement === "mixed") return "info";
  return "muted";
}

function getKnowledgeIcon(requirement: DbGrammarPoint["knowledge_requirement"]) {
  if (requirement === "productive") return "write";
  if (requirement === "receptive") return "preview";
  if (requirement === "mixed") return "layers";
  return "question";
}

export function GrammarKnowledgeRequirementBadge({
  requirement,
}: {
  requirement: DbGrammarPoint["knowledge_requirement"];
}) {
  return (
    <Badge tone={getKnowledgeTone(requirement)} icon={getKnowledgeIcon(requirement)}>
      {getGrammarKnowledgeRequirementLabel(requirement)}
    </Badge>
  );
}

export function GrammarPointRequirementBadges({
  point,
  showSpecReference = true,
  showTag = true,
}: {
  point: DbGrammarPoint;
  showSpecReference?: boolean;
  showTag?: boolean;
}) {
  return (
    <>
      <Badge tone="info" icon="school">
        {getGrammarTierLabel(point.tier)}
      </Badge>
      <Badge tone="muted" icon="folder" className="capitalize">
        {getGrammarCategoryLabel(point.category_key)}
      </Badge>
      <GrammarKnowledgeRequirementBadge requirement={point.knowledge_requirement} />
      {point.receptive_scope ? (
        <Badge tone="warning" icon="preview">
          Receptive scope
        </Badge>
      ) : null}
      {showSpecReference && point.spec_reference ? (
        <Badge tone="muted" icon="file">
          {point.spec_reference}
        </Badge>
      ) : null}
      {showTag && point.grammar_tag_key ? (
        <Badge tone="muted" icon="grammar">
          {point.grammar_tag_key.replaceAll("_", " ")}
        </Badge>
      ) : null}
    </>
  );
}

export function GrammarSetRequirementBadges({
  grammarSet,
  pointCount,
}: {
  grammarSet: DbGrammarSet;
  pointCount?: number;
}) {
  return (
    <>
      <Badge tone="info" icon="school">
        {getGrammarTierLabel(grammarSet.tier)}
      </Badge>
      {typeof pointCount === "number" ? (
        <Badge tone="muted" icon="list">
          {pointCount} point{pointCount === 1 ? "" : "s"}
        </Badge>
      ) : null}
      {grammarSet.is_trial_visible ? (
        <Badge tone="success" icon="unlocked">
          Trial sample
        </Badge>
      ) : grammarSet.requires_paid_access ? (
        <Badge tone="warning" icon="lock">
          Full access
        </Badge>
      ) : (
        <Badge tone="success" icon="unlocked">
          Included
        </Badge>
      )}
    </>
  );
}
