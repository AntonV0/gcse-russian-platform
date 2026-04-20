"use client";

import AppIcon, { type AppIconValue } from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: AppIconValue;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function EmptyState({
  title,
  description,
  action,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="EmptyState"
          filePath="src/components/ui/empty-state.tsx"
        />
      ) : null}

      <div
        className={[
          "relative overflow-hidden rounded-[1.75rem] border border-dashed border-[var(--border)]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(238,243,249,0.88)_100%)]",
          "px-6 py-9 text-center shadow-[0_10px_24px_rgba(16,32,51,0.04)]",
          "[data-theme='dark']:&:border-[rgba(118,167,255,0.14)]",
          "[data-theme='dark']:&:bg-[linear-gradient(180deg,rgba(9,23,47,0.9)_0%,rgba(20,35,61,0.92)_100%)]",
          "[data-theme='dark']:&:shadow-[0_14px_28px_rgba(0,0,0,0.22)]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(37,99,235,0.05)_0%,rgba(37,99,235,0)_100%)] [data-theme='dark']:&:bg-[linear-gradient(180deg,rgba(79,140,255,0.08)_0%,rgba(79,140,255,0)_100%)]" />

        {icon ? (
          <div className="relative mb-5 flex justify-center">
            <span
              className={[
                "inline-flex h-14 w-14 items-center justify-center rounded-[1.15rem]",
                "border border-[rgba(37,99,235,0.12)]",
                "bg-[linear-gradient(135deg,var(--brand-blue-soft)_0%,rgba(255,255,255,0.98)_100%)]",
                "text-[var(--brand-blue)] shadow-[0_8px_18px_rgba(37,99,235,0.10)]",
                "[data-theme='dark']:&:border-[rgba(118,167,255,0.16)]",
                "[data-theme='dark']:&:bg-[linear-gradient(135deg,rgba(79,140,255,0.22)_0%,rgba(24,43,72,0.98)_100%)]",
                "[data-theme='dark']:&:text-[#dbeafe]",
              ].join(" ")}
            >
              <AppIcon icon={icon} size={22} />
            </span>
          </div>
        ) : null}

        <div className="relative mx-auto max-w-[32rem]">
          <div className="text-[1.15rem] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
            {title}
          </div>

          {description ? (
            <p className="mt-2 text-sm leading-6 app-text-muted">{description}</p>
          ) : null}

          {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
