type CheckboxFieldProps = {
  name: string;
  label: string;
  value?: string;
  defaultChecked?: boolean;
};

export default function CheckboxField({
  name,
  label,
  value = "true",
  defaultChecked,
}: CheckboxFieldProps) {
  return (
    <label className="flex items-start gap-3 text-sm text-[var(--text-primary)]">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-[var(--brand-blue)] focus:ring-2 focus:ring-[var(--brand-blue)]/20"
      />
      <span>{label}</span>
    </label>
  );
}
