export type AppLogoVariant = "full" | "compact" | "icon";
export type AppLogoSize = "sm" | "md" | "lg";
export type AppLogoTone = "accent" | "neutral";
export type AppLogoMark = "scholarDialogue" | "cyrillicPath" | "lessonPrism";

export type AppLogoProps = {
  variant?: AppLogoVariant;
  size?: AppLogoSize;
  tone?: AppLogoTone;
  mark?: AppLogoMark;
  subtitle?: string;
  ariaLabel?: string;
  className?: string;
  markClassName?: string;
};

const APP_LOGO_LABEL = "GCSE Russian";

const sizeStyles: Record<
  AppLogoSize,
  {
    mark: string;
    icon: number;
    wordmark: string;
    subtitle: string;
    gap: string;
  }
> = {
  sm: {
    mark: "h-8 w-8 rounded-[0.7rem]",
    icon: 22,
    wordmark: "text-sm",
    subtitle: "text-[11px]",
    gap: "gap-2.5",
  },
  md: {
    mark: "h-9 w-9 rounded-xl",
    icon: 24,
    wordmark: "text-base",
    subtitle: "text-xs",
    gap: "gap-3",
  },
  lg: {
    mark: "h-11 w-11 rounded-2xl",
    icon: 30,
    wordmark: "text-lg",
    subtitle: "text-sm",
    gap: "gap-3.5",
  },
};

function ScholarDialogueMark({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className="shrink-0"
    >
      <path
        d="M8.8 13.05c0-2.38 2.07-4.2 4.4-3.76 2.72.52 4.92 1.58 6.8 3.18 1.88-1.6 4.08-2.66 6.8-3.18 2.33-.44 4.4 1.38 4.4 3.76v17.9c0 .98-.91 1.72-1.87 1.5-3.66-.83-6.64-.14-9.33 2.05-2.69-2.19-5.67-2.88-9.33-2.05-.96.22-1.87-.52-1.87-1.5v-17.9Z"
        fill="color-mix(in srgb, var(--accent) 10%, var(--background-elevated))"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 12.47V34.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13.4 16.2c2.1.34 4.02 1.06 5.72 2.16M26.6 16.2c-2.1.34-4.02 1.06-5.72 2.16M13.4 22.25c1.6.2 3.08.64 4.44 1.32M26.6 22.25c-1.6.2-3.08.64-4.44 1.32"
        stroke="var(--text-secondary)"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M11.4 11.05c2.98.18 5.83 1.28 8.6 3.32 2.77-2.04 5.62-3.14 8.6-3.32"
        stroke="var(--background-elevated)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M13.6 18.8h2.75c1.3 0 2.35 1 2.35 2.22 0 1.23-1.05 2.23-2.35 2.23H15.1l-2.35 2.08v-4.31c0-1.23 1.05-2.22 2.35-2.22"
        fill="var(--background-elevated)"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CyrillicPathMark({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className="shrink-0"
    >
      <path
        d="M27.5 8.5v23"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M27.5 9.4H18c-4.4 0-7.6 2.86-7.6 6.74 0 3.9 3.2 6.72 7.6 6.72h9.5"
        fill="color-mix(in srgb, var(--accent) 10%, var(--background-elevated))"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M18.4 22.85 10.6 31.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M15 15.95c0-1.42 1.18-2.57 2.63-2.57h4.92v5.14h-4.92A2.6 2.6 0 0 1 15 15.95Z"
        fill="var(--background-elevated)"
        stroke="var(--text-secondary)"
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
      <path
        d="M13.55 28.18c2.58 1.58 5.4 2.37 8.45 2.37 2.52 0 4.82-.54 6.9-1.62M13.15 8.55c-2.18 1.12-3.9 2.64-5.15 4.55"
        stroke="color-mix(in srgb, var(--accent) 64%, var(--text-secondary))"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <circle
        cx="10"
        cy="14.05"
        r="1.6"
        fill="var(--background-elevated)"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <circle
        cx="29.3"
        cy="28.75"
        r="1.6"
        fill="var(--background-elevated)"
        stroke="currentColor"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function LessonPrismMark({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className="shrink-0"
    >
      <path
        d="M9.5 12.2c0-2 1.62-3.62 3.62-3.62h13.76c2 0 3.62 1.62 3.62 3.62v9.6c0 2-1.62 3.62-3.62 3.62h-5.82l-5.38 5.02v-5.02h-2.56c-2 0-3.62-1.62-3.62-3.62v-9.6Z"
        fill="color-mix(in srgb, var(--accent) 11%, var(--background-elevated))"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13.6 14.2h12.8M13.6 18.35h7.7"
        stroke="var(--background-elevated)"
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M13.2 30.15H28c2.1 0 3.8-1.7 3.8-3.8V15.8M10.25 26.3H8.8c-1.44 0-2.6-1.16-2.6-2.6v-8.6c0-1.44 1.16-2.6 2.6-2.6h.7"
        stroke="var(--text-secondary)"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M23.35 22.2c1.42-.48 2.57-1.56 3.13-2.96M25.15 14.15c-1.1-.94-2.62-1.5-4.32-1.5-3.35 0-6.08 2.18-6.08 4.88 0 1.42.76 2.7 1.96 3.6"
        stroke="color-mix(in srgb, var(--accent) 70%, var(--text-secondary))"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      <circle cx="20.7" cy="17.48" r="1.55" fill="currentColor" />
    </svg>
  );
}

function LogoMark({ mark, size }: { mark: AppLogoMark; size: number }) {
  if (mark === "cyrillicPath") {
    return <CyrillicPathMark size={size} />;
  }

  if (mark === "lessonPrism") {
    return <LessonPrismMark size={size} />;
  }

  return <ScholarDialogueMark size={size} />;
}

export default function AppLogo({
  variant = "full",
  size = "md",
  tone = "accent",
  mark = "scholarDialogue",
  subtitle,
  ariaLabel,
  className,
  markClassName,
}: AppLogoProps) {
  const styles = sizeStyles[size];
  const showText = variant !== "icon";
  const showSubtitle = variant === "full" && subtitle;
  const iconLabel = ariaLabel ?? APP_LOGO_LABEL;

  const markClasses = [
    "inline-flex shrink-0 items-center justify-center border shadow-[var(--shadow-xs)]",
    styles.mark,
    tone === "accent"
      ? "[background:var(--accent-gradient-soft)] text-[var(--accent-ink)] border-[var(--accent-selected-border)]"
      : "bg-[var(--background-elevated)] text-[var(--text-primary)] border-[var(--border)]",
    markClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={[
        "inline-flex min-w-0 items-center",
        showText ? styles.gap : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role={variant === "icon" ? "img" : undefined}
      aria-label={variant === "icon" ? iconLabel : undefined}
    >
      <span className={markClasses}>
        <LogoMark mark={mark} size={styles.icon} />
      </span>

      {showText ? (
        <span className="min-w-0 leading-none">
          <span
            className={[
              "block truncate font-semibold tracking-normal",
              styles.wordmark,
              tone === "accent" ? "text-[var(--accent-ink)]" : "text-[var(--text-primary)]",
            ].join(" ")}
          >
            {APP_LOGO_LABEL}
          </span>

          {showSubtitle ? (
            <span
              className={[
                "mt-1 block truncate font-medium leading-tight text-[var(--text-muted)]",
                styles.subtitle,
              ].join(" ")}
            >
              {subtitle}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
