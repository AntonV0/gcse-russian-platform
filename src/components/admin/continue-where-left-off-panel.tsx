"use client";

import { useMemo, useSyncExternalStore } from "react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PanelCard from "@/components/ui/panel-card";

type RecentAdminRoute = {
  href: string;
  title: string;
  description: string;
  timestamp: number;
};

const STORAGE_KEY = "gcse-russian-admin-last-route";

function readRecentAdminRoute(): RecentAdminRoute | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as RecentAdminRoute;

    if (!parsed?.href || parsed.href === "/admin") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function subscribeToRecentAdminRoute(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

function formatRelativeTime(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export default function ContinueWhereLeftOffPanel() {
  const recentRoute = useSyncExternalStore(
    subscribeToRecentAdminRoute,
    readRecentAdminRoute,
    () => null
  );

  const relativeTime = useMemo(() => {
    if (!recentRoute?.timestamp) {
      return null;
    }

    return formatRelativeTime(recentRoute.timestamp);
  }, [recentRoute]);

  return (
    <PanelCard
      title="Continue where you left off"
      description="Jump back into your most recent admin route."
      tone="student"
      density="compact"
      contentClassName="space-y-3"
    >
      {recentRoute ? (
        <>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  {recentRoute.title}
                </div>
                <div className="mt-1 text-sm app-text-muted">
                  {recentRoute.description}
                </div>
              </div>

              {relativeTime ? <Badge tone="muted">{relativeTime}</Badge> : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              href={recentRoute.href}
              variant="primary"
              size="sm"
              icon="next"
              iconPosition="right"
            >
              Reopen page
            </Button>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-elevated)] px-4 py-4 text-sm app-text-muted">
          Visit a course, variant, module, lesson, or other admin page to create a resume
          point here.
        </div>
      )}
    </PanelCard>
  );
}
