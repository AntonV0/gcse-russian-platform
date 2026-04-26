import VocabularyBlock from "@/components/lesson-blocks/vocabulary-block";
import {
  getVocabularyListModeLabel,
  getVocabularyTierLabel,
  loadVocabularySetBySlugDb,
  type DbVocabularyStudyVariant,
} from "@/lib/vocabulary/vocabulary-helpers-db";

type VocabularySetBlockProps = {
  title?: string;
  vocabularySetSlug: string;
  vocabularyListSlug?: string;
  currentVariant: DbVocabularyStudyVariant;
};

export default async function VocabularySetBlock({
  title,
  vocabularySetSlug,
  vocabularyListSlug,
  currentVariant,
}: VocabularySetBlockProps) {
  const { vocabularySet, vocabularyList, items } = await loadVocabularySetBySlugDb(
    vocabularySetSlug,
    {
      scopeVariant: currentVariant,
      vocabularyListSlug,
    }
  );

  if (!vocabularySet) {
    return (
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--danger)_24%,transparent)] bg-[var(--danger-soft)] px-5 py-4 text-sm text-[var(--danger)]">
        Vocabulary set not found: {vocabularySetSlug}
      </div>
    );
  }

  if (vocabularyListSlug && !vocabularyList) {
    return (
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--danger)_24%,transparent)] bg-[var(--danger-soft)] px-5 py-4 text-sm text-[var(--danger)]">
        Vocabulary list not found: {vocabularySetSlug} / {vocabularyListSlug}
      </div>
    );
  }

  return (
    <VocabularyBlock
      title={title ?? vocabularyList?.title ?? vocabularySet.title}
      eyebrow={vocabularyList ? "Vocabulary list" : "Vocabulary set"}
      description={
        vocabularyList?.description ?? vocabularySet.description ?? undefined
      }
      meta={[
        getVocabularyTierLabel(vocabularySet.tier),
        getVocabularyListModeLabel(vocabularySet.list_mode),
        ...(vocabularyList ? [vocabularyList.title] : []),
        currentVariant === "volna" ? "Volna tier" : getVocabularyTierLabel(currentVariant),
        vocabularySet.is_published ? "Published set" : "Draft set",
      ]}
      items={items.map((item) => ({
        russian: item.russian,
        english: item.english,
      }))}
    />
  );
}
