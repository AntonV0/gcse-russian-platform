type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={["app-focus-ring rounded-xl px-3 py-2 text-sm", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
