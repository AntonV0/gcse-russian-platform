import { VocabularyAdminStatTile } from "@/components/admin/vocabulary/items/primitives";
import type {
  DbVocabularyItem,
  DbVocabularyList,
  DbVocabularySetUsageStats,
} from "@/lib/vocabulary/shared/types";

export function VocabularySetItemsStatsSection({
  items,
  lists,
  usageStats,
}: {
  items: DbVocabularyItem[];
  lists: DbVocabularyList[];
  usageStats: DbVocabularySetUsageStats;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <VocabularyAdminStatTile label="Items" value={items.length} />
      <VocabularyAdminStatTile label="Lists" value={lists.length} />
      <VocabularyAdminStatTile
        label="Foundation usages"
        value={usageStats.foundationOccurrences}
      />
      <VocabularyAdminStatTile
        label="Higher usages"
        value={usageStats.higherOccurrences}
      />
    </section>
  );
}
