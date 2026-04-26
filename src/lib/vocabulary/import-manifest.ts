import {
  ASPECTS,
  DISPLAY_VARIANTS,
  GENDERS,
  ITEM_TYPES,
  LIST_MODES,
  PARTS_OF_SPEECH,
  PRIORITIES,
  PRODUCTIVE_RECEPTIVE,
  REVIEW_STATUSES,
  SET_TYPES,
  SOURCE_TYPES,
  TIERS,
} from "./import-manifest-constants";
import type {
  VocabularyManifestValidationIssue,
  VocabularyManifestValidationResult,
} from "./import-manifest-types";

export type {
  VocabularyImportManifest,
  VocabularyManifestItem,
  VocabularyManifestList,
  VocabularyManifestReviewStatus,
  VocabularyManifestSet,
  VocabularyManifestValidationIssue,
  VocabularyManifestValidationResult,
} from "./import-manifest-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function addIssue(
  issues: VocabularyManifestValidationIssue[],
  path: string,
  message: string
) {
  issues.push({ path, message });
}

function hasString(record: Record<string, unknown>, key: string) {
  return typeof record[key] === "string" && record[key].trim().length > 0;
}

function assertString(
  issues: VocabularyManifestValidationIssue[],
  record: Record<string, unknown>,
  key: string,
  path: string
) {
  if (!hasString(record, key)) {
    addIssue(issues, `${path}.${key}`, "Required non-empty string is missing");
  }
}

function assertNumber(
  issues: VocabularyManifestValidationIssue[],
  record: Record<string, unknown>,
  key: string,
  path: string
) {
  if (!Number.isInteger(record[key]) || Number(record[key]) < 0) {
    addIssue(issues, `${path}.${key}`, "Required non-negative integer is missing");
  }
}

function assertBoolean(
  issues: VocabularyManifestValidationIssue[],
  record: Record<string, unknown>,
  key: string,
  path: string
) {
  if (typeof record[key] !== "boolean") {
    addIssue(issues, `${path}.${key}`, "Required boolean is missing");
  }
}

function assertEnum<T extends readonly string[]>(
  issues: VocabularyManifestValidationIssue[],
  record: Record<string, unknown>,
  key: string,
  path: string,
  allowed: T
) {
  if (typeof record[key] !== "string" || !allowed.includes(record[key] as T[number])) {
    addIssue(
      issues,
      `${path}.${key}`,
      `Must be one of: ${allowed.map((value) => `"${value}"`).join(", ")}`
    );
  }
}

function assertUnique(
  issues: VocabularyManifestValidationIssue[],
  value: unknown,
  seen: Map<string, string>,
  path: string,
  label: string
) {
  if (typeof value !== "string" || !value.trim()) return;

  const normalized = value.trim();
  const existingPath = seen.get(normalized);

  if (existingPath) {
    addIssue(issues, path, `${label} duplicates ${existingPath}`);
    return;
  }

  seen.set(normalized, path);
}

function assertSequentialPositions(
  issues: VocabularyManifestValidationIssue[],
  items: unknown[],
  path: string
) {
  const positions = items
    .map((item) => (isRecord(item) ? item.position : null))
    .filter((position): position is number => typeof position === "number")
    .sort((a, b) => a - b);

  for (let index = 0; index < positions.length; index += 1) {
    const expected = index + 1;

    if (positions[index] !== expected) {
      addIssue(
        issues,
        path,
        `Positions should be sequential starting at 1; expected ${expected}, found ${positions[index]}`
      );
      return;
    }
  }
}

