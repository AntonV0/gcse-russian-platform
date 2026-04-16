import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { getAccountPath, getCoursesPath, getDashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/layout/logout-button";
import ThemeToggle from "@/components/ui/theme-toggle";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "GCSE Russian Course Platform",
  description: "Online GCSE Russian learning platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    const stored = localStorage.getItem("theme");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (system ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <div className="flex min-h-screen flex-col">
          <SiteHeader user={user} />

          <main className="app-page flex-1">{children}</main>

          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
