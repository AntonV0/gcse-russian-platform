"use client";

import DevComponentMarker from "@/components/ui/dev-component-marker";

type PageIntroPanelTone = "admin" | "student" | "brand" | "neutral";

type PageIntroPanelProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  tone?: PageIntroPanelTone;
  className?: string;
  contentClassName?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

function getToneClass(tone: PageIntroPanelTone) {
  switch (tone) {
    case "brand":
      return [
        "border border-[var(--border-subtle)]",
        "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-blue)_8%,transparent)_0%,color-mix(in_srgb,var(--background-elevated)_98.5%,transparent)_52%,color-mix(in_srgb,var(--brand-red)_5%,transparent)_100%)]",
        "shadow-[0_16px_34px_color-mix(in_srgb,var(--text-primary)_8%,transparent)]",
      ].join(" ");

    case "student":
      return [
        "border border-[var(--border-subtle)]",
        "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-blue)_6%,transparent)_0%,color-mix(in_srgb,var(--background-elevated)_98.5%,transparent)_48%,color-mix(in_srgb,var(--brand-red)_4%,transparent)_100%)]",
        "shadow-[0_14px_30px_color-mix(in_srgb,var(--text-primary)_7%,transparent)]",
      ].join(" ");

    case "neutral":
      return [
        "border border-[var(--border-subtle)]",
        "bg-[var(--background-elevated)]",
        "shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_6%,transparent)]",
      ].join(" ");

    case "admin":
    default:
      return [
        "border border-[var(--border-subtle)]",
        "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand-blue)_4%,transparent)_0%,var(--background-elevated)_100%)]",
        "shadow-[0_12px_28px_color-mix(in_srgb,var(--text-primary)_6%,transparent)]",
      ].join(" ");
  }
}

export default function PageIntroPanel({
  title,
  description,
  eyebrow,
  badges,
  actions,
  children,
  tone = "admin",
  className,
  contentClassName,
}: PageIntroPanelProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="PageIntroPanel"
          filePath="src/components/ui/page-intro-panel.tsx"
          tier="container"
          componentRole="Premium top-of-page context panel"
          bestFor="Important page introductions that need title, explanation, badges, actions, and optional supporting content."
          usageExamples={[
            "Student dashboard intro",
            "Admin overview header",
            "Course landing context panel",
            "Upgrade or access explanation panel",
          ]}
          notes="Use this when a page needs more presence than PageHeader. Avoid using it repeatedly on the same page or for small subsections."
        />
      ) : null}

      <section
        className={[
          "overflow-hidden rounded-[1.5rem] px-5 py-5 md:px-6 md:py-6",
          getToneClass(tone),
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            {eyebrow ? (
              <div className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] app-text-soft">
                {eyebrow}
              </div>
            ) : null}

            <h1 className={eyebrow ? "mt-2.5 app-title" : "app-title"}>{title}</h1>

            {description ? (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base sm:leading-7">
                {description}
              </p>
            ) : null}

            {badges ? <div className="mt-4 flex flex-wrap gap-2">{badges}</div> : null}
          </div>

          {actions ? (
            <div className="flex shrink-0 flex-wrap gap-2.5 xl:justify-end">
              {actions}
            </div>
          ) : null}
        </div>

        {children ? <div className="mt-5">{children}</div> : null}
      </section>
    </div>
  );
}
