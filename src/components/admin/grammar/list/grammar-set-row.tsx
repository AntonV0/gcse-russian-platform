import { deleteGrammarSetAction } from "@/app/actions/admin/admin-grammar-actions";
import {
  AdminActionMenu,
  AdminActionMenuConfirmItem,
  AdminActionMenuItem,
} from "@/components/admin/admin-action-menu";
import GrammarContentHealthBadges from "@/components/admin/grammar/list/grammar-content-health-badges";
import { getShortGrammarTierLabel } from "@/components/admin/grammar/list/grammar-list-labels";
import GrammarUsageCount from "@/components/admin/grammar/list/grammar-usage-count";
import type { AdminGrammarListProps } from "@/components/admin/grammar/list/types";
import GrammarCoverageBadges from "@/components/grammar/grammar-coverage-badges";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { DataTableCompactCell, DataTableRow } from "@/components/ui/data-table";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import {
  getGrammarTopicLabel,
  type DbGrammarSetContentHealth,
  type DbGrammarSetListItem,
} from "@/lib/grammar/grammar-helpers-db";

type GrammarSetRowProps = {
  grammarSet: DbGrammarSetListItem;
  contentHealth: DbGrammarSetContentHealth | null;
  rowNumber: number;
  filters: AdminGrammarListProps["filters"];
};

export default function GrammarSetRow({
  grammarSet,
  contentHealth,
  rowNumber,
  filters,
}: GrammarSetRowProps) {
  const rowLabel = String(rowNumber).padStart(2, "0");
  const showTierBadge = filters.tier === "all";
  const showTopicBadge = !filters.topicKey;

  return (
    <DataTableRow>
      <DataTableCompactCell className="min-w-[34rem]">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 min-w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] px-2 text-[0.72rem] font-semibold tabular-nums text-[var(--text-muted)] shadow-sm">
            {rowLabel}
          </span>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="font-semibold leading-snug text-[var(--text-primary)]">
              {grammarSet.title}
            </div>
            <div className="app-text-caption">{grammarSet.slug}</div>
            <div className="max-w-5xl app-text-body-muted">
              {grammarSet.description ?? "No description yet."}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {showTierBadge ? (
                <Badge tone="info" icon="school">
                  {getShortGrammarTierLabel(grammarSet.tier)}
                </Badge>
              ) : null}
              {showTopicBadge ? (
                <Badge tone="muted" icon="folder">
                  {getGrammarTopicLabel(grammarSet.topic_key)}
                </Badge>
              ) : null}
              {grammarSet.is_trial_visible ? (
                <Badge tone="success" icon="unlocked">
                  Trial
                </Badge>
              ) : null}
              {grammarSet.available_in_volna ? <Badge tone="muted">Volna</Badge> : null}
              {grammarSet.requires_paid_access ? (
                <Badge tone="muted" icon="lock">
                  Paid
                </Badge>
              ) : (
                <Badge tone="info" icon="unlocked">
                  Open
                </Badge>
              )}
              <GrammarContentHealthBadges
                health={contentHealth}
                isPublished={grammarSet.is_published}
              />
            </div>
          </div>
        </div>
      </DataTableCompactCell>

      <DataTableCompactCell className="whitespace-nowrap">
        <div className="font-semibold app-text-detail">{grammarSet.point_count}</div>
        <div className="app-text-caption">
          {contentHealth?.published_points ?? 0} published
        </div>
      </DataTableCompactCell>

      <DataTableCompactCell className="min-w-[7.5rem]">
        <div className="grid gap-1">
          <GrammarUsageCount
            label="Fdn"
            count={grammarSet.usage_stats.foundationOccurrences}
            title="Foundation lesson usages"
          />
          <GrammarUsageCount
            label="High"
            count={grammarSet.usage_stats.higherOccurrences}
            title="Higher lesson usages"
          />
          <GrammarUsageCount
            label="Volna"
            count={grammarSet.usage_stats.volnaOccurrences}
            title="Volna lesson usages"
          />
        </div>
      </DataTableCompactCell>

      <DataTableCompactCell>
        <div className="flex min-w-[12rem] flex-wrap gap-2 md:max-w-[13rem]">
          <GrammarCoverageBadges
            coverageSummary={grammarSet.coverage_summary}
            fallbackTotalPoints={grammarSet.point_count}
            hideEmptyVolna
          />
        </div>
      </DataTableCompactCell>

      <DataTableCompactCell className="w-[9rem] min-w-[9rem]">
        <div className="whitespace-nowrap">
          <PublishStatusBadge isPublished={grammarSet.is_published} />
        </div>
      </DataTableCompactCell>

      <DataTableCompactCell className="w-[10.5rem] min-w-[10.5rem]">
        <div className="grid gap-2">
          <Button
            href={`/admin/grammar/${grammarSet.id}/points`}
            variant="secondary"
            size="sm"
            icon="list"
            className="w-full justify-center"
          >
            Points
          </Button>
          <AdminActionMenu>
            <AdminActionMenuItem
              href={`/admin/grammar/${grammarSet.id}/edit`}
              icon="edit"
            >
              Edit
            </AdminActionMenuItem>
            <AdminActionMenuItem href={`/grammar/${grammarSet.slug}`} icon="preview">
              View
            </AdminActionMenuItem>
            <AdminActionMenuConfirmItem
              action={deleteGrammarSetAction}
              hiddenFields={{ grammarSetId: grammarSet.id }}
              confirmMessage={`Delete ${grammarSet.title}? This also deletes its points, examples, and tables.`}
            >
              Delete
            </AdminActionMenuConfirmItem>
          </AdminActionMenu>
        </div>
      </DataTableCompactCell>
    </DataTableRow>
  );
}
