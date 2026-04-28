import type { CSSProperties } from "react";
import type { DbGrammarSetCoverageSummary } from "@/lib/grammar/grammar-helpers-db";

function getCoverageTone(usedPoints: number, totalPoints: number) {
  if (totalPoints === 0 || usedPoints === 0) return "danger";
  if (usedPoints === totalPoints) return "success";
  if (usedPoints < totalPoints / 2) return "warning";
  return "info";
}

function getCoveragePercentage(usedPoints: number, totalPoints: number) {
  if (totalPoints <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((usedPoints / totalPoints) * 100)));
}

function getCoverageRingColor(usedPoints: number, totalPoints: number) {
  switch (getCoverageTone(usedPoints, totalPoints)) {
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
  usedPoints,
  totalPoints,
}: {
  letter: string;
  label: string;
  usedPoints: number;
  totalPoints: number;
}) {
  const percentage = getCoveragePercentage(usedPoints, totalPoints);
  const progressDegrees = Math.round((percentage / 100) * 360);
  const ringColor = getCoverageRingColor(usedPoints, totalPoints);
  const style = {
    background: `conic-gradient(${ringColor} ${progressDegrees}deg, color-mix(in srgb, ${ringColor} 16%, var(--background-muted)) ${progressDegrees}deg 360deg)`,
  } satisfies CSSProperties;

  return (
    <span
      role="meter"
      aria-label={`${label} grammar coverage: ${percentage}% (${usedPoints} of ${totalPoints} points)`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
      title={`${label}: ${usedPoints}/${totalPoints} points (${percentage}%)`}
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
        {label} {usedPoints} of {totalPoints}
      </span>
    </span>
  );
}

export default function GrammarCoverageBadges({
  coverageSummary,
  fallbackTotalPoints,
}: {
  coverageSummary: DbGrammarSetCoverageSummary;
  fallbackTotalPoints: number;
}) {
  const totalPoints = coverageSummary.totalPoints || fallbackTotalPoints;

  if (totalPoints === 0) return null;

  return (
    <>
      <CoverageProgressRing
        letter="F"
        label="Foundation"
        usedPoints={coverageSummary.foundationUsedPoints}
        totalPoints={coverageSummary.foundationTotalPoints || totalPoints}
      />
      <CoverageProgressRing
        letter="H"
        label="Higher"
        usedPoints={coverageSummary.higherUsedPoints}
        totalPoints={coverageSummary.higherTotalPoints || totalPoints}
      />
      <CoverageProgressRing
        letter="V"
        label="Volna"
        usedPoints={coverageSummary.volnaUsedPoints}
        totalPoints={coverageSummary.volnaTotalPoints || totalPoints}
      />
    </>
  );
}
