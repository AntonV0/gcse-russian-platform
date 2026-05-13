"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import PlatformDesktopSidebar from "@/components/layout/platform-desktop-sidebar";
import PlatformMobileSidebar from "@/components/layout/platform-mobile-sidebar";
import type { PlatformSidebarNextUp } from "@/lib/dashboard/sidebar-next-up";
import {
  PROFILE_UPDATED_EVENT,
  type ProfileUpdatedEventDetail,
} from "@/lib/profile/profile-events";
import {
  buildPlatformSidebarNav,
  getSidebarHeaderState,
  getSidebarNavigationLabels,
  type PlatformSidebarAccessMode,
  type PlatformSidebarRole,
  type PlatformSidebarVariant,
} from "@/components/layout/platform-sidebar-config";
import {
  getStatusIcon,
  isActive,
} from "@/components/layout/platform-sidebar-primitives";
import { usePlatformSidebarHeight } from "@/components/layout/use-platform-sidebar-height";

type PlatformSidebarProps = {
  role: PlatformSidebarRole;
  accessMode: PlatformSidebarAccessMode;
  variant?: PlatformSidebarVariant;
  pathname?: string;
  userEmail?: string | null;
  userDisplayName?: string | null;
  userAvatarKey?: string | null;
  userAvatarBackgroundKey?: string | null;
  userAvatarFrameKey?: string | null;
  nextUp?: PlatformSidebarNextUp | null;
};

export default function PlatformSidebar({
  role,
  accessMode,
  variant,
  pathname,
  userEmail,
  userDisplayName,
  userAvatarKey,
  userAvatarBackgroundKey,
  userAvatarFrameKey,
  nextUp,
}: PlatformSidebarProps) {
  const desktopSidebarRef = useRef<HTMLElement>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [accountNavOpenOverride, setAccountNavOpenOverride] = useState<boolean | null>(
    null
  );
  const [sidebarProfile, setSidebarProfile] = useState({
    displayName: userDisplayName ?? null,
    avatarKey: userAvatarKey ?? null,
    avatarBackgroundKey: userAvatarBackgroundKey ?? null,
    avatarFrameKey: userAvatarFrameKey ?? null,
  });
  const currentPathname = usePathname();
  const activePathname = pathname ?? currentPathname;
  const previousPathnameRef = useRef(activePathname);
  const isGuest = role === "guest";
  const sidebarHeader = getSidebarHeaderState({
    pathname: activePathname ?? "",
    role,
    accessMode,
  });
  const navigationLabels = getSidebarNavigationLabels(role);
  const statusIcon = getStatusIcon(role);
  const {
    courseGroupItems,
    studyItems,
    examPrepItems,
    volnaSchoolItems,
    utilityItems,
    contentNavGroups,
    navGroups,
    mobileQuickItems,
  } = buildPlatformSidebarNav({
    role,
    accessMode,
    variant,
    isGuest,
  });
  const mobileContextLabel = sidebarHeader.showStatusPill
    ? sidebarHeader.subtitle
    : sidebarHeader.title;
  const isAccountNavActive = utilityItems.some((item) =>
    isActive(activePathname, item.href)
  );
  const isAccountSectionOpen = accountNavOpenOverride ?? isAccountNavActive;
  const activeNavItem =
    [
      ...courseGroupItems,
      ...studyItems,
      ...examPrepItems,
      ...volnaSchoolItems,
      ...utilityItems,
    ].find((item) => isActive(activePathname, item.href)) ?? courseGroupItems[0];
  const isMobileMenuActive =
    isMobileNavOpen ||
    [...examPrepItems, ...volnaSchoolItems, ...utilityItems].some((item) =>
      isActive(activePathname, item.href)
    );

  function handleAccountSectionToggle() {
    const currentOpen = accountNavOpenOverride ?? isAccountNavActive;
    const nextOpen = !currentOpen;

    setAccountNavOpenOverride(nextOpen);
  }

  useEffect(() => {
    if (!isMobileNavOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    if (previousPathnameRef.current === activePathname) return;

    previousPathnameRef.current = activePathname;

    const frameId = window.requestAnimationFrame(() => {
      setIsMobileNavOpen(false);
      setAccountNavOpenOverride(null);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [activePathname]);

  useEffect(() => {
    function handleProfileUpdated(event: Event) {
      const detail = (event as CustomEvent<ProfileUpdatedEventDetail>).detail;

      setSidebarProfile({
        displayName: detail.displayName || detail.fullName || null,
        avatarKey: detail.avatarKey ?? null,
        avatarBackgroundKey: detail.avatarBackgroundKey ?? null,
        avatarFrameKey: detail.avatarFrameKey ?? null,
      });
    }

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
    };
  }, []);

  usePlatformSidebarHeight(desktopSidebarRef);

  return (
    <>
      <PlatformMobileSidebar
        activeNavItem={activeNavItem}
        activePathname={activePathname}
        isGuest={isGuest}
        isMobileMenuActive={isMobileMenuActive}
        isMobileNavOpen={isMobileNavOpen}
        mobileContextLabel={mobileContextLabel}
        mobileQuickItems={mobileQuickItems}
        navGroups={navGroups}
        navigationLabels={navigationLabels}
        nextUp={nextUp}
        onToggleMobileNav={() => setIsMobileNavOpen((current) => !current)}
        sidebarHeader={sidebarHeader}
        statusIcon={statusIcon}
      />

      <PlatformDesktopSidebar
        accountItems={utilityItems}
        activePathname={activePathname}
        contentNavGroups={contentNavGroups}
        isAccountNavActive={isAccountNavActive}
        isAccountSectionOpen={isAccountSectionOpen}
        isGuest={isGuest}
        navigationLabels={navigationLabels}
        nextUp={nextUp}
        onToggleAccountSection={handleAccountSectionToggle}
        sidebarHeader={sidebarHeader}
        sidebarProfile={sidebarProfile}
        sidebarRef={desktopSidebarRef}
        statusIcon={statusIcon}
        userEmail={userEmail}
      />
    </>
  );
}
