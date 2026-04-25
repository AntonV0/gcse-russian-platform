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
        wrapperClass: "app-feedback-banner-success",
      };

    case "warning":
      return {
        icon: "warning" as const,
        wrapperClass: "app-feedback-banner-warning",
      };

    case "danger":
      return {
        icon: "alert" as const,
        wrapperClass: "app-feedback-banner-danger",
      };

    case "info":
    default:
      return {
        icon: "info" as const,
        wrapperClass: "app-feedback-banner-info",
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
          tier="semantic"
          componentRole="Semantic feedback and guidance banner"
          bestFor="Important page-level messages, action outcomes, validation summaries, warnings, and admin/student guidance."
          usageExamples={[
            "Saved successfully banner",
            "Access required warning",
            "Mock exam still incomplete notice",
            "Teacher feedback or admin guidance",
          ]}
          notes="Use for messages that need more weight than inline helper text. Avoid using it for tiny field-level errors or decorative callouts."
        />
      ) : null}

      <div
        className={[
          "app-feedback-banner px-4 py-3.5 sm:px-5 sm:py-4",
          wrapperClass,
        ].join(" ")}
      >
        <div className="relative flex items-start gap-3">
          <div className="app-feedback-icon mt-0.5">
            <AppIcon icon={resolvedIcon} size={17} />
          </div>

          <div className="min-w-0 flex-1">
            {title ? (
              <div className="font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                {title}
              </div>
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
