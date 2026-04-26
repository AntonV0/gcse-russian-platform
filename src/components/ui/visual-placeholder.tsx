import AppIcon from "@/components/ui/app-icon";
import type { AppIconKey } from "@/lib/shared/icons";

type VisualPlaceholderCategory =
  | "learningPath"
  | "vocabulary"
  | "grammar"
  | "listening"
  | "speaking"
  | "writing"
  | "travel"
  | "food"
  | "school"
  | "emptyState";

type VisualPlaceholderSize = "compact" | "wide" | "square";

type VisualPlaceholderProps = {
  category: VisualPlaceholderCategory;
  size?: VisualPlaceholderSize;
  ariaLabel?: string;
  className?: string;
};

const categoryIcons: Record<VisualPlaceholderCategory, AppIconKey> = {
  learningPath: "learning",
  vocabulary: "vocabulary",
  grammar: "grammar",
  listening: "listening",
  speaking: "speaking",
  writing: "write",
  travel: "navigation",
  food: "vocabularySet",
  school: "school",
  emptyState: "image",
};

function getSizeClass(size: VisualPlaceholderSize) {
  switch (size) {
    case "wide":
      return "min-h-[160px] w-full max-w-[360px]";
    case "square":
      return "h-[180px] w-[180px]";
    case "compact":
    default:
      return "h-[120px] w-[180px]";
  }
}

export default function VisualPlaceholder({
  category,
  size = "compact",
  ariaLabel,
  className,
}: VisualPlaceholderProps) {
  const accessibilityProps = ariaLabel
    ? { role: "img", "aria-label": ariaLabel }
    : { "aria-hidden": true as const };

  return (
    <div
      {...accessibilityProps}
      className={[
        "relative isolate overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)]",
        "bg-[var(--accent-gradient-soft)] shadow-[var(--shadow-sm)]",
        getSizeClass(size),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="absolute inset-x-0 top-0 h-16 [background:var(--accent-sheen-gradient)]" />
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[var(--accent-selected-border)] bg-[var(--background-elevated)]/55" />
      <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]" />
      <div className="absolute bottom-5 right-5 h-10 w-16 rounded-full border border-[var(--border)] bg-[var(--background-elevated)]/70" />

      <div className="relative flex h-full items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)] border border-[var(--accent-selected-border)] bg-[var(--background-elevated)] text-[var(--accent-on-soft)] shadow-[var(--shadow-xs)]">
          <AppIcon icon={categoryIcons[category]} size={28} />
        </div>
      </div>
    </div>
  );
}
