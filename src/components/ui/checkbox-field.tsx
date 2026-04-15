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
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input type="checkbox" name={name} value={value} defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}
