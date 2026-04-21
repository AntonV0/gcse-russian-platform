"use client";

import DevComponentMarker from "@/components/ui/dev-component-marker";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function Input({ className, ...props }: InputProps) {
  return (
    <div className="dev-marker-host">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="Input"
          filePath="src/components/ui/input.tsx"
        />
      ) : null}

      <input
        {...props}
        className={[
          "app-focus-ring app-form-control app-form-input",
          "placeholder:text-[var(--text-muted)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  );
}
