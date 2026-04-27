import "./globals.css";
import type { Metadata } from "next";
import {
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  PUBLIC_SITE_NAME,
  getPublicSiteUrl,
} from "@/lib/seo/site";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  metadataBase: getPublicSiteUrl(),
  applicationName: PUBLIC_SITE_NAME,
  title: {
    default: DEFAULT_SEO_TITLE,
    template: `%s | ${PUBLIC_SITE_NAME}`,
  },
  description: DEFAULT_SEO_DESCRIPTION,
  openGraph: {
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
    siteName: PUBLIC_SITE_NAME,
    type: "website",
    images: [
      {
        url: getPublicSiteUrl(DEFAULT_OG_IMAGE_PATH),
        width: 1200,
        height: 630,
        alt: "GCSE Russian online course",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
    images: [getPublicSiteUrl(DEFAULT_OG_IMAGE_PATH)],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/brand/logo-final/favicon-r-light-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/brand/logo-final/favicon-r-dark-32.png"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/brand/logo-final/favicon-r-light-180.png"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    const profileTheme = null;
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
    const profileAccent = null;
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
