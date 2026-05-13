import ActionPill from "@/components/ui/action-pill";
import Button from "@/components/ui/button";
import type {
  VocabularyStudyState,
  VocabularyStudyStateFilter,
} from "@/lib/vocabulary/study-state";

export function getStudyStateLabel(state: VocabularyStudyState) {
  switch (state) {
    case "mastered":
      return "Mastered";
    case "needs_practice":
      return "Needs practice";
    case "new":
      return "New";
  }
}

export function getStudyStateBadgeTone(state: VocabularyStudyState) {
  switch (state) {
    case "mastered":
      return "success";
    case "needs_practice":
      return "warning";
    case "new":
      return "muted";
  }
}

export function getStudyStateIcon(state: VocabularyStudyState) {
  switch (state) {
    case "mastered":
      return "success";
    case "needs_practice":
      return "brain";
    case "new":
      return "sparkles";
  }
}

export function getStudyStateRowClassName(state: VocabularyStudyState) {
  switch (state) {
    case "mastered":
      return [
        "border-[var(--success-border)]",
        "bg-[color-mix(in_srgb,var(--success-surface)_48%,var(--surface-muted-bg))]",
        "hover:border-[var(--success-border-strong)]",
      ].join(" ");
    case "needs_practice":
      return [
        "border-[var(--warning-border)]",
        "bg-[color-mix(in_srgb,var(--warning-surface)_52%,var(--surface-muted-bg))]",
        "hover:border-[var(--warning-border-strong)]",
      ].join(" ");
    case "new":
    default:
      return [
        "border-[var(--border-subtle)]",
        "bg-[var(--surface-muted-bg)]",
        "hover:border-[color-mix(in_srgb,var(--accent-border-ink)_34%,var(--border-strong))]",
      ].join(" ");
  }
}

export function getStudyStateStripeClassName(state: VocabularyStudyState) {
  switch (state) {
    case "mastered":
      return "bg-[var(--success)]";
    case "needs_practice":
      return "bg-[var(--warning-display)]";
    case "new":
    default:
      return "bg-[var(--accent-fill)]";
  }
}

export function SectionToggleButton() {
  return (
    <ActionPill
      icon="down"
      className="pointer-events-none shrink-0 gap-1 px-3 sm:px-3.5"
      aria-hidden="true"
    >
      <span className="group-open:hidden">Open</span>
      <span className="hidden group-open:inline">Close</span>
    </ActionPill>
  );
}

export function StudyStateButton({
  state,
  currentState,
  onClick,
}: {
  state: VocabularyStudyState;
  currentState: VocabularyStudyState;
  onClick: () => void;
}) {
  const isActive = state === currentState;

  return (
    <Button
      type="button"
      variant={
        state === "mastered"
          ? "success"
          : state === "needs_practice"
            ? "warning"
            : isActive
              ? "soft"
              : "secondary"
      }
      size="sm"
      icon={getStudyStateIcon(state)}
      aria-pressed={isActive}
      onClick={onClick}
    >
      {getStudyStateLabel(state)}
    </Button>
  );
}

export function StudySummaryButton({
  label,
  count,
  stateFilter,
  activeFilter,
  onClick,
}: {
  label: string;
  count: number;
  stateFilter: VocabularyStudyStateFilter;
  activeFilter: VocabularyStudyStateFilter;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activeFilter === stateFilter}
      className={[
        "app-focus-ring rounded-2xl border px-4 py-3 text-left transition",
        activeFilter === stateFilter
          ? "border-[var(--accent-selected-border)] [background:var(--accent-gradient-selected)] shadow-[0_10px_24px_color-mix(in_srgb,var(--accent)_10%,transparent)]"
          : "border-[var(--border-subtle)] bg-[var(--background-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]",
      ].join(" ")}
    >
      <span className="block text-2xl font-bold leading-none text-[var(--text-primary)]">
        {count}
      </span>
      <span className="mt-1 block text-sm font-semibold text-[var(--text-secondary)]">
        {label}
      </span>
    </button>
  );
}
