"use client";

import DevComponentMarker from "@/components/ui/dev-component-marker";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <div className="dev-marker-host">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="Textarea"
          filePath="src/components/ui/textarea.tsx"
        />
      ) : null}

      <textarea
        {...props}
        className={[
          "app-focus-ring app-form-control app-form-textarea",
          "min-h-[120px] resize-y align-top",
          "placeholder:text-[var(--text-muted)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  );
}
