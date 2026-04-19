type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={[
        "app-focus-ring w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--text-primary)] shadow-sm transition",
        "min-h-[120px] resize-y align-top",
        "placeholder:text-[var(--text-soft)]",
        "hover:border-[var(--border-strong)]",
        "disabled:cursor-not-allowed disabled:bg-[var(--background-muted)] disabled:text-[var(--text-soft)] disabled:shadow-none",
        "aria-[invalid=true]:border-[var(--danger)] aria-[invalid=true]:bg-[var(--danger-soft)]/30",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
