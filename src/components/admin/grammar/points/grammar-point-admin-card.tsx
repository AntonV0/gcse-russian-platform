import AdminConfirmButton from "@/components/admin/admin-confirm-button";
import PointContentHealthBadges from "@/components/admin/grammar/points/point-content-health-badges";
import PointCoverageBadges from "@/components/admin/grammar/points/point-coverage-badges";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PublishStatusBadge from "@/components/ui/publish-status-badge";
import { deleteGrammarPointAction } from "@/app/actions/admin/admin-grammar-point-actions";
import {
  getGrammarCategoryLabel,
  getGrammarKnowledgeRequirementLabel,
  getGrammarTierLabel,
  type DbGrammarPoint,
  type DbGrammarPointContentHealth,
  type DbGrammarPointCoverage,
} from "@/lib/grammar/grammar-helpers-db";

const POINT_ROW_ACTION_BUTTON_CLASS =
  "!min-h-9 !rounded-full !px-3.5 !py-1.5 !text-sm !shadow-[0_1px_2px_color-mix(in_srgb,var(--text-primary)_5%,transparent)] hover:!translate-y-0 hover:!shadow-[0_4px_10px_color-mix(in_srgb,var(--text-primary)_7%,transparent)]";

const POINT_ROW_DELETE_BUTTON_CLASS = [
  POINT_ROW_ACTION_BUTTON_CLASS,
  "!bg-[var(--danger-surface)] hover:!bg-[var(--danger-surface-strong)]",
].join(" ");

export default function GrammarPointAdminCard({
  grammarSetId,
  point,
  coverage,
  health,
  position,
}: {
  grammarSetId: string;
  point: DbGrammarPoint;
  coverage: DbGrammarPointCoverage | null;
  health: DbGrammarPointContentHealth | null;
  position: number;
}) {
  const knowledgeTone =
    point.knowledge_requirement === "receptive" ? "warning" : "muted";

  return (
    <article className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] px-4 py-3 shadow-[var(--shadow-xs)]">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="flex min-w-0 gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-muted)] text-sm font-semibold text-[var(--text-secondary)]">
            {position}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="break-words text-base font-semibold leading-6 text-[var(--text-primary)]">
                {point.title}
              </h3>
              <PublishStatusBadge isPublished={point.is_published} />
            </div>
            <p className="mt-1 max-w-3xl break-words text-sm leading-6 text-[var(--text-secondary)]">
              {point.short_description ?? "No short description yet."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 lg:justify-end">
          <Button
            href={`/admin/grammar/${grammarSetId}/points/${point.id}/edit`}
            variant="secondary"
            size="sm"
            icon="edit"
            className={POINT_ROW_ACTION_BUTTON_CLASS}
          >
            Edit
          </Button>
          <form action={deleteGrammarPointAction}>
            <input type="hidden" name="grammarSetId" value={grammarSetId} />
            <input type="hidden" name="grammarPointId" value={point.id} />
            <AdminConfirmButton
              variant="danger"
              icon="delete"
              size="sm"
              className={POINT_ROW_DELETE_BUTTON_CLASS}
              confirmMessage={`Delete ${point.title}? This also deletes examples and tables.`}
            >
              Delete
            </AdminConfirmButton>
          </form>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-3">
        <Badge tone="info">{getGrammarTierLabel(point.tier)}</Badge>
        <Badge tone="muted" className="capitalize">
          {getGrammarCategoryLabel(point.category_key)}
        </Badge>
        <Badge tone={knowledgeTone}>
          {getGrammarKnowledgeRequirementLabel(point.knowledge_requirement)}
        </Badge>
        <PointContentHealthBadges health={health} />
        <PointCoverageBadges point={point} coverage={coverage} />
      </div>
    </article>
  );
}
