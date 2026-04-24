import "./globals.css";
import type { Metadata } from "next";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";
import AppShell from "@/components/layout/app-shell";
import { DevMarkerProvider } from "@/components/providers/dev-marker-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

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
  const profile = user ? await getCurrentProfile() : null;
  const isAdmin = Boolean(profile?.is_admin);

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
    const theme =
      stored === "light" || stored === "dark"
        ? stored
        : system
          ? "dark"
          : "light";
    document.documentElement.setAttribute("data-theme", theme);
    const accentOptions = new Set([
      "blue",
      "purple",
      "pink",
      "red",
      "orange",
      "yellow",
      "green",
      "teal",
      "brown",
      "slate",
    ]);
    const storedAccent = localStorage.getItem("accent");
    document.documentElement.setAttribute(
      "data-accent",
      accentOptions.has(storedAccent) ? storedAccent : "blue"
    );
  } catch (e) {}
})();
`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <DevMarkerProvider isAdmin={isAdmin}>
            <AppShell user={user}>{children}</AppShell>
          </DevMarkerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
