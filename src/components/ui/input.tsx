type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={["app-focus-ring rounded-xl px-3 py-2 text-sm", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
