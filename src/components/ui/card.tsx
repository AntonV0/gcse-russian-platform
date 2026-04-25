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
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="Card"
          filePath="src/components/ui/card.tsx"
          tier="container"
          componentRole="Base content container primitive"
          bestFor="Neutral boxed content, reusable card shells, and low-level wrappers used by higher-level card components."
          usageExamples={[
            "CardHeader/CardBody/CardFooter layouts",
            "Base shell for PanelCard",
            "Base shell for SectionCard",
            "Simple standalone content blocks",
          ]}
          notes="Use Card when you need a plain reusable container. Prefer SectionCard, PanelCard, or DashboardCard when the content has a specific page role."
        />
      ) : null}

      <div
        className={[
          "app-card app-card-shell overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] transition-[border-color,box-shadow,transform]",
          interactive
            ? "app-card-hover hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]"
            : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div
      className={[
        "app-card-header border-b border-[var(--border-subtle)] px-5 py-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardSectionProps) {
  return (
    <div className={["app-card-body px-5 py-4", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div
      className={[
        "app-card-footer border-t border-[var(--border-subtle)] px-5 py-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export default Card;
