import AppIcon from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge";
import { getButtonClassName } from "@/components/ui/button-styles";
import { GrammarPointRequirementBadges } from "@/components/grammar/grammar-requirement-badges";
import {
  getGrammarCoverageVariantCount,
  getGrammarCoverageVariantLabel,
  getGrammarCoverageVariantUsed,
  getRequiredGrammarCoverageVariants,
  type DbGrammarPoint,
  type DbGrammarPointCoverage,
  type DbGrammarSet,
} from "@/lib/grammar/grammar-helpers-db";

function CoverageBadge({
  label,
  isUsed,
  count,
}: {
  label: string;
  isUsed: boolean;
  count?: number;
}) {
  return (
    <Badge tone={isUsed ? "success" : "danger"} icon={isUsed ? "success" : "cancel"}>
      {count && count > 0 ? `${label} ${count}` : label}
    </Badge>
  );
}

function GrammarPointCoverageBadges({
  point,
  coverage,
}: {
  point: DbGrammarPoint;
  coverage: DbGrammarPointCoverage | null;
}) {
  const variants = getRequiredGrammarCoverageVariants(point.tier);

  if (variants.length === 0) {
    return (
      <Badge tone="warning" icon="warning">
        Unclassified coverage
      </Badge>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 md:justify-end">
      {variants.map((variant) => (
        <CoverageBadge
          key={variant}
          label={getGrammarCoverageVariantLabel(variant)}
          isUsed={getGrammarCoverageVariantUsed(coverage, variant)}
          count={getGrammarCoverageVariantCount(coverage, variant)}
        />
      ))}
    </div>
  );
}

function SectionToggleButton() {
  return (
    <span
      className={getButtonClassName({
        variant: "secondary",
        size: "sm",
        className: "pointer-events-none",
      })}
      aria-hidden="true"
    >
      <span className="shrink-0">
        <AppIcon icon="next" size={16} />
      </span>
      <span className="truncate">Open</span>
    </span>
  );
}

function GrammarPointRow({
  grammarSet,
  point,
  coverage,
  showStaffMetadata,
  position,
}: {
  grammarSet: DbGrammarSet;
  point: DbGrammarPoint;
  coverage: DbGrammarPointCoverage | null;
  showStaffMetadata: boolean;
  position: number;
}) {
  return (
    <a
      href={`/grammar/${grammarSet.slug}/${point.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted-bg)] shadow-[var(--shadow-xs)] transition hover:border-[color-mix(in_srgb,var(--accent)_24%,var(--border-strong))] hover:bg-[var(--background-elevated)]"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-[var(--accent-fill)] opacity-70" />

      <div className="grid gap-3 px-4 py-4 sm:pl-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="flex min-w-0 gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-elevated)] text-xs font-semibold text-[var(--text-muted)]">
            {position}
          </span>

          <div className="min-w-0">
            <div className="text-lg font-semibold leading-7 text-[var(--text-primary)]">
              {point.title}
            </div>
            <div className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              {point.short_description ?? "Grammar rule being prepared."}
            </div>
          </div>
        </div>

        <div className="min-w-0 lg:max-w-[21rem]">
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <GrammarPointRequirementBadges
              point={point}
              showSpecReference={false}
              showTag={false}
            />
          </div>

          {showStaffMetadata ? (
            <div className="mt-2">
              <GrammarPointCoverageBadges point={point} coverage={coverage} />
            </div>
          ) : null}
        </div>
      </div>
    </a>
  );
}

export default function GrammarPointSectionList({
  grammarSet,
  points,
  pointCoverageById,
  showStaffMetadata,
}: {
  grammarSet: DbGrammarSet;
  points: DbGrammarPoint[];
  pointCoverageById: Map<string, DbGrammarPointCoverage>;
  showStaffMetadata: boolean;
}) {
  return (
    <details className="group app-card p-4" open>
      <summary className="app-focus-ring flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg">
        <span className="min-w-0">
          <span className="block text-base font-semibold text-[var(--text-primary)]">
            {grammarSet.title}
          </span>
          <span className="mt-1 block text-sm text-[var(--text-secondary)]">
            {points.length} grammar point{points.length === 1 ? "" : "s"}
          </span>
        </span>

        <SectionToggleButton />
      </summary>

      <div className="mt-4 grid gap-3">
        {points.map((point, index) => (
          <GrammarPointRow
            key={point.id}
            grammarSet={grammarSet}
            point={point}
            coverage={pointCoverageById.get(point.id) ?? null}
            showStaffMetadata={showStaffMetadata}
            position={index + 1}
          />
        ))}
      </div>
    </details>
  );
}
