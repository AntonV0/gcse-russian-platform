import type { Metadata } from "next";
import { getDefaultActiveCourseSlug } from "@/lib/courses/active-course";

export type SiteConfig = {
  publicSiteUrl: string;
  appSiteUrl: string;
  publicSiteName: string;
  appName: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgTitle: string;
  defaultOgDescription: string;
  defaultOgImagePath: string;
  defaultOgImageAlt: string;
  courseSlug: string;
  languageName: string;
  qualificationLabel: string;
  examBoardLabel: string;
  curriculumCode: string;
};

export type BuildPublicMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImagePath?: string;
  ogImageAlt?: string;
};

const GCSE_RUSSIAN_SITE_CONFIG = {
  publicSiteUrl: "https://www.gcserussian.com",
  appSiteUrl: "https://app.gcserussian.com",
  publicSiteName: "GCSE Russian",
  appName: "GCSE Russian",
  defaultSeoTitle: "GCSE Russian Online Course",
  defaultSeoDescription:
    "Structured online GCSE Russian learning for Pearson Edexcel 1RU0 students, with lessons, vocabulary, grammar, exam practice, and progress tracking.",
  defaultOgTitle: "Online GCSE Russian Course",
  defaultOgDescription:
    "Structured lessons, vocabulary, grammar, exam practice, and progress.",
  defaultOgImagePath: "/og/default",
  defaultOgImageAlt: "GCSE Russian online course",
  courseSlug: getDefaultActiveCourseSlug(),
  languageName: "Russian",
  qualificationLabel: "GCSE",
  examBoardLabel: "Pearson Edexcel",
  curriculumCode: "1RU0",
} satisfies SiteConfig;

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  ...GCSE_RUSSIAN_SITE_CONFIG,
  publicSiteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? GCSE_RUSSIAN_SITE_CONFIG.publicSiteUrl,
  appSiteUrl: process.env.NEXT_PUBLIC_APP_URL ?? GCSE_RUSSIAN_SITE_CONFIG.appSiteUrl,
};

function normalizeUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function getDefaultSiteConfig() {
  return DEFAULT_SITE_CONFIG;
}

export function getPublicSiteUrl(path = "/") {
  return new URL(normalizePath(path), normalizeUrl(getDefaultSiteConfig().publicSiteUrl));
}

export function getAppSiteUrl(path = "/") {
  return new URL(normalizePath(path), normalizeUrl(getDefaultSiteConfig().appSiteUrl));
}

export function buildPublicMetadata({
  title = DEFAULT_SITE_CONFIG.defaultSeoTitle,
  description = DEFAULT_SITE_CONFIG.defaultSeoDescription,
  path = "/",
  ogTitle,
  ogDescription,
  ogImagePath = DEFAULT_SITE_CONFIG.defaultOgImagePath,
  ogImageAlt = DEFAULT_SITE_CONFIG.defaultOgImageAlt,
}: BuildPublicMetadataOptions = {}): Metadata {
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
      siteName: DEFAULT_SITE_CONFIG.publicSiteName,
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
