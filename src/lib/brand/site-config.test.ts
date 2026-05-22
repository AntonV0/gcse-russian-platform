import { afterEach, describe, expect, it, vi } from "vitest";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

async function loadSiteConfigWithDefaultEnv() {
  vi.resetModules();
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_APP_URL;

  return import("./site-config");
}

afterEach(() => {
  if (originalSiteUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  }

  if (originalAppUrl === undefined) {
    delete process.env.NEXT_PUBLIC_APP_URL;
  } else {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  }

  vi.resetModules();
});

describe("site config", () => {
  it("keeps the default public and app origins as GCSE Russian domains", async () => {
    const { getDefaultSiteConfig } = await loadSiteConfigWithDefaultEnv();

    expect(getDefaultSiteConfig().publicSiteUrl).toBe("https://www.gcserussian.com");
    expect(getDefaultSiteConfig().appSiteUrl).toBe("https://app.gcserussian.com");
  });

  it("builds canonical public URLs from paths with or without a leading slash", async () => {
    const { getPublicSiteUrl } = await loadSiteConfigWithDefaultEnv();

    expect(getPublicSiteUrl("gcse-russian-course").toString()).toBe(
      "https://www.gcserussian.com/gcse-russian-course"
    );
    expect(getPublicSiteUrl("/sitemap.xml").toString()).toBe(
      "https://www.gcserussian.com/sitemap.xml"
    );
  });

  it("builds app URLs from the default app origin", async () => {
    const { getAppSiteUrl } = await loadSiteConfigWithDefaultEnv();

    expect(getAppSiteUrl("/dashboard").toString()).toBe(
      "https://app.gcserussian.com/dashboard"
    );
  });

  it("preserves the default GCSE Russian metadata values", async () => {
    const { buildPublicMetadata } = await loadSiteConfigWithDefaultEnv();
    const metadata = buildPublicMetadata();

    expect(metadata.title).toBe("GCSE Russian Online Course");
    expect(metadata.description).toBe(
      "Structured online GCSE Russian learning for Pearson Edexcel 1RU0 students, with lessons, vocabulary, grammar, exam practice, and progress tracking."
    );
    expect(String(metadata.metadataBase)).toBe("https://www.gcserussian.com/");
    expect(String(metadata.alternates?.canonical)).toBe("https://www.gcserussian.com/");
    expect(metadata.openGraph?.siteName).toBe("GCSE Russian");
  });
});
