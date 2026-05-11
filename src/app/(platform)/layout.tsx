import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/app-shell";
import PageContainer from "@/components/layout/page-container";
import PlatformSidebar from "@/components/layout/platform-sidebar";
import AppearancePreferenceSync from "@/components/providers/appearance-preference-sync";
import { DevMarkerProvider } from "@/components/providers/dev-marker-provider";
import {
  getCurrentAppearancePreferences,
  getCurrentProfile,
  getCurrentUser,
} from "@/lib/auth/auth";
import { getDashboardInfo } from "@/lib/dashboard/dashboard-helpers";
import { getPlatformSidebarNextUp } from "@/lib/dashboard/sidebar-next-up";
import { noIndexRobots } from "@/lib/seo/site";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [dashboard, profile, appearancePreferences] = await Promise.all([
    getDashboardInfo(),
    getCurrentProfile(),
    getCurrentAppearancePreferences(),
  ]);
  const sidebarNextUp = await getPlatformSidebarNextUp(dashboard);

  return (
    <DevMarkerProvider isAdmin={dashboard.role === "admin"}>
      <AppearancePreferenceSync
        themePreference={appearancePreferences?.theme_preference}
        accentPreference={appearancePreferences?.accent_preference}
      />
      <AppShell user={{ email: user.email, variant: dashboard.variant }}>
        <PageContainer>
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <div className="lg:sticky lg:top-[var(--sticky-site-offset)] lg:max-h-[calc(100dvh-var(--sticky-site-offset)-1rem)] lg:self-start">
              <PlatformSidebar
                role={dashboard.role}
                accessMode={dashboard.accessMode}
                variant={dashboard.variant}
                userEmail={user.email}
                userDisplayName={profile?.display_name || profile?.full_name}
                userAvatarKey={profile?.avatar_key}
                userAvatarBackgroundKey={profile?.avatar_background_key}
                userAvatarFrameKey={profile?.equipped_avatar_frame_key}
                nextUp={sidebarNextUp}
              />
            </div>

            <section className="min-w-0">{children}</section>
          </div>
        </PageContainer>
      </AppShell>
    </DevMarkerProvider>
  );
}
