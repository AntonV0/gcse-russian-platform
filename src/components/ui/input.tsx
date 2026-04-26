import DevComponentMarker from "@/components/ui/dev-component-marker";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function Input({ className, ...props }: InputProps) {
  return (
    <div className="dev-marker-host relative">
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="Input"
          filePath="src/components/ui/input.tsx"
          tier="primitive"
          componentRole="Single-line form input primitive"
          bestFor="Short text, slugs, titles, emails, numbers, dates, and compact form values."
          usageExamples={[
            "Course title field",
            "Lesson slug field",
            "Student profile name",
            "Search or filter input",
          ]}
          notes="Use inside FormField when a visible label, hint, description, or validation message is needed. Use Textarea for long-form content."
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
