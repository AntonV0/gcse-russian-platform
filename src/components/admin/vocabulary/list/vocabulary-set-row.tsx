import { deleteVocabularySetAction } from "@/app/actions/admin/admin-vocabulary-actions";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  DataTableCell,
  DataTableRow,
} from "@/components/ui/data-table";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import {
  getVocabularyDisplayVariantLabel,
  getVocabularyListModeLabel,
  getVocabularySetTypeLabel,
  getVocabularySourceLabel,
  getVocabularyThemeLabel,
  getVocabularyTierLabel,
  getVocabularyTopicLabel,
} from "@/lib/vocabulary/shared/labels";
import type { DbVocabularySetListItem } from "@/lib/vocabulary/shared/types";

function getVocabularySetHref(vocabularySet: { id: string; slug: string | null }) {
  return `/vocabulary/${vocabularySet.slug ?? vocabularySet.id}`;
}

type VocabularySetRowProps = {
  vocabularySet: DbVocabularySetListItem;
};

export default function VocabularySetRow({ vocabularySet }: VocabularySetRowProps) {
  return (
    <DataTableRow>
      <DataTableCell>
        <div className="space-y-1">
          <div className="app-heading-card">{vocabularySet.title}</div>
          <div className="app-text-caption">
            {vocabularySet.slug ?? vocabularySet.id}
          </div>
          <div className="max-w-md app-text-body-muted">
            {vocabularySet.description ?? "No description yet."}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge tone="muted">
              {getVocabularySetTypeLabel(vocabularySet.set_type)}
            </Badge>
            <Badge tone="muted">
              {getVocabularyDisplayVariantLabel(
                vocabularySet.default_display_variant
              )}
            </Badge>
          </div>
        </div>
      </DataTableCell>

      <DataTableCell>
        <Badge tone="info" icon="school">
          {getVocabularyTierLabel(vocabularySet.tier)}
        </Badge>
      </DataTableCell>

      <DataTableCell>
        <Badge tone="muted" icon="vocabularySet">
          {getVocabularyListModeLabel(vocabularySet.list_mode)}
        </Badge>
      </DataTableCell>

      <DataTableCell>
        <div className="font-semibold app-text-detail">
          {vocabularySet.item_count}
        </div>
        <div className="app-text-caption">
          {vocabularySet.list_count} list
          {vocabularySet.list_count === 1 ? "" : "s"}
        </div>
      </DataTableCell>

      <DataTableCell>
        <div className="grid min-w-[8rem] grid-cols-3 gap-1 text-center">
          <div className="rounded-lg bg-[var(--background-muted)] px-2 py-1">
            <div className="app-text-meta">F</div>
            <div className="font-semibold text-[var(--text-primary)]">
              {vocabularySet.usage_stats.foundationOccurrences}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--background-muted)] px-2 py-1">
            <div className="app-text-meta">H</div>
            <div className="font-semibold text-[var(--text-primary)]">
              {vocabularySet.usage_stats.higherOccurrences}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--background-muted)] px-2 py-1">
            <div className="app-text-meta">V</div>
            <div className="font-semibold text-[var(--text-primary)]">
              {vocabularySet.usage_stats.volnaOccurrences}
            </div>
          </div>
        </div>
      </DataTableCell>

      <DataTableCell>
        <PublishStatusBadge isPublished={vocabularySet.is_published} />
      </DataTableCell>

      <DataTableCell>
        <div className="space-y-1">
          <div className="capitalize text-[var(--text-primary)]">
            {getVocabularyThemeLabel(vocabularySet.theme_key)}
          </div>
          {vocabularySet.topic_key ? (
            <div className="app-text-caption">
              Topic: {getVocabularyTopicLabel(vocabularySet.topic_key)}
            </div>
          ) : null}
          {vocabularySet.source_key ? (
            <div className="app-text-caption">
              Source: {getVocabularySourceLabel(vocabularySet.source_key)}
            </div>
          ) : null}
        </div>
      </DataTableCell>

      <DataTableCell>
        <div className="flex flex-wrap gap-2">
          <Button
            href={`/admin/vocabulary/${vocabularySet.id}/items`}
            variant="secondary"
            size="sm"
            icon="list"
          >
            Items
          </Button>
          <Button
            href={`/admin/vocabulary/${vocabularySet.id}/edit`}
            variant="quiet"
            size="sm"
            icon="edit"
          >
            Edit
          </Button>
          <Button
            href={getVocabularySetHref(vocabularySet)}
            variant="quiet"
            size="sm"
            icon="preview"
          >
            View
          </Button>
          <form action={deleteVocabularySetAction}>
            <input type="hidden" name="vocabularySetId" value={vocabularySet.id} />
            <AdminConfirmButton
              variant="danger"
              icon="delete"
              confirmMessage={`Delete ${vocabularySet.title}? This also deletes its items and list links.`}
            >
              Delete
            </AdminConfirmButton>
          </form>
        </div>
      </DataTableCell>
    </DataTableRow>
  );
}
