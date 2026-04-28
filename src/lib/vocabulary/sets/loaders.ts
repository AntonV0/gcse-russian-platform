import { getVocabularyItemsBySetIdDb } from "@/lib/vocabulary/items/item-queries";
import { getVocabularyListsBySetIdDb } from "@/lib/vocabulary/sets/list-queries";
import {
  getVocabularySetByIdDb,
  getVocabularySetByRefDb,
  getVocabularySetBySlugDb,
} from "@/lib/vocabulary/sets/set-queries";
import { getVocabularySetUsageStatsBySetIdDb } from "@/lib/vocabulary/usage/usage-queries";
import type {
  LoadedVocabularySetDb,
  LoadedVocabularySetDetailDb,
  VocabularySetLoadOptions,
} from "@/lib/vocabulary/shared/types";

const EMPTY_USAGE_STATS = {
  totalOccurrences: 0,
  foundationOccurrences: 0,
  higherOccurrences: 0,
  volnaOccurrences: 0,
  usedInFoundation: false,
  usedInHigher: false,
  usedInVolna: false,
};

export async function loadVocabularySetByIdDb(
  vocabularySetId: string,
  options?: VocabularySetLoadOptions
): Promise<LoadedVocabularySetDetailDb> {
  const vocabularySet = await getVocabularySetByIdDb(vocabularySetId);

  if (!vocabularySet) {
    return {
      vocabularySet: null,
      vocabularyList: null,
      lists: [],
      items: [],
      usageStats: EMPTY_USAGE_STATS,
    };
  }

  const lists = await getVocabularyListsBySetIdDb(vocabularySet.id);
  const vocabularyList = getSelectedVocabularyList(lists, options?.vocabularyListSlug);
  const [items, usageStats] = await Promise.all([
    getVocabularyItemsBySetIdDb(vocabularySet.id, options),
    getVocabularySetUsageStatsBySetIdDb(vocabularySet.id),
  ]);

  return {
    vocabularySet,
    vocabularyList,
    lists,
    items,
    usageStats,
  };
}

export async function loadVocabularySetBySlugDb(
  vocabularySetSlug: string,
  options?: VocabularySetLoadOptions
): Promise<LoadedVocabularySetDb> {
  const vocabularySet = await getVocabularySetBySlugDb(vocabularySetSlug);

  if (!vocabularySet) {
    return getEmptyLoadedVocabularySet();
  }

  return loadVocabularySet(vocabularySet.id, options, vocabularySet);
}

export async function loadVocabularySetByRefDb(
  vocabularySetRef: string,
  options?: VocabularySetLoadOptions
): Promise<LoadedVocabularySetDb> {
  const vocabularySet = await getVocabularySetByRefDb(vocabularySetRef);

  if (!vocabularySet) {
    return getEmptyLoadedVocabularySet();
  }

  return loadVocabularySet(vocabularySet.id, options, vocabularySet);
}

async function loadVocabularySet(
  vocabularySetId: string,
  options: VocabularySetLoadOptions | undefined,
  vocabularySet: LoadedVocabularySetDb["vocabularySet"]
): Promise<LoadedVocabularySetDb> {
  const lists = await getVocabularyListsBySetIdDb(vocabularySetId);
  const vocabularyList = getSelectedVocabularyList(lists, options?.vocabularyListSlug);
  const items = await getVocabularyItemsBySetIdDb(vocabularySetId, options);

  return {
    vocabularySet,
    vocabularyList,
    lists,
    items,
  };
}

function getSelectedVocabularyList<T extends { slug: string | null | undefined }>(
  lists: T[],
  vocabularyListSlug?: string | null
) {
  const trimmedSlug = vocabularyListSlug?.trim();

  return trimmedSlug
    ? (lists.find((list) => list.slug === trimmedSlug) ?? null)
    : (lists[0] ?? null);
}

function getEmptyLoadedVocabularySet(): LoadedVocabularySetDb {
  return {
    vocabularySet: null,
    vocabularyList: null,
    lists: [],
    items: [],
  };
}
