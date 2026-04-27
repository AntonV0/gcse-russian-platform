import type { ReactNode } from "react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

export const lessonBuilderBlockTypeGroups = [
  ["Structure", ["Header", "Subheader", "Divider"]],
  ["Teaching", ["Text", "Note", "Callout", "Exam tip", "Vocabulary"]],
  ["Media", ["Image", "Audio"]],
  ["Practice", ["Question set", "Vocabulary set"]],
] as const;

export function BuilderPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background-muted)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
      {children}
    </span>
  );
}

export function BuilderIconButton({ label }: { label: string }) {
  return (
    <Button variant="secondary" size="sm" icon="settings" iconOnly ariaLabel={label} />
  );
}

export function SectionSidebarRow({
  title,
  active = false,
  dropTarget = false,
}: {
  title: string;
  active?: boolean;
  dropTarget?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border px-3 py-3 transition",
        active
          ? "app-selected-surface"
          : "border-[var(--border)] bg-[var(--background-elevated)]",
        dropTarget
          ? "ring-2 ring-[color-mix(in_srgb,var(--success)_40%,transparent)]"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <Badge tone={active ? "default" : "muted"}>{active ? "Selected" : "Draft"}</Badge>
        <Badge tone="info">H</Badge>
      </div>
      <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <BuilderPill>4 blocks</BuilderPill>
        <BuilderPill>content</BuilderPill>
      </div>
      {dropTarget ? (
        <div className="mt-2 text-xs font-semibold text-[var(--success)]">
          Drop block here
        </div>
      ) : null}
    </div>
  );
}

export function BlockRow({
  title,
  type,
  selected = false,
  dropTarget = false,
}: {
  title: string;
  type: string;
  selected?: boolean;
  dropTarget?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border px-3 py-3 transition",
        selected
          ? "app-selected-surface"
          : "border-[var(--border)] bg-[var(--background-elevated)]",
        dropTarget ? "ring-2 ring-[var(--accent-ring)]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <BuilderPill>drag</BuilderPill>
            <Badge tone="info">{type}</Badge>
            <Badge tone="success">Published</Badge>
            {selected ? <Badge tone="default">Selected</Badge> : null}
          </div>
          <div className="font-semibold text-[var(--text-primary)]">{title}</div>
          <p className="mt-1 line-clamp-2 text-sm app-text-muted">
            Preview text from the block should help editors recognise the content without
            opening the inspector.
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-1.5">
          <BuilderIconButton label="Duplicate block" />
          <BuilderIconButton label="Move block up" />
          <BuilderIconButton label="Publish block" />
          <BuilderIconButton label="Move block down" />
        </div>
      </div>
    </div>
  );
}
