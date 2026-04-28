import {
  getGrammarExamplesByPointIdDb,
  getGrammarPointByIdDb,
  getGrammarPointBySlugForSetIdDb,
  getGrammarPointsBySetIdDb,
  getGrammarSetByIdDb,
  getGrammarSetBySlugDb,
  getGrammarTablesByPointIdDb,
} from "@/lib/grammar/queries";
import type {
  DbGrammarStudyVariant,
  LoadedGrammarPointDetailDb,
  LoadedGrammarSetDetailDb,
} from "@/lib/grammar/types";

type GrammarSetLoadOptions = {
  publishedOnly?: boolean;
  scopeVariant?: DbGrammarStudyVariant | "all" | null;
};

export async function loadGrammarSetByIdDb(
  grammarSetId: string
): Promise<LoadedGrammarSetDetailDb> {
  const grammarSet = await getGrammarSetByIdDb(grammarSetId);

  if (!grammarSet) {
    return {
      grammarSet: null,
      points: [],
    };
  }

  const points = await getGrammarPointsBySetIdDb(grammarSet.id);

  return {
    grammarSet,
    points,
  };
}

export async function loadGrammarSetBySlugDb(
  grammarSetSlug: string,
  options?: GrammarSetLoadOptions
): Promise<LoadedGrammarSetDetailDb> {
  const grammarSet = await getGrammarSetBySlugDb(grammarSetSlug);

  if (!grammarSet) {
    return {
      grammarSet: null,
      points: [],
    };
  }

  if (options?.publishedOnly && !grammarSet.is_published) {
    return {
      grammarSet: null,
      points: [],
    };
  }

  const points = await getGrammarPointsBySetIdDb(grammarSet.id, {
    publishedOnly: options?.publishedOnly,
    scopeVariant: options?.scopeVariant,
  });

  return {
    grammarSet,
    points,
  };
}

export async function loadGrammarPointByIdDb(
  grammarPointId: string
): Promise<LoadedGrammarPointDetailDb> {
  const grammarPoint = await getGrammarPointByIdDb(grammarPointId);

  if (!grammarPoint) {
    return {
      grammarSet: null,
      grammarPoint: null,
      examples: [],
      tables: [],
    };
  }

  const [grammarSet, examples, tables] = await Promise.all([
    getGrammarSetByIdDb(grammarPoint.grammar_set_id),
    getGrammarExamplesByPointIdDb(grammarPoint.id),
    getGrammarTablesByPointIdDb(grammarPoint.id),
  ]);

  return {
    grammarSet,
    grammarPoint,
    examples,
    tables,
  };
}

export async function loadGrammarPointBySlugsDb(
  grammarSetSlug: string,
  grammarPointSlug: string,
  options?: { publishedOnly?: boolean }
): Promise<LoadedGrammarPointDetailDb> {
  const grammarSet = await getGrammarSetBySlugDb(grammarSetSlug);

  if (!grammarSet || (options?.publishedOnly && !grammarSet.is_published)) {
    return {
      grammarSet: null,
      grammarPoint: null,
      examples: [],
      tables: [],
    };
  }

  const grammarPoint = await getGrammarPointBySlugForSetIdDb(
    grammarSet.id,
    grammarPointSlug
  );

  if (!grammarPoint || (options?.publishedOnly && !grammarPoint.is_published)) {
    return {
      grammarSet,
      grammarPoint: null,
      examples: [],
      tables: [],
    };
  }

  const [examples, tables] = await Promise.all([
    getGrammarExamplesByPointIdDb(grammarPoint.id),
    getGrammarTablesByPointIdDb(grammarPoint.id),
  ]);

  return {
    grammarSet,
    grammarPoint,
    examples,
    tables,
  };
}
