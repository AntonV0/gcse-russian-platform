import Badge from "@/components/ui/badge";
import VocabularyItemCoverageBadges from "@/components/admin/vocabulary/items/coverage-badges";
import VocabularyItemEditForm from "@/components/admin/vocabulary/items/vocabulary-item-edit-form";
import {
  getVocabularyItemPriorityLabel,
  getVocabularyItemSourceTypeLabel,
  getVocabularyItemTypeLabel,
  getVocabularyPartOfSpeechLabel,
} from "@/components/admin/vocabulary/items/item-display";
import { VocabularyAdminStatTile } from "@/components/admin/vocabulary/items/primitives";
import { getVocabularyProductiveReceptiveLabel } from "@/lib/vocabulary/labels";
import type {
  DbVocabularyItem,
  DbVocabularyItemCoverage,
  DbVocabularyTier,
} from "@/lib/vocabulary/types";

export default function VocabularyItemCard({
  item,
  vocabularySetId,
  vocabularyListId,
  defaultTier,
  coverage,
}: {
  item: DbVocabularyItem;
  vocabularySetId: string;
  vocabularyListId: string | null;
  defaultTier: DbVocabularyTier;
  coverage: DbVocabularyItemCoverage | null;
}) {
  return (
    <details className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] shadow-[var(--shadow-sm)]">
      <summary className="cursor-pointer list-none px-5 py-4 transition hover:bg-[var(--background-muted)]/55">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Badge tone="muted" icon="list">
                Position {item.position}
              </Badge>
              <Badge tone="info" icon="file">
                {getVocabularyItemTypeLabel(item.item_type)}
              </Badge>
              <Badge tone="muted" icon="vocabularySet">
                {getVocabularyItemSourceTypeLabel(item.source_type)}
              </Badge>
              <Badge
                tone={item.priority === "core" ? "success" : "warning"}
                icon={item.priority === "core" ? "success" : "info"}
              >
                {getVocabularyItemPriorityLabel(item.priority)}
              </Badge>
              <Badge tone="muted" icon="info">
                {getVocabularyProductiveReceptiveLabel(item.productive_receptive)}
              </Badge>
            </div>

            <div className="mt-3">
              <VocabularyItemCoverageBadges item={item} coverage={coverage} />
            </div>

            <div className="mt-3">
              <h4 className="app-vocab-term">{item.russian}</h4>
              <p className="mt-1 app-text-body-muted">{item.english}</p>
            </div>
          </div>

          <div className="font-semibold app-text-caption group-open:hidden">Edit</div>
          <div className="hidden font-semibold app-text-caption group-open:block">
            Close
          </div>
        </div>
      </summary>

      <div className="space-y-5 border-t border-[var(--border)] p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <VocabularyAdminStatTile label="Russian" value={item.russian} />
          <VocabularyAdminStatTile label="English" value={item.english} />
          <VocabularyAdminStatTile
            label="Type"
            value={getVocabularyItemTypeLabel(item.item_type)}
          />
          <VocabularyAdminStatTile
            label="Part of speech"
            value={getVocabularyPartOfSpeechLabel(item.part_of_speech)}
          />
          <VocabularyAdminStatTile label="Position" value={item.position} />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-3">
          <div className="app-text-meta">Usage coverage</div>
          <div className="mt-3">
            <VocabularyItemCoverageBadges item={item} coverage={coverage} />
          </div>
        </div>

        <VocabularyItemEditForm
          item={item}
          vocabularySetId={vocabularySetId}
          vocabularyListId={vocabularyListId}
          defaultTier={defaultTier}
        />
      </div>
    </details>
  );
}
