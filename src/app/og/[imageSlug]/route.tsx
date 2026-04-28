import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import {
  BRANDED_OG_BACKGROUND_PATH,
  BrandedOgImage,
} from "@/lib/seo/branded-og-template";
import { getOgImageDefinition } from "@/lib/seo/og-images";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageSlug: string }> }
) {
  const { imageSlug } = await params;
  const image = getOgImageDefinition(imageSlug);

  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  if (imageSlug === "course") {
    const backgroundImageUrl = new URL(
      BRANDED_OG_BACKGROUND_PATH,
      request.url
    ).toString();

    return new ImageResponse(
      <BrandedOgImage
        backgroundImageUrl={backgroundImageUrl}
        eyebrow="Pearson Edexcel 1RU0"
        title={image.title}
        description="Structured lessons, vocabulary, grammar, exam practice, and progress."
        badges={["Foundation + Higher", "Course dashboard", "Exam-focused"]}
      />,
      size
    );
  }

  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#f8fafc",
        color: "#172033",
        display: "flex",
        height: "100%",
        padding: "58px",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "2px solid #d8e1ec",
          borderRadius: "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "54px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: image.softAccent,
            borderRadius: "999px",
            height: "340px",
            position: "absolute",
            right: "-120px",
            top: "-130px",
            width: "340px",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            style={{
              alignItems: "center",
              color: image.accent,
              display: "flex",
              fontSize: 30,
              fontWeight: 800,
              gap: "14px",
              letterSpacing: 0,
            }}
          >
            <div
              style={{
                background: image.accent,
                borderRadius: "16px",
                height: "34px",
                width: "34px",
              }}
            />
            {image.kicker}
          </div>
          <div
            style={{
              fontSize: 70,
              fontWeight: 850,
              letterSpacing: 0,
              lineHeight: 1.03,
              maxWidth: 930,
            }}
          >
            {image.title}
          </div>
          <div
            style={{
              color: "#526173",
              fontSize: 31,
              lineHeight: 1.32,
              maxWidth: 930,
            }}
          >
            {image.description}
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            borderTop: "2px solid #e5ebf2",
            color: "#526173",
            display: "flex",
            fontSize: 25,
            fontWeight: 650,
            justifyContent: "space-between",
            paddingTop: "28px",
          }}
        >
          <span>GCSE Russian</span>
          <span>www.gcserussian.com</span>
        </div>
      </div>
    </div>,
    size
  );
}
