type FormSelectOption = {
  value: string;
  label: string;
};

export function UiLabFormsSelectOptions({
  options,
}: {
  options: readonly FormSelectOption[];
}) {
  return (
    <>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </>
  );
}
