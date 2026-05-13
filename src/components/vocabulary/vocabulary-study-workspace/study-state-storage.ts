"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  normalizeVocabularyStudyState,
  type VocabularyStudyState,
  type VocabularyStudyStateMap,
} from "@/lib/vocabulary/study-state";

const EMPTY_STUDY_STATES: VocabularyStudyStateMap = {};
const STUDY_STATE_STORAGE_EVENT = "vocabulary-study-state-change";

let cachedStudyStateStorageKey = "";
let cachedStudyStateItemIdsKey = "";
let cachedStudyStateRawValue = "";
let cachedStudyStateSnapshot: VocabularyStudyStateMap = EMPTY_STUDY_STATES;

export function getVocabularyStudyStorageKey(vocabularySetId: string) {
  return `gcse-russian:vocabulary-study:${vocabularySetId}`;
}

export function useVocabularyStudyStateMap({
  storageKey,
  itemIdSet,
}: {
  storageKey: string;
  itemIdSet: Set<string>;
}) {
  const getStudyStateSnapshot = useCallback(
    () => getCachedStoredStudyStates(storageKey, itemIdSet),
    [itemIdSet, storageKey]
  );

  return useSyncExternalStore(
    subscribeToStudyStateStorage,
    getStudyStateSnapshot,
    () => EMPTY_STUDY_STATES
  );
}

export function saveVocabularyStudyState({
  storageKey,
  stateByItemId,
  itemId,
  state,
}: {
  storageKey: string;
  stateByItemId: VocabularyStudyStateMap;
  itemId: string;
  state: VocabularyStudyState;
}) {
  window.localStorage.setItem(
    storageKey,
    JSON.stringify({
      ...stateByItemId,
      [itemId]: state,
    })
  );
  window.dispatchEvent(new Event(STUDY_STATE_STORAGE_EVENT));
}

function loadStoredStudyStates(storageKey: string, itemIds: Set<string>) {
  try {
    const rawValue = window.localStorage.getItem(storageKey);
    const parsedValue = rawValue ? JSON.parse(rawValue) : null;

    if (!parsedValue || typeof parsedValue !== "object") {
      return {};
    }

    return Object.entries(parsedValue).reduce<VocabularyStudyStateMap>(
      (states, [itemId, value]) => {
        const normalizedState = normalizeVocabularyStudyState(value);

        if (itemIds.has(itemId) && normalizedState) {
          states[itemId] = normalizedState;
        }

        return states;
      },
      {}
    );
  } catch {
    return {};
  }
}

function getCachedStoredStudyStates(storageKey: string, itemIds: Set<string>) {
  if (typeof window === "undefined") {
    return EMPTY_STUDY_STATES;
  }

  const itemIdsKey = Array.from(itemIds).join("\u001f");
  const rawValue = window.localStorage.getItem(storageKey) ?? "";

  if (
    cachedStudyStateStorageKey === storageKey &&
    cachedStudyStateItemIdsKey === itemIdsKey &&
    cachedStudyStateRawValue === rawValue
  ) {
    return cachedStudyStateSnapshot;
  }

  cachedStudyStateStorageKey = storageKey;
  cachedStudyStateItemIdsKey = itemIdsKey;
  cachedStudyStateRawValue = rawValue;
  cachedStudyStateSnapshot = loadStoredStudyStates(storageKey, itemIds);

  return cachedStudyStateSnapshot;
}

function subscribeToStudyStateStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STUDY_STATE_STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STUDY_STATE_STORAGE_EVENT, onStoreChange);
  };
}
