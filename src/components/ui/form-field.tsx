type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
  labelClassName?: string;
};

export default function FormField({
  label,
  children,
  hint,
  className,
  labelClassName,
}: FormFieldProps) {
  return (
    <div className={["space-y-2", className].filter(Boolean).join(" ")}>
      <label
        className={[
          "block text-sm font-medium text-[var(--text-primary)]",
          labelClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
      </label>

      {children}

      {hint ? <p className="text-xs leading-5 app-text-soft">{hint}</p> : null}
    </div>
  );
}
