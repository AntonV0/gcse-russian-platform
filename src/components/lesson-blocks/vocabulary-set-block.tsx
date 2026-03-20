import VocabularyBlock from "@/components/lesson-blocks/vocabulary-block";
import { loadVocabularySetBySlugDb } from "@/lib/vocabulary-helpers-db";

type VocabularySetBlockProps = {
  title?: string;
  vocabularySetSlug: string;
};

export default async function VocabularySetBlock({
  title,
  vocabularySetSlug,
}: VocabularySetBlockProps) {
  const { vocabularySet, items } =
    await loadVocabularySetBySlugDb(vocabularySetSlug);

  if (!vocabularySet) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Vocabulary set not found: {vocabularySetSlug}
      </div>
    );
  }

  return (
    <VocabularyBlock
      title={title ?? vocabularySet.title}
      items={items.map((item) => ({
        russian: item.russian,
        english: item.english,
      }))}
    />
  );
}