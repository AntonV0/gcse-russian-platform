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
  ogTitle,
  ogDescription,
  ogImagePath = DEFAULT_OG_IMAGE_PATH,
  ogImageAlt = "GCSE Russian online course",
}: {
  title?: string;
  description?: string;
  path?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImagePath?: string;
  ogImageAlt?: string;
} = {}): Metadata {
  const url = getPublicSiteUrl(path);
  const imageUrl = getPublicSiteUrl(ogImagePath);
  const socialTitle = ogTitle ?? title;
  const socialDescription = ogDescription ?? description;

  return {
    metadataBase: getPublicSiteUrl(),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url,
      siteName: PUBLIC_SITE_NAME,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [imageUrl],
    },
  };
}
