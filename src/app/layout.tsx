import "./globals.css";
import type { Metadata } from "next";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";
import AppShell from "@/components/layout/app-shell";
import { DevMarkerProvider } from "@/components/providers/dev-marker-provider";
import {
  ThemeProvider,
  type AccentPreference,
  type ThemePreference,
} from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "GCSE Russian Course Platform",
  description: "Online GCSE Russian learning platform",
};

function getThemePreference(value: unknown): ThemePreference | null {
  return value === "light" || value === "dark" || value === "system" ? value : null;
}

function getAccentPreference(value: unknown): AccentPreference | null {
  return value === "blue" ||
    value === "purple" ||
    value === "pink" ||
    value === "red" ||
    value === "orange" ||
    value === "yellow" ||
    value === "green" ||
    value === "teal" ||
    value === "brown" ||
    value === "slate"
    ? value
    : null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  const isAdmin = Boolean(profile?.is_admin);
  const initialThemePreference = getThemePreference(profile?.theme_preference);
  const initialAccentPreference = getAccentPreference(profile?.accent_preference);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    const profileTheme = ${JSON.stringify(initialThemePreference)};
    const stored = localStorage.getItem("theme");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const preference =
      profileTheme === "light" || profileTheme === "dark" || profileTheme === "system"
        ? profileTheme
        : stored;
    const theme =
      preference === "light" || preference === "dark"
        ? preference
        : system
          ? "dark"
          : "light";
    document.documentElement.setAttribute("data-theme", theme);
    if (profileTheme === "light" || profileTheme === "dark" || profileTheme === "system") {
      localStorage.setItem("theme", profileTheme);
    }
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
    const profileAccent = ${JSON.stringify(initialAccentPreference)};
    const storedAccent = localStorage.getItem("accent");
    const accent =
      accentOptions.has(profileAccent)
        ? profileAccent
        : accentOptions.has(storedAccent)
          ? storedAccent
          : "blue";
    document.documentElement.setAttribute(
      "data-accent",
      accent
    );
    localStorage.setItem("accent", accent);
  } catch (e) {}
})();
`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <ThemeProvider
          initialThemePreference={initialThemePreference}
          initialAccentPreference={initialAccentPreference}
        >
          <DevMarkerProvider isAdmin={isAdmin}>
            <AppShell user={user}>{children}</AppShell>
          </DevMarkerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
