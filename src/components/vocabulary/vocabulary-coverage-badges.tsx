import type { CSSProperties } from "react";
import type { DbVocabularySetCoverageSummary } from "@/lib/vocabulary/types";

function getCoverageTone(usedItems: number, totalItems: number) {
  if (totalItems === 0 || usedItems === 0) return "danger";
  if (usedItems === totalItems) return "success";
  if (usedItems < totalItems / 2) return "warning";
  return "info";
}

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function getCoveragePercentage(usedItems: number, totalItems: number) {
  if (totalItems <= 0) return 0;
  return clampPercentage(Math.round((usedItems / totalItems) * 100));
}

function getCoverageRingColor(usedItems: number, totalItems: number) {
  switch (getCoverageTone(usedItems, totalItems)) {
    case "success":
      return "var(--success)";
    case "warning":
      return "var(--warning)";
    case "danger":
      return "var(--danger)";
    case "info":
    default:
      return "var(--info)";
  }
}

function CoverageProgressRing({
  letter,
  label,
  usedItems,
  totalItems,
}: {
  letter: string;
  label: string;
  usedItems: number;
  totalItems: number;
}) {
  const percentage = getCoveragePercentage(usedItems, totalItems);
  const progressDegrees = Math.round((percentage / 100) * 360);
  const ringColor = getCoverageRingColor(usedItems, totalItems);
  const style = {
    background: `conic-gradient(${ringColor} ${progressDegrees}deg, color-mix(in srgb, ${ringColor} 16%, var(--background-muted)) ${progressDegrees}deg 360deg)`,
  } satisfies CSSProperties;

  return (
    <span
      role="meter"
      aria-label={`${label} vocabulary coverage: ${percentage}% (${usedItems} of ${totalItems} items)`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
      title={`${label}: ${usedItems}/${totalItems} items (${percentage}%)`}
      className="flex min-w-[3.75rem] flex-col items-center gap-1 text-center"
    >
      <span
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full p-1 shadow-[0_8px_18px_color-mix(in_srgb,var(--text-primary)_7%,transparent)]"
        style={style}
      >
        <span className="flex h-full w-full flex-col items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--background-elevated)] leading-none">
          <span className="text-[0.78rem] font-bold text-[var(--text-primary)]">
            {letter}
          </span>
          <span className="mt-0.5 text-[0.68rem] font-semibold text-[var(--text-secondary)]">
            {percentage}%
          </span>
        </span>
      </span>
      <span className="sr-only">
        {label} {usedItems} of {totalItems}
      </span>
    </span>
  );
}

export default function VocabularyCoverageBadges({
  coverageSummary,
  fallbackTotalItems,
}: {
  coverageSummary: DbVocabularySetCoverageSummary;
  fallbackTotalItems: number;
}) {
  const totalItems = coverageSummary.totalItems || fallbackTotalItems;

  if (totalItems === 0) return null;

  return (
    <>
      <CoverageProgressRing
        letter="F"
        label="Foundation"
        usedItems={coverageSummary.foundationUsedItems}
        totalItems={coverageSummary.foundationTotalItems || totalItems}
      />
      <CoverageProgressRing
        letter="H"
        label="Higher"
        usedItems={coverageSummary.higherUsedItems}
        totalItems={coverageSummary.higherTotalItems || totalItems}
      />
      <CoverageProgressRing
        letter="V"
        label="Volna"
        usedItems={coverageSummary.volnaUsedItems}
        totalItems={coverageSummary.volnaTotalItems || totalItems}
      />
      <CoverageProgressRing
        letter="C"
        label="Custom list"
        usedItems={coverageSummary.customListUsedItems}
        totalItems={coverageSummary.customListTotalItems || totalItems}
      />
    </>
  );
}
