import type { HTMLAttributes } from "react";
import { getTextLanguage } from "@/lib/typography/text-language";

type RussianTextVariant = "inline" | "prose" | "term" | "muted";

type RussianTextProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: RussianTextVariant;
};

const variantClassNames: Record<RussianTextVariant, string> = {
  inline: "app-russian-inline",
  prose: "app-russian-text",
  term: "app-vocab-term",
  muted: "app-russian-muted",
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function RussianText({
  variant = "inline",
  className,
  ...props
}: RussianTextProps) {
  return (
    <span
      lang="ru"
      className={joinClassNames(variantClassNames[variant], className)}
      {...props}
    />
  );
}

export function AutoLangText({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { children: string }) {
  return (
    <span lang={getTextLanguage(children)} className={className} {...props}>
      {children}
    </span>
  );
}
