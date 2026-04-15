import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { getAccountPath, getCoursesPath, getDashboardPath } from "@/lib/routes";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/layout/logout-button";
import ThemeToggle from "@/components/ui/theme-toggle";

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
        <header className="border-b app-surface">
          <div className="app-page flex items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold app-brand-text">
              GCSE Russian
            </Link>

            <nav className="flex items-center gap-3 text-sm">
              <Link href="/" className="app-nav-link">
                Home
              </Link>
              <Link href={getDashboardPath()} className="app-nav-link">
                Dashboard
              </Link>
              <Link href={getCoursesPath()} className="app-nav-link">
                Courses
              </Link>
              <Link href={getAccountPath()} className="app-nav-link">
                Account
              </Link>

              <ThemeToggle />

              {user ? (
                <>
                  <span className="app-text-soft">{user.email}</span>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="app-nav-link">
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="app-btn-base app-btn-primary px-3 py-1.5 text-sm"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="app-page">{children}</main>
      </body>
    </html>
  );
}
