"use client";

import DevComponentMarker from "@/components/ui/dev-component-marker";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
};

type CardSectionProps = {
  children: React.ReactNode;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export function Card({ children, className, interactive = false }: CardProps) {
  return (
    <div
      className={[
        "dev-marker-host app-card app-card-shell",
        interactive ? "app-card-hover" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker componentName="Card" filePath="src/components/ui/card.tsx" />
      ) : null}

      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div
      className={["app-card-header border-b border-[var(--border)] px-5 py-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardSectionProps) {
  return (
    <div className={["app-card-body p-5", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div
      className={["app-card-footer border-t border-[var(--border)] px-5 py-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export default Card;
