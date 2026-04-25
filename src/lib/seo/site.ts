import type { Metadata } from "next";

export const PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gcserussian.com";

export const APP_SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.gcserussian.com";

export const PUBLIC_SITE_NAME = "GCSE Russian";

export const DEFAULT_SEO_TITLE = "GCSE Russian Online Course";

export const DEFAULT_SEO_DESCRIPTION =
  "Structured online GCSE Russian learning for Pearson Edexcel 1RU0 students, with lessons, vocabulary, grammar, exam practice, and progress tracking.";

export const DEFAULT_OG_IMAGE_PATH = "/og/default";

function normalizeUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getPublicSiteUrl(path = "/") {
  const baseUrl = normalizeUrl(PUBLIC_SITE_URL);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalizedPath, baseUrl);
}

export function getAppSiteUrl(path = "/") {
  const baseUrl = normalizeUrl(APP_SITE_URL);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalizedPath, baseUrl);
}

export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

export function buildPublicMetadata({
  title = DEFAULT_SEO_TITLE,
  description = DEFAULT_SEO_DESCRIPTION,
  path = "/",
}: {
  title?: string;
  description?: string;
  path?: string;
} = {}): Metadata {
  const url = getPublicSiteUrl(path);
  const imageUrl = getPublicSiteUrl(DEFAULT_OG_IMAGE_PATH);

  return {
    metadataBase: getPublicSiteUrl(),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: PUBLIC_SITE_NAME,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "GCSE Russian online course",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
