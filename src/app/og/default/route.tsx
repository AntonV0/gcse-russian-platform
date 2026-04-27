import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "GCSE Russian online course";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#f8fafc",
        color: "#172033",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "2px solid #d8e1ec",
          borderRadius: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          padding: "64px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#3563d8",
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: 0,
          }}
        >
          GCSE Russian
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: 0,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Online GCSE Russian Course
        </div>
        <div
          style={{
            color: "#526173",
            fontSize: 32,
            lineHeight: 1.35,
            maxWidth: 920,
          }}
        >
          Pearson Edexcel 1RU0 lessons, vocabulary, grammar, exam practice, and progress
          tracking.
        </div>
      </div>
    </div>,
    size
  );
}
