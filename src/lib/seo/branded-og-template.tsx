const brand = {
  background: "#f6f8fb",
  navy: "#102033",
  textMuted: "#526377",
  textSoft: "#6f8095",
  border: "#d8e1eb",
  borderSubtle: "#e4ecf5",
  accent: "#2563eb",
  accentStrong: "#1d4ed8",
  red: "#d94b52",
};

export const BRANDED_OG_BACKGROUND_PATH = "/brand/og/default-course-platform-v1.png";

type BrandedOgImageProps = {
  backgroundImageUrl: string;
  eyebrow: string;
  title: string;
  description: string;
  badges: string[];
};

function LogoUnderline() {
  return (
    <svg
      width="292"
      height="22"
      viewBox="0 0 260 20"
      style={{
        display: "flex",
        marginTop: 5,
      }}
    >
      <path
        d="M5 7.5H176C188 7.5 194 8.6 201 15.8C208 8.6 214 7.5 226 7.5H255"
        fill="none"
        stroke={brand.accent}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
    </svg>
  );
}

function Wordmark() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          alignItems: "baseline",
          display: "flex",
          fontSize: 42,
          fontWeight: 790,
          letterSpacing: 0,
          lineHeight: 0.95,
        }}
      >
        <span style={{ color: brand.navy }}>GCSE</span>
        <span style={{ color: brand.accentStrong, marginLeft: 0 }}>Russian</span>
        <span
          style={{
            color: brand.textSoft,
            fontSize: 31,
            fontWeight: 680,
            marginLeft: 1,
          }}
        >
          .com
        </span>
      </div>
      <LogoUnderline />
    </div>
  );
}

export function BrandedOgImage({
  backgroundImageUrl,
  eyebrow,
  title,
  description,
  badges,
}: BrandedOgImageProps) {
  return (
    <div
      style={{
        background: brand.background,
        color: brand.navy,
        display: "flex",
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders raw image elements. */}
      <img
        alt=""
        height="630"
        src={backgroundImageUrl}
        style={{
          display: "flex",
          height: "100%",
          left: 0,
          objectFit: "cover",
          position: "absolute",
          top: 0,
          width: "100%",
        }}
        width="1200"
      />

      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(246, 248, 251, 0.98) 0%, rgba(246, 248, 251, 0.92) 42%, rgba(246, 248, 251, 0.5) 66%, rgba(246, 248, 251, 0.08) 100%)",
          display: "flex",
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "58px 64px 52px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 48,
            maxWidth: 625,
          }}
        >
          <Wordmark />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div
              style={{
                alignItems: "center",
                alignSelf: "flex-start",
                background: "rgba(255, 255, 255, 0.78)",
                border: `2px solid ${brand.borderSubtle}`,
                borderRadius: 999,
                color: brand.accentStrong,
                display: "flex",
                fontSize: 24,
                fontWeight: 740,
                gap: 10,
                padding: "10px 16px",
              }}
            >
              <div
                style={{
                  background: brand.red,
                  borderRadius: 999,
                  display: "flex",
                  height: 12,
                  width: 12,
                }}
              />
              {eyebrow}
            </div>

            <div
              style={{
                color: brand.navy,
                fontSize: 74,
                fontWeight: 850,
                letterSpacing: 0,
                lineHeight: 1.02,
                maxWidth: 620,
              }}
            >
              {title}
            </div>

            <div
              style={{
                color: brand.textMuted,
                fontSize: 30,
                lineHeight: 1.32,
                maxWidth: 590,
              }}
            >
              {description}
            </div>
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: 14,
          }}
        >
          {badges.map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255, 255, 255, 0.78)",
                border: `2px solid ${brand.border}`,
                borderRadius: 999,
                color: brand.textMuted,
                display: "flex",
                flexShrink: 0,
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1,
                padding: "12px 16px",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            background: brand.accent,
            bottom: 0,
            display: "flex",
            height: 8,
            left: 0,
            position: "absolute",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}
