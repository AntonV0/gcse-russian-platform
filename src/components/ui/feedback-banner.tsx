"use client";

import AppIcon from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type { AppIconValue } from "@/components/ui/app-icon";

type FeedbackBannerTone = "info" | "success" | "warning" | "danger";

type FeedbackBannerProps = {
  tone?: FeedbackBannerTone;
  title?: string;
  description?: string;
  icon?: AppIconValue;
  children?: React.ReactNode;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getToneConfig(tone: FeedbackBannerTone) {
  switch (tone) {
    case "success":
      return {
        icon: "completed" as const,
        wrapperClass: [
          "border-[color:rgba(31,138,76,0.18)]",
          "bg-[var(--success-soft)]",
          "text-[var(--success)]",
          "[data-theme='dark']:&:border-[rgba(34,197,94,0.22)]",
          "[data-theme='dark']:&:bg-[linear-gradient(135deg,rgba(34,197,94,0.18)_0%,rgba(16,46,31,0.96)_100%)]",
          "[data-theme='dark']:&:text-[#86efac]",
        ].join(" "),
      };

    case "warning":
      return {
        icon: "warning" as const,
        wrapperClass: [
          "border-[color:rgba(183,121,31,0.18)]",
          "bg-[var(--warning-soft)]",
          "text-[var(--warning)]",
          "[data-theme='dark']:&:border-[rgba(245,158,11,0.24)]",
          "[data-theme='dark']:&:bg-[linear-gradient(135deg,rgba(245,158,11,0.18)_0%,rgba(61,38,10,0.96)_100%)]",
          "[data-theme='dark']:&:text-[#fbbf24]",
        ].join(" "),
      };

    case "danger":
      return {
        icon: "alert" as const,
        wrapperClass: [
          "border-[color:rgba(194,59,59,0.18)]",
          "bg-[var(--danger-soft)]",
          "text-[var(--danger)]",
          "[data-theme='dark']:&:border-[rgba(239,68,68,0.22)]",
          "[data-theme='dark']:&:bg-[linear-gradient(135deg,rgba(239,68,68,0.18)_0%,rgba(66,22,28,0.96)_100%)]",
          "[data-theme='dark']:&:text-[#fca5a5]",
        ].join(" "),
      };

    case "info":
    default:
      return {
        icon: "info" as const,
        wrapperClass: [
          "border-[color:rgba(37,99,235,0.18)]",
          "bg-[var(--info-soft)]",
          "text-[var(--info)]",
          "[data-theme='dark']:&:border-[rgba(118,167,255,0.2)]",
          "[data-theme='dark']:&:bg-[linear-gradient(135deg,rgba(118,167,255,0.22)_0%,rgba(23,42,70,0.98)_100%)]",
          "[data-theme='dark']:&:text-[#dce9ff]",
        ].join(" "),
      };
  }
}

export default function FeedbackBanner({
  tone = "info",
  title,
  description,
  icon,
  children,
  className,
}: FeedbackBannerProps) {
  const { icon: defaultIcon, wrapperClass } = getToneConfig(tone);
  const resolvedIcon = icon ?? defaultIcon;

  return (
    <div
      className={[
        "dev-marker-host",
        "relative rounded-2xl border px-4 py-4 shadow-[0_8px_20px_rgba(16,32,51,0.05)]",
        wrapperClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="FeedbackBanner"
          filePath="src/components/ui/feedback-banner.tsx"
        />
      ) : null}

      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <AppIcon icon={resolvedIcon} size={18} />
        </div>

        <div className="min-w-0">
          {title ? <div className="font-semibold">{title}</div> : null}

          {description ? (
            <p className={title ? "mt-1 text-sm opacity-90" : "text-sm opacity-90"}>
              {description}
            </p>
          ) : null}

          {children ? (
            <div className={title || description ? "mt-2 text-sm opacity-95" : "text-sm"}>
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
