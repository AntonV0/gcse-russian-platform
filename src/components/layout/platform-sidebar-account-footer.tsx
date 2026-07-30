import Link from "next/link";
import Button from "@/components/ui/button";
import LogoutButton from "@/components/layout/logout-button";
import AppIcon from "@/components/ui/app-icon";
import StudentAvatar from "@/components/profile/student-avatar";
import {
  getAvatarOption,
  getSafeAvatarBackgroundKey,
  getSafeAvatarFrameKey,
} from "@/lib/profile/avatar-customization";
import type { NavItem } from "@/components/layout/platform-sidebar-config";
import { appendAuthDestination } from "@/lib/auth/redirect-paths";
import {
  NavLockMeta,
  accountItemClass,
  accountItemIconFrameClass,
  getNavHref,
  isActive,
  navIconClass,
} from "./platform-sidebar-primitives";

function getAccountInitials(
  userDisplayName: string | null | undefined,
  userEmail: string | null | undefined
) {
  const displayName = userDisplayName?.trim();

  if (displayName) {
    const nameParts = displayName.split(/[\s._-]+/).filter(Boolean);

    if (nameParts.length >= 2) {
      return `${nameParts[0][0] ?? ""}${nameParts[1][0] ?? ""}`.toUpperCase();
    }

    return displayName.slice(0, 2).toUpperCase();
  }

  if (!userEmail) return "GR";

  const localPart = userEmail.split("@")[0]?.trim();
  if (!localPart) return "GR";

  const words = localPart
    .split(/[\s._-]+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
  }

  return localPart.slice(0, 2).toUpperCase();
}

export default function AccountFooter({
  isGuest,
  userEmail,
  userDisplayName,
  userAvatarKey,
  userAvatarBackgroundKey,
  userAvatarFrameKey,
  accountItems,
  activePathname,
  isAccountSectionOpen,
  isAccountNavActive,
  onToggleAccountSection,
}: {
  isGuest: boolean;
  userEmail?: string | null;
  userDisplayName?: string | null;
  userAvatarKey?: string | null;
  userAvatarBackgroundKey?: string | null;
  userAvatarFrameKey?: string | null;
  accountItems: NavItem[];
  activePathname?: string;
  isAccountSectionOpen: boolean;
  isAccountNavActive: boolean;
  onToggleAccountSection: () => void;
}) {
  if (isGuest) {
    return (
      <div className="platform-sidebar-account-card rounded-2xl p-2.5">
        <div className="flex items-center gap-2.5">
          <AppIcon
            icon="userCheck"
            size={18}
            aria-hidden="true"
            className="shrink-0 text-[var(--accent-ink)]"
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
              Begin studying for free
            </div>
            <div className="truncate text-[11px] leading-snug text-[color-mix(in_srgb,var(--text-muted)_88%,var(--text-secondary))]">
              Create your trial student account
            </div>
          </div>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <Button
            href={appendAuthDestination("/login?from=app", activePathname ?? null)}
            variant="secondary"
            size="sm"
            icon="user"
            className="w-full"
          >
            Login
          </Button>
          <Button
            href="/signup?from=app"
            variant="primary"
            size="sm"
            icon="create"
            className="w-full"
          >
            Sign up
          </Button>
        </div>
      </div>
    );
  }

  const displayName = userDisplayName?.trim() || "Your account";
  const avatar = getAvatarOption(userAvatarKey);
  const initials = getAccountInitials(userDisplayName, userEmail);
  const avatarBackgroundKey = getSafeAvatarBackgroundKey(userAvatarBackgroundKey);
  const avatarFrameKey = getSafeAvatarFrameKey(userAvatarFrameKey);

  return (
    <div className="platform-sidebar-account-card rounded-2xl p-2.5">
      <button
        type="button"
        className="-m-1 flex w-[calc(100%+0.5rem)] items-center gap-2.5 rounded-xl p-1 text-left transition hover:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] app-focus-ring"
        aria-expanded={isAccountSectionOpen}
        aria-controls="platform-account-card-nav"
        onClick={onToggleAccountSection}
      >
        <StudentAvatar
          avatar={avatar}
          initials={initials}
          backgroundKey={avatarBackgroundKey}
          frameKey={avatarFrameKey}
          size="xs"
          aria-label={`${displayName} avatar`}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
            {isAccountSectionOpen ? displayName : "Your account"}
          </div>
          {isAccountSectionOpen ? (
            <div className="truncate text-[11px] text-[color-mix(in_srgb,var(--text-muted)_88%,var(--text-secondary))]">
              {userEmail ?? "Signed in"}
            </div>
          ) : null}
        </div>
        <AppIcon
          icon={isAccountSectionOpen ? "chevronDown" : "chevronRight"}
          size={16}
          className="shrink-0 text-[var(--text-muted)] transition group-hover:text-[var(--text-primary)]"
        />
      </button>

      {isAccountSectionOpen ? (
        <div
          id="platform-account-card-nav"
          className="mt-3 space-y-1 border-t border-[color-mix(in_srgb,var(--accent-border-ink)_14%,var(--border-subtle))] pt-3 [html[data-theme=dark]_&]:border-[color-mix(in_srgb,var(--accent-border-ink)_30%,var(--dark-surface-border))]"
        >
          {accountItems.map((item) => {
            const active = isActive(activePathname, item.href);
            const href = appendAuthDestination(
              getNavHref(item),
              activePathname ?? null
            );

            return (
              <Link
                key={item.href}
                href={href}
                className={accountItemClass(active, item.locked)}
                aria-current={active ? "page" : undefined}
                aria-label={
                  item.locked
                    ? `${item.label} requires ${item.lockedLabel?.toLowerCase() ?? "login"}`
                    : undefined
                }
              >
                <span className={accountItemIconFrameClass()}>
                  <AppIcon icon={item.icon} size={15} className={navIconClass(active)} />
                </span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <NavLockMeta item={item} />
              </Link>
            );
          })}
        </div>
      ) : null}

      <div className="mt-2.5">
        <LogoutButton
          variant="secondary"
          className={[
            "w-full justify-start !shadow-none border-[color-mix(in_srgb,var(--danger)_12%,var(--border-subtle))]",
            "text-[color-mix(in_srgb,var(--danger-text)_54%,var(--text-secondary))]",
            "hover:border-[color-mix(in_srgb,var(--danger)_24%,var(--border))]",
            "hover:bg-[color-mix(in_srgb,var(--danger)_5%,var(--background-elevated))]",
            "hover:text-[var(--danger-text)]",
            isAccountNavActive
              ? "bg-[color-mix(in_srgb,var(--accent)_2%,transparent)]"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </div>
    </div>
  );
}
