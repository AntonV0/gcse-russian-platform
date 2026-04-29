"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type AppShellProps = {
  user: {
    email?: string | null;
  } | null;
  children: React.ReactNode;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const isMarketingRoute =
    pathname.startsWith("/marketing") || pathname === "/login" || pathname === "/signup";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isMarketingRoute) {
    return <>{children}</>;
  }

  return (
    <div className="dev-marker-host relative flex min-h-screen flex-col">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="AppShell"
          filePath="src/components/layout/app-shell.tsx"
          tier="layout"
          componentRole="Platform-wide application shell with shared public header, main content area, and footer behaviour"
          bestFor="Top-level platform screens that need consistent chrome around student, public, and admin routes."
          usageExamples={[
            "Student dashboard shell",
            "Course/module/lesson pages",
            "Pricing and account pages",
            "Admin route chrome handling",
          ]}
          notes="Use only at the route-layout boundary. Do not use it inside page sections or nested feature panels."
        />
      ) : null}

      <SiteHeader user={user} />

      <div className={isAdminRoute ? "flex-1" : "app-shell-main flex-1"}>
        {children}
      </div>

      <SiteFooter />
    </div>
  );
}
