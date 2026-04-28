import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import {
  BRANDED_OG_BACKGROUND_PATH,
  BrandedOgImage,
} from "@/lib/seo/branded-og-template";

export const runtime = "edge";

export const alt = "GCSE Russian online course";
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
      eyebrow="Pearson Edexcel 1RU0"
      title="Online GCSE Russian Course"
      description="Structured lessons, vocabulary, grammar, exam practice, and progress."
      badges={["Foundation + Higher", "Course dashboard", "Exam-focused"]}
    />,
    size
  );
}
