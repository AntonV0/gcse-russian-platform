import { createClient } from "@/lib/supabase/server";
import {
  getBoolean,
  getOptionalPositiveNumber,
  getOptionalString,
  getTrimmedString,
} from "@/app/actions/shared/form-data";

export {
  getBoolean,
  getOptionalPositiveNumber,
  getOptionalString,
  getTrimmedString,
};

export function parseJsonObject(raw: string) {
  if (!raw) return {};

  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Metadata must be a JSON object");
  }

  return parsed as Record<string, unknown>;
}

export function parseLineList(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseOneBasedIndexList(raw: string) {
  return raw
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item > 0)
    .map((item) => item - 1);
}

function parseSelectionGroups(raw: string) {
  const lines = parseLineList(raw);

  return lines.map((line, index) => {
    const parts = line.split("|").map((part) => part.trim());
    const [id, label, optionsRaw] = parts;

    if (!id || !optionsRaw) {
      throw new Error(
        `Invalid selection group format on line ${index + 1}. Use id|label|option1,option2`
      );
    }

    const options = optionsRaw
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);

    if (options.length === 0) {
      throw new Error(`Selection group on line ${index + 1} has no options`);
    }

    return {
      id,
      label: label || undefined,
      options,
    };
  });
}

function parseGapRows(raw: string) {
  return parseLineList(raw).map((line, index) => {
    const [labelRaw, acceptedAnswersRaw] = line.split("|");
    const label = labelRaw?.trim();
    const acceptedAnswers = (acceptedAnswersRaw ?? "")
      .split(";")
      .map((answer) => answer.trim())
      .filter(Boolean);

    if (!label || acceptedAnswers.length === 0) {
      throw new Error(
        `Invalid gap format on line ${index + 1}. Use label|answer1;answer2`
      );
    }

    return {
      id: `gap-${index + 1}`,
      label,
      acceptedAnswers,
    };
  });
}

function parseCategoryRows(raw: string) {
  return parseLineList(raw).map((line, index) => {
    const [idRaw, labelRaw] = line.split("|");
    const id = idRaw?.trim();
    const label = labelRaw?.trim() || id;

    if (!id) {
      throw new Error(`Invalid category format on line ${index + 1}. Use id|label`);
    }

    return {
      id,
      label,
    };
  });
}

function parseCategorisationItemRows(raw: string) {
  return parseLineList(raw).map((line, index) => {
    const [textRaw, categoryIdRaw] = line.split("|");
    const text = textRaw?.trim();
    const categoryId = categoryIdRaw?.trim();

    if (!text || !categoryId) {
      throw new Error(
        `Invalid categorisation item on line ${index + 1}. Use text|categoryId`
      );
    }

    return {
      id: `item-${index + 1}`,
      text,
      categoryId,
    };
  });
}

