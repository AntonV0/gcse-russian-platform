type AppLogoVariant = "full" | "compact" | "icon";
type AppLogoSize = "sm" | "md" | "lg";
type AppLogoTone = "accent" | "neutral";
export type AppLogoMark = "dialogueBook" | "languageGrid" | "globeSpeech";

type AppLogoProps = {
  variant?: AppLogoVariant;
  size?: AppLogoSize;
  tone?: AppLogoTone;
  mark?: AppLogoMark;
  subtitle?: string;
  className?: string;
  markClassName?: string;
};

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

function DialogueBookMark({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className="shrink-0"
    >
      <path
        d="M7.5 9.25c0-1.1.9-1.95 2-1.78 2.42.38 4.45 1.18 6.5 2.67v14.4c-2.05-1.49-4.08-2.29-6.5-2.67-1.1-.17-2 .68-2 1.78V9.25Z"
        fill="var(--background-elevated)"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path
        d="M24.5 9.25c0-1.1-.9-1.95-2-1.78-2.42.38-4.45 1.18-6.5 2.67v14.4c2.05-1.49 4.08-2.29 6.5-2.67 1.1-.17 2 .68 2 1.78V9.25Z"
        fill="var(--background-elevated)"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <path
        d="M20.15 13.2h2.65M19.15 16.05h3.65"
        stroke="var(--text-secondary)"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M10.7 12.85h2.05c.9 0 1.62.7 1.62 1.55s-.72 1.55-1.62 1.55H11.7l-1.55 1.55v-3.1c0-.85.72-1.55 1.62-1.55"
        fill="color-mix(in srgb, var(--accent) 16%, var(--background-elevated))"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LanguageGridMark({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className="shrink-0"
    >
      <rect
        x="7"
        y="7"
        width="8"
        height="8"
        rx="2.25"
        fill="var(--background-elevated)"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="17"
        y="7"
        width="8"
        height="8"
        rx="2.25"
        fill="color-mix(in srgb, var(--accent) 16%, var(--background-elevated))"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="7"
        y="17"
        width="8"
        height="8"
        rx="2.25"
        fill="color-mix(in srgb, var(--accent) 10%, var(--background-elevated))"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="17"
        y="17"
        width="8"
        height="8"
        rx="2.25"
        fill="var(--background-elevated)"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M10.1 12.4h1.9M20.1 11h1.2c.9 0 1.65.63 1.65 1.42 0 .78-.75 1.41-1.65 1.41h-.7l-1.05 1.05v-2.46c0-.79.72-1.42 1.62-1.42M10.25 21h2.5M19.8 20.1l2.4 2.4M22.2 20.1l-2.4 2.4"
        stroke="var(--text-secondary)"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeSpeechMark({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className="shrink-0"
    >
      <path
        d="M7.5 15.2c0-4.45 3.78-8.05 8.45-8.05s8.45 3.6 8.45 8.05c0 4.44-3.78 8.04-8.45 8.04-.72 0-1.42-.08-2.08-.25l-4.05 2.05.78-3.62c-1.9-1.47-3.1-3.7-3.1-6.22Z"
        fill="var(--background-elevated)"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 15.2h13.4M15.95 7.35c-1.72 1.85-2.58 4.47-2.58 7.85 0 3.37.86 5.98 2.58 7.84M15.95 7.35c1.72 1.85 2.58 4.47 2.58 7.85 0 3.37-.86 5.98-2.58 7.84"
        stroke="var(--text-secondary)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M11.6 11.65c1.14.52 2.6.78 4.35.78 1.74 0 3.19-.26 4.34-.78M11.6 18.75c1.14-.52 2.6-.78 4.35-.78 1.74 0 3.19.26 4.34.78"
        stroke="color-mix(in srgb, var(--accent) 72%, var(--text-secondary))"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoMark({ mark, size }: { mark: AppLogoMark; size: number }) {
  if (mark === "languageGrid") {
    return <LanguageGridMark size={size} />;
  }

  if (mark === "globeSpeech") {
    return <GlobeSpeechMark size={size} />;
  }

  return <DialogueBookMark size={size} />;
}

export default function AppLogo({
  variant = "full",
  size = "md",
  tone = "accent",
  mark = "dialogueBook",
  subtitle,
  className,
  markClassName,
}: AppLogoProps) {
  const styles = sizeStyles[size];
  const showText = variant !== "icon";
  const showSubtitle = variant === "full" && subtitle;

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
            GCSE Russian
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
