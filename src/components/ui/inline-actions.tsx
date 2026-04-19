type InlineActionsProps = {
  children: React.ReactNode;
  className?: string;
};

export default function InlineActions({ children, className }: InlineActionsProps) {
  return (
    <div
      className={["flex flex-wrap items-center gap-2 sm:gap-3", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
