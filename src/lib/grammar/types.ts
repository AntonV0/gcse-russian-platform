export type DbGrammarTier = "foundation" | "higher" | "both" | "unknown";
export type DbGrammarUsageVariant = "foundation" | "higher" | "volna";
export type DbGrammarCoverageVariant = DbGrammarUsageVariant;
export type DbGrammarStudyVariant = DbGrammarUsageVariant;
export type DbGrammarKnowledgeRequirement =
  | "productive"
  | "receptive"
  | "mixed"
  | "unknown";

export type GrammarTableCell = string;
export type GrammarTableColumns = string[];
export type GrammarTableRows = string[][];

export type DbGrammarSet = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  theme_key: string | null;
  topic_key: string | null;
  tier: DbGrammarTier;
  sort_order: number;
  is_published: boolean;
  is_trial_visible: boolean;
  requires_paid_access: boolean;
  available_in_volna: boolean;
  source_key: string | null;
  source_version: string | null;
  import_key: string | null;
  created_at: string;
  updated_at: string;
};

export type DbGrammarPoint = {
  id: string;
  grammar_set_id: string;
  slug: string;
  title: string;
  short_description: string | null;
  full_explanation: string | null;
  spec_reference: string | null;
  grammar_tag_key: string | null;
  category_key: string | null;
  tier: DbGrammarTier;
  knowledge_requirement: DbGrammarKnowledgeRequirement;
  receptive_scope: string | null;
  source_key: string | null;
  source_version: string | null;
  import_key: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type DbGrammarExample = {
  id: string;
  grammar_point_id: string;
  russian_text: string;
  english_translation: string;
  optional_highlight: string | null;
  note: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type DbGrammarTable = {
  id: string;
  grammar_point_id: string;
  title: string;
  columns: GrammarTableColumns;
  rows: GrammarTableRows;
  optional_note: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type DbGrammarPointCoverage = {
  grammar_point_id: string;
  used_in_foundation: boolean;
  used_in_higher: boolean;
  used_in_volna: boolean;
  foundation_occurrences: number;
  higher_occurrences: number;
  volna_occurrences: number;
};

export type DbLessonGrammarLink = {
  id: string;
  lesson_id: string;
  lesson_section_id: string | null;
  lesson_block_id: string | null;
  link_type: "set" | "point" | "tag";
  grammar_set_id: string | null;
  grammar_point_id: string | null;
  grammar_tag_key: string | null;
  variant: DbGrammarUsageVariant;
  usage_type: "lesson_block" | "lesson_page" | "explanation" | "practice" | "other";
  position: number;
  created_at: string;
};

export type DbGrammarSetUsageStats = {
  totalOccurrences: number;
  foundationOccurrences: number;
  higherOccurrences: number;
  volnaOccurrences: number;
  usedInFoundation: boolean;
  usedInHigher: boolean;
  usedInVolna: boolean;
};

export type DbGrammarSetCoverageSummary = {
  totalPoints: number;
  foundationTotalPoints: number;
  higherTotalPoints: number;
  volnaTotalPoints: number;
  foundationUsedPoints: number;
  higherUsedPoints: number;
  volnaUsedPoints: number;
};

export type DbGrammarSetSummaryRow = {
  grammar_set_id: string;
  point_count: number;
  total_occurrences: number;
  foundation_occurrences: number;
  higher_occurrences: number;
  volna_occurrences: number;
  foundation_total_points: number;
  higher_total_points: number;
  volna_total_points: number;
  foundation_used_points: number;
  higher_used_points: number;
  volna_used_points: number;
};

export type DbGrammarSetListItem = DbGrammarSet & {
  point_count: number;
  usage_stats: DbGrammarSetUsageStats;
  coverage_summary: DbGrammarSetCoverageSummary;
};

export type LoadedGrammarSetDetailDb = {
  grammarSet: DbGrammarSet | null;
  points: DbGrammarPoint[];
};

export type LoadedGrammarPointDetailDb = {
  grammarSet: DbGrammarSet | null;
  grammarPoint: DbGrammarPoint | null;
  examples: DbGrammarExample[];
  tables: DbGrammarTable[];
};

export type GrammarSetFilters = {
  search?: string | null;
  tier?: DbGrammarTier | "all" | null;
  themeKey?: string | null;
  topicKey?: string | null;
  sourceKey?: string | null;
  usageVariant?: DbGrammarUsageVariant | "unused" | "all" | null;
  published?: "all" | "published" | "draft" | null;
};
