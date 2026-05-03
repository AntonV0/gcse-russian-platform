import Select from "@/components/ui/select";
import { VocabularyAdminFormField } from "@/components/admin/vocabulary/items/primitives";
import type { DbVocabularyItem, DbVocabularyTier } from "@/lib/vocabulary/shared/types";

export default function CoreMetadataFields({
  idPrefix,
  defaultTier,
  item,
}: {
  idPrefix: string;
  defaultTier: DbVocabularyTier;
  item?: DbVocabularyItem;
}) {
  const showLegacyTier = item?.tier === "unknown";
  const showLegacySourceType = item?.source_type === "extended";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <VocabularyAdminFormField label="Item type" htmlFor={`${idPrefix}-item-type`}>
        <Select
          id={`${idPrefix}-item-type`}
          name="itemType"
          defaultValue={item?.item_type ?? "word"}
        >
          <option value="word">Word</option>
          <option value="phrase">Phrase</option>
        </Select>
      </VocabularyAdminFormField>

      <VocabularyAdminFormField
        label="Part of speech"
        htmlFor={`${idPrefix}-part-of-speech`}
      >
        <Select
          id={`${idPrefix}-part-of-speech`}
          name="partOfSpeech"
          defaultValue={item?.part_of_speech ?? "unknown"}
        >
          <option value="unknown">Unknown</option>
          <option value="noun">Noun</option>
          <option value="verb">Verb</option>
          <option value="adjective">Adjective</option>
          <option value="adverb">Adverb</option>
          <option value="pronoun">Pronoun</option>
          <option value="preposition">Preposition</option>
          <option value="conjunction">Conjunction</option>
          <option value="number">Number</option>
          <option value="phrase">Phrase</option>
          <option value="interjection">Interjection</option>
          <option value="other">Other</option>
        </Select>
      </VocabularyAdminFormField>

      <VocabularyAdminFormField label="Tier / path" htmlFor={`${idPrefix}-tier`}>
        <Select
          id={`${idPrefix}-tier`}
          name="tier"
          defaultValue={item?.tier ?? defaultTier}
        >
          <option value="both">Both tiers</option>
          <option value="foundation">Foundation path</option>
          <option value="higher">Higher path</option>
          {showLegacyTier ? <option value="unknown">Unknown (legacy)</option> : null}
        </Select>
      </VocabularyAdminFormField>

      <VocabularyAdminFormField label="Item source" htmlFor={`${idPrefix}-source-type`}>
        <Select
          id={`${idPrefix}-source-type`}
          name="sourceType"
          defaultValue={item?.source_type ?? "custom"}
        >
          <option value="custom">Custom</option>
          <option value="spec_required">Spec required</option>
          {showLegacySourceType ? (
            <option value="extended">Extended (legacy)</option>
          ) : null}
        </Select>
      </VocabularyAdminFormField>
    </div>
  );
}
