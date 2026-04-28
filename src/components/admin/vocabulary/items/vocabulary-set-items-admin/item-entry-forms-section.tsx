import {
  BulkVocabularyItemForm,
  NewVocabularyItemForm,
} from "@/components/admin/vocabulary/items/item-forms";
import type { DbVocabularyTier } from "@/lib/vocabulary/shared/types";

export function VocabularyItemEntryFormsSection({
  vocabularySetId,
  vocabularyListId,
  defaultTier,
}: {
  vocabularySetId: string;
  vocabularyListId: string | null;
  defaultTier: DbVocabularyTier;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
      <NewVocabularyItemForm
        vocabularySetId={vocabularySetId}
        vocabularyListId={vocabularyListId}
        defaultTier={defaultTier}
      />

      <BulkVocabularyItemForm
        vocabularySetId={vocabularySetId}
        vocabularyListId={vocabularyListId}
        defaultTier={defaultTier}
      />
    </div>
  );
}
