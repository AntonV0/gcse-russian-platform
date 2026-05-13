import { type RefObject } from "react";
import Link from "next/link";
import AppIcon from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import AccountFooter from "@/components/layout/platform-sidebar-account-footer";
import type { NavItem } from "@/components/layout/platform-sidebar-config";
import type {
  SidebarCommonProps,
  SidebarNavGroup,
  SidebarProfileState,
} from "./platform-sidebar-types";
import {
  NavLockMeta,
  getNavHref,
  isActive,
  itemClass,
  navIconClass,
  navIconFrameClass,
  sectionLabel,
} from "./platform-sidebar-primitives";
import { SidebarHeader, SidebarNextUpCard } from "./platform-sidebar-shared";

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function PlatformDesktopSidebar({
  accountItems,
  activePathname,
  contentNavGroups,
  isAccountNavActive,
  isAccountSectionOpen,
  isGuest,
  navigationLabels,
  nextUp,
  onToggleAccountSection,
  sidebarHeader,
  sidebarProfile,
  sidebarRef,
  statusIcon,
  userEmail,
}: SidebarCommonProps & {
  accountItems: NavItem[];
  contentNavGroups: SidebarNavGroup[];
  isAccountNavActive: boolean;
  isAccountSectionOpen: boolean;
  onToggleAccountSection: () => void;
  sidebarProfile: SidebarProfileState;
  sidebarRef: RefObject<HTMLElement | null>;
  userEmail?: string | null;
}) {
  return (
    <aside
      ref={sidebarRef}
      className="platform-sidebar-shell dev-marker-host relative z-[60] hidden h-[var(--platform-sidebar-height,calc(100dvh-var(--sticky-site-offset)-1rem))] min-h-0 flex-col overflow-hidden rounded-3xl border p-4 lg:flex"
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PlatformSidebar"
          filePath="src/components/layout/platform-sidebar.tsx"
          tier="layout"
          componentRole="Role-aware platform sidebar navigation"
          bestFor="Authenticated platform pages, student/teacher/admin navigation, account utilities, and access-aware route groups."
          usageExamples={[
            "Student platform shell",
            "Teacher assignment area",
            "Admin navigation shell",
            "Account/settings navigation",
          ]}
          notes="Use inside the authenticated platform layout. Keep route visibility rules here aligned with access control helpers."
        />
      ) : null}

      <SidebarHeader
        eyebrow={sidebarHeader.eyebrow}
        title={sidebarHeader.title}
        subtitle={sidebarHeader.showStatusPill ? sidebarHeader.subtitle : null}
        statusIcon={statusIcon}
      />

      {nextUp ? <SidebarNextUpCard nextUp={nextUp} /> : null}

      <nav
        className="-mr-1 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pr-1"
        aria-label={navigationLabels.primary}
      >
        {contentNavGroups.map((group, groupIndex) => (
          <div
            key={group.label}
            className={groupIndex === 0 ? "space-y-0.5" : "mt-4 space-y-0.5"}
          >
            {sectionLabel(group.label)}

            {group.items.map((item) => {
              const active = isActive(activePathname, item.href);
              const href = getNavHref(item);

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
      </nav>

      <div className="mt-3 shrink-0 border-t border-[color-mix(in_srgb,var(--accent-border-ink)_16%,var(--border))] pt-3 [html[data-theme=dark]_&]:border-[color-mix(in_srgb,var(--accent-border-ink)_34%,var(--dark-surface-border))]">
        <AccountFooter
          isGuest={isGuest}
          userEmail={userEmail}
          userDisplayName={sidebarProfile.displayName}
          userAvatarKey={sidebarProfile.avatarKey}
          userAvatarBackgroundKey={sidebarProfile.avatarBackgroundKey}
          userAvatarFrameKey={sidebarProfile.avatarFrameKey}
          accountItems={accountItems}
          activePathname={activePathname}
          isAccountSectionOpen={isAccountSectionOpen}
          isAccountNavActive={isAccountNavActive}
          onToggleAccountSection={onToggleAccountSection}
        />
      </div>
    </aside>
  );
}
