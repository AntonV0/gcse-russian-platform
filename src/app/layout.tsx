import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { cookies } from "next/headers";
import {
  APP_NAME,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  PUBLIC_SITE_NAME,
  getPublicSiteUrl,
} from "@/lib/seo/site";
import {
  ThemeProvider,
  type AccentPreference,
  type ThemeMode,
  type ThemePreference,
} from "@/components/providers/theme-provider";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-app",
});

export const metadata: Metadata = {
  metadataBase: getPublicSiteUrl(),
  applicationName: APP_NAME,
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
        alt: DEFAULT_OG_IMAGE_ALT,
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

const ACCENT_OPTIONS = new Set<AccentPreference>([
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

function readThemePreference(value: string | undefined): ThemePreference {
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

function readAccentPreference(value: string | undefined): AccentPreference {
  return ACCENT_OPTIONS.has(value as AccentPreference)
    ? (value as AccentPreference)
    : "blue";
}

function resolveInitialTheme(preference: ThemePreference): ThemeMode {
  return preference === "dark" ? "dark" : "light";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialThemePreference = readThemePreference(cookieStore.get("theme")?.value);
  const initialAccentPreference = readAccentPreference(cookieStore.get("accent")?.value);
  const initialTheme = resolveInitialTheme(initialThemePreference);

  return (
    <html
      lang="en"
      className={manrope.variable}
      data-scroll-behavior="smooth"
      data-theme={initialTheme}
      data-accent={initialAccentPreference}
      suppressHydrationWarning
    >
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
      </head>
      <body className="min-h-screen">
        <ThemeProvider
          initialThemePreference={initialThemePreference}
          initialAccentPreference={initialAccentPreference}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
