import VocabularyBlock from "@/components/lesson-blocks/vocabulary-block";
import {
  getVocabularyListModeLabel,
  getVocabularyTierLabel,
  loadVocabularySetBySlugDb,
} from "@/lib/vocabulary/vocabulary-helpers-db";

type VocabularySetBlockProps = {
  title?: string;
  vocabularySetSlug: string;
};

export default async function VocabularySetBlock({
  title,
  vocabularySetSlug,
}: VocabularySetBlockProps) {
  const { vocabularySet, items } = await loadVocabularySetBySlugDb(vocabularySetSlug);

  if (!vocabularySet) {
    return (
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--danger)_24%,transparent)] bg-[var(--danger-soft)] px-5 py-4 text-sm text-[var(--danger)]">
        Vocabulary set not found: {vocabularySetSlug}
      </div>
    );
  }

  return (
    <VocabularyBlock
      title={title ?? vocabularySet.title}
      eyebrow="Vocabulary set"
      description={vocabularySet.description ?? undefined}
      meta={[
        getVocabularyTierLabel(vocabularySet.tier),
        getVocabularyListModeLabel(vocabularySet.list_mode),
        vocabularySet.is_published ? "Published set" : "Draft set",
      ]}
      items={items.map((item) => ({
        russian: item.russian,
        english: item.english,
      }))}
    />
  );
}
