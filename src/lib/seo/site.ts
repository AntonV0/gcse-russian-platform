import type { Metadata } from "next";
import {
  DEFAULT_SITE_CONFIG,
  buildPublicMetadata,
  getAppSiteUrl,
  getDefaultSiteConfig,
  getPublicSiteUrl,
} from "@/lib/brand/site-config";

export const PUBLIC_SITE_URL = DEFAULT_SITE_CONFIG.publicSiteUrl;

export const APP_SITE_URL = DEFAULT_SITE_CONFIG.appSiteUrl;

export const APP_NAME = DEFAULT_SITE_CONFIG.appName;

export const PUBLIC_SITE_NAME = DEFAULT_SITE_CONFIG.publicSiteName;

export const DEFAULT_SEO_TITLE = DEFAULT_SITE_CONFIG.defaultSeoTitle;

export const DEFAULT_SEO_DESCRIPTION = DEFAULT_SITE_CONFIG.defaultSeoDescription;

export const DEFAULT_OG_IMAGE_PATH = DEFAULT_SITE_CONFIG.defaultOgImagePath;

export const DEFAULT_OG_IMAGE_ALT = DEFAULT_SITE_CONFIG.defaultOgImageAlt;

export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

export { buildPublicMetadata, getAppSiteUrl, getDefaultSiteConfig, getPublicSiteUrl };
