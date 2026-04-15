type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border px-3 py-2 text-sm text-gray-900 outline-none transition",
        "placeholder:text-gray-400",
        "focus:border-black",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
