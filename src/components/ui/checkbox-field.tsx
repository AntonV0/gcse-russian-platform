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
    <label className="flex items-start gap-3 rounded-xl border border-transparent px-0.5 py-0.5 text-sm text-[var(--text-primary)] transition">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className={[
          "app-focus-ring mt-0.5 h-4 w-4 shrink-0 rounded border border-[var(--border)] bg-white text-[var(--brand-blue)] shadow-sm transition",
          "hover:border-[var(--border-strong)]",
        ].join(" ")}
      />
      <span className="leading-5">{label}</span>
    </label>
  );
}
