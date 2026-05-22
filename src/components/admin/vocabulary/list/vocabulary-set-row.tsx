import { deleteVocabularySetAction } from "@/app/actions/admin/admin-vocabulary-actions";
import {
  AdminActionMenu,
  AdminActionMenuConfirmItem,
  AdminActionMenuItem,
} from "@/components/admin/admin-action-menu";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTableCompactCell, DataTableRow } from "@/components/ui/data-table";
import VocabularyUsageCount from "@/components/admin/vocabulary/list/vocabulary-usage-count";
import type { AdminVocabularyListProps } from "@/components/admin/vocabulary/list/types";
import {
  getVocabularyDisplayVariantLabel,
  getVocabularyListModeLabel,
  getVocabularySetTypeLabel,
  getVocabularyTierLabel,
} from "@/lib/vocabulary/shared/labels";
import type { DbVocabularySetListItem } from "@/lib/vocabulary/shared/types";

function getVocabularySetHref(vocabularySet: { id: string; slug: string | null }) {
  return `/vocabulary/${vocabularySet.slug ?? vocabularySet.id}`;
}

function getVocabularySetDisplayTitle(title: string) {
  return title.replace(/^Custom Vocab Set:\s*/i, "");
}

function getShortTierLabel(tier: DbVocabularySetListItem["tier"]) {
  if (tier === "both") return "Both";
  if (tier === "unknown") return "Unknown";
  return getVocabularyTierLabel(tier);
}

function getShortModeLabel(listMode: DbVocabularySetListItem["list_mode"]) {
  if (listMode === "custom") return "Custom";
  if (listMode === "spec_only") return "Spec";
  if (listMode === "extended_only") return "Extra";
  if (listMode === "spec_and_extended") return "Spec + extra";
  return getVocabularyListModeLabel(listMode);
}

function getShortSetTypeLabel(setType: DbVocabularySetListItem["set_type"]) {
  if (setType === "lesson_custom") return "Lesson set";
  return getVocabularySetTypeLabel(setType);
}

function getShortDisplayVariantLabel(
  displayVariant: DbVocabularySetListItem["default_display_variant"]
) {
  if (displayVariant === "two_column") return "2-column";
  return getVocabularyDisplayVariantLabel(displayVariant);
}

type VocabularySetRowProps = {
  vocabularySet: DbVocabularySetListItem;
  rowNumber: number;
  filters: AdminVocabularyListProps["filters"];
};

export default function VocabularySetRow({
  vocabularySet,
  rowNumber,
  filters,
}: VocabularySetRowProps) {
  const displayTitle = getVocabularySetDisplayTitle(vocabularySet.title);
  const rowLabel = String(rowNumber).padStart(2, "0");
  const lessonUsageCount = vocabularySet.usage_stats.totalOccurrences;
  const showTierBadge = filters.tier === "all";
  const showListModeBadge = filters.listMode === "all";
  const showSetTypeBadge = filters.setType === "all";
  const showStatusBadge = filters.published === "all";
  const showDisplayVariantBadge = vocabularySet.default_display_variant !== "two_column";
  const cannotDeleteReason =
    lessonUsageCount > 0
      ? `Remove ${lessonUsageCount} lesson usage${lessonUsageCount === 1 ? "" : "s"} before deleting this set.`
      : vocabularySet.item_count > 0
        ? `Delete ${vocabularySet.item_count} item${vocabularySet.item_count === 1 ? "" : "s"} before deleting this set.`
        : null;

  return (
    <DataTableRow>
      <DataTableCompactCell className="min-w-[36rem]">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 min-w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 text-[0.72rem] font-semibold tabular-nums text-[var(--text-muted)] shadow-sm">
            {rowLabel}
          </span>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="font-semibold leading-snug text-[var(--text-primary)]">
              {displayTitle}
            </div>
            <div className="app-text-caption">
              {vocabularySet.slug ?? vocabularySet.id}
            </div>
            <div className="max-w-5xl app-text-body-muted">
              {vocabularySet.description ?? "No description yet."}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {showTierBadge ? (
                <Badge tone="info" icon="school">
                  {getShortTierLabel(vocabularySet.tier)}
                </Badge>
              ) : null}
              {showListModeBadge ? (
                <Badge tone="muted">{getShortModeLabel(vocabularySet.list_mode)}</Badge>
              ) : null}
              {showSetTypeBadge ? (
                <Badge tone="muted">{getShortSetTypeLabel(vocabularySet.set_type)}</Badge>
              ) : null}
              {showDisplayVariantBadge ? (
                <Badge tone="muted">
                  {getShortDisplayVariantLabel(vocabularySet.default_display_variant)}
                </Badge>
              ) : null}
              {showStatusBadge ? (
                <Badge tone={vocabularySet.is_published ? "success" : "warning"}>
                  {vocabularySet.is_published ? "Published" : "Draft"}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </DataTableCompactCell>

      <DataTableCompactCell className="whitespace-nowrap">
        <div className="font-semibold app-text-detail">{vocabularySet.item_count}</div>
        <div className="app-text-caption">
          {vocabularySet.list_count} list
          {vocabularySet.list_count === 1 ? "" : "s"}
        </div>
      </DataTableCompactCell>

      <DataTableCompactCell className="min-w-[7.5rem]">
        <div className="grid gap-1">
          <VocabularyUsageCount
            label="Fdn"
            count={vocabularySet.usage_stats.foundationOccurrences}
            title="Foundation lesson usages"
          />
          <VocabularyUsageCount
            label="High"
            count={vocabularySet.usage_stats.higherOccurrences}
            title="Higher lesson usages"
          />
          <VocabularyUsageCount
            label="Volna"
            count={vocabularySet.usage_stats.volnaOccurrences}
            title="Volna lesson usages"
          />
        </div>
      </DataTableCompactCell>

      <DataTableCompactCell className="w-[10.5rem] min-w-[10.5rem]">
        <div className="grid gap-2">
          <Button
            href={`/admin/vocabulary/${vocabularySet.id}/items`}
            variant="secondary"
            size="sm"
            icon="list"
            className="w-full justify-center"
          >
            Items
          </Button>
          <AdminActionMenu>
            <AdminActionMenuItem
              href={`/admin/vocabulary/${vocabularySet.id}/edit`}
              icon="edit"
            >
              Edit
            </AdminActionMenuItem>
            <AdminActionMenuItem
              href={getVocabularySetHref(vocabularySet)}
              icon="preview"
            >
              View
            </AdminActionMenuItem>
            <AdminActionMenuItem
              href={`/admin/vocabulary/${vocabularySet.id}/export`}
              icon="download"
              download
              prefetch={false}
            >
              Export Markdown
            </AdminActionMenuItem>
            <AdminActionMenuConfirmItem
              action={deleteVocabularySetAction}
              hiddenFields={{ vocabularySetId: vocabularySet.id }}
              disabled={Boolean(cannotDeleteReason)}
              disabledReason={cannotDeleteReason}
              confirmMessage={`Delete ${vocabularySet.title}? This also deletes its items and list links.`}
            >
              {cannotDeleteReason ? "Protected" : "Delete"}
            </AdminActionMenuConfirmItem>
          </AdminActionMenu>
        </div>
      </DataTableCompactCell>
    </DataTableRow>
  );
}
