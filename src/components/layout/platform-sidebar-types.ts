import type { PlatformSidebarNextUp } from "@/lib/dashboard/sidebar-next-up";
import type { AppIconKey } from "@/lib/shared/icons";
import type { NavItem } from "@/components/layout/platform-sidebar-config";

export type SidebarHeaderState = {
  eyebrow: string;
  title: string;
  subtitle: string;
  showStatusPill: boolean;
};

export type SidebarNavigationLabels = {
  quick: string;
  full: string;
  primary: string;
};

export type SidebarNavGroup = {
  label: string;
  items: NavItem[];
};

export type SidebarProfileState = {
  displayName: string | null;
  avatarKey: string | null;
  avatarBackgroundKey: string | null;
  avatarFrameKey: string | null;
};

export type SidebarCommonProps = {
  activePathname?: string;
  isGuest: boolean;
  navigationLabels: SidebarNavigationLabels;
  nextUp?: PlatformSidebarNextUp | null;
  sidebarHeader: SidebarHeaderState;
  statusIcon: AppIconKey;
};
