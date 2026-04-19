type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={[
        "app-focus-ring w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--text-primary)] shadow-sm transition",
        "hover:border-[var(--border-strong)]",
        "disabled:cursor-not-allowed disabled:bg-[var(--background-muted)] disabled:text-[var(--text-soft)] disabled:shadow-none",
        "aria-[invalid=true]:border-[var(--danger)] aria-[invalid=true]:bg-[var(--danger-soft)]/30",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </select>
  );
}
