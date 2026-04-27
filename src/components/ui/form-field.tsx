"use client";

import { Fragment, cloneElement, isValidElement, useId } from "react";
import DevComponentMarker from "@/components/ui/dev-component-marker";

type FormControlElementProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
};

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  id?: string;
  htmlFor?: string;
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
  id,
  htmlFor,
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
  const generatedId = useId();
  const controlElement =
    isValidElement<FormControlElementProps>(children) && children.type !== Fragment
      ? children
      : null;
  const controlId =
    id ?? htmlFor ?? controlElement?.props.id ?? `form-field-${generatedId}`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const statusId = statusText ? `${controlId}-message` : undefined;
  const describedBy = [controlElement?.props["aria-describedby"], descriptionId, statusId]
    .filter(Boolean)
    .join(" ");
  const control = controlElement
    ? cloneElement(controlElement, {
        id: controlId,
        "aria-describedby": describedBy || undefined,
        "aria-invalid": error ? true : controlElement.props["aria-invalid"],
      })
    : children;

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
        <label
          htmlFor={controlElement ? controlId : undefined}
          className={["app-form-label", labelClassName].filter(Boolean).join(" ")}
        >
          <span>{label}</span>
          {required ? <span className="app-form-required">*</span> : null}
        </label>

        {description ? (
          <p id={descriptionId} className="app-form-description">
            {description}
          </p>
        ) : null}
      </div>

      <div className="app-form-control-wrap">{control}</div>

      {statusText ? (
        <p id={statusId} className={statusClassName}>
          {statusText}
        </p>
      ) : null}
    </div>
  );
}