export function validateVocabularyImportManifest(
  input: unknown
): VocabularyManifestValidationResult {
  const issues: VocabularyManifestValidationIssue[] = [];
  const importKeys = new Map<string, string>();
  const setSlugs = new Map<string, string>();
  const itemKeys = new Map<string, string>();

  let setCount = 0;
  let listCount = 0;
  let itemCount = 0;

  if (!isRecord(input)) {
    return {
      valid: false,
      issues: [{ path: "$", message: "Manifest must be an object" }],
      summary: { setCount, listCount, itemCount },
    };
  }

  assertString(issues, input, "sourceKey", "$");
  assertString(issues, input, "sourceTitle", "$");
  assertString(issues, input, "sourceVersion", "$");
  assertEnum(issues, input, "reviewStatus", "$", REVIEW_STATUSES);

  if (!Array.isArray(input.sets)) {
    addIssue(issues, "$.sets", "Required sets array is missing");
  } else {
    setCount = input.sets.length;

    input.sets.forEach((set, setIndex) => {
      const setPath = `$.sets[${setIndex}]`;

      if (!isRecord(set)) {
        addIssue(issues, setPath, "Set must be an object");
        return;
      }

      assertString(issues, set, "importKey", setPath);
      assertUnique(issues, set.importKey, importKeys, `${setPath}.importKey`, "Import key");
      assertString(issues, set, "slug", setPath);
      assertUnique(issues, set.slug, setSlugs, `${setPath}.slug`, "Set slug");
      assertString(issues, set, "title", setPath);
      assertEnum(issues, set, "setType", setPath, SET_TYPES);
      assertEnum(issues, set, "tier", setPath, TIERS);
      assertEnum(issues, set, "listMode", setPath, LIST_MODES);
      assertEnum(issues, set, "defaultDisplayVariant", setPath, DISPLAY_VARIANTS);
      assertBoolean(issues, set, "isPublished", setPath);
      assertNumber(issues, set, "sortOrder", setPath);

      if (!Array.isArray(set.lists)) {
        addIssue(issues, `${setPath}.lists`, "Required lists array is missing");
        return;
      }

      listCount += set.lists.length;
      const listSlugs = new Map<string, string>();

      set.lists.forEach((list, listIndex) => {
        const listPath = `${setPath}.lists[${listIndex}]`;

        if (!isRecord(list)) {
          addIssue(issues, listPath, "List must be an object");
          return;
        }

        assertString(issues, list, "importKey", listPath);
        assertUnique(
          issues,
          list.importKey,
          importKeys,
          `${listPath}.importKey`,
          "Import key"
        );
        assertString(issues, list, "slug", listPath);
        assertUnique(issues, list.slug, listSlugs, `${listPath}.slug`, "List slug");
        assertString(issues, list, "title", listPath);
        assertEnum(issues, list, "tier", listPath, TIERS);
        assertEnum(issues, list, "listMode", listPath, LIST_MODES);
        assertEnum(issues, list, "defaultDisplayVariant", listPath, DISPLAY_VARIANTS);
        assertBoolean(issues, list, "isPublished", listPath);
        assertNumber(issues, list, "sortOrder", listPath);

        if (!Array.isArray(list.items)) {
          addIssue(issues, `${listPath}.items`, "Required items array is missing");
          return;
        }

        itemCount += list.items.length;
        assertSequentialPositions(issues, list.items, `${listPath}.items`);

        list.items.forEach((item, itemIndex) => {
          const itemPath = `${listPath}.items[${itemIndex}]`;

          if (!isRecord(item)) {
            addIssue(issues, itemPath, "Item must be an object");
            return;
          }

          assertString(issues, item, "importKey", itemPath);
          assertUnique(
            issues,
            item.importKey,
            importKeys,
            `${itemPath}.importKey`,
            "Import key"
          );
          assertUnique(
            issues,
            item.importKey,
            itemKeys,
            `${itemPath}.importKey`,
            "Item import key"
          );
          assertString(issues, item, "russian", itemPath);
          assertString(issues, item, "english", itemPath);
          assertEnum(issues, item, "itemType", itemPath, ITEM_TYPES);
          assertEnum(issues, item, "sourceType", itemPath, SOURCE_TYPES);
          assertEnum(issues, item, "priority", itemPath, PRIORITIES);
          assertEnum(issues, item, "partOfSpeech", itemPath, PARTS_OF_SPEECH);
          assertEnum(issues, item, "gender", itemPath, GENDERS);
          assertEnum(
            issues,
            item,
            "productiveReceptive",
            itemPath,
            PRODUCTIVE_RECEPTIVE
          );
          assertEnum(issues, item, "tier", itemPath, TIERS);
          assertEnum(issues, item, "aspect", itemPath, ASPECTS);
          assertBoolean(issues, item, "isReflexive", itemPath);
          assertNumber(issues, item, "position", itemPath);
        });
      });
    });
  }

  return {
    valid: issues.length === 0,
    issues,
    summary: {
      setCount,
      listCount,
      itemCount,
    },
  };
}

