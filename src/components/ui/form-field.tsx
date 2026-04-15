type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  hint?: string;
};

export default function FormField({ label, children, hint }: FormFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-900">{label}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}
