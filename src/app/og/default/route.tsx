import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import {
  BRANDED_OG_BACKGROUND_PATH,
  BrandedOgImage,
} from "@/lib/seo/branded-og-template";
import { getDefaultSiteConfig } from "@/lib/brand/site-config";

export const runtime = "edge";

const siteConfig = getDefaultSiteConfig();

export const alt = siteConfig.defaultOgImageAlt;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export function GET(request: NextRequest) {
  const backgroundImageUrl = new URL(BRANDED_OG_BACKGROUND_PATH, request.url).toString();

  return new ImageResponse(
    <BrandedOgImage
      backgroundImageUrl={backgroundImageUrl}
      eyebrow={`${siteConfig.examBoardLabel} ${siteConfig.curriculumCode}`}
      title={siteConfig.defaultOgTitle}
      description={siteConfig.defaultOgDescription}
      badges={["Foundation + Higher", "Course dashboard", "Exam-focused"]}
    />,
    size
  );
}