export function buildStructuredMetadata(formData: FormData) {
  const metadata: Record<string, unknown> = {};

  const answerStrategy = getTrimmedString(formData, "answerStrategy");
  if (answerStrategy) {
    metadata.answerStrategy = answerStrategy;
  }

  const translationDirection = getTrimmedString(formData, "translationDirection");
  if (translationDirection === "to_russian" || translationDirection === "to_english") {
    metadata.direction = translationDirection;
  }

  const placeholder = getOptionalString(formData, "placeholder");
  if (placeholder) {
    metadata.placeholder = placeholder;
  }

  const sourceLanguageLabel = getOptionalString(formData, "sourceLanguageLabel");
  if (sourceLanguageLabel) {
    metadata.sourceLanguageLabel = sourceLanguageLabel;
  }

  const targetLanguageLabel = getOptionalString(formData, "targetLanguageLabel");
  if (targetLanguageLabel) {
    metadata.targetLanguageLabel = targetLanguageLabel;
  }

  const instruction = getOptionalString(formData, "instruction");
  if (instruction) {
    metadata.instruction = instruction;
  }

  const selectionDisplayMode = getTrimmedString(formData, "selectionDisplayMode");
  if (selectionDisplayMode === "grouped" || selectionDisplayMode === "inline_gaps") {
    metadata.selectionDisplayMode = selectionDisplayMode;
  }

  const selectionGroupsText = getTrimmedString(formData, "selectionGroupsText");
  if (selectionGroupsText) {
    metadata.selectionGroups = parseSelectionGroups(selectionGroupsText);
  }

  const wordBankText = getTrimmedString(formData, "wordBankText");
  if (wordBankText) {
    metadata.wordBank = parseLineList(wordBankText);
  }

  const matchingPromptsText = getTrimmedString(formData, "matchingPromptsText");
  if (matchingPromptsText) {
    metadata.prompts = parseLineList(matchingPromptsText);
  }

  const matchingOptionsText = getTrimmedString(formData, "matchingOptionsText");
  if (matchingOptionsText) {
    metadata.options = parseLineList(matchingOptionsText);
  }

  const correctMatchesText = getTrimmedString(formData, "correctMatchesText");
  if (correctMatchesText) {
    metadata.correctMatches = parseOneBasedIndexList(correctMatchesText);
  }

  const orderingItemsText = getTrimmedString(formData, "orderingItemsText");
  if (orderingItemsText) {
    metadata.items = parseLineList(orderingItemsText);
  }

  const correctOrderText = getTrimmedString(formData, "correctOrderText");
  if (correctOrderText) {
    metadata.correctOrder = parseOneBasedIndexList(correctOrderText);
  }

  const gapFillText = getOptionalString(formData, "gapFillText");
  if (gapFillText) {
    metadata.text = gapFillText;
  }

  const gapsText = getTrimmedString(formData, "gapsText");
  if (gapsText) {
    metadata.gaps = parseGapRows(gapsText);
  }

  const categoriesText = getTrimmedString(formData, "categoriesText");
  if (categoriesText) {
    metadata.categories = parseCategoryRows(categoriesText);
  }

  const categorisationItemsText = getTrimmedString(
    formData,
    "categorisationItemsText"
  );
  if (categorisationItemsText) {
    metadata.items = parseCategorisationItemRows(categorisationItemsText);
  }

  metadata.ignorePunctuation = getBoolean(formData, "ignorePunctuation");
  metadata.ignoreArticles = getBoolean(formData, "ignoreArticles");
  metadata.collapseWhitespace = getBoolean(formData, "collapseWhitespace");

  const maxPlays = getOptionalPositiveNumber(formData, "maxPlays");
  if (maxPlays !== null) {
    metadata.maxPlays = maxPlays;
  }

  if (getBoolean(formData, "listeningMode")) {
    metadata.listeningMode = true;
  }

  if (getBoolean(formData, "autoPlay")) {
    metadata.autoPlay = true;
  }

  if (getBoolean(formData, "hideNativeControls")) {
    metadata.hideNativeControls = true;
  }

  if (getBoolean(formData, "requireAudioCompletionBeforeSubmit")) {
    metadata.requireAudioCompletionBeforeSubmit = true;
  }

  return metadata;
}

export function getQuestionTypeMetadataDefaults(questionType: string) {
  if (questionType === "translation") {
    return {
      answerStrategy: "text_input",
      selectionDisplayMode: "grouped",
      collapseWhitespace: true,
    };
  }

  if (questionType === "short_answer") {
    return {
      collapseWhitespace: true,
    };
  }

  return {};
}

function stripCopySuffix(value: string) {
  return value
    .trim()
    .replace(/\s*\(copy(?:\s+\d+)?\)$/i, "")
    .replace(/-copy(?:-\d+)?$/i, "")
    .trim();
}

export function getOptionalTemplateType(formData: FormData) {
  const value = getTrimmedString(formData, "templateType");
  return value.length > 0 ? value : null;
}

export async function generateUniqueQuestionSetTitle(params: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  baseTitle: string;
}) {
  const normalizedBaseTitle = stripCopySuffix(params.baseTitle) || "Question Set";

  const { data, error } = await params.supabase
    .from("question_sets")
    .select("title")
    .ilike("title", `${normalizedBaseTitle} (Copy%`);

  if (error) {
    console.error("Error checking existing titles:", error);
    throw new Error("Failed to generate unique title");
  }

  const existingTitles = new Set((data ?? []).map((row) => row.title).filter(Boolean));

  const firstCopyTitle = `${normalizedBaseTitle} (Copy)`;

  if (!existingTitles.has(firstCopyTitle)) {
    return firstCopyTitle;
  }

  let counter = 2;

  while (existingTitles.has(`${normalizedBaseTitle} (Copy ${counter})`)) {
    counter += 1;
  }

  return `${normalizedBaseTitle} (Copy ${counter})`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function generateUniqueQuestionSetSlug(params: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  baseSlug: string;
}) {
  const cleanedBaseSlug = stripCopySuffix(params.baseSlug);
  const normalizedBaseSlug = slugify(cleanedBaseSlug) || "question-set";
  const copyBaseSlug = `${normalizedBaseSlug}-copy`;

  const { data, error } = await params.supabase
    .from("question_sets")
    .select("slug")
    .ilike("slug", `${copyBaseSlug}%`);

  if (error) {
    console.error("Error checking existing slugs:", error);
    throw new Error("Failed to generate unique slug");
  }

  const existingSlugs = new Set((data ?? []).map((row) => row.slug).filter(Boolean));

  if (!existingSlugs.has(copyBaseSlug)) {
    return copyBaseSlug;
  }

  let counter = 2;

  while (existingSlugs.has(`${copyBaseSlug}-${counter}`)) {
    counter += 1;
  }

  return `${copyBaseSlug}-${counter}`;
}
