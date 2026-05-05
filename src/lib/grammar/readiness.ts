export type GrammarPointReadinessInput = {
  fullExplanation?: string | null;
  exampleCount?: number;
  tableCount?: number;
};

export type GrammarPointReadiness = {
  hasExplanation: boolean;
  hasExamples: boolean;
  hasTables: boolean;
  canPublish: boolean;
  requiredIssues: string[];
  advisoryIssues: string[];
};

export function getGrammarPointReadiness({
  fullExplanation,
  exampleCount = 0,
  tableCount = 0,
}: GrammarPointReadinessInput): GrammarPointReadiness {
  const hasExplanation = Boolean(fullExplanation?.trim());
  const hasExamples = exampleCount > 0;
  const hasTables = tableCount > 0;
  const requiredIssues = [
    !hasExplanation ? "Add a full explanation" : null,
    !hasExamples ? "Add at least one example" : null,
  ].filter((issue): issue is string => Boolean(issue));
  const advisoryIssues = [
    !hasTables ? "Add a table when this point needs forms or patterns" : null,
  ].filter((issue): issue is string => Boolean(issue));

  return {
    hasExplanation,
    hasExamples,
    hasTables,
    canPublish: requiredIssues.length === 0,
    requiredIssues,
    advisoryIssues,
  };
}

export function getGrammarPointPublishGateMessage(
  readiness: GrammarPointReadiness
) {
  if (readiness.canPublish) return null;

  return `Cannot publish this grammar point yet: ${readiness.requiredIssues
    .map((issue) => issue.toLowerCase())
    .join(" and ")}.`;
}
