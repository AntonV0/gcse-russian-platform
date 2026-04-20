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
          "border-[rgba(31,138,76,0.24)]",
          "bg-[linear-gradient(135deg,rgba(31,138,76,0.14)_0%,rgba(31,138,76,0.05)_100%)]",
          "text-[var(--success)]",
          "shadow-[0_10px_24px_rgba(31,138,76,0.08)]",
        ].join(" "),
      };

    case "warning":
      return {
        icon: "warning" as const,
        wrapperClass: [
          "border-[rgba(183,121,31,0.26)]",
          "bg-[linear-gradient(135deg,rgba(183,121,31,0.14)_0%,rgba(183,121,31,0.05)_100%)]",
          "text-[var(--warning)]",
          "shadow-[0_10px_24px_rgba(183,121,31,0.08)]",
        ].join(" "),
      };

    case "danger":
      return {
        icon: "alert" as const,
        wrapperClass: [
          "border-[rgba(194,59,59,0.24)]",
          "bg-[linear-gradient(135deg,rgba(194,59,59,0.14)_0%,rgba(194,59,59,0.05)_100%)]",
          "text-[var(--danger)]",
          "shadow-[0_10px_24px_rgba(194,59,59,0.08)]",
        ].join(" "),
      };

    case "info":
    default:
      return {
        icon: "info" as const,
        wrapperClass: [
          "border-[rgba(37,99,235,0.22)]",
          "bg-[linear-gradient(135deg,rgba(37,99,235,0.14)_0%,rgba(37,99,235,0.05)_100%)]",
          "text-[var(--info)]",
          "shadow-[0_10px_24px_rgba(37,99,235,0.08)]",
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
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="FeedbackBanner"
          filePath="src/components/ui/feedback-banner.tsx"
        />
      ) : null}

      <div
        className={[
          "relative overflow-hidden rounded-[1.6rem] border px-5 py-4",
          "backdrop-blur-[1px]",
          wrapperClass,
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)]" />

        <div className="relative flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <AppIcon icon={resolvedIcon} size={18} />
          </div>

          <div className="min-w-0">
            {title ? (
              <div className="font-semibold tracking-[-0.01em]">{title}</div>
            ) : null}

            {description ? (
              <p className={[title ? "mt-1" : "", "text-sm leading-6"].join(" ")}>
                {description}
              </p>
            ) : null}

            {children ? (
              <div className={title || description ? "mt-3" : ""}>{children}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
