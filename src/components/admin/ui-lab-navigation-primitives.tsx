import type { ReactNode } from "react";

import type { AppIconKey } from "@/lib/shared/icons";
import AppIcon from "@/components/ui/app-icon";

export type UiLabPrimaryNavItem = {
  label: string;
  icon?: AppIconKey;
  active?: boolean;
  locked?: boolean;
  badge?: ReactNode;
};

export type UiLabNavGroup = {
  title: string;
  items: UiLabPrimaryNavItem[];
};

export function UiLabDemoHeaderLink({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={[
        "rounded-full px-3 py-2 text-sm font-medium transition",
        active
          ? "app-selected-surface"
          : "text-[var(--text-secondary)] hover:bg-[var(--background-muted)] hover:text-[var(--text-primary)]",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export function UiLabDemoSidebarItem({
  item,
  compact = false,
}: {
  item: UiLabPrimaryNavItem;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-2xl border transition",
        compact ? "px-3 py-2.5" : "px-3.5 py-3",
        item.active
          ? "app-selected-surface"
          : item.locked
            ? "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-secondary)] opacity-80"
            : "border-[var(--border)] bg-[var(--background-elevated)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--background-muted)]",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          item.active
            ? "[background:var(--accent-gradient-soft)] text-[var(--accent-on-soft)] ring-1 ring-[var(--accent-selected-border)]"
            : "bg-[var(--background-muted)] text-[var(--text-secondary)]",
        ].join(" ")}
      >
        <AppIcon icon={item.icon ?? "file"} size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{item.label}</div>
      </div>

      {item.badge ? <div className="shrink-0">{item.badge}</div> : null}
      {item.locked ? <AppIcon icon="locked" size={16} className="shrink-0" /> : null}
    </div>
  );
}

export function UiLabDemoNavGroup({
  title,
  items,
  compact = false,
}: UiLabNavGroup & { compact?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="px-1 text-xs font-semibold uppercase tracking-[0.08em] app-text-soft">
        {title}
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <UiLabDemoSidebarItem key={item.label} item={item} compact={compact} />
        ))}
      </div>
    </div>
  );
}
