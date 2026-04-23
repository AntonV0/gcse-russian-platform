"use client";

import DevComponentMarker from "@/components/ui/dev-component-marker";

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  hint?: string;
  description?: string;
  error?: string;
  success?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function FormField({
  label,
  children,
  hint,
  description,
  error,
  success,
  required = false,
  className,
  labelClassName,
}: FormFieldProps) {
  const statusText = error ?? success ?? hint;
  const statusClassName = error
    ? "app-form-message app-form-message-error"
    : success
      ? "app-form-message app-form-message-success"
      : "app-form-message";

  return (
    <div
      className={["dev-marker-host relative app-form-field", className]
        .filter(Boolean)
        .join(" ")}
    >
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="FormField"
          filePath="src/components/ui/form-field.tsx"
          tier="semantic"
          componentRole="Semantic form layout wrapper"
          bestFor="Labelled form controls with description, required state, helper text, validation errors, or success messages."
          usageExamples={[
            "Admin edit forms",
            "Lesson builder field groups",
            "Course and module metadata forms",
            "Student profile/settings forms",
          ]}
          notes="Use FormField around Input, Textarea, Select, or custom controls. Do not use it for checkbox rows; use CheckboxField for those."
        />
      ) : null}

      <div className="app-form-field-header">
        <label className={["app-form-label", labelClassName].filter(Boolean).join(" ")}>
          <span>{label}</span>
          {required ? <span className="app-form-required">*</span> : null}
        </label>

        {description ? <p className="app-form-description">{description}</p> : null}
      </div>

      <div className="app-form-control-wrap">{children}</div>

      {statusText ? <p className={statusClassName}>{statusText}</p> : null}
    </div>
  );
}
