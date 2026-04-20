"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

type AppShellProps = {
  user: {
    email?: string | null;
  } | null;
  children: React.ReactNode;
};

export default function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user} />

      <main className={isAdminRoute ? "flex-1" : "app-shell-main flex-1"}>
        {children}
      </main>

      {!isAdminRoute ? <SiteFooter /> : null}
    </div>
  );
}
