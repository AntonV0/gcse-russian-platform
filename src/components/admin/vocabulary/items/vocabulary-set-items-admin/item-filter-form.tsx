import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { getVocabularyCategoryLabel } from "@/lib/vocabulary/shared/labels";
import {
  normalizeCoverageFilter,
  normalizePartOfSpeechFilter,
  normalizeSkillUseFilter,
  normalizeSourceTypeFilter,
  normalizeTierFilter,
} from "./item-filters";
import type { VocabularyItemAdminFilters } from "./types";

export function VocabularyItemFilterForm({
  vocabularySetId,
  itemFilters,
  categoryOptions,
}: {
  vocabularySetId: string;
  itemFilters: VocabularyItemAdminFilters;
  categoryOptions: string[];
}) {
  return (
    <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.2fr)_repeat(6,minmax(140px,1fr))_max-content] xl:items-center">
      <Input
        name="itemSearch"
        defaultValue={itemFilters.itemSearch ?? ""}
        placeholder="Search word, meaning, example, key..."
      />

      <Select
        name="partOfSpeech"
        defaultValue={normalizePartOfSpeechFilter(itemFilters.partOfSpeech)}
      >
        <option value="all">All parts</option>
        <option value="noun">Nouns</option>
        <option value="verb">Verbs</option>
        <option value="adjective">Adjectives</option>
        <option value="adverb">Adverbs</option>
        <option value="pronoun">Pronouns</option>
        <option value="preposition">Prepositions</option>
        <option value="conjunction">Conjunctions</option>
        <option value="number">Numbers</option>
        <option value="phrase">Phrases</option>
        <option value="interjection">Interjections</option>
        <option value="other">Other</option>
        <option value="unknown">Unknown</option>
      </Select>

      <Select
        name="sourceType"
        defaultValue={normalizeSourceTypeFilter(itemFilters.sourceType)}
      >
        <option value="all">All sources</option>
        <option value="spec_required">Spec required</option>
        <option value="extended">Extended</option>
        <option value="custom">Custom</option>
      </Select>

      <Select name="tier" defaultValue={normalizeTierFilter(itemFilters.tier)}>
        <option value="all">All tiers</option>
        <option value="foundation">Foundation</option>
        <option value="higher">Higher</option>
        <option value="both">Both tiers</option>
        <option value="unknown">Unknown</option>
      </Select>

      <Select
        name="skillUse"
        defaultValue={normalizeSkillUseFilter(itemFilters.skillUse)}
      >
        <option value="all">All skills</option>
        <option value="productive">Productive</option>
        <option value="receptive">Receptive</option>
        <option value="both">Both</option>
        <option value="unknown">Unknown</option>
      </Select>

      <Select name="categoryKey" defaultValue={itemFilters.categoryKey ?? ""}>
        <option value="">All categories</option>
        {categoryOptions.map((categoryKey) => (
          <option key={categoryKey} value={categoryKey}>
            {getVocabularyCategoryLabel(categoryKey)}
          </option>
        ))}
      </Select>

      <Select
        name="coverage"
        defaultValue={normalizeCoverageFilter(itemFilters.coverage)}
      >
        <option value="all">All coverage</option>
        <option value="foundation">Used in Foundation</option>
        <option value="higher">Used in Higher</option>
        <option value="volna">Used in Volna</option>
        <option value="custom">Used in custom list</option>
        <option value="unused">Unused</option>
      </Select>

      <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-1 xl:justify-end">
        <Button type="submit" variant="secondary" size="sm" icon="filter">
          Apply
        </Button>
        <Button
          href={`/admin/vocabulary/${vocabularySetId}/items`}
          variant="quiet"
          size="sm"
          icon="refresh"
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
