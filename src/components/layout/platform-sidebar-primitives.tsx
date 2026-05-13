import AppIcon from "@/components/ui/app-icon";
import { getAccountPath } from "@/lib/access/routes";
import type { AppIconKey } from "@/lib/shared/icons";
import type {
  NavItem,
  PlatformSidebarRole,
} from "@/components/layout/platform-sidebar-config";

export function isActive(pathname: string | undefined, href: string) {
  if (!pathname) return false;
  if (pathname === href) return true;
  if (href === getAccountPath()) return false;
  if (href.startsWith("/courses/") && pathname.startsWith("/courses")) return true;
  if (href !== "/" && pathname.startsWith(`${href}/`)) return true;
  return false;
}

export function itemClass(active: boolean, locked = false) {
  return [
    "group relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-transparent px-2.5 py-[0.3125rem] text-sm font-medium transition app-focus-ring",
    active
      ? [
          "border-[var(--sidebar-item-border-active)]",
          "bg-[var(--sidebar-item-bg-active)]",
          "text-[var(--sidebar-item-text-active)]",
          "shadow-[var(--sidebar-item-shadow-active)]",
          "before:absolute before:inset-y-2.5 before:left-0 before:w-0.5 before:rounded-r-full before:[background:var(--accent-gradient-fill)]",
        ].join(" ")
      : [
          "text-[color-mix(in_srgb,var(--text-secondary)_90%,var(--text-primary))]",
          "hover:border-[var(--sidebar-item-border-hover)]",
          "hover:bg-[var(--sidebar-item-bg-hover)]",
          "hover:text-[var(--sidebar-item-text-hover)]",
        ].join(" "),
    locked ? "opacity-85" : "",
  ].join(" ");
}

export function mobileQuickItemClass(active: boolean, locked = false) {
  return [
    "group flex min-h-[4.15rem] min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border px-1.5 py-2 text-center text-[0.72rem] font-semibold leading-tight transition app-focus-ring",
    active
      ? [
          "border-[var(--sidebar-item-border-active)]",
          "bg-[var(--sidebar-item-bg-active)]",
          "text-[var(--sidebar-item-text-active)]",
          "shadow-[var(--sidebar-item-shadow-active)]",
        ].join(" ")
      : "border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--background-elevated)_82%,transparent)] text-[color-mix(in_srgb,var(--text-secondary)_88%,var(--text-primary))] hover:border-[var(--sidebar-item-border-hover)] hover:bg-[var(--sidebar-item-bg-hover)] hover:text-[var(--sidebar-item-text-hover)]",
    locked ? "opacity-85" : "",
  ].join(" ");
}

export function navIconClass(active: boolean) {
  return [
    "shrink-0 transition-colors",
    active
      ? "text-[var(--sidebar-item-icon-active)]"
      : "text-[var(--sidebar-item-icon)] group-hover:text-[var(--sidebar-item-icon-hover)]",
  ].join(" ");
}

export function navIconFrameClass() {
  return "flex h-6 w-6 shrink-0 items-center justify-center bg-transparent transition-colors";
}

export function accountItemClass(active: boolean, locked = false) {
  return [
    "group relative flex items-center gap-2 overflow-hidden rounded-xl border border-transparent px-2 py-1.5 text-[13px] font-medium transition app-focus-ring",
    active
      ? [
          "border-[var(--sidebar-item-border-active)]",
          "bg-[var(--sidebar-item-bg-active)]",
          "text-[var(--sidebar-item-text-active)]",
          "shadow-[var(--sidebar-item-shadow-active)]",
          "before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:[background:var(--accent-gradient-fill)]",
        ].join(" ")
      : [
          "text-[color-mix(in_srgb,var(--text-secondary)_84%,var(--text-primary))]",
          "hover:border-[var(--sidebar-item-border-hover)]",
          "hover:bg-[var(--sidebar-item-bg-hover)]",
          "hover:text-[var(--sidebar-item-text-hover)]",
        ].join(" "),
    locked ? "opacity-85" : "",
  ].join(" ");
}

export function accountItemIconFrameClass() {
  return "flex h-6 w-6 shrink-0 items-center justify-center bg-transparent transition-colors";
}

export function sectionLabel(label: string) {
  return (
    <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[color-mix(in_srgb,var(--text-muted)_82%,var(--text-secondary))]">
      {label}
    </div>
  );
}

export function getStatusIcon(role: PlatformSidebarRole): AppIconKey {
  if (role === "admin") return "admin";
  if (role === "teacher") return "teacher";
  if (role === "student") return "student";
  return "preview";
}

export function getNavHref(item: NavItem) {
  return item.locked ? (item.lockedHref ?? "/login") : item.href;
}

export function NavLockMeta({ item }: { item: NavItem }) {
  if (!item.locked) return null;

  return (
    <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--background-muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
      <AppIcon icon="lock" size={11} />
      <span>{item.lockedLabel ?? "Login"}</span>
    </span>
  );
}
