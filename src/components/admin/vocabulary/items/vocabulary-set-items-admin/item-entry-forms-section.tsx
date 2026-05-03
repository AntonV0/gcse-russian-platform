import {
  BulkVocabularyItemForm,
  NewVocabularyItemForm,
} from "@/components/admin/vocabulary/items/item-forms";
import type { DbVocabularyTier } from "@/lib/vocabulary/shared/types";

export function VocabularyItemEntryFormsSection({
  vocabularySetId,
  vocabularyListId,
  defaultTier,
  defaultOpen = false,
}: {
  vocabularySetId: string;
  vocabularyListId: string | null;
  defaultTier: DbVocabularyTier;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group" open={defaultOpen}>
      <summary className="app-surface app-section-padding flex cursor-pointer list-none items-start justify-between gap-4">
        <span>
          <span className="block app-heading-subsection">Add vocabulary items</span>
          <span className="mt-2 block app-text-body-muted">
            Use quick add for one item or bulk add when pasting a prepared list.
          </span>
        </span>
        <span className="font-semibold app-text-caption group-open:hidden">Open</span>
        <span className="hidden font-semibold app-text-caption group-open:inline">
          Close
        </span>
      </summary>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
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
    </details>
  );
}
