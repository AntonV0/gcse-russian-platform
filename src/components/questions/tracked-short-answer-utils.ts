import type { SelectionGroup } from "@/components/questions/selection-based-block";
import type { TranslationUiConfig } from "./tracked-short-answer-types";

export function buildSentenceBuilderTokenPool(params: { customWordBank?: string[] }) {
  if (params.customWordBank && params.customWordBank.length > 0) {
    return [...params.customWordBank];
  }

  return [];
}

export function buildSelectionBasedSubmittedText(params: {
  groups: SelectionGroup[];
  selectedOptions: Record<string, string>;
}) {
  return params.groups
    .map((group) => params.selectedOptions[group.id])
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ");
}

export function getSentenceBuilderInstruction(translationUi?: TranslationUiConfig) {
  if (translationUi?.instruction) {
    return translationUi.instruction;
  }

  if (translationUi?.targetLanguageLabel) {
    return `Build the sentence in ${translationUi.targetLanguageLabel}`;
  }

  return "Build the sentence in Russian";
}

export function getSelectionBasedInstruction(translationUi?: TranslationUiConfig) {
  if (translationUi?.instruction) {
    return translationUi.instruction;
  }

  if (translationUi?.targetLanguageLabel) {
    return `Select the correct forms in ${translationUi.targetLanguageLabel}`;
  }

  return "Select the correct Russian forms";
}
