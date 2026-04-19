type CardProps = {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
};

type CardSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className, interactive = false }: CardProps) {
  return (
    <div
      className={["app-card", interactive ? "app-card-hover" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div
      className={["border-b border-[var(--border)] px-5 py-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardSectionProps) {
  return <div className={["p-5", className].filter(Boolean).join(" ")}>{children}</div>;
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div
      className={["border-t border-[var(--border)] px-5 py-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export default Card;
