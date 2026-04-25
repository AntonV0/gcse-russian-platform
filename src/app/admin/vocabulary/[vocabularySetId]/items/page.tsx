import { notFound } from "next/navigation";
import VocabularySetItemsAdmin from "@/components/admin/vocabulary/items/vocabulary-set-items-admin";
import {
  getVocabularyItemCoverageByItemIdsDb,
  loadVocabularySetByIdDb,
} from "@/lib/vocabulary/vocabulary-helpers-db";

export default async function VocabularySetItemsPage({
  params,
}: {
  params: Promise<{ vocabularySetId: string }>;
}) {
  const { vocabularySetId } = await params;
  const { vocabularySet, vocabularyList, lists, items, usageStats } =
    await loadVocabularySetByIdDb(vocabularySetId);

  if (!vocabularySet) {
    notFound();
  }

  const itemCoverageById = await getVocabularyItemCoverageByItemIdsDb(
    items.map((item) => item.id)
  );

  return (
    <VocabularySetItemsAdmin
      vocabularySet={vocabularySet}
      vocabularyList={vocabularyList}
      lists={lists}
      items={items}
      usageStats={usageStats}
      itemCoverageById={itemCoverageById}
    />
  );
}
