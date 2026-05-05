import type {
  DbGrammarSetContentHealth,
  DbGrammarSetListItem,
  GrammarSetFilters,
} from "@/lib/grammar/grammar-helpers-db";

export type AdminGrammarSearchParams = {
  search?: string;
  tier?: string;
  topicKey?: string;
  sourceKey?: string;
  usageVariant?: string;
  published?: string;
  page?: string;
};

export type AdminGrammarListStats = {
  totalSets: number;
  publishedSets: number;
  draftSets: number;
  totalPoints: number;
  totalUsages: number;
};

export type AdminGrammarPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startItem: number;
  endItem: number;
};

export type AdminGrammarMetadataHealth = {
  missingSourceSets: number;
  missingTopicSets: number;
};

export type AdminGrammarListProps = {
  grammarSets: DbGrammarSetListItem[];
  filters: GrammarSetFilters;
  params: AdminGrammarSearchParams;
  topicKeys: string[];
  sourceKeys: string[];
  contentHealthBySetId: Map<string, DbGrammarSetContentHealth>;
  pagination: AdminGrammarPagination;
};
