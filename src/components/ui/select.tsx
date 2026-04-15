type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-xl border px-3 py-2 text-sm text-gray-900 outline-none transition",
        "focus:border-black",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </select>
  );
}
