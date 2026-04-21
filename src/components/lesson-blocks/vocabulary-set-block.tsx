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
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
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
