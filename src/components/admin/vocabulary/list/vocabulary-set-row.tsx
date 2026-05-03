import { deleteVocabularySetAction } from "@/app/actions/admin/admin-vocabulary-actions";
import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  DataTableCell,
  DataTableRow,
} from "@/components/ui/data-table";
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

function getUsageToneClass(count: number) {
  if (count === 0) {
    return "border-[var(--border)] bg-[var(--background-muted)] text-[var(--text-muted)]";
  }

  if (count === 1) {
    return "border-[var(--info-border)] bg-[var(--info-surface)] text-[var(--info-text)]";
  }

  return "border-[var(--success-border)] bg-[var(--success-surface)] text-[var(--success-text)]";
}

function UsageCount({
  label,
  count,
  title,
}: {
  label: string;
  count: number;
  title: string;
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-2 rounded-lg border px-2 py-1",
        getUsageToneClass(count),
      ].join(" ")}
      title={title}
    >
      <span className="whitespace-nowrap text-[0.72rem] font-semibold">{label}</span>
      <span className="font-semibold">{count}</span>
    </div>
  );
}

type VocabularySetRowProps = {
  vocabularySet: DbVocabularySetListItem;
  rowNumber: number;
};

export default function VocabularySetRow({
  vocabularySet,
  rowNumber,
}: VocabularySetRowProps) {
  const displayTitle = getVocabularySetDisplayTitle(vocabularySet.title);
  const rowLabel = String(rowNumber).padStart(2, "0");

  return (
    <DataTableRow>
      <DataTableCell className="min-w-[34rem]">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 min-w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background-elevated)] px-2 text-[0.72rem] font-semibold tabular-nums text-[var(--text-muted)] shadow-sm">
            {rowLabel}
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="app-heading-card">{displayTitle}</div>
            <div className="app-text-caption">
              {vocabularySet.slug ?? vocabularySet.id}
            </div>
            <div className="max-w-4xl app-text-body-muted">
              {vocabularySet.description ?? "No description yet."}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge tone="info" icon="school">
                {getShortTierLabel(vocabularySet.tier)}
              </Badge>
              <Badge tone="muted">
                {getShortModeLabel(vocabularySet.list_mode)}
              </Badge>
              <Badge tone="muted">
                {getShortSetTypeLabel(vocabularySet.set_type)}
              </Badge>
              <Badge tone="muted">
                {getShortDisplayVariantLabel(
                  vocabularySet.default_display_variant
                )}
              </Badge>
              <Badge tone={vocabularySet.is_published ? "success" : "warning"}>
                {vocabularySet.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>
        </div>
      </DataTableCell>

      <DataTableCell className="whitespace-nowrap">
        <div className="font-semibold app-text-detail">
          {vocabularySet.item_count}
        </div>
        <div className="app-text-caption">
          {vocabularySet.list_count} list
          {vocabularySet.list_count === 1 ? "" : "s"}
        </div>
      </DataTableCell>

      <DataTableCell className="min-w-[7.5rem]">
        <div className="grid gap-1">
          <UsageCount
            label="Fdn"
            count={vocabularySet.usage_stats.foundationOccurrences}
            title="Foundation lesson usages"
          />
          <UsageCount
            label="High"
            count={vocabularySet.usage_stats.higherOccurrences}
            title="Higher lesson usages"
          />
          <UsageCount
            label="Volna"
            count={vocabularySet.usage_stats.volnaOccurrences}
            title="Volna lesson usages"
          />
        </div>
      </DataTableCell>

      <DataTableCell className="w-[10.5rem] min-w-[10.5rem]">
        <div className="grid gap-2">
          <Button
            href={`/admin/vocabulary/${vocabularySet.id}/items`}
            variant="secondary"
            size="sm"
            icon="list"
            className="w-full justify-start"
          >
            Items
          </Button>
          <details className="relative w-full">
            <summary className="app-focus-ring inline-flex w-full cursor-pointer list-none items-center justify-start gap-2 rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] shadow-sm transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]">
              More
            </summary>
            <div className="absolute right-0 z-20 mt-2 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-1.5 shadow-xl">
              <div className="grid gap-1">
                <Button
                  href={`/admin/vocabulary/${vocabularySet.id}/edit`}
                  variant="quiet"
                  size="sm"
                  icon="edit"
                  className="w-full justify-start"
                >
                  Edit
                </Button>
                <Button
                  href={getVocabularySetHref(vocabularySet)}
                  variant="quiet"
                  size="sm"
                  icon="preview"
                  className="w-full justify-start"
                >
                  View
                </Button>
                <form action={deleteVocabularySetAction} className="grid">
                  <input
                    type="hidden"
                    name="vocabularySetId"
                    value={vocabularySet.id}
                  />
                  <AdminConfirmButton
                    variant="danger"
                    size="sm"
                    icon="delete"
                    className="w-full justify-start !rounded-xl !border-[var(--danger-border)] !bg-[var(--danger-surface)] !text-[var(--danger-text)] !shadow-none hover:!border-[var(--danger-border-strong)] hover:!bg-[var(--danger-surface-strong)] hover:!text-[var(--danger-text-strong)] hover:!shadow-none"
                    confirmMessage={`Delete ${vocabularySet.title}? This also deletes its items and list links.`}
                  >
                    Delete
                  </AdminConfirmButton>
                </form>
              </div>
            </div>
          </details>
        </div>
      </DataTableCell>
    </DataTableRow>
  );
}
