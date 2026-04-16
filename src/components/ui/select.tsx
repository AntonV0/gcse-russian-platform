type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={["app-focus-ring rounded-xl px-3 py-2 text-sm", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </select>
  );
}
