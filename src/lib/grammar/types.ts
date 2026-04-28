export type DbGrammarTier = "foundation" | "higher" | "both" | "unknown";
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

export type DbGrammarSetListItem = DbGrammarSet & {
  point_count: number;
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
  published?: "all" | "published" | "draft" | null;
};
