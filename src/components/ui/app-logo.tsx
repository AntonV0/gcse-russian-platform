export type AppLogoVariant = "full" | "domain" | "icon";
export type AppLogoSize = "sm" | "md" | "lg";

type AppLogoProps = {
  variant?: AppLogoVariant;
  size?: AppLogoSize;
  subtitle?: string;
  ariaLabel?: string;
  className?: string;
  imageClassName?: string;
  showIcon?: boolean;
};

const APP_LOGO_LABEL = "GCSE Russian";

const sizeClass: Record<
  AppLogoSize,
  {
    root: string;
    icon: string;
    text: string;
    underline: string;
    subtitle: string;
  }
> = {
  sm: {
    root: "gap-2",
    icon: "h-9 w-9",
    text: "text-[1.05rem]",
    underline: "h-[0.34rem]",
    subtitle: "text-[0.68rem]",
  },
  md: {
    root: "gap-2.5",
    icon: "h-11 w-11",
    text: "text-[1.32rem]",
    underline: "h-[0.42rem]",
    subtitle: "text-xs",
  },
  lg: {
    root: "gap-3",
    icon: "h-14 w-14",
    text: "text-[1.72rem]",
    underline: "h-[0.55rem]",
    subtitle: "text-sm",
  },
};

function RussianWord() {
  return <>Russian</>;
}

function LogoUnderline({ className }: { className: string }) {
  return (
    <svg
      className={["app-logo-underline", className].join(" ")}
      viewBox="0 0 260 20"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5 7.5H176C188 7.5 194 8.6 201 15.8C208 8.6 214 7.5 226 7.5H255"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function AppLogo({
  variant = "full",
  size = "sm",
  subtitle,
  ariaLabel,
  className,
  imageClassName,
  showIcon = true,
}: AppLogoProps) {
  const classes = sizeClass[size];
  const iconClasses = ["app-logo-icon block shrink-0", classes.icon, imageClassName]
    .filter(Boolean)
    .join(" ");
  const isIconOnly = variant === "icon";
  const hasIcon = isIconOnly || showIcon;
  const label = ariaLabel ?? (variant === "domain" ? "GCSERussian.com" : APP_LOGO_LABEL);

  return (
    <span
      className={[
        "app-logo inline-flex min-w-0 flex-col",
        isIconOnly ? "items-center" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="img"
      aria-label={label}
    >
      <span
        className={[
          "inline-flex min-w-0 shrink-0 items-center",
          !isIconOnly && hasIcon ? classes.root : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {hasIcon ? <span className={iconClasses} aria-hidden="true" /> : null}

        {isIconOnly ? null : (
          <span className="app-logo-wordmark min-w-0">
            <span
              className={[
                "app-logo-textline",
                classes.text,
                variant === "domain" ? "app-logo-textline-domain" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="app-logo-gcse">GCSE</span>
              <span className="app-logo-russian">
                <RussianWord />
              </span>
              {variant === "domain" ? (
                <span className="app-logo-dotcom">.com</span>
              ) : null}
            </span>
            <LogoUnderline className={classes.underline} />
          </span>
        )}
      </span>

      {subtitle ? (
        <span
          className={[
            "app-logo-subtitle mt-1 block truncate font-medium leading-tight app-text-soft",
            classes.subtitle,
          ].join(" ")}
        >
          {subtitle}
        </span>
      ) : null}
    </span>
  );
}
