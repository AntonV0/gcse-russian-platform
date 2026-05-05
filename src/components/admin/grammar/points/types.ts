import type {
  DbGrammarKnowledgeRequirement,
  DbGrammarPoint,
  DbGrammarPointContentHealth,
  DbGrammarPointCoverage,
  DbGrammarSet,
  DbGrammarTier,
} from "@/lib/grammar/grammar-helpers-db";

export type GrammarPointAdminFilters = {
  pointSearch?: string;
  tier?: string;
  knowledgeRequirement?: string;
  categoryKey?: string;
  coverage?: string;
};

export type GrammarPointCoverageFilter =
  | "foundation"
  | "higher"
  | "volna"
  | "unused"
  | "all";

export type GrammarSetPointsAdminProps = {
  grammarSet: DbGrammarSet;
  points: DbGrammarPoint[];
  pointCoverageById: Map<string, DbGrammarPointCoverage>;
  pointContentHealthById: Map<string, DbGrammarPointContentHealth>;
  pointFilters: GrammarPointAdminFilters;
};

export type GrammarPointAdminStats = {
  totalPoints: number;
  publishedPoints: number;
  draftPoints: number;
  foundationUsages: number;
  higherUsages: number;
  missingExplanationPoints: number;
  missingExamplePoints: number;
};

export type NormalizedGrammarPointFilters = {
  tier: DbGrammarTier | "all";
  knowledgeRequirement: DbGrammarKnowledgeRequirement | "all";
  coverage: GrammarPointCoverageFilter;
};
