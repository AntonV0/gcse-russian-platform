"use client";

import AppIcon, { type AppIconValue } from "@/components/ui/app-icon";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type EmptyStateIconTone =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "inverse";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: AppIconValue;
  iconTone?: EmptyStateIconTone;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getIconToneClass(iconTone: EmptyStateIconTone) {
  switch (iconTone) {
    case "brand":
      return "app-empty-icon app-empty-icon-brand";
    case "success":
      return "app-empty-icon app-empty-icon-success";
    case "warning":
      return "app-empty-icon app-empty-icon-warning";
    case "danger":
      return "app-empty-icon app-empty-icon-danger";
    case "inverse":
      return "app-empty-icon app-empty-icon-inverse";
    case "default":
    default:
      return "app-empty-icon app-empty-icon-default";
  }
}

export default function EmptyState({
  title,
  description,
  action,
  className,
  icon,
  iconTone = "default",
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
          "bg-[linear-gradient(180deg,var(--background-elevated)_0%,var(--background-muted)_100%)]",
          "px-6 py-9 text-center shadow-[0_10px_24px_rgba(16,32,51,0.05)]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(37,99,235,0.06)_0%,rgba(37,99,235,0)_100%)]" />

        {icon ? (
          <div className="relative mb-5 flex justify-center">
            <span className={getIconToneClass(iconTone)}>
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
