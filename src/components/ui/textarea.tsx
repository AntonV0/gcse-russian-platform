import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <div className="dev-marker-host relative">
      <DevOnlyComponentMarker
        componentName="Textarea"
        filePath="src/components/ui/textarea.tsx"
        tier="primitive"
        componentRole="Multi-line form input primitive"
        bestFor="Descriptions, lesson text, teacher notes, feedback, explanations, and longer admin content."
        usageExamples={[
          "Lesson description",
          "Teacher feedback text",
          "Admin notes",
          "Question explanation field",
        ]}
        notes="Use inside FormField when labelled. Keep textarea content purposeful; use rich block editors for structured lesson content."
      />

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
