import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import Button from "@/components/ui/button";
import LogoutButton from "@/components/layout/logout-button";
import type { NavItem } from "@/components/layout/platform-sidebar-config";
import type { SidebarCommonProps, SidebarNavGroup } from "./platform-sidebar-types";
import { appendAuthDestination } from "@/lib/auth/redirect-paths";
import {
  NavLockMeta,
  getNavHref,
  getMobileQuickLabel,
  isActive,
  itemClass,
  mobileQuickItemClass,
  navIconClass,
  navIconFrameClass,
  sectionLabel,
} from "./platform-sidebar-primitives";
import { SidebarNextUpCard } from "./platform-sidebar-shared";

export default function PlatformMobileSidebar({
  activeNavItem,
  activePathname,
  isGuest,
  isMobileMenuActive,
  isMobileNavOpen,
  mobileContextLabel,
  mobileQuickItems,
  navGroups,
  navigationLabels,
  nextUp,
  onToggleMobileNav,
  sidebarHeader,
  statusIcon,
}: SidebarCommonProps & {
  activeNavItem: NavItem;
  isMobileMenuActive: boolean;
  isMobileNavOpen: boolean;
  mobileContextLabel: string;
  mobileQuickItems: NavItem[];
  navGroups: SidebarNavGroup[];
  onToggleMobileNav: () => void;
}) {
  return (
    <section className="dev-marker-host relative lg:hidden">
      <div className="platform-sidebar-shell rounded-[1.35rem] border p-3">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] app-text-soft">
              {sidebarHeader.eyebrow}
            </div>
            <div className="mt-1 flex min-w-0 items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--accent-border-ink)_28%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent)_7%,var(--background-muted))] text-[var(--accent-on-soft)]">
                <AppIcon icon={activeNavItem.icon} size={15} />
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
                  {activeNavItem.label}
                </div>
                <div className="truncate text-xs app-text-muted">
                  {mobileContextLabel}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] shadow-[0_1px_2px_color-mix(in_srgb,var(--text-primary)_4%,transparent)] transition hover:border-[color-mix(in_srgb,var(--accent-border-ink)_30%,var(--border))] hover:bg-[var(--background-muted)] app-focus-ring"
            aria-expanded={isMobileNavOpen}
            aria-controls="platform-mobile-nav-panel"
            aria-label={
              isMobileNavOpen ? "Close study navigation" : "Open study navigation"
            }
            onClick={onToggleMobileNav}
          >
            <AppIcon icon={isMobileNavOpen ? "cancel" : "menu"} size={16} />
            Menu
          </button>
        </div>

        {nextUp ? (
          <SidebarNextUpCard nextUp={nextUp} activePathname={activePathname} />
        ) : null}

        <nav aria-label={navigationLabels.quick}>
          <div className="grid grid-cols-5 gap-2">
            {mobileQuickItems.map((item) => {
              const active = isActive(activePathname, item.href);
              const href = appendAuthDestination(
                getNavHref(item),
                activePathname ?? null
              );
              const label = getMobileQuickLabel(item.label);

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={mobileQuickItemClass(active, item.locked)}
                  aria-current={active ? "page" : undefined}
                  aria-label={
                    item.locked
                      ? `${item.label} requires ${item.lockedLabel?.toLowerCase() ?? "login"}`
                      : item.label
                  }
                >
                  <AppIcon icon={item.icon} size={17} />
                  <span className="max-w-full truncate">{label}</span>
                  {item.locked ? (
                    <span className="sr-only">{item.lockedLabel ?? "Locked"}</span>
                  ) : null}
                </Link>
              );
            })}

            <button
              type="button"
              className={mobileQuickItemClass(isMobileMenuActive)}
              aria-expanded={isMobileNavOpen}
              aria-controls="platform-mobile-nav-panel"
              aria-label={
                isMobileNavOpen
                  ? "Close full study navigation"
                  : "Open full study navigation"
              }
              onClick={onToggleMobileNav}
            >
              <AppIcon icon={isMobileNavOpen ? "chevronDown" : "navigation"} size={17} />
              <span className="max-w-full truncate">More</span>
            </button>
          </div>
        </nav>

        {isMobileNavOpen ? (
          <div
            id="platform-mobile-nav-panel"
            className="mt-3 max-h-[min(72dvh,34rem)] overflow-y-auto overscroll-contain rounded-2xl border border-[color-mix(in_srgb,var(--accent-border-ink)_20%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--background-elevated)_90%,var(--background-muted))] p-3 shadow-[0_10px_24px_color-mix(in_srgb,var(--text-primary)_5%,transparent)]"
          >
            <div className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.12em] app-text-soft">
              <AppIcon icon={statusIcon} size={13} />
              {sidebarHeader.title}
            </div>

            <nav className="space-y-4" aria-label={navigationLabels.full}>
              {navGroups.map((group) => (
                <div key={group.label} className="space-y-0.5">
                  {sectionLabel(group.label)}
                  {group.items.map((item) => {
                    const active = isActive(activePathname, item.href);
                    const href = appendAuthDestination(
                      getNavHref(item),
                      activePathname ?? null
                    );

                    return (
                      <Link
                        key={item.href}
                        href={href}
                        className={itemClass(active, item.locked)}
                        aria-current={active ? "page" : undefined}
                        aria-label={
                          item.locked
                            ? `${item.label} requires ${item.lockedLabel?.toLowerCase() ?? "access"}`
                            : undefined
                        }
                      >
                        <span className={navIconFrameClass()}>
                          <AppIcon
                            icon={item.icon}
                            size={16}
                            className={navIconClass(active)}
                          />
                        </span>
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        <NavLockMeta item={item} />
                      </Link>
                    );
                  })}
                </div>
              ))}

              <div className="border-t border-[color-mix(in_srgb,var(--accent-border-ink)_16%,var(--border))] pt-3 [html[data-theme=dark]_&]:border-[color-mix(in_srgb,var(--accent-border-ink)_34%,var(--dark-surface-border))]">
                {isGuest ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      href={appendAuthDestination(
                        "/login?from=app",
                        activePathname ?? null
                      )}
                      variant="secondary"
                      size="sm"
                      icon="user"
                    >
                      Login
                    </Button>
                    <Button
                      href="/signup?from=app"
                      variant="primary"
                      size="sm"
                      icon="create"
                    >
                      Sign up
                    </Button>
                  </div>
                ) : (
                  <LogoutButton variant="quiet" />
                )}
              </div>
            </nav>
          </div>
        ) : null}
      </div>
    </section>
  );
}
